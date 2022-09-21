import {
  IBaseQuantityControlRequest,
  IBaseQuantityControlResponse
} from './request-response.quantity-control.model';

export interface IQcRevertVerifyReportsRequest
  extends IBaseQuantityControlRequest {
  reportIds: number[];
}

export interface IQcRevertVerifyReportsResponse
  extends IBaseQuantityControlResponse {}
