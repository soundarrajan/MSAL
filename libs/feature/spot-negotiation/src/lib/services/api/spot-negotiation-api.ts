import { Injectable, InjectionToken } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { AppConfig } from '@shiptech/core/config/app-config';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';

import { catchError, map } from 'rxjs/operators';
import { ISpotNegotiationApiService } from './spot-negotiation.api.service.interface';
import {
  IDocumentsCreateUploadRequest,
  IDocumentsCreateUploadResponse
} from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-create-upload.dto';
import {
  IDocumentsDeleteRequest,
  IDocumentsDeleteResponse
} from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-delete.dto';
import { IDocumentsDownloadRequest } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-download.dto';
import {
  IDocumentsUpdateIsVerifiedRequest,
  IDocumentsUpdateIsVerifiedResponse
} from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-update-isVerified.dto';
import { IDocumentsListResponse } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents.dto';
import {
  IDocumentsUpdateNotesRequest,
  IDocumentsUpdateNotesResponse
} from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-update-notes.dto';

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
  getBestContract: `api/procurement/request/bestContract`,
  delinkRequest: `Groups/deleteRequest`,
  getExchangeRate: `price/getExchangeRate`,
  applyExchangeRate: `price/applyExchangeRate`,
  getLocationCosts: `price/locationCosts`,
  saveOfferAdditionalCosts: `price/saveOfferAdditionalCosts`,
  getMasterAdditionalCostsList: `api/masters/additionalcosts/listApps`,
  getUomConversionFactor: `api/masters/uoms/convertQuantity`,
  getRangeTotalAdditionalCosts: `api/procurement/order/getRangeTotalAdditionalCosts`,
  getDocumentTypeList: `/api/masters/documenttype/list`,
  uploadDocument: `api/masters/documentupload/create`,
  getDocuments: `api/masters/documentupload/list`,
  deleteDocument: `api/masters/documentupload/delete`,
  downloadDocument: `api/masters/documentupload/download`,
  updateIsVerifiedDocument: `api/masters/documentupload/update`,
  updateNotes: `api/masters/documentupload/notes`,
  updateNegotiationComments: `groups/updateComments`,
  switchReqOffBasedOnQuote: `RFQ/switchReqOffBasedOnQuote`,
  copyComments: `groups/copyComments`,
  updateSellerComment: `RFQ/UpdateSellerComments`,
  getOfferPriceHistory: `Price/getOfferPriceHistory`,
  updateProductPrice: `RFQ/FreezeMarketPrices`,
  isAuthorizedForReportsTab: `api/procurement/rfq/isAuthorizedForReportsTab`
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
        catchError((body: any) => this.handleErrorMessage(body))
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
        catchError((body: any) => this.handleErrorMessage(body))
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
        catchError((body: any) => this.handleErrorMessage(body))
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
        catchError((body: any) => this.handleErrorMessage(body))
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
        catchError((body: any) => this.handleErrorMessage(body))
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
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  getBestContract(request: any): Observable<any> {
    let payload = {
      Order: null,
      PageFilters: {
        Filters: []
      },
      SortList: {
        SortList: []
      },
      Filters: [
        {
          ColumnName: 'RequestId',
          Value: request
        },
        {
          ColumnName: 'IsCallFromNego',
          Value: true
        }
      ],
      SearchText: null,
      Pagination: {
        Skip: 0,
        Take: 99999
      }
    };
    return this.http
      .post<any>(
        `${this._procurementApiUrl}/${SpotNegotiationApiPaths.getBestContract}`,
        { Payload: payload }
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }
  @ObservableException()
  getExchangeRate(payload: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.getExchangeRate}`,
        payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  applyExchangeRate(payload: any): Observable<any> {
    return this.http
      .put<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.applyExchangeRate}`,
        payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  delinkRequest(payload: any): Observable<any> {
    const options = {
      headers: new HttpHeaders(),
      body: { ...payload }
    };
    return this.http
      .delete<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.delinkRequest}`,
        options
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
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
        catchError((body: any) => this.handleErrorMessage(body))
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
        catchError((body: any) => this.handleErrorMessage(body))
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
        catchError((body: any) => this.handleErrorMessage(body))
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
        catchError((body: any) => this.handleErrorMessage(body))
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
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }
  @ObservableException()
  updatePrices(payload: any): Observable<any> {
    return this.http
      .put<any>(`${this._negotiationApiUrl}/Price/updatePrices`, payload)
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  copyPriceDetails(payload: any): Observable<any> {
    return this.http
      .put<any>(`${this._negotiationApiUrl}/Price/copyPriceDetails`, payload)
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  getRequestGroup(request: any): Observable<any> {
    return this.http
      .get<any>(`${this._negotiationApiUrl}/groups/${request}`, {})
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
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
        catchError((body: any) => this.handleErrorMessage(body))
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
        catchError((body: any) => this.handleErrorMessage(body))
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
        catchError((body: any) => this.handleErrorMessage(body))
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
        catchError((body: any) => this.handleErrorMessage(body))
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
        catchError((body: any) => this.handleErrorMessage(body))
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
        catchError((body: any) => this.handleErrorMessage(body))
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
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  GetExistingOrders(request: any): Observable<any> {
    const requestUrl = `${this._procurementApiUrl}/${SpotNegotiationApiPaths.getExistingOrders}`;
    return this.http
      .post<any>(requestUrl, { payload: request })
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
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
        catchError((body: any) => this.handleErrorMessage(body))
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
        catchError((body: any) => this.handleErrorMessage(body))
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
        catchError((body: any) => this.handleErrorMessage(body))
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
        catchError((body: any) => this.handleErrorMessage(body))
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
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  ConfirmRfq(request: any): Observable<any> {
    const requestUrl = `${this._procurementApiUrl}/${SpotNegotiationApiPaths.confirmRfq}`;
    return this.http
      .post<any>(requestUrl, { payload: request })
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
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
        catchError((body: any) => this.handleErrorMessage(body))
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
        catchError((body: any) => this.handleErrorMessage(body))
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
        catchError((body: any) => this.handleErrorMessage(body))
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
        catchError((body: any) => this.handleErrorMessage(body))
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
        `${this._procurementApiUrl}/${SpotNegotiationApiPaths.getRangeTotalAdditionalCosts}`,
        request
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

  @ObservableException()
  getPriceDetailsById(
    groupId: any,
    requestLocationSellerId: any
  ): Observable<any> {
    return this.http
      .get<any>(
        `${this._negotiationApiUrl}/Price/${groupId}/${requestLocationSellerId}/getSellerPrices`,
        {}
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  getDocumentTypeList(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._masterApiUrl}/${SpotNegotiationApiPaths.getDocumentTypeList}`,
        { Payload: request }
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

  @ObservableException()
  uploadFile(
    request: IDocumentsCreateUploadRequest
  ): Observable<IDocumentsCreateUploadResponse> {
    return this.http
      .post<IDocumentsCreateUploadResponse>(
        `${this._masterApiUrl}/${SpotNegotiationApiPaths.uploadDocument}`,
        request
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) =>
          of(
            body.error.ErrorMessage && body.error.Reference
              ? body.error.ErrorMessage + ' ' + body.error.Reference
              : body.error.errorMessage + ' ' + body.error.reference
          )
        )
      );
  }

  @ObservableException()
  deleteDocument(
    request: IDocumentsDeleteRequest
  ): Observable<IDocumentsDeleteResponse> {
    return this.http.post<IDocumentsDeleteResponse>(
      `${this._masterApiUrl}/${SpotNegotiationApiPaths.deleteDocument}`,
      { payload: { ...request } }
    );
  }

  @ObservableException()
  updateIsVerifiedDocument(
    request: IDocumentsUpdateIsVerifiedRequest
  ): Observable<any> {
    return this.http.post<any>(
      `${this._masterApiUrl}/${SpotNegotiationApiPaths.updateIsVerifiedDocument}`,
      { payload: { ...request } }
    );
  }

  @ObservableException()
  updateNotes(
    request: IDocumentsUpdateNotesRequest
  ): Observable<IDocumentsUpdateNotesResponse> {
    return this.http.post<IDocumentsUpdateNotesResponse>(
      `${this._masterApiUrl}/${SpotNegotiationApiPaths.updateNotes}`,
      { payload: { ...request } }
    );
  }

  @ObservableException()
  downloadDocument(request: IDocumentsDownloadRequest): Observable<Blob> {
    return this.http.post(
      `${this._masterApiUrl}/${SpotNegotiationApiPaths.downloadDocument}`,
      request,
      {
        responseType: 'blob'
      }
    );
  }

  @ObservableException()
  getDocuments(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._masterApiUrl}/${SpotNegotiationApiPaths.getDocuments}`,
        { Payload: request }
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

  @ObservableException()
  updateNegotiationComments(request: any): Observable<any> {
    return this.http
      .put<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.updateNegotiationComments}`,
        request
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  switchReqOffBasedOnQuote(payload: any): Observable<any> {
    return this.http
      .put<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.switchReqOffBasedOnQuote}`,
        payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  UpdateSellerComments(payload: any): Observable<any> {
    return this.http
      .put<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.updateSellerComment}`,
        payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  copyNegotiationComments(request: any): Observable<any> {
    return this.http
      .put<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.copyComments}`,
        request
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  handleErrorMessage(body: any) {
    return of(
      body instanceof HttpErrorResponse && body.status != 401
        ? body.error.ErrorMessage
          ? body.error.ErrorMessage
          : body.error.errorMessage
        : { message: 'Unauthorized' }
    );
  }

  @ObservableException()
  getOfferPriceHistory(payload: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.getOfferPriceHistory}`,
        payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  UpdateProductPrices(payload: any): Observable<any> {
    return this.http
      .put<any>(
        `${this._negotiationApiUrl}/${SpotNegotiationApiPaths.updateProductPrice}`,
        payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  CheckWhetherUserIsAuthorizedForReportsTab(): Observable<any> {
    return this.http
      .post<any>(
        `${this._procurementApiUrl}/${SpotNegotiationApiPaths.isAuthorizedForReportsTab}`, 
        { Payload: null }
      )
      .pipe(
        map((body: any) => body.payload),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }
  @ObservableException()
  updateGroupComments(request: any): Observable<any> {
    return this.http
      .put<any>(`${this._negotiationApiUrl}/groups/${request}/updateGroupComments`, {})
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }
}

export const SPOT_NEGOTIATION_API_SERVICE = new InjectionToken<
  ISpotNegotiationApiService
>('SPOT_NEGOTIATION_API_SERVICE');
