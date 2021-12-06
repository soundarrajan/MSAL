import { Injectable, InjectionToken } from '@angular/core';
import {
  IExportApiService,
  IExportDocumentRequestInterface
} from '@shiptech/core/ui/components/export/api/export-api.service.interface';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExportApiService implements IExportApiService {
  constructor(private http: HttpClient) {}

  @ObservableException()
  exportDocument(url: string, request: IExportDocumentRequestInterface): any {
    return this.http.post(
      url,
      {
        payload: { ...request }
      },
      {
        observe: 'response',
        responseType: 'blob'
      }
    );
  }
}

export const EXPORT_API_SERVICE = new InjectionToken<IExportApiService>(
  'EXPORT_API_SERVICE'
);
