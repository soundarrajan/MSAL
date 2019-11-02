import { IBaseQuantityControlRequest, IBaseQuantityControlResponse } from './request-response.quantity-control.model';
import { QcReportsListItemModel } from '../../models/qc-reports-list-item.model';
import { IApiGridRequestDto } from '@shiptech/core/grid/api-grid-request-response.dto';

export interface IGetQcReportsListRequest extends IBaseQuantityControlRequest, IApiGridRequestDto {
}

export interface IGetQcReportsListResponse extends IBaseQuantityControlResponse {
  items: QcReportsListItemModel[];
  totalItems: number;
}
