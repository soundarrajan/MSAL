import {
  IBaseQuantityControlRequest,
  IBaseQuantityControlResponse
} from './request-response.quantity-control.model';
import { IQcPortCallProductTypeBdnDto } from '../dto/qc-port-call-product-type-bdn.dto';

export interface IQcLoadPortCallBdnRequest extends IBaseQuantityControlRequest {
  vesselVoyageDetailsId: number;
}

export interface IQcLoadPortCallBdnResponse
  extends IBaseQuantityControlResponse {
  vesselVoyageDetailsId: number;
  nbOfClaims: number;
  nbOfDeliveries: number;
  productTypes: IQcPortCallProductTypeBdnDto[];
}
