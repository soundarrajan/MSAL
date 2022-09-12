import { Observable } from 'rxjs';
import {
  IGetInvoiceCompletesListRequest,
  IGetInvoiceCompletesListResponse
} from './dto/invoice-complete-list-item.dto';
import {
  IGetInvoiceListRequest,
  IGetInvoiceListResponse
} from './dto/invoice-list-item.dto';

export interface IInvoiceCompleteApiService {
  getReportList(
    request: IGetInvoiceCompletesListRequest
  ): Observable<IGetInvoiceCompletesListResponse>;

  getInvoiceList(
    request: IGetInvoiceListRequest
  ): Observable<IGetInvoiceListResponse>;

  getReportListExportUrl(): string;

  getInvoiceListExportUrl(): string;
}
