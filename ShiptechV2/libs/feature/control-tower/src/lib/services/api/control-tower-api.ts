import { Injectable, InjectionToken } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '@shiptech/core/config/app-config';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';



import { catchError, map } from 'rxjs/operators';
import { IControlTowerApiService } from './control-tower.api.service.interface';
import { IGetControlTowerQuantityRobDifferenceListRequest, IGetControlTowerQuantityRobDifferenceListResponse } from './dto/control-tower-list-item.dto';

export namespace ControlTowerApiPaths {
  export const getInvoicesList = () => `api/invoice/list`;
  export const getInvoicesListExport = () => `api/invoice/export`;
}

@Injectable({
  providedIn: 'root'
})
export class ControlTowerApi implements IControlTowerApiService {
  @ApiCallUrl()
  private _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_INVOICES;

  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  @ObservableException()
  getInvoiceList(
    request: IGetControlTowerQuantityRobDifferenceListRequest
  ): Observable<IGetControlTowerQuantityRobDifferenceListResponse> {
    return this.http.post<IGetControlTowerQuantityRobDifferenceListResponse>(
      `${this._apiUrl}/${ControlTowerApiPaths.getInvoicesList()}`,
      { payload: request }
    );
  }

  getInvoiceListExportUrl(): string {
    return `${this._apiUrl}/${ControlTowerApiPaths.getInvoicesListExport()}`;
  }
}

export const CONTROL_TOWER_API_SERVICE = new InjectionToken<
  IControlTowerApiService
>('CONTROL_TOWER_API_SERVICE');
