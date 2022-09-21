import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';
import { DefaultPageSize } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { BaseModel } from '../report/models/base.sub-state';

export class QcReportsListStateModel extends BaseModel {
  gridInfo: IServerGridInfo = {
    pagination: { skip: 0, take: DefaultPageSize }
  };

  nbOfMatched: number;
  nbOfNotMatched: number;
  nbOfMatchedWithinLimit: number;
  totalCount: number;

  constructor(state: Partial<QcReportsListStateModel> = {}) {
    super();
    Object.assign(this, state);
  }
}

export interface IQcReportsListState extends QcReportsListStateModel {}
