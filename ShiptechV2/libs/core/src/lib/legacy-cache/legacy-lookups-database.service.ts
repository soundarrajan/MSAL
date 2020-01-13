import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { nameof } from '../utils/type-definitions';
import { ILegacyLookupVersion } from './legacy-lookup-version.interface';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { IReconStatusDto } from '@shiptech/core/masters/recon-status.interface';
import { fromLegacyLookup } from '@shiptech/core/lookups/utils';

/**
 * Front-end will only work with this class, and it doesn't care how these tables are actually populated.
 * Note: See {@link LookupsCacheService} to see how data is actually loaded from the api.
 */
@Injectable({
  providedIn: 'root'
})
export class LegacyLookupsDatabase extends Dexie {

  readonly currency: Dexie.Table<IDisplayLookupDto, number>;
  readonly uom: Dexie.Table<IDisplayLookupDto, number>;
  readonly uomVolume: Dexie.Table<IDisplayLookupDto, number>;
  readonly uomMass: Dexie.Table<IDisplayLookupDto, number>;
  readonly status: Dexie.Table<IDisplayLookupDto, number>;
  readonly vessel: Dexie.Table<IDisplayLookupDto, number>;
  readonly reconMatch: Dexie.Table<IReconStatusDto, number>;

  /**
   * For some entities we want to map from the BE dto more than the default IDisplayLookup props, for these cases we use a transformer.
   * Note: In case a transformer is not defined {@link fromLegacyLookup} is used as default mapper
   */
  readonly transforms: Record<string, (dto: any) => any> = {
    [nameof<LegacyLookupsDatabase>('reconMatch')]: (dto: IDisplayLookupDto & { 'code': string }) => (<IReconStatusDto>{ ... fromLegacyLookup(dto), code: dto.code })
  };

  lookupVersions: Dexie.Table<ILegacyLookupVersion, string>;
  dbVersion: number;

  private readonly schema: Record<string, string>;

  constructor() {
    super('Shiptech-UI.Lookups');

    const lookupId = nameof<IDisplayLookupDto>('id');
    const lookupName = nameof<IDisplayLookupDto>('name');
    const lookupSchema = `++${lookupId}, ${lookupName}`;

    // Note: Never change versions, always make changes by incrementing the version, the key of the following object.
    this.schema = {
      [nameof<LegacyLookupsDatabase>('currency')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('uom')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('lookupVersions')]: `++${nameof<ILegacyLookupVersion>('name')}`,
      [nameof<LegacyLookupsDatabase>('uomVolume')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('uomMass')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('status')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('vessel')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('reconMatch')]: lookupSchema,
    };
  }

  public init(): Observable<any> {
    return fromPromise(this.initInternal());
  }

  public async initInternal(): Promise<any> {
    await this.ensureVersion();

    this.version(1).stores(this.schema);

    Object.keys(this.schema).forEach(tableName => {
      this[tableName] = this.table(tableName);
    });
  }

  private async ensureVersion(): Promise<any> {
    // TODO: add proper logging
    // Note: We're doing a different db versioning strategy. Whenever a table is added or deleted the version will Change automatically
    // Note: When the version changes, we should delete the database and start clean. Please note that other changes besides adding,
    // Note: deleting, renaming a table are not supported yet, but can be easily accomplished by passing a one time random array of strings.
    const dbVersionKey = `${this.name}.Version`;
    const currentVersion = localStorage.getItem(dbVersionKey);
    const newVersion = this.calculateDbVersion(Object.keys(this.schema));

    if (currentVersion !== newVersion.toString()) {
      await this.delete();
    }

    // Note: In case the version changes (new app version loaded in another tab) we should show a popup that the user should close the tab
    const watchVersionChangesCallBack = this.watchVersionChanges.bind(this);
    window.removeEventListener('storage', watchVersionChangesCallBack);

    localStorage.setItem(dbVersionKey, newVersion.toString());

    window.addEventListener('storage', watchVersionChangesCallBack);

    this.dbVersion = newVersion;
  }

  private watchVersionChanges(): void {
    // TODO: Show popup that the database version has changed and the user should try to save work and close the tab.
    // TODO: Detect if there were version changes
    // TODO: Implement proper logging here
    // console.log(`IndexedDb ${this.name} version has been changed. Please reload tab`);
  }

  // noinspection JSMethodCanBeStatic
  private calculateDbVersion(tables: string[]): number {
    const str = tables.sort().join();

    let hash = 0, i, chr;

    if (str.length === 0) {
      return hash;
    }

    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      // tslint:disable-next-line:no-bitwise
      hash = ((hash << 5) - hash) + chr;
      // tslint:disable-next-line:no-bitwise
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };
}
