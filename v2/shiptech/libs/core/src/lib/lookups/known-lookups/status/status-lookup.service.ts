import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { Injectable } from '@angular/core';
import { AppError } from '@shiptech/core/error-handling/app-error';
import { IStatusLookupDto } from '@shiptech/core/lookups/known-lookups/status/status-lookup.interface';
import { nameof } from '@shiptech/core/utils/type-definitions';
import { IReconStatusLookupDto } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.interface';
import { StatusLookupEnum } from '@shiptech/core/lookups/known-lookups/status/status-lookup.enum';

const nameField = nameof<IReconStatusLookupDto>('name');

@Injectable({ providedIn: 'root'})
export class StatusLookup {
  get new(): IStatusLookupDto {
    console.assert(this._new !== undefined);
    return this._new;
  }

  get verified(): IStatusLookupDto {
    console.assert(this._verified !== undefined);
    return this._verified;
  }

  get pending(): IStatusLookupDto {
    console.assert(this._pending !== undefined);
    return this._pending;
  }

  private _verified: IStatusLookupDto;
  private _new: IStatusLookupDto;
  private _pending: IStatusLookupDto;

  constructor(private legacyLookupsDatabase: LegacyLookupsDatabase) {

  }

  public async load(): Promise<any> {
    this._verified = await this.legacyLookupsDatabase.status.where(nameField).equals(StatusLookupEnum.Verified).first();
    if (!this._verified)
      throw AppError.MissingLookupKey(nameof<LegacyLookupsDatabase>('status'), StatusLookupEnum.Verified);

    this._new = await this.legacyLookupsDatabase.status.where(nameField).equals(StatusLookupEnum.New).first();
    if (!this._new)
      throw AppError.MissingLookupKey(nameof<LegacyLookupsDatabase>('status'), StatusLookupEnum.New);

    this._pending = await this.legacyLookupsDatabase.status.where(nameField).equals(StatusLookupEnum.Pending).first();
    if (!this._pending)
      throw AppError.MissingLookupKey(nameof<LegacyLookupsDatabase>('status'), StatusLookupEnum.Pending);
  }
}
