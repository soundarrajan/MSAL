import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';
import { DefaultPageSize } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { BaseModel } from '../report/models/base.sub-state';

export class ControlTowerListStateModel extends BaseModel {
  gridInfo: IServerGridInfo = {
    pagination: { skip: 0, take: DefaultPageSize }
  };

  noOfNew: number;
  noOfMarkedAsSeen: number;
  noOfResolved: number;
  totalCount: number;

  constructor(state: Partial<ControlTowerListStateModel> = {}) {
    super();
    Object.assign(this, state);
  }
}

export interface IControlTowerListState extends ControlTowerListStateModel {
  noOfNew: number;
  noOfMarkedAsSeen: number;
  noOfResolved: number;
}
