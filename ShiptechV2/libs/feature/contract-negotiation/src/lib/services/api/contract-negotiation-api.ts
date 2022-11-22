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
import { IContractNegotiationApiService } from './contract-negotiation.api.service.interface';
import { IContractRequestDetailDto } from '../../data-models/contract-request-detail.dto';
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
  IDocumentsUpdateIsVerifiedRequest
} from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-update-isVerified.dto';
import {
  IDocumentsUpdateNotesRequest,
  IDocumentsUpdateNotesResponse
} from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-update-notes.dto';

export const apiPaths = {
  tenantConfiguration: `Groups/getTenantConfiguration`,
  staticLists: `api/infrastructure/static/lists`,
  createContractRequest: `api/ContractRequest/create`,
  counterpartyLists: `api/masters/counterparties/listbyTypes`,
  counterpartyListsByName: `counterparty/getCounterpartyList`,
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
  isAuthorizedForReportsTab: `api/procurement/rfq/isAuthorizedForReportsTab`,
  getSellerRatingsforNegotiation: `api/sellerrating/sellerratingreview/getForNegotiation`,
  getContractFormulaList: `api/masters/formulas/listMasters`,
  getMasterFormula: `api/masters/formulas/get`,
  getDefaultConversionFactor: `api/masters/products/getProdDefaultConversionFactors`,
  getEnergy6MonthHistory: `groups/getEnergy6MonthHistorys`,
  updateQuoteDateGroup: `groups/updateQuoteGroup`
};

export const ContractNegotiationApiPaths = {
  requestList: `api/ContractRequest/list`,
  contractRequest: 'api/ContractRequest',
  preferenceCount: `api/ContractRequest/getCounts`,
  userSaveFilterPresets: 'api/user-settings/save/contract-requestlist-filter-presets',
  userFilterPresets: 'api/user-settings/contract-requestlist-filter-presets',
  savecolumnPreference: 'api/api/user-settings/save/contract-request-list-grid_ColumnPreference',
  columnPreference: 'api/user-settings/contract-request-list-grid_ColumnPreference'
}


@Injectable({
  providedIn: 'root'
})
export class ContractNegotiationApi implements IContractNegotiationApiService {

  @ApiCallUrl()
  private _infrastructureApiUrl = this.appConfig.v1.API
    .BASE_URL_DATA_INFRASTRUCTURE;

  @ApiCallUrl()
  private _negotiationApiUrl = this.appConfig.v1.API.BASE_URL_DATA_NEGOTIATION;

  @ApiCallUrl()
  private _masterApiUrl = this.appConfig.v1.API.BASE_URL_DATA_MASTERS;

  @ApiCallUrl()
  private _sellerApiUrl = this.appConfig.v1.API.BASE_URL_DATA_SELLERRATING;

  @ApiCallUrl()
  private _shitechApiUrl = this.appConfig.v1.API.BASE_URL;

  @ApiCallUrl()
  private _procurementApiUrl = this.appConfig.v1.API.BASE_URL_DATA_PROCUREMENT;

  constructor(private http: HttpClient, private appConfig: AppConfig) { }

  @ObservableException()
  getEmailLogsList(payload: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._masterApiUrl}/${apiPaths.getEmailLogs}`,
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
        `${this._masterApiUrl}/${apiPaths.getEmailLogsPreview}`,
        { Payload: payload }
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
        `${this._negotiationApiUrl}/${apiPaths.addRequesttoGroup}`,
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
        `${this._procurementApiUrl}/${apiPaths.getRequestList}`,
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
        `${this._procurementApiUrl}/${apiPaths.getBestContract}`,
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
        `${this._negotiationApiUrl}/${apiPaths.getExchangeRate}`,
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
        `${this._negotiationApiUrl}/${apiPaths.applyExchangeRate}`,
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
        `${this._negotiationApiUrl}/${apiPaths.delinkRequest}`,
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
        `${this._masterApiUrl}/${apiPaths.counterpartyLists}`,
        { Payload: payload }
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  getCounterpartyListByName(payload: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._negotiationApiUrl}/${apiPaths.counterpartyListsByName}`,
        payload
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
        `${this._negotiationApiUrl}/${apiPaths.addCounterparties}`,
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
        `${this._negotiationApiUrl}/${apiPaths.sendRFQ}`,
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
        `${this._negotiationApiUrl}/${apiPaths.UpdateSelectSeller}`,
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
  //updateEnegryPrices
  @ObservableException()
  updateEnegryPrices(payload: any): Observable<unknown> {
    return this.http
      .put<any>(`${this._negotiationApiUrl}/Price/updateEnegry`, payload)
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
        `${this._negotiationApiUrl}/${apiPaths.saveTargetPrice}`,
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
        `${this._negotiationApiUrl}/${apiPaths.updatePhySupplier}`,
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
        `${this._negotiationApiUrl}/${apiPaths.amendRFQ}`,
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
        `${this._negotiationApiUrl}/${apiPaths.previewRfqMail}`,
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
        `${this._negotiationApiUrl}/${apiPaths.revertSavedComments}`,
        request
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  GetExistingOrders(request: any): Observable<any> {
    const requestUrl = `${this._procurementApiUrl}/${apiPaths.getExistingOrders}`;
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
        `${this._negotiationApiUrl}/${apiPaths.skipRFQ}`,
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
        `${this._negotiationApiUrl}/${apiPaths.saveAndSendRFQ}`,
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
        `${this._negotiationApiUrl}/${apiPaths.removeCounterparty}/${request}`
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
        `${this._negotiationApiUrl}/${apiPaths.requoteRFQ}`,
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
        `${this._negotiationApiUrl}/${apiPaths.revokeRFQ}`,
        payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  ConfirmRfq(request: any): Observable<any> {
    const requestUrl = `${this._procurementApiUrl}/${apiPaths.confirmRfq}`;
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
        `${this._negotiationApiUrl}/${apiPaths.otherDetails}`,
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
        `${this._negotiationApiUrl}/${apiPaths.getSellerContacts}/${locationId}/${sellerId}`
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
        `${this._negotiationApiUrl}/${apiPaths.addNewSellerContact}`,
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
        `${this._negotiationApiUrl}/${apiPaths.getAdditionalCosts}`,
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
        `${this._negotiationApiUrl}/${apiPaths.getLocationCosts}/${locationId}`
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
        `${this._negotiationApiUrl}/${apiPaths.saveOfferAdditionalCosts}`,
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
        `${this._masterApiUrl}/${apiPaths.getMasterAdditionalCostsList}`,
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
        `${this._procurementApiUrl}/${apiPaths.getRangeTotalAdditionalCosts}`,
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
        `${this._masterApiUrl}/${apiPaths.getUomConversionFactor}`,
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
        `${this._masterApiUrl}/${apiPaths.getDocumentTypeList}`,
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
        `${this._masterApiUrl}/${apiPaths.uploadDocument}`,
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
      `${this._masterApiUrl}/${apiPaths.deleteDocument}`,
      { payload: { ...request } }
    );
  }

  @ObservableException()
  updateIsVerifiedDocument(
    request: IDocumentsUpdateIsVerifiedRequest
  ): Observable<any> {
    return this.http.post<any>(
      `${this._masterApiUrl}/${apiPaths.updateIsVerifiedDocument}`,
      { payload: { ...request } }
    );
  }

  @ObservableException()
  updateNotes(
    request: IDocumentsUpdateNotesRequest
  ): Observable<IDocumentsUpdateNotesResponse> {
    return this.http.post<IDocumentsUpdateNotesResponse>(
      `${this._masterApiUrl}/${apiPaths.updateNotes}`,
      { payload: { ...request } }
    );
  }

  @ObservableException()
  downloadDocument(request: IDocumentsDownloadRequest): Observable<Blob> {
    return this.http.post(
      `${this._masterApiUrl}/${apiPaths.downloadDocument}`,
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
        `${this._masterApiUrl}/${apiPaths.getDocuments}`,
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
        `${this._negotiationApiUrl}/${apiPaths.updateNegotiationComments}`,
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
        `${this._negotiationApiUrl}/${apiPaths.switchReqOffBasedOnQuote}`,
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
        `${this._negotiationApiUrl}/${apiPaths.updateSellerComment}`,
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
        `${this._negotiationApiUrl}/${apiPaths.copyComments}`,
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
        ? body?.error?.ErrorMessage
          ? body?.error?.ErrorMessage
          : (body?.error?.errors) ? body?.error?.errors : body?.error?.errorMessage
        : { message: 'Unauthorized' }
    );
  }

  @ObservableException()
  getTenantConfiguration(): Observable<any> {
    return this.http
      .get<any>(
        `${this._negotiationApiUrl}/${apiPaths.tenantConfiguration}`
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
        `${this._infrastructureApiUrl}/${apiPaths.staticLists}`,
        { Payload: request }
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  getOfferPriceHistory(payload: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._negotiationApiUrl}/${apiPaths.getOfferPriceHistory}`,
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
        `${this._negotiationApiUrl}/${apiPaths.updateProductPrice}`,
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
        `${this._procurementApiUrl}/${apiPaths.isAuthorizedForReportsTab}`,
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

  @ObservableException()
  getSellerRatingforNegotiation(payload: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._sellerApiUrl}/${apiPaths.getSellerRatingsforNegotiation}`,
        payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  updateQuoteDateGroup(request: any): Observable<any> {
    return this.http
      .put<any>(
        `${this._negotiationApiUrl}/${apiPaths.updateQuoteDateGroup}`,
        request
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }



  /**
  * Create new contract request
  * @param {*} {requestPayload<IContractRequestDetailDto>}
  * @return {*}  {Observable<any>}
  * @memberof ContractNegotiationApi
  */
  @ObservableException()
  createContractRequest(requestPayload: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._shitechApiUrl}/${apiPaths.createContractRequest}`,
        requestPayload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  getContractFormulaList(payload: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._masterApiUrl}/${apiPaths.getContractFormulaList}`,
        { Payload: payload }
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  getMasterFormula(payload: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._masterApiUrl}/${apiPaths.getMasterFormula}`,
        { Payload: payload }
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );

  }

  @ObservableException()
  addNewFormulaPrice(request: any, requestOfferId: number): Observable<any> {
    return this.http
      .post<any>(
        `${this._shitechApiUrl}/offers/${requestOfferId}/priceConfiguration`,
        request
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  updateFormulaPrice(request: any, requestOfferId: number, priceConfigurationId: number): Observable<any> {
    return this.http
      .patch<any>(
        `${this._shitechApiUrl}/offers/${requestOfferId}/priceConfiguration/${priceConfigurationId}`,
        request
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  evaluateFormulaPrice(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._shitechApiUrl}/offerPriceEvaluations`,
        request
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  cloneToPriceConfiguration(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._shitechApiUrl}/orders/cloneToPriceconfigurations`,
        request
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  orderPriceEvaluations(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._shitechApiUrl}/orderPriceEvaluations`,
        request
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  evaluatePrices(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._shitechApiUrl}/offerPriceEvaluations/ForOffers`,
        request
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  getOfferPriceConfiguration(requestOfferId: number, priceConfigId: number): Observable<any> {
    return this.http.get<any>(`${this._shitechApiUrl}/offers/${requestOfferId}/priceConfiguration/${priceConfigId}`)
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  getDefaultConversionFactor(payload: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._masterApiUrl}/${apiPaths.getDefaultConversionFactor}`,
        { Payload: payload }
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  copyPriceConfigurations(payload: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._shitechApiUrl}/Offers/copyPriceConfigurations`,
        payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }
  @ObservableException()
  removeFormula(requestOfferId: number, priceConfigId: number): Observable<any> {
    return this.http.delete<any>(`${this._shitechApiUrl}/offers/${requestOfferId}/priceConfiguration/${priceConfigId}`)
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }
  @ObservableException()
  getEnergy6MHistorys(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this._negotiationApiUrl}/${apiPaths.getEnergy6MonthHistory}`,
      payload
    )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  contractRequestList(): Observable<any> {
    return this.http
      .get<any>(
        `${this._shitechApiUrl}/${ContractNegotiationApiPaths.requestList}`
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  getcontractRequestDetails(contractRequestId: number): Observable<any> {
    return this.http
      .get<any>(
        `${this._shitechApiUrl}/${ContractNegotiationApiPaths.contractRequest}/${contractRequestId}`)
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  getContractPreferenceCount(): Observable<any> {
    return this.http
      .get<any>(
        `${this._shitechApiUrl}/${ContractNegotiationApiPaths.preferenceCount}`
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  getContractUserFilterPreset(): Observable<any> {
    return this.http
      .get<any>(
        `${this._infrastructureApiUrl}/${ContractNegotiationApiPaths.userFilterPresets}`
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  updateContractUserFilterPreset(payload): Observable<any> {
    return this.http
      .post<any>(
        `${this._infrastructureApiUrl}/${ContractNegotiationApiPaths.userSaveFilterPresets}`, payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  getColumnPreference(): Observable<any> {
    return this.http
      .get<any>(
        `${this._infrastructureApiUrl}/${ContractNegotiationApiPaths.columnPreference}`
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  updateColumnPreference(payload): Observable<any> {
    return this.http
      .post<any>(
        `${this._infrastructureApiUrl}/${ContractNegotiationApiPaths.savecolumnPreference}`, payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

}

export const CONTRACT_NEGOTIATION_API_SERVICE = new InjectionToken<
  IContractNegotiationApiService
>('CONTRACT_NEGOTIATION_API_SERVICE');
