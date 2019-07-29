import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { ILookupDto } from '../lookups/lookup-dto.interface';
import { nameof } from '../utils/type-definitions';
import { ILegacyLookupVersion } from './legacy-lookup-version.interface';

@Injectable({
  providedIn: 'root'
})
export class LegacyLookupsDatabase extends Dexie {

  company: Dexie.Table<ILookupDto, number>;
  currency: Dexie.Table<ILookupDto, number>;
  uom: Dexie.Table<ILookupDto, number>;
  uomVolume: Dexie.Table<ILookupDto, number>;
  uomMass: Dexie.Table<ILookupDto, number>;
  location: Dexie.Table<ILookupDto, number>;
  product: Dexie.Table<ILookupDto, number>;
  customer: Dexie.Table<ILookupDto, number>;
  supplier: Dexie.Table<ILookupDto, number>;
  vesselType: Dexie.Table<ILookupDto, number>;

  lookupVersions: Dexie.Table<ILegacyLookupVersion, string>;

  constructor() {
    super('Shiptech-UI.Lookups');

    const lookupId = nameof<ILookupDto>('id');
    const lookupName = nameof<ILookupDto>('name');
    const lookupSchema = `++${lookupId}, ${lookupName}`;

    // Note: Never change versions, always make changes by incrementing the version, the key of the following object.
    const schemaUpgrades = {
      1: {
        [nameof<LegacyLookupsDatabase>('company')]: lookupSchema,
        [nameof<LegacyLookupsDatabase>('currency')]: lookupSchema,
        [nameof<LegacyLookupsDatabase>('uom')]: lookupSchema,
        [nameof<LegacyLookupsDatabase>('location')]: lookupSchema,
        [nameof<LegacyLookupsDatabase>('lookupVersions')]: `++${nameof<ILegacyLookupVersion>('name')}`,
        [nameof<LegacyLookupsDatabase>('uomVolume')]: lookupSchema,
        [nameof<LegacyLookupsDatabase>('uomMass')]: lookupSchema,
        [nameof<LegacyLookupsDatabase>('product')]: lookupSchema
      },
      2: { [nameof<LegacyLookupsDatabase>('customer')]: lookupSchema },
      3: { [nameof<LegacyLookupsDatabase>('supplier')]: lookupSchema },
      4: { [nameof<LegacyLookupsDatabase>('vesselType')]: lookupSchema }
    };

    Object.keys(schemaUpgrades).sort().forEach(version => {
      const schema = schemaUpgrades[version];

      this.version(Number(version)).stores(schema);

      Object.keys(schema).forEach(tableName => {
        this[tableName] = this.table(tableName);
      });
    });
  }
}
