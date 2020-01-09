import {nullable} from '@shiptech/core/utils/nullable';
import {IServerGridInfo} from '@shiptech/core/grid/server-grid/server-grid-request-response';

export class LoadAuditLogAction {
  static readonly type = '[QC.Report.Audit.Log] Load QC Audit Log';

  constructor(public serverGridInfo: IServerGridInfo) {
  }

  public log(): any {
    return {
      serverGridInfo: nullable(this.serverGridInfo)?.pagination,
      searchText: nullable(this.serverGridInfo)?.searchText,
      hasFilters: (nullable(this.serverGridInfo)?.pageFilters?.filters ?? []).length,
      hasSorts: (nullable(this.serverGridInfo)?.sortList?.sortList || []).length
    };
  }
}

export class LoadAuditLogSuccessfulAction {
  static readonly type = '[QC.Report.Audit.Log] Load QC Audit Log Successful';

  constructor() {
  }

  public log(): any {
    return {};
  }
}

export class LoadAuditLogFailedAction {
  static readonly type = '[QC.Report.Audit.Log] Load QC Audit Log Failed';

  constructor() {
  }

  public log(): any {
    return {};
  }
}
