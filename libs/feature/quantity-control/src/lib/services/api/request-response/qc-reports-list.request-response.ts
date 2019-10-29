import { IBaseQuantityControlRequest, IBaseQuantityControlResponse } from './request-response.quantity-control.model';
import { QcReportsListItemModel } from '../../models/qc-reports-list-item.model';

export interface IGetQcReportsListRequest extends IBaseQuantityControlRequest {
  pageSize: number;
}

export interface IGetQcReportsListResponse extends IBaseQuantityControlResponse {
  items: QcReportsListItemModel[];
  totalItems: number;
}
