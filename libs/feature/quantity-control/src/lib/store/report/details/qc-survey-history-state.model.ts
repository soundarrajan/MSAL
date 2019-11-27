import { BaseModel } from '../models/base.sub-state';
import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';
import { DefaultPageSize } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';

export class QcSurveyHistoryStateModel extends BaseModel {
  gridInfo: IServerGridInfo = { pagination: { skip: 0, take: DefaultPageSize } };
  nbOfMatched: number;
  nbOfNotMatched: number;
  nbOfMatchedWithinLimit: number;
  totalItems: number;

  constructor(state: Partial<QcSurveyHistoryStateModel> = {}) {
    super();
    Object.assign(this, state);
  }
}

export interface IQcSurveyHistoryState extends QcSurveyHistoryStateModel {
}
