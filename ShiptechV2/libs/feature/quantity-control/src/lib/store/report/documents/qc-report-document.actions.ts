import { IServerGridInfo } from "@shiptech/core/grid/server-grid/server-grid-request-response";

export class LoadDocumentsAction {
  static readonly type = '[QC.Document] Load Documents';

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

export class LoadDocumentsSuccessfulAction {
  static readonly type = '[QC.Document.List] Load Document List Successful';

  constructor(public matchedCount: number) {
  }

  public log(): any {
    return {
      matchedCount: this.matchedCount
    };
  }
}

export class LoadDocumentsFailedAction {
  static readonly type = '[QC.Document.List] Load Document List Failed';

  constructor() {
  }

  public log(): any {
    return {};
  }
}
