import { nullable } from '@shiptech/core/utils/nullable';
import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';

export class LoadControlTowerQuantityRobDifferenceListAction {
  static readonly type =
    '[CT.RobDifference.List] Load Control Tower Rob Difference List List';

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

export class LoadControlTowerQuantityRobDifferenceListSuccessfulAction {
  static readonly type =
    '[CT.RobDifference.List] Load Control Tower Rob Difference List Successful';

  constructor(
    public nbOfNewStatuses: number,
    public nbOfMarkedAsSeenStatuses: number,
    public nbOfResolvedStatuses: number,
    public totalCount: number
  ) {}

  public log(): any {
    return {
      nbOfNewStatuses: this.nbOfNewStatuses,
      nbOfMarkedAsSeenStatuses: this.nbOfMarkedAsSeenStatuses,
      nbOfResolvedStatuses: this.nbOfResolvedStatuses,
      totalCount: this.totalCount
    };
  }
}

export class LoadControlTowerQuantityRobDifferenceListFailedAction {
  static readonly type =
    '[CT.RobDifference.List] Load Control Tower Rob Difference List Failed';

  constructor() {}

  public log(): any {
    return {};
  }
}
