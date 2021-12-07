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
  IControlTowerGetFilteredNotesDto,
  IGetControlTowerResidueEGCSDifferenceListResponse
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
  export const getControlTowerResidueEGCSDifferenceList = () =>
    `api/controlTower/egcsDifferenceList`;
  export const getControlTowerResidueEGCSDifferenceListExportUrl = () =>
    `api/controlTower/exportEgcsDifferenceList`;
  export const getResiduePopUpUrl = () => `api/controlTower/ResiduePopUp`;
  export const saveResiduePopUpUrl = () => `api/controlTower/SaveResiduePopUp`;
  export const getQualityLabsPopUpUrl = () =>
    `api/controlTower/getControlTowerQualityLabPopUpData`;
  export const saveQualityLabsPopUpUrl = () =>
    `api/controlTower/saveControlTowerQualityLabPopUpData`;
  export const saveControlTowerQuantityNoteUrl = () =>
    `api/controlTower/saveControlTowerQuantityNote`;
  export const saveControlTowerQualityNoteUrl = () =>
    `api/controlTower/saveControlTowerQualityNote`;
  export const saveControlTowerResidueNoteUrl = () =>
    `api/controlTower/saveControlTowerResidueNote`;
  export const getQuantityNotesUrl = () => `api/controlTower/getQuantityNotes`;
  export const getQualityNotesUrl = () => `api/controlTower/getQualityNotes`;
  export const getResidueNotesUrl = () => `api/controlTower/getResidueNotes`;
  export const getFilteredQuantityNotesUrl = () =>
    `api/controlTower/getFilteredQuantityNotes`;
  export const getFilteredQualityNotesUrl = () =>
    `api/controlTower/getFilteredQualityNotes`;
  export const getFilteredResidueNotesUrl = () =>
    `api/controlTower/getFilteredResidueNotes`;
  export const getRobDifferenceFiltersCount = () =>
    `api/controlTower/robDifferenceCounts`;
  export const getSupplyDifferenceFiltersCount = () =>
    `api/controlTower/supplyDifferenceCounts`;
  export const getSludgeDifferenceFiltersCount = () =>
    `api/controlTower/sludgeDifferenceCounts`;
  export const getEGCSDifferenceFiltersCount = () =>
    `api/controlTower/egcsDifferenceCounts`;
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
  getControlTowerResidueEGCSDifferenceList(
    request: IGetControlTowerListRequest
  ): Observable<IGetControlTowerResidueEGCSDifferenceListResponse> {
    return this.http.post<IGetControlTowerResidueEGCSDifferenceListResponse>(
      `${
        this._apiUrl
      }/${ControlTowerApiPaths.getControlTowerResidueEGCSDifferenceList()}`,
      { payload: request }
    );
  }

  getControlTowerResidueEGCSDifferenceListExportUrl(): string {
    return `${
      this._apiUrl
    }/${ControlTowerApiPaths.getControlTowerResidueEGCSDifferenceListExportUrl()}`;
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
  getNotes(request: IControlTowerGetMyNotesDto, view: any): any {
    if (view.displayName === 'QuantityView') {
      return this.http.post(
        `${this._apiUrl}/${ControlTowerApiPaths.getQuantityNotesUrl()}`,
        { payload: request }
      );
    } else if (view.displayName === 'QualityView') {
      return this.http.post(
        `${this._apiUrl}/${ControlTowerApiPaths.getQualityNotesUrl()}`,
        { payload: request }
      );
    } else if (view.displayName === 'ResidueView') {
      return this.http.post(
        `${this._apiUrl}/${ControlTowerApiPaths.getResidueNotesUrl()}`,
        { payload: request }
      );
    }
  }

  @ObservableException()
  saveControlTowerNote(request: IControlTowerSaveNotesItemDto, view: any): any {
    if (view.displayName === 'QuantityView') {
      return this.http.post(
        `${
          this._apiUrl
        }/${ControlTowerApiPaths.saveControlTowerQuantityNoteUrl()}`,
        { payload: request }
      );
    } else if (view.displayName === 'QualityView') {
      return this.http.post(
        `${
          this._apiUrl
        }/${ControlTowerApiPaths.saveControlTowerQualityNoteUrl()}`,
        { payload: request }
      );
    } else if (view.displayName === 'ResidueView') {
      return this.http.post(
        `${
          this._apiUrl
        }/${ControlTowerApiPaths.saveControlTowerResidueNoteUrl()}`,
        { payload: request }
      );
    }
  }

  @ObservableException()
  getFilteredNotes(request: IControlTowerGetFilteredNotesDto, view: any): any {
    if (view.displayName === 'QuantityView') {
      return this.http.post(
        `${this._apiUrl}/${ControlTowerApiPaths.getFilteredQuantityNotesUrl()}`,
        { payload: request }
      );
    } else if (view.displayName === 'QualityView') {
      return this.http.post(
        `${this._apiUrl}/${ControlTowerApiPaths.getFilteredQualityNotesUrl()}`,
        { payload: request }
      );
    } else if (view.displayName === 'ResidueView') {
      return this.http.post(
        `${this._apiUrl}/${ControlTowerApiPaths.getFilteredResidueNotesUrl()}`,
        { payload: request }
      );
    }
  }

  @ObservableException()
  saveQualityLabsPopUp(request): any {
    return this.http.post(
      `${this._labsApiUrl}/${ControlTowerApiPaths.saveQualityLabsPopUpUrl()}`,
      { payload: request }
    );
  }

  @ObservableException()
  getRobDifferenceFiltersCount(request): any {
    return this.http.post(
      `${this._apiUrl}/api/controlTower/robDifferenceCounts`,
      { payload: request }
    );
  }

  @ObservableException()
  getSupplyDifferenceFiltersCount(request): any {
    return this.http.post(
      `${this._apiUrl}/api/controlTower/supplyDifferenceCounts`,
      { payload: request }
    );
  }

  @ObservableException()
  getSludgeDifferenceFiltersCount(request): any {
    return this.http.post(
      `${this._apiUrl}/api/controlTower/sludgeDifferenceCounts`,
      { payload: request }
    );
  }

  @ObservableException()
  getEGCSDifferenceFiltersCount(request): any {
    return this.http.post(
      `${this._apiUrl}/${ControlTowerApiPaths.getEGCSDifferenceFiltersCount()}`,
      { payload: request }
    );
  }

  @ObservableException()
  getQuantityClaimCounts(request): any {
    return this.http.post(
      `${this._claimsApiUrl}/api/controlTower/getQuantityClaimCounts`,
      { payload: request }
    );
  }

  @ObservableException()
  getQualityClaimCounts(request): any {
    return this.http.post(
      `${this._claimsApiUrl}/api/controlTower/getQualityClaimCounts`,
      { payload: request }
    );
  }

  @ObservableException()
  getqualityLabCounts(request): any {
    return this.http.post(
      `${this._labsApiUrl}/api/controlTower/qualityLabCounts`,
      { payload: request }
    );
  }

  @ObservableException()
  getQualityViewCounts(request): any {
    return this.http.post(
      `${this._apiUrl}/api/controlTower/getQualityViewCounts`,
      {}
    );
  }

  @ObservableException()
  getQuantityViewCounts(request): any {
    return this.http.post(
      `${this._apiUrl}/api/controlTower/getQuantityViewCounts`,
      {}
    );
  }

  @ObservableException()
  getResidueViewCounts(request): any {
    return this.http.post(
      `${this._apiUrl}/api/controlTower/getResidueViewCounts`,
      {}
    );
  }
}

export const CONTROL_TOWER_API_SERVICE = new InjectionToken<
  IControlTowerApiService
>('CONTROL_TOWER_API_SERVICE');
