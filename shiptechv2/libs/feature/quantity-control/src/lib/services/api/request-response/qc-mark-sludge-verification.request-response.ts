import {
  IBaseQuantityControlRequest,
  IBaseQuantityControlResponse
} from './request-response.quantity-control.model';

export interface IQcMarkSludgeVerificationRequest
  extends IBaseQuantityControlRequest {
  id: number;
  IsVerifiedSludge: boolean;
}

export interface IQcMarkSludgeVerificationResponse
  extends IBaseQuantityControlResponse {}
