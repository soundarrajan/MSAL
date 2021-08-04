import {
  IBaseQuantityControlRequest,
  IBaseQuantityControlResponse
} from './request-response.quantity-control.model';

export interface IWatchVesselRequest extends IBaseQuantityControlRequest {
  reportId: number;
}

export interface IWatchVesselResponse extends IBaseQuantityControlResponse {}
