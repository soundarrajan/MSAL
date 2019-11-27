import { nullable } from '@shiptech/core/utils/nullable';
import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';

export class LoadReportListAction {
  static readonly type = '[QC.Report.List] Load Report List';

  constructor(public serverGridInfo: IServerGridInfo) {
  }

  public log(): any {
    return {
      serverGridInfo: nullable(this.serverGridInfo).pagination,
      searchText: nullable(this.serverGridInfo).searchText,
      hasFilters: (nullable(this.serverGridInfo).filters || []).length,
      hasSorts: (nullable(this.serverGridInfo).sortList || []).length
    };
  }
}

export class LoadReportListSuccessfulAction {
  static readonly type = '[QC.Report.List] Load Report List Successful';

  constructor(public nbOfMatched: number, public nbOfNotMatched: number, public nbOfMatchedWithinLimit: number, public totalItems: number) {
  }

  public log(): any {
    return {
      nbOfMatched: this.nbOfMatched,
      nbOfNotMatched: this.nbOfNotMatched,
      nbOfMatchedWithinLimit: this.nbOfMatchedWithinLimit,
      totalItems: this.totalItems
    };
  }
}

export class LoadReportListFailedAction {
  static readonly type = '[QC.Report.List] Load Report List Failed';

  constructor() {
  }

  public log(): any {
    return {};
  }
}
