import { Injectable, InjectionToken } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '@shiptech/core/config/app-config';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';

import { catchError, map } from 'rxjs/operators';
import { ISpotNegotiationApiService } from './spot-negotiation.api.service.interface';

export const SpotNegotiationApiPaths = {
  tenantConfiguration: `api/admin/tenantConfiguration/get`,
  staticLists: `api/infrastructure/static/lists`,
  counterpartyLists: `api/masters/counterparties/list`,
  addCounterparties: `groups/addSellers`,
  saveTargetPrice: `Groups/saveTargetPrice`,
  updatePhySupplier:`RFQ/updatePhysicalSupplier`,
  sendRFQ:`RFQ/createRFQ`,
  amendRFQ:`RFQ/amendRfq`
};

@Injectable({
  providedIn: 'root'
})
export class SpotNegotiationApi implements ISpotNegotiationApiService {
  @ApiCallUrl()
  private _apiUrl = this.appConfig.v1.API.BASE_URL_DATA_CONTRACTS;

  @ApiCallUrl()
  private _procurementApiUrl = this.appConfig.v1.API.BASE_URL_DATA_PROCUREMENT;

  @ApiCallUrl()
  private _adminApiUrl = this.appConfig.v1.API.BASE_URL_DATA_ADMIN;

  @ApiCallUrl()
  private _infrastructureApiUrl = this.appConfig.v1.API
    .BASE_URL_DATA_INFRASTRUCTURE;

  @ApiCallUrl()
  private _negotiationApiUrl = this.appConfig.v1.API.BASE_URL_DATA_NEGOTIATION;

  @ApiCallUrl()
  private _masterApiUrl = this.appConfig.v1.API.BASE_URL_DATA_MASTERS;

  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  @ObservableException()
  getTenantConfiguration(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._adminApiUrl}/${SpotNegotiationApiPaths.tenantConfiguration}`,
        { Payload: request }
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage ? body.error.ErrorMessage : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  getStaticLists(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._infrastructureApiUrl}/${SpotNegotiationApiPaths.staticLists}`,
        { Payload: request }
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage ? body.error.ErrorMessage : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  getCounterpartyList(payload: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._masterApiUrl}/${SpotNegotiationApiPaths.counterpartyLists}`,
        { Payload: payload }
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage ? body.error.ErrorMessage : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  AddCounterparties(payload: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.addCounterparties}`,
        payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage ? body.error.ErrorMessage : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  getGroupOfSellers(request: any): Observable<any> {
    return this.http
      .get<any>(`${this._negotiationApiUrl}/groups/${request}/sellers`, {
        // headers: { Origin: 'https://bvt.shiptech.com' }
      })
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage ? body.error.ErrorMessage : body.error.errorMessage
          )
        )
      );
  }
  @ObservableException()
  SendRFQ(payload: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.sendRFQ}`,
        payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage ? body.error.ErrorMessage : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  updatePrices(payload: any): Observable<any> {
    return this.http
      .put<any>(`${this._negotiationApiUrl}/Price/updatePrices`, payload)
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage ? body.error.ErrorMessage : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  getRequestGroup(request: any): Observable<any> {
    return this.http
      .get<any>(`${this._negotiationApiUrl}/groups/${request}`, {
      })
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage ? body.error.ErrorMessage : body.error.errorMessage
          )
        )
      );
  }
  @ObservableException()
  getPriceDetails(groupId: any): Observable<any> {
    return this.http
      .get<any>(`${this._negotiationApiUrl}/Price/${groupId}/getPriceDetails`, {
      })
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage ? body.error.ErrorMessage : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  SaveTragetPrice(payload: any): Observable<any> {
    return this.http
      .put<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.saveTargetPrice}`,
        payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage ? body.error.ErrorMessage : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  UpdatePhySupplier(payload: any): Observable<any> {
    return this.http
      .put<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.updatePhySupplier}`,
        payload        
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage ? body.error.ErrorMessage : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  AmendRFQ(payload: any): Observable<any> {    
    debugger;
    return this.http
      .put<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.amendRFQ}`,
        payload
      )
      .pipe(
        map((body: any) => body),        
        catchError((body: any) =>
          of(
            body.error.ErrorMessage ? body.error.ErrorMessage : body.error.errorMessage
          )
        )
      );
  }
}

export const SPOT_NEGOTIATION_API_SERVICE = new InjectionToken<
  ISpotNegotiationApiService
>('SPOT_NEGOTIATION_API_SERVICE');
