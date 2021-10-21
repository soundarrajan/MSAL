import { Observable } from 'rxjs';
import { IServerGridPagination } from '@shiptech/core/grid/server-grid/server-grid-pagination';

export interface IExportDocumentRequestInterface {
  exportType: number;
  SearchText: string;
  Pagination: IServerGridPagination;
  columns: any[];
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
