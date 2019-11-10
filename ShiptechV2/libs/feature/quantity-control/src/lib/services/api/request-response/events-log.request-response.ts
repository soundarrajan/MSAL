import { IBaseQuantityControlRequest, IBaseQuantityControlResponse } from './request-response.quantity-control.model';
import { QcEventLogListItemDto } from '../dto/qc-event-log-list-item.dto';


export interface IGetEventsLogRequest extends IBaseQuantityControlRequest {
  reportId: number;
}

export interface IGetEventsLogResponse extends IBaseQuantityControlResponse {
  items: QcEventLogListItemDto[];
}
