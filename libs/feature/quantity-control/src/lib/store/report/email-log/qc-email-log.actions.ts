import { IServerGridInfo } from "@shiptech/core/grid/server-grid/server-grid-request-response";

export class LoadEmailLogsAction {
  static readonly type = '[QC.Email.Logs] Load Email Logs';

  constructor(public serverGridInfo: IServerGridInfo) {
  }

  public log(): any {
    return {
      serverGridInfo: this.serverGridInfo?.pagination,
      searchText: this.serverGridInfo?.searchText,
      hasFilters: (this.serverGridInfo?.pageFilters?.filters ?? []).length,
      hasSorts: (this.serverGridInfo?.sortList?.sortList || []).length
    };
  }
}

export class LoadEmailLogsSuccessfulAction {
  static readonly type = '[QC.Email.List] Load Email List Successful';

  constructor(public matchedCount: number) {
  }

  public log(): any {
    return {
      matchedCount: this.matchedCount
    };
  }
}

export class LoadEmailLogsFailedAction {
  static readonly type = '[QC.Email.Logs] Load Email Logs Failed';

  constructor() {
  }

  public log(): any {
    return {};
  }
}
