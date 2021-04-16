import {
  IBaseQuantityControlRequest,
  IBaseQuantityControlResponse
} from './request-response.quantity-control.model';
import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';
import { IQcSurveyHistoryListItemDto } from '../dto/qc-survey-history-list-item.dto';

export interface IGetQcSurveyHistoryListRequest
  extends IBaseQuantityControlRequest,
    IServerGridInfo {
  id: number;
}

export interface IGetQcSurveyHistoryListResponse
  extends IBaseQuantityControlResponse {
  items: IQcSurveyHistoryListItemDto[];
  totalCount: number;
  nbOfMatched: number;
  nbOfMatchedWithinLimit: number;
  nbOfNotMatched: number;
}
