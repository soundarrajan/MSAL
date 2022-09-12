import { Observable } from 'rxjs';
import { IOrderListRequest, IOrderListResponse } from '../request-reponse-dtos/order-list.dtos';
import { IGetForTransactionForSearchRequest, IGetForTransactionForSearchResponse } from './bdn-information-response';

export interface IBdnInformationApiService {
  getForTransactionForSearch(request: IGetForTransactionForSearchRequest): Observable<IGetForTransactionForSearchResponse[]>;
  getOrderList(request: IOrderListRequest): Observable<IOrderListResponse>;

}
