import { IBaseQuantityControlRequest, IBaseQuantityControlResponse } from './request-response.quantity-control.model';
import { IQcReportViewDto } from '../dto/port-call.dto';

export interface IGetQcReportByIdRequest extends IBaseQuantityControlRequest {
  portCallId: string;
}

export interface IGetQcReportByIdResponse extends IBaseQuantityControlResponse {
  portCall: IQcReportViewDto
}
