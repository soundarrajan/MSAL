import { BaseModel } from '../models/base.sub-state';
import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';

export class QcSurveyHistoryStateModel extends BaseModel {
  gridInfo: IServerGridInfo = {};
  nbOfMatched: number;
  nbOfNotMatched: number;
  nbOfMatchedWithinLimit: number;
  totalCount: number;

  constructor(state: Partial<QcSurveyHistoryStateModel> = {}) {
    super();
    Object.assign(this, state);
  }
}

export interface IQcSurveyHistoryState extends QcSurveyHistoryStateModel {}
