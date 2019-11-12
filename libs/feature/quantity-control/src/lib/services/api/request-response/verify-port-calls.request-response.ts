import { IBaseQuantityControlRequest, IBaseQuantityControlResponse } from './request-response.quantity-control.model';

export interface IVerifyQcReportsRequest extends IBaseQuantityControlRequest {
  reportIds: number[]
}

export interface IVerifyQcReportsResponse extends IBaseQuantityControlResponse {
}
