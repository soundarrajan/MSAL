import { IBaseQuantityControlRequest, IBaseQuantityControlResponse } from './request-response.quantity-control.model';
import { QcReportsListItemModel } from '../../models/qc-reports-list-item.model';
import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';

export interface IGetQcReportsListRequest extends IBaseQuantityControlRequest, IServerGridInfo {
}

export interface IGetQcReportsListResponse extends IBaseQuantityControlResponse {
  items: QcReportsListItemModel[];
  totalItems: number;
  nbOfMatched: number;
  nbOfNotMatched: number;
  nbOfMatchedWithinLimit: number;
}
