import { Observable } from 'rxjs';
import { IOrderListRequest, IOrderListResponse } from '../request-reponse-dtos/order-list.dtos';
import { IPhysicalSupplierListRequest, IPhysicalSupplierListResponse, IProductListRequest, IProductListResponse } from './masters-list-response';

export interface IMastersListApiService {
  getProductList(request: IProductListRequest): Observable<IProductListResponse>;
  getPhysicalSupplierList(request: IPhysicalSupplierListRequest): Observable<IPhysicalSupplierListResponse>;
}
