
import { Observable } from 'rxjs';
import { IDeliveryConversionInfoResponse, IDeliveryDetailsRequest, IDeliveryDetailsResponse, IDeliveryInfoForOrderResponse, IDeliveryOrderSummaryResponse, IDeliveryQuantityParametersResponse, IDeliverySpecParametersResponse, IOrderResponse } from './request-response/delivery-by-id.request-response';


export interface IDeliveryApiService {
  getContractDetails(
    request: any
  ): Observable<IDeliveryDetailsResponse>;


  getTenantConfiguration(
    request: any
  ): Observable<any>;

  getStaticLists(
    request: any
  ): Observable<any>;




}
