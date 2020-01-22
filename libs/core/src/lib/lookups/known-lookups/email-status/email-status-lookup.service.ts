import {LegacyLookupsDatabase} from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import {Injectable} from '@angular/core';
import {AppError} from '@shiptech/core/error-handling/app-error';
import {nameof} from '@shiptech/core/utils/type-definitions';
import {EmailStatusLookupEnum, MockEmailStatusLookupEnumMap} from "@shiptech/core/lookups/known-lookups/email-status/email-status-lookup.enum";
import {IEmailStatusLookupDto} from "@shiptech/core/lookups/known-lookups/email-status/email-status-lookup.interface";

const nameField = nameof<IEmailStatusLookupDto>('name');

@Injectable({providedIn: 'root'})
export class EmailStatusLookup {
  get sent(): IEmailStatusLookupDto {
    console.assert(this._sent !== undefined);
    return this._sent;
  }

  get failed(): IEmailStatusLookupDto {
    console.assert(this._failed !== undefined);
    return this._failed;
  }

  get pending(): IEmailStatusLookupDto {
    console.assert(this._pending !== undefined);
    return this._pending;
  }


  private _failed: IEmailStatusLookupDto;
  private _sent: IEmailStatusLookupDto;
  private _pending: IEmailStatusLookupDto;

  constructor(private legacyLookupsDatabase: LegacyLookupsDatabase) {

  }

  public async load(): Promise<any> {
    this._failed = await this.legacyLookupsDatabase.emailStatus.where(nameField).equals(EmailStatusLookupEnum.Failed).first();
    // To be removed when color code will be implemented on Backend
    this._failed.code = MockEmailStatusLookupEnumMap.Failed.code;

    if (!this._failed)
      throw AppError.MissingLookupKey(nameof<LegacyLookupsDatabase>('emailStatus'), EmailStatusLookupEnum.Failed);

    this._sent = await this.legacyLookupsDatabase.emailStatus.where(nameField).equals(EmailStatusLookupEnum.Sent).first();
    // To be removed when color code will be implemented on Backend
    this._sent.code = MockEmailStatusLookupEnumMap.Sent.code;
    if (!this._sent)
      throw AppError.MissingLookupKey(nameof<LegacyLookupsDatabase>('emailStatus'), EmailStatusLookupEnum.Sent);

    this._pending = await this.legacyLookupsDatabase.emailStatus.where(nameField).equals(EmailStatusLookupEnum.Pending).first();
    // To be removed when color code will be implemented on Backend
    this._pending.code = MockEmailStatusLookupEnumMap.Pending.code;
    if (!this._pending)
      throw AppError.MissingLookupKey(nameof<LegacyLookupsDatabase>('emailStatus'), EmailStatusLookupEnum.Pending);
  }

  public toEmailStatus(status: EmailStatusLookupEnum): IEmailStatusLookupDto | undefined {
    if (status === null || status === undefined)
      return undefined;

    switch (status) {
      case EmailStatusLookupEnum.Sent:
        return this._sent;
      case EmailStatusLookupEnum.Failed:
        return this._failed;
      case EmailStatusLookupEnum.Pending:
        return this._pending;
      default:
        return null;
    }
  }
}
