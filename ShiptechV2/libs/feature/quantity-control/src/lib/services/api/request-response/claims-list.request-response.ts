import { IBaseQuantityControlRequest, IBaseQuantityControlResponse } from './request-response.quantity-control.model';
import { IQcOrderProductsListItemDto } from '../dto/qc-order-products-list-item.dto';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

export interface IGetOrderProductsListRequest extends IBaseQuantityControlRequest {
  vesselVoyageDetailId: number;
}

export interface IGetOrderProductsListResponse extends IBaseQuantityControlResponse {
  items: IQcOrderProductsListItemDto[];
  totalItems: number;
}
