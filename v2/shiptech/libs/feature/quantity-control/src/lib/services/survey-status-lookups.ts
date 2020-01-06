import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { EntityStatus } from '@shiptech/core/ui/components/entity-status/entity-status.component';
import { Injectable } from '@angular/core';
import { AppError } from '@shiptech/core/error-handling/app-error';

// TODO: Create a base class for this, we'll probably define more and more classes like these.
@Injectable()
export class SurveyStatusLookups {
  get new(): IDisplayLookupDto {
    // TODO: check if entities have been loaded
    return this._new;
  }

  get verified(): IDisplayLookupDto {
    //TODO: check if entities have been loaded
    return this._verified;
  }

  get pending(): IDisplayLookupDto {
    //TODO: check if entities have been loaded
    return this._pending;
  }

  private _verified: IDisplayLookupDto;
  private _new: IDisplayLookupDto;
  private _pending: IDisplayLookupDto;

  constructor(private legacyLookupsDatabase: LegacyLookupsDatabase) {

  }

  public async load(): Promise<any> {
    // TODO: cache the values and don't await multiple times, maybe even await all

    this._verified = await this.legacyLookupsDatabase.status.filter(s => s.name === EntityStatus.Verified).first();
    if (!this._verified)
      throw AppError.MissingLookupKey('status', EntityStatus.Verified);

    this._new = await this.legacyLookupsDatabase.status.filter(s => s.name === EntityStatus.New).first();
    if (!this._new)
      throw AppError.MissingLookupKey('status', EntityStatus.New);

    this._pending = await this.legacyLookupsDatabase.status.filter(s => s.name === EntityStatus.Pending).first();
    if (!this._pending)
      throw AppError.MissingLookupKey('status', EntityStatus.Pending);
  }
}
