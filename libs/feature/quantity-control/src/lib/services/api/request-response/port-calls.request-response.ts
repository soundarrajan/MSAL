import { IBaseQuantityControlRequest, IBaseQuantityControlResponse } from './request-response.quantity-control.model';
import { PortCallListItemModel } from '../../models/port-call-list-item.model';

export interface IGetPortCallsRequest extends IBaseQuantityControlRequest {
  pageSize: number;
}

export interface IGetPortCallsResponse extends IBaseQuantityControlResponse {
  items: PortCallListItemModel[];
  totalItems: number;
}
