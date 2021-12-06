import {
  IBaseQuantityControlRequest,
  IBaseQuantityControlResponse
} from './request-response.quantity-control.model';
import { IQcEventLogListItemDto } from '../dto/qc-event-log-list-item.dto';
import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';

export interface IGetEventsLogRequest
  extends IBaseQuantityControlRequest,
    IServerGridInfo {
  id: number;
}

export interface IGetEventsLogResponse extends IBaseQuantityControlResponse {
  items: IQcEventLogListItemDto[];
  totalCount: number;
}
