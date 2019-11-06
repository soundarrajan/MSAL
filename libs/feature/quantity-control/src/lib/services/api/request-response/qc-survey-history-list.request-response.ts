import { IBaseQuantityControlRequest, IBaseQuantityControlResponse } from './request-response.quantity-control.model';
import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';
import { QcSurveyHistoryListItemModel } from '../../models/qc-survey-history-list-item.model';

export interface IGetQcSurveyHistoryListRequest extends IBaseQuantityControlRequest, IServerGridInfo {
  portCallId: string;
}

export interface IGetQcSurveyHistoryListResponse extends IBaseQuantityControlResponse {
  items: QcSurveyHistoryListItemModel[];
  totalItems: number;
}
