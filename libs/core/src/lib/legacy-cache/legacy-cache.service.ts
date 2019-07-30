import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../config/app-config.service';
import { nameof } from '../utils/type-definitions';
import { ILookupDto } from '../lookups/lookup-dto.interface';
import { Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { LegacyLookupsDatabase } from './legacy-lookups-database.service';

interface ILegacyListStatus {
  name: string;
  lastModificationDate: string;
}

interface IHashListsLegacyResponse {
  initTime: string;
  selectListTimestamps: ILegacyListStatus[]
}

interface IStaticListLegacy {
  name: string;
  items: ILookupDto[]
}


const NonLookupTables = [nameof<LegacyLookupsDatabase>('lookupVersions').toString()];

@Injectable({
  providedIn: 'root'
})
export class LookupsCacheService {
  constructor(private appConfig: AppConfig, private db: LegacyLookupsDatabase, private http: HttpClient) {
  }

  private async loadInternal(): Promise<any> {
    // TODO: Implement proper logging here

    await this.db.open();

    const lookupTableNames = this.db.tables.filter(t => !NonLookupTables.includes(t.name)).map(t => t.name);
    // Note: Local LookupVersions may be "dirty", as in, there may be tables that are not relevant anymore, e.g deleted from schema
    const localLookupVersions = await this.db.lookupVersions.toArray();

    const serverLookupVersions = (await this.http.post<IHashListsLegacyResponse>(
        `${this.appConfig.API.BASE_URL}/Shiptech10.Api.Infrastructure/api/infrastructure/static/listsHash`,
        {}).toPromise()
    ).selectListTimestamps
    // Note: The server returns versions of lookups we're not interested in, e.g used in v1
      .filter(listHash => lookupTableNames.some(lookupName => lookupName.toUpperCase() === listHash.name.toUpperCase()))
      // Note: server returns lookup names with uppercase first letter.
      .map(listHash => ({ ...listHash, name: this.mapToTableName(listHash.name) }));

    const lookupsToUpdate = [];
    lookupTableNames.forEach(lookupName => {
      const localLookupVersion = localLookupVersions.find(l => l.name === lookupName);

      // Note: if we don't have the lookups in the current lookup versions, it means it's newly added (schema changed) and we should get it..
      if (!localLookupVersion) {
        lookupsToUpdate.push(lookupName);
        return;
      }

      const serverLookupVersion = serverLookupVersions.find(listHash => listHash.name === lookupName);
      if (!serverLookupVersion) {
        // TODO: Log, think what happens if we request a list and the server doesn't have it
        return;
      }

      if (new Date(localLookupVersion.lastModificationDate) < new Date(serverLookupVersion.lastModificationDate)) {
        lookupsToUpdate.push(lookupName);
      }
    });

    if (!lookupsToUpdate.length) {
      // TODO: log nothing to update
      return;
    }

    const lookupsResponse = await this.http.post<IStaticListLegacy[]>(`${this.appConfig.API.BASE_URL}/Shiptech10.Api.Infrastructure/api/infrastructure/static/lists`,
      { Payload: lookupsToUpdate.map(this.mapFromTableName) }).toPromise();

    // Note: Due to a bug?! the backend returns more lists than actually requested.
    // Note: If we decide that the server will force push updates, then we need to also update the lookup version. Currently the server does not return this info.
    const updatedLookups = lookupsResponse
      .filter(s => lookupsToUpdate.some(l => s.name.toUpperCase() === l.toUpperCase()))
      .map(s => {
        const tableName = this.mapToTableName(s.name);
        return { ...s, name: tableName, table: this.db.table(tableName) };
      });

    // Process the updates
    await this.db.transaction('rw!', [this.db.lookupVersions, ...updatedLookups.map(s => s.table)], async () => {
      const allUpdates = updatedLookups.map(async tableAndLookup => {
        const lookupTable = tableAndLookup.table;

        await lookupTable.clear();

        const lookupItems = tableAndLookup.items.map(i => ({ id: i.id, name: i.name }));
        await lookupTable.bulkPut(lookupItems);

        return lookupItems;
      });

      // Note: In transaction it's important to use the Dexie.Promise so that the context flows down.
      await Dexie.Promise.all(allUpdates);

      await this.db.lookupVersions.clear();
      await this.db.lookupVersions.bulkAdd(serverLookupVersions);
    });
  }

  // noinspection JSMethodCanBeStatic
  private mapToTableName(listName: string): string {
    // Note: In case the server tables names do not match desired names locally, map them here
    return listName[0].toLowerCase() + listName.slice(1);
  }

  // noinspection JSMethodCanBeStatic
  private mapFromTableName(tableName: string): string {
    // Note: In case the server tables names do not match desired names locally, map them here
    return tableName[0].toUpperCase() + tableName.slice(1);
  }

  public load(): Observable<any> {
    //TODO: What happens if loading cache fails? Handle failure anyway.
    //TODO: We should probably delete database and retry a couple of time then go to error screen
    return fromPromise(this.loadInternal());
  }
}


