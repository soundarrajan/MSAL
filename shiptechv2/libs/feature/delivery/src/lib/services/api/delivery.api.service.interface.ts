
import { Observable } from 'rxjs';
import { IDeliveryConversionInfoResponse, IDeliveryDetailsRequest, IDeliveryDetailsResponse, IDeliveryInfoForOrderResponse, IDeliveryOrderSummaryResponse, IDeliveryQuantityParametersResponse, IDeliverySpecParametersResponse, IOrderResponse } from './request-response/delivery-by-id.request-response';


export interface IDeliveryApiService {
  getDeliveryDetails(
    request: any
  ): Observable<IDeliveryDetailsResponse>;

  getDeliveryInfoForOrder(
    request: any
  ): Observable<IDeliveryInfoForOrderResponse[]>;

  getDeliveryOrderSummary(
    request: any
  ): Observable<IDeliveryOrderSummaryResponse>;

  getOrder(
    request: any
  ): Observable<IOrderResponse>;

  getDeliverySpecParameters(
    request: any
  ): Observable<IDeliverySpecParametersResponse[]>;

  getDeliveryQuantityParameters(
    request: any
  ): Observable<IDeliveryQuantityParametersResponse[]>;
  
  
  getConversionInfo(
    request: any
  ): Observable<IDeliveryConversionInfoResponse>;

  saveDelivery(
    request: any
  ): Observable<IDeliveryDetailsResponse>;

  updateDelivery(
    request: any
  ): Observable<IDeliveryDetailsResponse>;


  verifyDelivery(
    request: any
  ): Observable<IDeliveryDetailsResponse>;

  revertVerifyDelivery(
    request: any
  ): Observable<IDeliveryDetailsResponse>;


}
