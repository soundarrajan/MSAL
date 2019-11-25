import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { ILookupDto } from '../lookups/lookup-dto.interface';
import { nameof } from '../utils/type-definitions';
import { ILegacyLookupVersion } from './legacy-lookup-version.interface';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';

@Injectable({
  providedIn: 'root'
})
export class LegacyLookupsDatabase extends Dexie {

  readonly company: Dexie.Table<ILookupDto, number>;
  readonly currency: Dexie.Table<ILookupDto, number>;
  readonly uom: Dexie.Table<ILookupDto, number>;
  readonly uomVolume: Dexie.Table<ILookupDto, number>;
  readonly uomMass: Dexie.Table<ILookupDto, number>;
  readonly location: Dexie.Table<ILookupDto, number>;
  readonly product: Dexie.Table<ILookupDto, number>;
  readonly customer: Dexie.Table<ILookupDto, number>;
  readonly supplier: Dexie.Table<ILookupDto, number>;
  readonly status: Dexie.Table<ILookupDto, number>;

  lookupVersions: Dexie.Table<ILegacyLookupVersion, string>;
  dbVersion: number;

  private readonly schema: Record<string, string>;

  constructor() {
    super('Shiptech-UI.Lookups');

    const lookupId = nameof<ILookupDto>('id');
    const lookupName = nameof<ILookupDto>('name');
    const lookupSchema = `++${lookupId}, ${lookupName}`;

    // Note: Never change versions, always make changes by incrementing the version, the key of the following object.
    this.schema = {
      [nameof<LegacyLookupsDatabase>('company')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('currency')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('uom')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('location')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('lookupVersions')]: `++${nameof<ILegacyLookupVersion>('name')}`,
      [nameof<LegacyLookupsDatabase>('uomVolume')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('uomMass')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('product')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('customer')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('supplier')]: lookupSchema,
      [nameof<LegacyLookupsDatabase>('status')]: lookupSchema,
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
    console.log(`IndexedDb ${this.name} version has been changed. Please reload tab`);
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
