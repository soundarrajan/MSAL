import { Injectable, InjectionToken } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '@shiptech/core/config/app-config';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';

import { catchError, map } from 'rxjs/operators';
import { IControlTowerApiService } from './control-tower.api.service.interface';
import {
  IGetControlTowerListRequest,
  IGetControlTowerQuantityRobDifferenceListResponse,
  IGetControlTowerQuantitySupplyDifferenceListResponse
} from './dto/control-tower-list-item.dto';

export namespace ControlTowerApiPaths {
  export const getControlTowerQuantityRobDifferenceList = () => `api/labs/list`;
  export const getControlTowerQuantityRobDifferenceListExportUrl = () =>
    `api/labs/export`;
  export const getControlTowerQuantitySupplyDifferenceList = () =>
    `api/invoice/list`;
  export const getControlTowerQuantitySupplyDifferenceListExportUrl = () =>
    `api/invoice/export`;
}

@Injectable({
  providedIn: 'root'
})
export class ControlTowerApi implements IControlTowerApiService {
  @ApiCallUrl()
  private _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_LABS;

  @ApiCallUrl()
  private _invoiceUrl = this.appConfig.v1.API.BASE_URL_DATA_INVOICES;

  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  @ObservableException()
  getControlTowerQuantityRobDifferenceList(
    request: IGetControlTowerListRequest
  ): Observable<IGetControlTowerQuantityRobDifferenceListResponse> {
    return this.http.post<IGetControlTowerQuantityRobDifferenceListResponse>(
      `${
        this._apiUrl
      }/${ControlTowerApiPaths.getControlTowerQuantityRobDifferenceList()}`,
      { payload: request }
    );
  }

  getControlTowerQuantityRobDifferenceListExportUrl(): string {
    return `${
      this._apiUrl
    }/${ControlTowerApiPaths.getControlTowerQuantityRobDifferenceListExportUrl()}`;
  }

  @ObservableException()
  getControlTowerQuantitySupplyDifferenceList(
    request: IGetControlTowerListRequest
  ): Observable<IGetControlTowerQuantitySupplyDifferenceListResponse> {
    return this.http.post<IGetControlTowerQuantitySupplyDifferenceListResponse>(
      `${
        this._invoiceUrl
      }/${ControlTowerApiPaths.getControlTowerQuantitySupplyDifferenceList()}`,
      { payload: request }
    );
  }

  getControlTowerQuantitySupplyDifferenceListExportUrl(): string {
    return `${
      this._invoiceUrl
    }/${ControlTowerApiPaths.getControlTowerQuantitySupplyDifferenceListExportUrl()}`;
  }
}

export const CONTROL_TOWER_API_SERVICE = new InjectionToken<
  IControlTowerApiService
>('CONTROL_TOWER_API_SERVICE');
