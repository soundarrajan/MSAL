import {Injectable} from "@angular/core";
import {LegacyLookupsDatabase} from "@shiptech/core/legacy-cache/legacy-lookups-database.service";
import Dexie from "dexie";
import {LookupsCacheService} from "@shiptech/core/legacy-cache/legacy-cache.service";
import {fromPromise} from "rxjs/internal-compatibility";

export enum DatabaseManipulationEnum {
  DashboardLabelConfiguration = 'scheduleDashboardLabelConfiguration',
  Status = 'status'
}

@Injectable({
  providedIn: 'root'
})

export class DatabaseManipulation extends Dexie {

  constructor(private db: LegacyLookupsDatabase) {
    super('Shiptech-UI.Lookups');
  }

  async getStatusIdByName(tableName: string, StatusName: string): Promise<number> {
    let entityId = null;
    await this.db[tableName].where('name').startsWithAnyOfIgnoreCase(StatusName).each((item) => {
      entityId = item.id;
    });
    return entityId;
  }

  async getStatusColorFromDashboard(statusId: number, transactionTypeId: number): Promise<string> {
    let color = null;
    await this.db[DatabaseManipulationEnum.DashboardLabelConfiguration].where('id').equals(statusId).and((item) => item.transactionTypeId === transactionTypeId).each((item) => {
      color = item.code;
    });
    return color;
  }
}
