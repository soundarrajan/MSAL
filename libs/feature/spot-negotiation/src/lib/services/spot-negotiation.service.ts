import { Inject, Injectable, OnDestroy } from '@angular/core';
import { defer, Observable, of, Subject, throwError } from 'rxjs';
import { BaseStoreService } from '@shiptech/core/services/base-store.service';
import { ModuleLoggerFactory } from '../core/logging/module-logger-factory';
import { Store } from '@ngxs/store';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';

import { UrlService } from '@shiptech/core/services/url/url.service';
import { Router } from '@angular/router';
import { SpotNegotiationApi } from './api/spot-negotiation-api';
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
import {
  IDocumentsUpdateNotesRequest,
  IDocumentsUpdateNotesResponse
} from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-update-notes.dto';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class SpotNegotiationService extends BaseStoreService
  implements OnDestroy {
  private futureSetTabIndex = new Subject<any>();
  private gridRefreshService = new Subject<any>();
  private gridRefreshServiceAll = new Subject<any>();
  private gridRedrawService = new Subject<any>();
  QuoteByDate: any;
  counterpartyTotalCount: any;
  physicalSupplierTotalCount: any;
  requestCount: any;

  constructor(
    protected store: Store,
    private urlService: UrlService,
    private router: Router,
    loggerFactory: ModuleLoggerFactory,
    private spotNegotiationApi: SpotNegotiationApi
  ) {
    super(store, loggerFactory.createLogger(SpotNegotiationService.name));
  }
    // Observable string streams
    gridRefreshService$ = this.gridRefreshService.asObservable();
    // Grid Refrsh Service invoke commands
    callGridRefreshService() {
      this.gridRefreshService.next();
    }

        // Observable string streams
    gridRedrawService$ = this.gridRedrawService.asObservable();
    // Grid Redraw Service invoke commands
    callGridRedrawService() {
      this.gridRedrawService.next();
    }

    gridRefreshServiceAll$ = this.gridRefreshServiceAll.asObservable();
    // Grid Refrsh Service invoke commands
    callGridRefreshServiceAll() {
      this.gridRefreshServiceAll.next();
    }

  /* Gets the list of Email Logs
   * @param payload =
   */
  @ObservableException()
  getEmailLogsList(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.getEmailLogsList(payload);
  }

  /* Gets the Email Logs based on Id
   * @param payload =
   */
  @ObservableException()
  getEmailLogsPreview(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.getEmailLogsPreview(payload);
  }

  /**
   * @param payload = False
   */
  @ObservableException()
  getTenantConfiguration(): Observable<unknown> {
    return this.spotNegotiationApi.getTenantConfiguration();
  }

  /**
   * @param payload = False
   */
  @ObservableException()
  getStaticLists(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.getStaticLists(payload);
  }
  /**
 * @param payload = null
 */
  @ObservableException()
  CheckWhetherUserIsAuthorizedForReportsTab(): Observable<unknown> {
    return this.spotNegotiationApi.CheckWhetherUserIsAuthorizedForReportsTab();
  }

  /**
   * @param payload = False
   */
  @ObservableException()
  getCounterpartyList(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.getCounterpartyList(payload);
  }

  /**
   * @param payload = False
   */
  @ObservableException()
  getRequestList(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.getRequestList(payload);
  }
  /**
   * @param payload = False
   */
  @ObservableException()
  getPriceDetails(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.getPriceDetails(payload);
  }

  /**
   * @param payload = int
   */
  @ObservableException()
  getMarketPriceHistory(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.getMarketPriceHistory(payload);
  }

  /**
   * @param payload = False
   */
  @ObservableException()
  addCounterparties(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.AddCounterparties(payload);
  }

  /**
   * @param payload = False
   */
  @ObservableException()
  addRequesttoGroup(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.addRequesttoGroup(payload);
  }
  /**
   * Send RFQ
   * @param payload = int
   */
  @ObservableException()
  SendRFQ(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.SendRFQ(payload);
  }

  /**
   * Updated Selected Seller
   * @param payload = int
   */
  @ObservableException()
  UpdateSelectSeller(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.UpdateSelectSeller(payload);
  }

  /**
   * Updated supply qty,product & date
   * @param payload = False
   */
  @ObservableException()
  OtherDetails(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.OtherDetails(payload);
  }

  /**
   * Get group of request when window loads.
   * @param payload
   */
  @ObservableException()
  getGroupOfSellers(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.getGroupOfSellers(payload);
  }

  @ObservableException()
  getRequestGroup(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.getRequestGroup(payload);
  }

  /**
   * @param payload = True
   */
  @ObservableException()
  updatePrices(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.updatePrices(payload);
  }
  /**
   * @param payload = True
   */
  @ObservableException()
  copyPriceDetails(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.copyPriceDetails(payload);
  }
  /**
   * @param payload = False
   */
  @ObservableException()
  saveTargetPrice(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.SaveTargetPrice(payload);
  }

  @ObservableException()
  updatePhySupplier(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.UpdatePhySupplier(payload);
  }
  /**
   * Amend RFQ
   * @param payload =
   */
  @ObservableException()
  AmendRFQ(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.AmendRFQ(payload);
  }

  /**
   * Preview RFQ email
   * @param payload =
   */
  @ObservableException()
  PreviewRfqMail(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.PreviewRfqMail(payload);
  }

  /* Get Existing Order's
   * @param payload =
   */
  @ObservableException()
  GetExistingOrders(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.GetExistingOrders(payload);
  }

  /**
   * Get Confirm Offer's
   * @param payload =
   */
  @ObservableException()
  ConfirmRfq(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.ConfirmRfq(payload);
  }

  /**
   * Skip RFQ
   * @param payload =
   */
  @ObservableException()
  SkipRFQ(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.SkipRFQ(payload);
  }

  /**
   * Save and Send RFQ
   * @param payload =
   */
  @ObservableException()
  SaveAndSendRFQ(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.SaveAndSendRFQ(payload);
  }

  @ObservableException()
  RemoveCounterparty(counterpartyId: any): Observable<unknown> {
    return this.spotNegotiationApi.RemoveCounterparty(counterpartyId);
  }

  /**
   * Revoke RFQ
   * @param payload =
   */
  @ObservableException()
  RevokeFQ(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.RevokeRFQ(payload);
  }

  /**
   * Requote RFQ
   * @param payload =
   */
  @ObservableException()
  RequoteRFQ(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.RequoteRFQ(payload);
  }

  /**
   * Discard saved mail
   * @param payload =
   */
  @ObservableException()
  RevertSavedComments(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.RevertSavedComments(payload);
  }

  @ObservableException()
  getSellerContacts(sellerId: number, locationId: number): Observable<unknown> {
    return this.spotNegotiationApi.getSellerContacts(sellerId, locationId);
  }

  @ObservableException()
  addNewSellerContact(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.addNewSellerContact(payload);
  }

  /**
   * get offer and location based costs
   * @param payload
   * @returns
   */
  @ObservableException()
  getAdditionalCosts(payload: any): Promise<any> {
    return this.spotNegotiationApi.getAdditionalCosts(payload).toPromise();
  }

  /**
   * Get additional costs defined in location master
   * @param {*} payload
   * @return {*}  {Observable<unknown>}
   * @memberof SpotNegotiationService
   */
  @ObservableException()
  getLocationCosts(locationId: number): Observable<unknown> {
    return this.spotNegotiationApi.getLocationCosts(locationId);
  }

  /**
   * save additional costs in requestadditionalcosts
   * @param {*} payload
   * @return {*}  {Observable<unknown>}
   * @memberof SpotNegotiationService
   */
  @ObservableException()
  saveOfferAdditionalCosts(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.saveOfferAdditionalCosts(payload);
  }

  /**
   * @param payload
   */
  @ObservableException()
  getRangeTotalAdditionalCosts(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.getRangeTotalAdditionalCosts(payload);
  }

  /**
   * Fake populate rows
   */
  public getSpotDataJSON(): any {
    return this.store.selectSnapshot(state => {
      return state.spotNegotiation.rows;
    });
  }

  public getFutureSettlementTabChange(): Observable<any> {
    return this.futureSetTabIndex.asObservable();
  }

  /**
   * get additional costs list
   * @param payload
   * @returns
   */
  @ObservableException()
  getMasterAdditionalCosts(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.getMasterAdditionalCosts(payload);
  }

  /**
   * @param payload
   */
  @ObservableException()
  getUomConversionFactor(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.getUomConversionFactor(payload);
  }

  /**
   * @param groupId
   *
   */
  @ObservableException()
  getPriceDetailsById(
    groupId: any,
    requestLocationSellerId: any
  ): Observable<unknown> {
    return this.spotNegotiationApi.getPriceDetailsById(
      groupId,
      requestLocationSellerId
    );
  }

  /**
   * @param requestId
   *
   */
  @ObservableException()
  getBestContract(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.getBestContract(payload);
  }

  /**
   * @param payload
   */
  @ObservableException()
  getDocumentTypeList(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.getDocumentTypeList(payload);
  }

  /**
   * @param payload
   */
  @ObservableException()
  uploadFile(
    payload: IDocumentsCreateUploadRequest
  ): Observable<IDocumentsCreateUploadResponse> {
    return this.spotNegotiationApi.uploadFile(payload);
  }

  /**
   * @param payload
   */
  @ObservableException()
  deleteDocument(
    payload: IDocumentsDeleteRequest
  ): Observable<IDocumentsDeleteResponse> {
    return this.spotNegotiationApi.deleteDocument(payload);
  }

  /**
   * @param payload
   */
  @ObservableException()
  updateIsVerifiedDocument(
    payload: IDocumentsUpdateIsVerifiedRequest
  ): Observable<any> {
    return this.spotNegotiationApi.updateIsVerifiedDocument(payload).pipe(
      map((body: any) => body.payload),
      catchError((body: any) =>
        of(
          body.error?.ErrorMessage && body.error?.Reference
            ? body.error.ErrorMessage + ' ' + body.error.Reference
            : body.status == 401
            ? { message: 'Unauthorized' }
            : body.error.errorMessage + ' ' + body.error.reference
        )
      )
    );
  }

  /**
   * @param payload
   */
  @ObservableException()
  updateNotes(
    payload: IDocumentsUpdateNotesRequest
  ): Observable<IDocumentsUpdateNotesResponse> {
    return this.spotNegotiationApi.updateNotes(payload);
  }

  /**
   * @param payload
   */
  @ObservableException()
  getDocuments(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.getDocuments(payload);
  }

  /**
   * @param payload
   */
  @ObservableException()
  downloadDocument(payload: IDocumentsDownloadRequest): Observable<Blob> {
    return this.spotNegotiationApi.downloadDocument(payload);
  }

  /**
   * @param payload
   */
  @ObservableException()
  delinkRequest(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.delinkRequest(payload);
  }

  @ObservableException()
  getExchangeRate(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.getExchangeRate(payload);
  }

  @ObservableException()
  applyExchangeRate(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.applyExchangeRate(payload);
  }

  /**
   * @param payload
   */
  updateNegotiationComments(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.updateNegotiationComments(payload);
  }

  /**
   * @param payload
   */
  UpdateSellerComments(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.UpdateSellerComments(payload);
  }

  /**
   * @param payload
   */
  copyNegotiationComments(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.copyNegotiationComments(payload);
  }

  /**
   * @param payload
   */
  switchReqOffBasedOnQuote(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.switchReqOffBasedOnQuote(payload);
  }

  /**
   * @param payload
   */
  UpdateProductPrices(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.UpdateProductPrices(payload);
  }

  ngOnDestroy(): void {
    super.onDestroy();
  }

  //for getting counterparty response
  getResponse(
    Order: any,
    PageFilters: any,
    SortList: any,
    Filters: any,
    SearchText: any,
    Pagination: any
  ) {
    let payload = {
      Order: Order,
      PageFilters: PageFilters,
      SortList: SortList,
      Filters: Filters,
      SearchText: SearchText,
      Pagination: Pagination
    };
    return this.getCounterpartyList(payload);
  }

  getRequestresponse(
    Order: any,
    PageFilters: any,
    SortList: any,
    Filters: any,
    SearchText: any,
    Pagination: any
  ) {
    let payload = {
      Order: Order,
      PageFilters: PageFilters,
      SortList: SortList,
      Filters: Filters,
      SearchText: SearchText,
      Pagination: Pagination
    };
    return this.getRequestList(payload);
  }

  formatRowData(
    row,
    product,
    field,
    newValue,
    currentLocation,
    isPriceCopied,
    sourceReqProOff
  ) {
    const productDetails = this.getRowProductDetails(row, product.id);

    //Change with new value
    switch (field) {
      case 'offPrice':
        productDetails.price = Number(newValue.toString().replace(/,/g, ''));
        break;

      default:
        break;
    }
    productDetails.exchangeRateToBaseCurrency = isPriceCopied
      ? sourceReqProOff?.exchangeRateToBaseCurrency ?? 1
      : productDetails.exchangeRateToBaseCurrency ?? 1;
    // Total Price = Offer Price + Additional cost(Rate/MT of the product + Rate/MT of  applicable for 'All')
    productDetails.totalPrice =
      (Number(productDetails.price) + productDetails.cost) *
      (productDetails.exchangeRateToBaseCurrency ?? 1); // Amount = Total Price * Max. Quantity
    productDetails.amount = productDetails.totalPrice * product.maxQuantity;

    // Target Difference = Total Price - Target Price
    productDetails.targetDifference =
      productDetails.totalPrice -
      (product.requestGroupProducts
        ? product.requestGroupProducts.targetPrice
        : 0);
    productDetails.targetDifference =
      product.requestGroupProducts.targetPrice == 0
        ? 0
        : productDetails.targetDifference;
    productDetails.isOfferPriceCopied = isPriceCopied;
    productDetails.currencyId = isPriceCopied
      ? sourceReqProOff?.currencyId
      : productDetails.currencyId;
    // Total Offer(provided Offer Price is captured for all the products in the request) = Sum of Amount of all the products in the request

    if (isPriceCopied)
      productDetails.offerPriceCopiedFrom = sourceReqProOff?.id;
    const currentLocationAllProductsIds = currentLocation.requestProducts.map(
      e => e.id
    );

    let futureRow = this.setRowProductDetails(row, productDetails, product.id);

    let calcTotalOffer = 0;
    currentLocationAllProductsIds.map(id => {
      calcTotalOffer += Number(this.getRowProductDetails(futureRow, id).amount);
    });
    futureRow.totalOffer = calcTotalOffer;

    return futureRow;
  }

  getRowProductDetails(row, productId) {
    let futureRow = JSON.parse(JSON.stringify(row));

    const emptyPriceDetails = {
      amount: null,
      contactCounterpartyId: null,
      currencyId: 0,
      id: null,
      offerId: null,
      price: null,
      priceQuantityUomId: null,
      quotedProductId: null,
      requestProductId: productId,
      targetDifference: null,
      totalPrice: null,
      exchangeRateToBaseCurrency: 1
    };

    if (!futureRow.requestOffers) {
      return emptyPriceDetails;
    }

    const priceDetails = futureRow.requestOffers.find(
      item => item.requestProductId === productId
    );

    if (priceDetails) {
      return priceDetails;
    }

    return emptyPriceDetails;
  }

  setRowProductDetails(row, details, productId) {
    // returns a row;
    let futureRow = JSON.parse(JSON.stringify(row));

    if (!futureRow.requestOffers) {
      return futureRow;
    }

    for (let i = 0; i < futureRow.requestOffers.length; i++) {
      if (futureRow.requestOffers[i].requestProductId == productId) {
        futureRow.requestOffers[i] = details;
        break;
      }
    }
    return futureRow;
  }

  @ObservableException()
  getOfferPrice(payload: any): Observable<unknown> {
    return this.spotNegotiationApi.getOfferPriceHistory(payload);
  }

  @ObservableException()
  getSellerRatingforNegotiation(payload: any): Observable<unknown>{
    return this.spotNegotiationApi.getSellerRatingforNegotiation(payload)  ;
  }
}
