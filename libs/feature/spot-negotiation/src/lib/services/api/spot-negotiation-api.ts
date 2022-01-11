import { Injectable, InjectionToken } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '@shiptech/core/config/app-config';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';

import { catchError, map } from 'rxjs/operators';
import { ISpotNegotiationApiService } from './spot-negotiation.api.service.interface';

export const SpotNegotiationApiPaths = {
  // tenantConfiguration: `api/admin/tenantConfiguration/get`,
  tenantConfiguration: `Groups/getTenantConfiguration`,
  staticLists: `api/infrastructure/static/lists`,
  counterpartyLists: `api/masters/counterparties/listbyTypes`,
  addCounterparties: `groups/addSellers`,
  addRequesttoGroup: `groups/linkRequest`,
  saveTargetPrice: `Groups/saveTargetPrice`,
  updatePhySupplier: `RFQ/updatePhysicalSupplier`,
  sendRFQ: `RFQ/createRFQ`,
  amendRFQ: `RFQ/amendRfq`,
  requoteRFQ: `RFQ/requoteRfq`,
  skipRFQ: `RFQ/skipRFQ`,
  revokeRFQ: `RFQ/revokeRFQ`,
  saveAndSendRFQ: `RFQ/saveAndSendRFQ`,
  UpdateSelectSeller: `Groups/toggleReqSellerSelection`,
  previewRfqMail: `RFQ/previewRfqMail`,
  revertSavedComments: `RFQ/discardSavedComments`,
  getExistingOrders: `api/procurement/order/getExistingOrders`,
  confirmRfq: `api/procurement/rfq/confirm`,
  removeCounterparty: `Groups/removeSeller`,
  otherDetails: `RFQ/otherDetails/requestChange`,
  getSellerContacts: `counterparty/viewContacts`,
  addNewSellerContact: `counterparty/addContact`,
  getEmailLogs: `api/masters/emaillogs/list`,
  getAdditionalCosts: `price/getOfferAdditionalCosts`,
  getEmailLogsPreview: `api/masters/emaillogs/get`,
  getRequestList: `api/procurement/rfq/selectRequest`,
  getLocationCosts: `price/locationCosts`,
  saveOfferAdditionalCosts: `price/saveOfferAdditionalCosts`,
  getMasterAdditionalCostsList: `api/masters/additionalcosts/listApps`,
  getUomConversionFactor: `api/masters/uoms/convertQuantity`,
  getRangeTotalAdditionalCosts: `api/procurement/order/getRangeTotalAdditionalCosts`
};

@Injectable({
  providedIn: 'root'
})
export class SpotNegotiationApi implements ISpotNegotiationApiService {
  @ApiCallUrl()
  private _procurementApiUrl = this.appConfig.v1.API.BASE_URL_DATA_PROCUREMENT;

  @ApiCallUrl()
  private _infrastructureApiUrl = this.appConfig.v1.API
    .BASE_URL_DATA_INFRASTRUCTURE;

  @ApiCallUrl()
  private _negotiationApiUrl = this.appConfig.v1.API.BASE_URL_DATA_NEGOTIATION;

  @ApiCallUrl()
  private _masterApiUrl = this.appConfig.v1.API.BASE_URL_DATA_MASTERS;

  constructor(private http: HttpClient, private appConfig: AppConfig) {}

  @ObservableException()
  getTenantConfiguration(): Observable<any> {
    return this.http
      .get<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.tenantConfiguration}`
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  getEmailLogsList(payload: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._masterApiUrl}/${SpotNegotiationApiPaths.getEmailLogs}`,
        { Payload: payload }
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  getEmailLogsPreview(payload: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._masterApiUrl}/${SpotNegotiationApiPaths.getEmailLogsPreview}`,
        { Payload: payload }
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
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
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  addRequesttoGroup(payload: any): Observable<any> {
    return this.http
      .put<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.addRequesttoGroup}`,
        payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  getRequestList(payload: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._procurementApiUrl}/${SpotNegotiationApiPaths.getRequestList}`,
        { Payload: payload }
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
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
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
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
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
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
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
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
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  UpdateSelectSeller(payload: any): Observable<any> {
    return this.http
      .put<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.UpdateSelectSeller}`,
        payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
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
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  getRequestGroup(request: any): Observable<any> {
    return this.http
      .get<any>(`${this._negotiationApiUrl}/groups/${request}`, {})
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  getPriceDetails(groupId: any): Observable<any> {
    return this.http
      .get<any>(
        `${this._negotiationApiUrl}/Price/${groupId}/getPriceDetails`,
        {}
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  getMarketPriceHistory(payload: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._negotiationApiUrl}/Price/getMarketPriceHistory`,
        payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  SaveTargetPrice(payload: any): Observable<any> {
    return this.http
      .put<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.saveTargetPrice}`,
        payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
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
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  AmendRFQ(payload: any): Observable<any> {
    return this.http
      .put<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.amendRFQ}`,
        payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  PreviewRfqMail(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.previewRfqMail}`,
        request
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  RevertSavedComments(request: any): Observable<any> {
    return this.http
      .put<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.revertSavedComments}`,
        request
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  GetExistingOrders(request: any): Observable<any> {
    const requestUrl = `${this._procurementApiUrl}/${SpotNegotiationApiPaths.getExistingOrders}`;
    return this.http
      .post<any>(requestUrl, { payload: request })
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  SkipRFQ(payload: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.skipRFQ}`,
        payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  SaveAndSendRFQ(payload: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.saveAndSendRFQ}`,
        payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  RemoveCounterparty(request: any): Observable<any> {
    return this.http
      .delete<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.removeCounterparty}/${request}`
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  RequoteRFQ(payload: any): Observable<any> {
    return this.http
      .put<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.requoteRFQ}`,
        payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  RevokeRFQ(payload: any): Observable<any> {
    return this.http
      .put<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.revokeRFQ}`,
        payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  ConfirmRfq(request: any): Observable<any> {
    const requestUrl = `${this._procurementApiUrl}/${SpotNegotiationApiPaths.confirmRfq}`;
    return this.http
      .post<any>(requestUrl, { payload: request })
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  OtherDetails(payload: any): Observable<any> {
    return this.http
      .put<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.otherDetails}`,
        payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  getSellerContacts(sellerId: number, locationId: number): Observable<any> {
    return this.http
      .get<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.getSellerContacts}/${locationId}/${sellerId}`
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  addNewSellerContact(contact: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.addNewSellerContact}`,
        contact
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
          )
        )
      );
  }

  @ObservableException()
  getAdditionalCosts(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.getAdditionalCosts}`,
        request
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage
              ? body.error.ErrorMessage
              : body.error.errorMessage
          )
        )
      );
  }

  /**
   * Get additional costs defined in location master
   * @param {*} request
   * @return {*}  {Observable<any>}
   * @memberof SpotNegotiationApi
   */
  @ObservableException()
  getLocationCosts(locationId: number): Observable<any> {
    return this.http
      .get<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.getLocationCosts}/${locationId}`
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  /**
   * save location based or offer additional into requestadditionalcosts
   * @param {*} payload
   * @return {*}  {Observable<any>}
   * @memberof SpotNegotiationApi
   */
  @ObservableException()
  saveOfferAdditionalCosts(payload: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.saveOfferAdditionalCosts}`,
        payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  getMasterAdditionalCosts(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._masterApiUrl}/${SpotNegotiationApiPaths.getMasterAdditionalCostsList}`,
        { Payload: request }
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  getRangeTotalAdditionalCosts(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._procurementApiUrl}/${SpotNegotiationApiPaths.getRangeTotalAdditionalCosts}`, request
      )
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  getUomConversionFactor(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._masterApiUrl}/${SpotNegotiationApiPaths.getUomConversionFactor}`,
        request
      )
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : body.error.errorMessage + ' ' + body.error.reference
          )
        )
      );
  }

  handleErrorMessage(body: any) {
    return of(
      body.error.ErrorMessage
        ? body.error.ErrorMessage
        : body.error.errorMessage
    );
  }
}

export const SPOT_NEGOTIATION_API_SERVICE = new InjectionToken<
  ISpotNegotiationApiService
>('SPOT_NEGOTIATION_API_SERVICE');
