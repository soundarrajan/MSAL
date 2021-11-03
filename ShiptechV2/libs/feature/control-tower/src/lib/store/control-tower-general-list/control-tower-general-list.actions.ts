import { nullable } from '@shiptech/core/utils/nullable';
import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';

export class LoadControlTowerListAction {
  static readonly type = '[CT.List] Load Control Tower  List';

  constructor(public serverGridInfo: IServerGridInfo) {}

  public log(): any {
    return {
      serverGridInfo: nullable(this.serverGridInfo)?.pagination,
      searchText: nullable(this.serverGridInfo)?.searchText,
      hasFilters: (nullable(this.serverGridInfo)?.pageFilters?.filters ?? [])
        .length,
      hasSorts: (nullable(this.serverGridInfo)?.sortList?.sortList || []).length
    };
  }
}

export class LoadControlTowerListSuccessfulAction {
  static readonly type = '[CT.List] Load Control Tower List Successful';

  constructor(
    public noOfNew: number,
    public noOfMarkedAsSeen: number,
    public noOfResolved: number,
    public totalCount?: number
  ) {}

  public log(): any {
    return {
      firstStatusCount: this.noOfNew,
      secondStatusCount: this.noOfMarkedAsSeen,
      thirdStatusCount: this.noOfResolved,
      totalCount: this.totalCount
    };
  }
}

export class LoadControlTowerListFailedAction {
  static readonly type = '[CT.List] Load Control Tower  List Failed';

  constructor() {}

  public log(): any {
    return {};
  }
}
