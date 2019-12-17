import { IBaseQuantityControlRequest, IBaseQuantityControlResponse } from './request-response.quantity-control.model';
import { IQcPortCallProductTypeBdnDto } from '../dto/qc-port-call-product-type-bdn.dto';


export interface IQcLoadPortCallBdnRequest extends IBaseQuantityControlRequest {
  portCallId: string,
}

export interface IQcLoadPortCallBdnResponse extends IBaseQuantityControlResponse {
  portCallId: string;
  productTypes: IQcPortCallProductTypeBdnDto[];
}
