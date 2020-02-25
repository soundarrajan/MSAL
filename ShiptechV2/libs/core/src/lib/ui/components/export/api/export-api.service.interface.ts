import { Observable } from 'rxjs';

export interface IExportDocumentRequestInterface {
  exportType: number;
  SearchText: string;
  Pagination: number;
  columns: any[];
  dateTimeOffset: number;
  timezone: string;
  PageFilters: any;
  SortList: any;
}

export interface IExportApiService {
  exportDocument(
    url: string,
    request: IExportDocumentRequestInterface
  ): Observable<any>;
}
