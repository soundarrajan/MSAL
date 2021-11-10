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
  IGetControlTowerQuantityClaimsListResponse,
  IGetControlTowerQuantityRobDifferenceListResponse,
  IGetControlTowerQuantitySupplyDifferenceListResponse,
  IGetControlTowerQualityClaimsListResponse,
  IGetControlTowerResidueSludgeDifferenceListResponse
} from './dto/control-tower-list-item.dto';

export namespace ControlTowerApiPaths {
  export const getControlTowerQuantityRobDifferenceList = () =>
    `api/controlTower/robDifferenceList`;
  export const getControlTowerQuantityRobDifferenceListExportUrl = () =>
    `api/controlTower/exportRobDifferenceList`;
  export const getControlTowerQuantitySupplyDifferenceList = () =>
    `api/controlTower/supplyDifferenceList`;
  export const getControlTowerQuantitySupplyDifferenceListExportUrl = () =>
    `api/controlTower/exportSupplyDifferenceList`;
  export const getControlTowerQuantityClaimsList = () =>
    `api/controlTower/getQuantityControlList`;
  export const getControlTowerQuantityClaimsListExportUrl = () =>
    `api/controlTower/exportQuantityControlList`;
  export const getControlTowerQualityClaimsListUrl = () =>
    `/api/controlTower/getQualityControlList`;
  export const getControlTowerQualityClaimsListExportUrl = () =>
    `/api/controlTower/exportQualityControlList`;
  export const getQuantityResiduePopUpUrl = () =>
    `/api/controlTower/QuantityResiduePopUp`;
  export const saveQuantityResiduePopUpUrl = () =>
    `/api/controlTower/QuantityResiduePopUp`;
  export const getControlTowerResidueSludgeDifferenceList = () =>
    `api/controlTower/sludgeDifferenceList`;
  export const getControlTowerResidueSludgeDifferenceListExportUrl = () =>
    `api/controlTower/exportSludgeDifferenceList`;
  export const getResiduePopUpUrl = () => `api/controlTower/ResiduePopUp`;
  export const saveResiduePopUpUrl = () => `api/controlTower/SaveResiduePopUp`;
}

@Injectable({
  providedIn: 'root'
})
export class ControlTowerApi implements IControlTowerApiService {
  @ApiCallUrl()
  private _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_ROB;

  @ApiCallUrl()
  private _claimsApiUrl = this.appConfig.v1.API.BASE_URL_DATA_CLAIMS;

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
        this._apiUrl
      }/${ControlTowerApiPaths.getControlTowerQuantitySupplyDifferenceList()}`,
      { payload: request }
    );
  }

  getControlTowerQuantitySupplyDifferenceListExportUrl(): string {
    return `${
      this._apiUrl
    }/${ControlTowerApiPaths.getControlTowerQuantitySupplyDifferenceListExportUrl()}`;
  }

  @ObservableException()
  getControlTowerQuantityClaimsList(
    request: IGetControlTowerListRequest
  ): Observable<IGetControlTowerQuantityClaimsListResponse> {
    return this.http.post<IGetControlTowerQuantityClaimsListResponse>(
      `${
        this._claimsApiUrl
      }/${ControlTowerApiPaths.getControlTowerQuantityClaimsList()}`,
      { payload: request }
    );
  }
  getControlTowerQuantityClaimsListExportUrl(): string {
    return `${
      this._claimsApiUrl
    }/${ControlTowerApiPaths.getControlTowerQuantityClaimsListExportUrl()}`;
  }

  @ObservableException()
  getQuantityResiduePopUp(request): any {
    return this.http.post(
      `${this._apiUrl}/api/controlTower/QuantityResiduePopUp`,
      { payload: request }
    );
  }

  @ObservableException()
  saveQuantityResiduePopUp(request): any {
    return this.http.post(
      `${this._apiUrl}/api/controlTower/saveQuantityResiduePopUp`,
      { payload: request }
    );
  }
  //control tower quality claims api service
  @ObservableException()
  getControlTowerQualityClaimsList(
    request: IGetControlTowerListRequest
  ): Observable<IGetControlTowerQualityClaimsListResponse> {
    return this.http.post<IGetControlTowerQualityClaimsListResponse>(
      `${
        this._claimsApiUrl
      }/${ControlTowerApiPaths.getControlTowerQualityClaimsListUrl()}`,
      { payload: request }
    );
  }
  getControlTowerQualityClaimsListExportUrl(): string {
    return `${
      this._claimsApiUrl
    }/${ControlTowerApiPaths.getControlTowerQualityClaimsListExportUrl()}`;
  }

  @ObservableException()
  getControlTowerResidueSludgeDifferenceList(
    request: IGetControlTowerListRequest
  ): Observable<IGetControlTowerResidueSludgeDifferenceListResponse> {
    return this.http.post<IGetControlTowerResidueSludgeDifferenceListResponse>(
      `${
        this._apiUrl
      }/${ControlTowerApiPaths.getControlTowerResidueSludgeDifferenceList()}`,
      { payload: request }
    );
  }

  getControlTowerResidueSludgeDifferenceListExportUrl(): string {
    return `${
      this._apiUrl
    }/${ControlTowerApiPaths.getControlTowerResidueSludgeDifferenceListExportUrl()}`;
  }

  @ObservableException()
  getResiduePopUp(request): any {
    return this.http.post(
      `${this._apiUrl}/${ControlTowerApiPaths.getResiduePopUpUrl()}`,
      { payload: request }
    );
  }

  @ObservableException()
  saveResiduePopUp(request): any {
    return this.http.post(
      `${this._apiUrl}/${ControlTowerApiPaths.saveResiduePopUpUrl()}`,
      { payload: request }
    );
  }
}

export const CONTROL_TOWER_API_SERVICE = new InjectionToken<
  IControlTowerApiService
>('CONTROL_TOWER_API_SERVICE');
