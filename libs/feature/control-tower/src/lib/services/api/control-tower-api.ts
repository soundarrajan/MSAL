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
  IGetControlTowerResidueSludgeDifferenceListResponse,
  IGetControlTowerQualityLabsListResponse,
  IControlTowerSaveNotesItemDto,
  IControlTowerGetMyNotesDto,
  IControlTowerGetFilteredNotesDto
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
  export const getControlTowerQualityLabsListUrl = () =>
    `/api/controlTower/getQualityLabControlList`;
  export const getControlTowerQualityLabsListExportUrl = () =>
    `/api/controlTower/exportQualityLabControlList`;
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
  export const getQualityLabsPopUpUrl = () => `api/controlTower/getControlTowerQualityLabPopUpData`;
  export const saveQualityLabsPopUpUrl = () => `api/controlTower/saveControlTowerQualityLabPopUpData`;
  export const getMyNotesUrl = () => `api/controlTower/getMyNotes`;
  export const getFilteredNotesUrl = () => `api/controlTower/getFilteredNotes`;
  export const getNoteByIdUrl = () => `api/controlTower/getNoteById`;
  export const saveControlTowerNoteUrl = () =>
    `api/controlTower/saveControlTowerNote`;
}

@Injectable({
  providedIn: 'root'
})
export class ControlTowerApi implements IControlTowerApiService {
  @ApiCallUrl()
  private _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_ROB;

  @ApiCallUrl()
  private _claimsApiUrl = this.appConfig.v1.API.BASE_URL_DATA_CLAIMS;
  
  @ApiCallUrl()
  private _labsApiUrl = this.appConfig.v1.API.BASE_URL_DATA_LABS;

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

  //control tower quality labs api service
  @ObservableException()
  getControlTowerQualityLabsList(
    request: IGetControlTowerListRequest
  ): Observable<IGetControlTowerQualityLabsListResponse> {
    return this.http.post<IGetControlTowerQualityLabsListResponse>(
      `${
        this._labsApiUrl
      }/${ControlTowerApiPaths.getControlTowerQualityLabsListUrl()}`,
      { payload: request }
    );
  }
  getControlTowerQualityLabsListExportUrl(): string {
    return `${
      this._labsApiUrl
    }/${ControlTowerApiPaths.getControlTowerQualityLabsListExportUrl()}`;
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

  @ObservableException()
  getQualityLabsPopUp(request): any {
    return this.http.post(
      `${this._labsApiUrl}/${ControlTowerApiPaths.getQualityLabsPopUpUrl()}`,
      { payload: request }
    );
  }

  @ObservableException()
  getMyNotes(request: IControlTowerGetMyNotesDto): any {
    return this.http.post(
      `${this._apiUrl}/${ControlTowerApiPaths.getMyNotesUrl()}`,
      { payload: request }
    );
  }
  @ObservableException()
  getFilteredNotes(request: IControlTowerGetFilteredNotesDto): any {
    return this.http.post(
      `${this._apiUrl}/${ControlTowerApiPaths.getFilteredNotesUrl()}`,
      { payload: request }
    );
  }

  @ObservableException()
  getNoteById(request: any): any {
    return this.http.post(
      `${this._apiUrl}/${ControlTowerApiPaths.getNoteByIdUrl()}`,
      { payload: request }
    );
  }

  @ObservableException()
  saveQualityLabsPopUp(request): any {
    return this.http.post(
      `${this._labsApiUrl}/${ControlTowerApiPaths.saveQualityLabsPopUpUrl()}`,
      { payload: request }
      );
    }

  @ObservableException()
  saveControlTowerNote(request: IControlTowerSaveNotesItemDto): any {
    return this.http.post(
      `${this._apiUrl}/${ControlTowerApiPaths.saveControlTowerNoteUrl()}`,
      { payload: request }
    );
  }
}

export const CONTROL_TOWER_API_SERVICE = new InjectionToken<
  IControlTowerApiService
>('CONTROL_TOWER_API_SERVICE');
