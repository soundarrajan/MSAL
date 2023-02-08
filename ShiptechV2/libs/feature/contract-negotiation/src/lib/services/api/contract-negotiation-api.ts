import { Injectable, InjectionToken } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';
import { AppConfig } from '@shiptech/core/config/app-config';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { ApiCallUrl } from '@shiptech/core/utils/decorators/api-call.decorator';
import { catchError, map } from 'rxjs/operators';
import { IContractNegotiationApiService } from './contract-negotiation.api.service.interface';
import { IDocumentsDownloadRequest } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-download.dto';
import {
  IDocumentsUpdateNotesRequest,
  IDocumentsUpdateNotesResponse
} from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-update-notes.dto';

export const apiPaths = {
  tenantConfiguration: `Groups/getTenantConfiguration`,
  staticLists: `api/infrastructure/static/lists`,
  createContractRequest: `api/ContractRequest/create`,
  updateContractRequest: `api/ContractRequest/update`,
  counterpartyLists: `api/masters/counterparties/listbyTypes`,
  //counterpartyListsByName: `counterparty/getCounterpartyList`,
  //addCounterparties: `groups/addSellers`,
  //addRequesttoGroup: `groups/linkRequest`,
  //saveTargetPrice: `Groups/saveTargetPrice`,
  //updatePhySupplier: `RFQ/updatePhysicalSupplier`,
  //sendRFQ: `RFQ/createRFQ`,
  //amendRFQ: `RFQ/amendRfq`,
  //requoteRFQ: `RFQ/requoteRfq`,
  //skipRFQ: `RFQ/skipRFQ`,
  //revokeRFQ: `RFQ/revokeRFQ`,
  //saveAndSendRFQ: `RFQ/saveAndSendRFQ`,
 // UpdateSelectSeller: `Groups/toggleReqSellerSelection`,
  //previewRfqMail: `RFQ/previewRfqMail`,
  //revertSavedComments: `RFQ/discardSavedComments`,
  //getExistingOrders: `api/procurement/order/getExistingOrders`,
  //confirmRfq: `api/procurement/rfq/confirm`,
  removeCounterparty: `Groups/removeSeller`,
  //otherDetails: `RFQ/otherDetails/requestChange`,
  //getSellerContacts: `counterparty/viewContacts`,
  //addNewSellerContact: `counterparty/addContact`,
  getEmailLogs: `api/masters/emaillogs/list`,
  getAuditLogs: `api/admin/audit/get`,
   //getAdditionalCosts: `price/getOfferAdditionalCosts`,
  getEmailLogsPreview: `api/masters/emaillogs/get`,
  //getRequestList: `api/procurement/rfq/selectRequest`,
  //getBestContract: `api/procurement/request/bestContract`,
  //delinkRequest: `Groups/deleteRequest`,
  //getExchangeRate: `price/getExchangeRate`,
  //applyExchangeRate: `price/applyExchangeRate`,
  //getLocationCosts: `price/locationCosts`,
  //saveOfferAdditionalCosts: `price/saveOfferAdditionalCosts`,
  //getMasterAdditionalCostsList: `api/masters/additionalcosts/listApps`,
  //getUomConversionFactor: `api/masters/uoms/convertQuantity`,
  //getRangeTotalAdditionalCosts: `api/procurement/order/getRangeTotalAdditionalCosts`,
  //getDocumentTypeList: `api/masters/documenttype/list`,
  uploadDocument: `api/masters/documentupload/create`,
  getDocuments: `api/masters/documentupload/list`,
  //deleteDocument: `api/masters/documentupload/delete`,
  downloadDocument: `api/masters/documentupload/download`,
  //updateIsVerifiedDocument: `api/masters/documentupload/update`,
  updateNotes: `api/masters/documentupload/notes`,
  //updateNegotiationComments: `groups/updateComments`,
  //switchReqOffBasedOnQuote: `RFQ/switchReqOffBasedOnQuote`,
  copyComments: `groups/copyComments`,
  //updateSellerComment: `RFQ/UpdateSellerComments`,
  //getOfferPriceHistory: `Price/getOfferPriceHistory`,
  updateProductPrice: `RFQ/FreezeMarketPrices`,
  //isAuthorizedForReportsTab: `api/procurement/rfq/isAuthorizedForReportsTab`,
  getSellerRatingsforNegotiation: `api/sellerrating/sellerratingreview/getForNegotiation`,
  getContractFormulaList: `api/masters/formulas/listMasters`,
  //getMasterFormula: `api/masters/formulas/get`,
  //getDefaultConversionFactor: `api/masters/products/getProdDefaultConversionFactors`,
  //getEnergy6MonthHistory: `groups/getEnergy6MonthHistorys`,
  //updateQuoteDateGroup: `groups/updateQuoteGroup`
};

export const ContractNegotiationApiPaths = {
  requestList: `api/ContractRequest/list`,
  contractRequest: 'api/ContractRequest',
  preferenceCount: `api/ContractRequest/getCounts`,
  userSaveFilterPresets: 'api/user-settings/save/contract-requestlist-filter-presets',
  userFilterPresets: 'api/user-settings/contract-requestlist-filter-presets',
  savecolumnPreference: 'api/user-settings/save/contract-request-list-grid_ColumnPreference',
  columnPreference: 'api/user-settings/contract-request-list-grid_ColumnPreference',
  counterPartSelectionToggle : 'api/ContractNegotiation/toggleConReqSellerSelection',
  addSellerContract : 'api/ContractNegotiation/addSellerContract',
  removeCounterparty : 'api/ContractNegotiation/removeSellerContract',
  sendRFQ: 'api/ContractNegotiation/SendRFQ',
  amendRFQ: 'api/ContractNegotiation/amendRFQ',
  previewRFQ: 'api/contractnegotiation/previewRfqmail',
  discardSavedPreviewRFQ: 'api/contractnegotiation/discardSavedComments',
  saveAndSendRFQ: 'api/contractnegotiation/saveAndSendRFQ',
  updatePrices : 'api/ContractNegotiation/offer/update',
  resend : 'api/ContractNegotiation/resend',
  switchContractReqBasedOnQuote:'api/ContractNegotiation/switchContractReqBasedOnQuote', 
  offerChatList:'api/ContractNegotiation/offerChatList',
  addOfferChat:'api/ContractNegotiation/offerChatCreate',
  saveAdditionalCost: 'api/ContractNegotiation/offer/saveAdditionalCosts',
  getAdditionalCost : 'api/ContractNegotiation/offer/getAdditionalCosts',
  getMasterAdditionalCostsList : `api/masters/additionalcosts/listApps`
}


@Injectable({
  providedIn: 'root'
})
export class ContractNegotiationApi implements IContractNegotiationApiService {

  @ApiCallUrl()
  private _adminApiUrl = this.appConfig.v1.API.BASE_URL_DATA_ADMIN;

  @ApiCallUrl()
  private _auditLog = this.appConfig.v1.API.BASE_URL_DATA_ADMIN;

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
  getOfferChat(payload: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._shitechApiUrl}/${ContractNegotiationApiPaths.offerChatList}`,
         payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  addOfferChat(payload: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._shitechApiUrl}/${ContractNegotiationApiPaths.addOfferChat}`,
       payload
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
  emailLogsResendMail(payload: any): Observable<any> { 
    return this.http
      .post<any>(
        `${this._shitechApiUrl}/${ContractNegotiationApiPaths.resend}`, payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  getAuditLogsList(payload: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._adminApiUrl}/${apiPaths.getAuditLogs}`,
        { Payload: payload }
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  RemoveCounterparty(id: any): Observable<any> {
    return this.http
      .put<any>(
        `${this._shitechApiUrl}/${ContractNegotiationApiPaths.removeCounterparty}`, {id}
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
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

  /**
  * Create new contract request
  * @param {*} {requestPayload<IContractRequestDetailDto>}
  * @return {*}  {Observable<any>}
  * @memberof ContractNegotiationApi
  */
  @ObservableException()
  updateContractRequest(requestPayload: any): Observable<any> {
    return this.http
      .put<any>(
        `${this._shitechApiUrl}/${apiPaths.updateContractRequest}`,
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
  counterPartSelectionToggle(sellerIds): Observable<any> {
      return this.http
      .put<any>(
        `${this._shitechApiUrl}/${ContractNegotiationApiPaths.counterPartSelectionToggle}`,
        sellerIds
      )
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
  
  @ObservableException()
  addCounterpartyToAllLocations(payload): Observable<any> {
    if(payload.length == 0) return;
    return this.http
      .post<any>(
        `${this._shitechApiUrl}/${ContractNegotiationApiPaths.addSellerContract}`, payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }
  @ObservableException()
  switchContractReqBasedOnQuote(payload): Observable<any> {
    if(payload.length == 0) return;
    return this.http
      .put<any>(
        `${this._shitechApiUrl}/${ContractNegotiationApiPaths.switchContractReqBasedOnQuote}`,
        payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  sendRFQ(payload): Observable<any> {
    if(payload.length == 0) return;
    return this.http
      .put<any>(
        `${this._shitechApiUrl}/${ContractNegotiationApiPaths.sendRFQ}`, payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  amendRFQ(payload): Observable<any> {
    if(payload.length == 0) return;
    return this.http
      .put<any>(
        `${this._shitechApiUrl}/${ContractNegotiationApiPaths.amendRFQ}`, payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  saveAndSendRFQ(payload): Observable<any> {
    if(payload.length == 0) return;
    return this.http
      .post<any>(
        `${this._shitechApiUrl}/${ContractNegotiationApiPaths.saveAndSendRFQ}`, payload
      )
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  getPreviewRFQEmail(payload: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._shitechApiUrl}/${ContractNegotiationApiPaths.previewRFQ}`, payload)
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  discardSavedPreviewRFQ(payload: any): Observable<any> {
    return this.http
      .put<any>(
        `${this._shitechApiUrl}/${ContractNegotiationApiPaths.discardSavedPreviewRFQ}`, payload)
      .pipe(
        map((body: any) => body),
        catchError((body: any) => this.handleErrorMessage(body))
      );
  }

  @ObservableException()
  updatePrices(payload: any[]): Observable<any> {
    return this.http
    .put<any>(
      `${this._shitechApiUrl}/${ContractNegotiationApiPaths.updatePrices}`, payload
    )
    .pipe(
      map((body: any) => body),
      catchError((body: any) => this.handleErrorMessage(body))
    );
  }
  @ObservableException()
  saveAdditionalCost(payload: any[]): Observable<any> {
    return this.http
    .post<any>(
      `${this._shitechApiUrl}/${ContractNegotiationApiPaths.saveAdditionalCost}`, payload
    )
    .pipe(
      map((body: any) => body),
      catchError((body: any) => this.handleErrorMessage(body))
    );
  }
  @ObservableException()
  getAdditionalCost(payload: any): Observable<any> {
    return this.http
    .get<any>(
      `${this._shitechApiUrl}/${ContractNegotiationApiPaths.getAdditionalCost}`, payload
    )
    .pipe(
      map((body: any) => body),
      catchError((body: any) => this.handleErrorMessage(body))
    );
  }

  @ObservableException()
  getMasterAdditionalCostsList(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${this._masterApiUrl}/${ContractNegotiationApiPaths.getMasterAdditionalCostsList}`,
        { Payload: request }
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
