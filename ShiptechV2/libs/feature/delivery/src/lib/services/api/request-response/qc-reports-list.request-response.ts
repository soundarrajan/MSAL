import {
  IBaseQuantityControlRequest,
  IBaseQuantityControlResponse
} from './request-response.quantity-control.model';
import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';
import { IQcReportsListItemDto } from '../dto/qc-reports-list-item.dto';

export interface IGetQcReportsListRequest
  extends IBaseQuantityControlRequest,
    IServerGridInfo {}

export interface IGetQcReportsListResponse
  extends IBaseQuantityControlResponse {
  items: IQcReportsListItemDto[];
  totalCount: number;
  nbOfMatched: number;
  nbOfMatchedWithinLimit: number;
  nbOfNotMatched: number;
}
