
import { Observable } from 'rxjs';
import { IDeliveryConversionInfoResponse, IDeliveryDetailsRequest, IDeliveryDetailsResponse, IDeliveryInfoForOrderResponse, IDeliveryOrderSummaryResponse, IDeliveryQuantityParametersResponse, IDeliverySpecParametersResponse, IOrderResponse } from './request-response/contract-by-id.request-response';


export interface IContractApiService {
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
