import { Injectable } from '@angular/core';
import {
  IExportApiService,
  IExportDocumentRequestInterface
} from '@shiptech/core/ui/components/export/api/export-api.service.interface';
import { Observable, of } from 'rxjs';
import { ApiCall } from '@shiptech/core/utils/decorators/api-call.decorator';

@Injectable({
  providedIn: 'root'
})
export class ExportApiServiceMock implements IExportApiService {
  constructor() {}

  @ApiCall()
  exportDocument(
    url: string,
    request: IExportDocumentRequestInterface
  ): Observable<any> {
    return of(undefined);
  }
}
