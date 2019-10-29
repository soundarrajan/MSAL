import { IBaseQuantityControlRequest, IBaseQuantityControlResponse } from './request-response.quantity-control.model';
import { QcReportsListItemModel } from '../../models/qc-reports-list-item.model';

export interface IGetPortCallsRequest extends IBaseQuantityControlRequest {
  pageSize: number;
}

export interface IGetPortCallsResponse extends IBaseQuantityControlResponse {
  items: QcReportsListItemModel[];
  totalItems: number;
}
