import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../config/app-config.service';
import { nameof } from '../utils/type-definitions';
import { ILookupDto } from '../lookups/lookup-dto.interface';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';

interface ILookupVersion {
  name: string;
  lastModificationDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class LookupsDatabase extends Dexie {

  company: Dexie.Table<ILookupDto, number>;
  currency: Dexie.Table<ILookupDto, number>;
  uom: Dexie.Table<ILookupDto, number>;
  lookupVersions: Dexie.Table<ILookupVersion, string>;

  constructor() {
    super('Shiptech-UI.Lookups');

    const lookupId = nameof<ILookupDto>('id');
    const lookupName = nameof<ILookupDto>('name');
    const lookupSchema = `++${lookupId}, ${lookupName}`;

    const schema = {
      [nameof<LookupsDatabase>('company')]: lookupSchema,
      [nameof<LookupsDatabase>('currency')]: lookupSchema,
      [nameof<LookupsDatabase>('uom')]: lookupSchema,
      [nameof<LookupsDatabase>('lookupVersions')]: `++${nameof<ILookupVersion>('name')}`
    };

    this.version(1).stores(schema);

    Object.keys(schema).forEach(tableName =>{
      this[tableName] = this.table(tableName);
    });
  }
}


interface ILegacyListStatus {
  name: string;
  lastModificationDate: string;
}

export interface IHashListsLegacyResponse {
  initTime: string;
  selectListTimestamps: ILegacyListStatus[]
}

const NonLookupTables = [nameof<LookupsDatabase>('lookupVersions').toString()];

interface IStaticListLegacy {
  name: string;
  items: ILookupDto[]
}

@Injectable({
  providedIn: 'root'
})
export class LookupsCacheService {

  constructor(private appConfig: AppConfig, private db: LookupsDatabase, private http: HttpClient) {
    //TODO: AppConfig might come uninitialized yet.
  }

  private async loadInternal(): Promise<any> {

    try {
      await this.db.open();
    }catch (e) {
      console.log(e);
    }


    const currentLookupVersions = await this.db.lookupVersions.toArray();

    const serverLookupVersions = (await this.http.post<IHashListsLegacyResponse>(
        `${this.appConfig.API.BASE_URL}/Shiptech10.Api.Infrastructure/api/infrastructure/static/listsHash`,
        {}).toPromise()
    ).selectListTimestamps;


    const lookupTableNames = this.db.tables.filter(t => NonLookupTables.includes(t.name)).map(t => t.name);

    const minDate = new Date(0);
    const toDateOrDefault = (date: string) => date ? new Date(date) : minDate;

    const updateLists = lookupTableNames.filter(lookupName => {
      const lookupServerVersion = toDateOrDefault(serverLookupVersions[lookupName]);
      const lookupCurrentVersion = toDateOrDefault(currentLookupVersions[lookupName]);

      return lookupCurrentVersion <= lookupServerVersion;
    });

    const serverLookups = await this.http.post<IStaticListLegacy[]>(`${this.appConfig.API.BASE_URL}//Shiptech10.Api.Infrastructure/api/infrastructure/static/lists`, updateLists).toPromise();

    const allUpdates = serverLookups.map(async serverLookup => {
      const lookupTable = this.db.table(this.mapTableName(serverLookup.name));

      await lookupTable.clear();

      const lookupItems = serverLookup.items.map(i => ({ id: i.id, name: i.name }));
      await lookupTable.bulkPut(lookupItems);

      return lookupItems;
    });

    return await Promise.all(allUpdates);
  }

  // noinspection JSMethodCanBeStatic
  private mapTableName(tableName: string): string {
    // Note: In case the server tables names do not match desired names locally, map them here
    return tableName[0].toLowerCase() + tableName.slice(1);
  }

  public load(): Observable<any> {
    return fromPromise(this.loadInternal());
  }


}


