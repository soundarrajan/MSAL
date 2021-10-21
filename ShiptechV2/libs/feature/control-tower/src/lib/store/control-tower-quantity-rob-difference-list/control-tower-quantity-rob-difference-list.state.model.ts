import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';
import { DefaultPageSize } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { BaseModel } from '../report/models/base.sub-state';

export class ControlTowerQuantityRobDifferenceListStateModel extends BaseModel {
  gridInfo: IServerGridInfo = {
    pagination: { skip: 0, take: DefaultPageSize }
  };

  nbOfNewStatuses: number;
  nbOfMarkedAsSeenStatuses: number;
  nbOfResolvedStatuses: number;
  totalCount: number;

  constructor(
    state: Partial<ControlTowerQuantityRobDifferenceListStateModel> = {}
  ) {
    super();
    Object.assign(this, state);
  }
}

export interface IControlTowerQuantityRobDifferenceListState
  extends ControlTowerQuantityRobDifferenceListStateModel {}
