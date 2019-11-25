import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';
import { DefaultPageSize } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';

export class QcReportsListStateModel {
  gridInfo: IServerGridInfo = { pagination: { skip: 0, take: DefaultPageSize } };
  _isLoading = false;
  _hasLoaded = false;
  nbOfMatched: number;
  nbOfNotMatched: number;
  nbOfMatchedWithinLimit: number;
  totalItems: number;

  constructor(state: Partial<QcReportsListStateModel> = {}) {
    Object.assign(this, state);
  }
}

export interface IQcReportsListState extends QcReportsListStateModel {
}
