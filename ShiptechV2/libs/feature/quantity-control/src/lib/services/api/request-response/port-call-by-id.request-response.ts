import { IBaseQuantityControlRequest, IBaseQuantityControlResponse } from './request-response.quantity-control.model';
import { IPortCallDto } from '../dto/port-call.dto';

export interface IGetPortCallByIdRequest extends IBaseQuantityControlRequest {
  portCallId: number;
}

export interface IGetPortCallByIdResponse extends IBaseQuantityControlResponse {
  portCall: IPortCallDto
}
