import {
  IBaseQuantityControlRequest,
  IBaseQuantityControlResponse
} from './request-response.quantity-control.model';

export interface IQcVerifyReportsRequest extends IBaseQuantityControlRequest {
  reportIds: number[];
}

export interface IQcVerifyReportsResponse
  extends IBaseQuantityControlResponse {}
