import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { Injectable } from '@angular/core';
import { AppError } from '@shiptech/core/error-handling/app-error';
import { nameof } from '@shiptech/core/utils/type-definitions';
import { ReconStatusLookupEnum } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.enum';
import { IReconStatusLookupDto } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.interface';

const nameField = nameof<IReconStatusLookupDto>('name');

@Injectable({ providedIn: 'root' })
export class ReconStatusLookup {
  get matched(): IReconStatusLookupDto {
    console.assert(this._matched !== undefined);
    return this._matched;
  }

  get withinLimit(): IReconStatusLookupDto {
    console.assert(this._withinLimit !== undefined);
    return this._withinLimit;
  }

  get notMatched(): IReconStatusLookupDto {
    console.assert(this._notMatched !== undefined);
    return this._notMatched;
  }

  private _withinLimit: IReconStatusLookupDto;
  private _matched: IReconStatusLookupDto;
  private _notMatched: IReconStatusLookupDto;

  constructor(private legacyLookupsDatabase: LegacyLookupsDatabase) {}

  public async load(): Promise<any> {
    if (window.location.pathname.includes('email-template-editor')) {
      return;
    }
    this._withinLimit = await this.legacyLookupsDatabase.reconMatch
      .where(nameField)
      .equals(ReconStatusLookupEnum.WithinLimit)
      .first();
    if (!this._withinLimit)
      throw AppError.MissingLookupKey(
        nameof<LegacyLookupsDatabase>('reconMatch'),
        ReconStatusLookupEnum.WithinLimit
      );

    this._matched = await this.legacyLookupsDatabase.reconMatch
      .where(nameField)
      .equals(ReconStatusLookupEnum.Matched)
      .first();
    if (!this._matched)
      throw AppError.MissingLookupKey(
        nameof<LegacyLookupsDatabase>('reconMatch'),
        ReconStatusLookupEnum.Matched
      );

    this._notMatched = await this.legacyLookupsDatabase.reconMatch
      .where(nameField)
      .equals(ReconStatusLookupEnum.NotMatched)
      .first();
    if (!this._notMatched)
      throw AppError.MissingLookupKey(
        nameof<LegacyLookupsDatabase>('reconMatch'),
        ReconStatusLookupEnum.NotMatched
      );
  }

  public toReconStatus(
    status: ReconStatusLookupEnum
  ): IReconStatusLookupDto | undefined {
    if (status === null || status === undefined) return undefined;

    switch (status) {
      case ReconStatusLookupEnum.Matched:
        return this._matched;
      case ReconStatusLookupEnum.WithinLimit:
        return this._withinLimit;
      case ReconStatusLookupEnum.NotMatched:
        return this._notMatched;
    }
  }
}
