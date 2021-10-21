import {
  IBaseQuantityControlRequest,
  IBaseQuantityControlResponse
} from './request-response.quantity-control.model';
import { IQcOrderProductsListItemDto } from '../dto/qc-order-products-list-item.dto';

export interface IGetOrderProductsListRequest
  extends IBaseQuantityControlRequest {
  vesselVoyageDetailId: number;
}

export interface IGetOrderProductsListResponse
  extends IBaseQuantityControlResponse {
  items: IQcOrderProductsListItemDto[];
  totalCount: number;
}
