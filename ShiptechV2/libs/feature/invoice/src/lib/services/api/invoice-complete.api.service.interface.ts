import { Observable } from 'rxjs';
import {
  IGetInvoiceCompletesListRequest,
  IGetInvoiceCompletesListResponse
} from './dto/invoice-complete-list-item.dto';

export interface IInvoiceCompleteApiService {
  getReportList(request: IGetInvoiceCompletesListRequest): Observable<IGetInvoiceCompletesListResponse>;

}
