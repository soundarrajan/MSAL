import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { BaseStoreService } from '@shiptech/core/services/base-store.service';
import { IDocumentsCreateUploadRequest, IDocumentsCreateUploadResponse } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-create-upload.dto';
import { IDocumentsDeleteRequest, IDocumentsDeleteResponse } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-delete.dto';
import { IDocumentsDownloadRequest } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-download.dto';
import { IDocumentsUpdateIsVerifiedRequest } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-update-isVerified.dto';
import { IDocumentsUpdateNotesRequest, IDocumentsUpdateNotesResponse } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-update-notes.dto';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { cloneDeep } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ModuleLoggerFactory } from '../core/logging/module-logger-factory';
import { ContractNegotiationStoreModel } from '../store/contract-negotiation.store';
//import { EditLocationRow } from '../store/actions/ag-grid-row.action';
import { ContractNegotiationApi } from './api/contract-negotiation-api';

@Injectable()
export class ContractNegotiationService extends BaseStoreService
  implements OnDestroy {
  private futureSetTabIndex = new Subject<any>();
  private gridRefreshService = new Subject<any>();
  private gridRefreshServiceAll = new Subject<any>();
  private gridRedrawService = new Subject<any>();
  private evaluateIconDisplayCheck = new Subject<any>();
  QuoteByDate: any;
  QuoteByTimeZoneId: any;
  counterpartyTotalCount: any;
  physicalSupplierTotalCount: any;
  requestCount: any;
  hArray: any = [];
  netEnergyList: any;
  selectedCounterparty = {};
  // indexedDBList: any = [];
  constructor(
    protected store: Store,
    loggerFactory: ModuleLoggerFactory,
    private contractNegotiationApi: ContractNegotiationApi,
    private toastr: ToastrService,
  ) {
    super(store, loggerFactory.createLogger(ContractNegotiationService.name));
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

  evaluateIconDisplayCheck$ = this.evaluateIconDisplayCheck.asObservable();
  callEvaluateIconDisplayCheck() {
    this.evaluateIconDisplayCheck.next();
  }

  /* Gets the list of Email Logs
   * @param payload =
   */
  @ObservableException()
  getEmailLogsList(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.getEmailLogsList(payload);
  }
  public highlihtArrayIni(data, _i) {
    data.forEach((element, index) => {
      if (element.rowId) {
        this.hArray[index] = element;
      } else {
        this.hArray[_i + 100000] = element;
      }
    });
  }

  /* Gets the Email Logs based on Id
   * @param payload =
   */
  @ObservableException()
  getEmailLogsPreview(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.getEmailLogsPreview(payload);
  }

  /**
   * @param payload = False
   */
  @ObservableException()
  getStaticLists(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.getStaticLists(payload);
  }
  /**
 * @param payload = null
 */
  @ObservableException()
  CheckWhetherUserIsAuthorizedForReportsTab(): Observable<unknown> {
    return this.contractNegotiationApi.CheckWhetherUserIsAuthorizedForReportsTab();
  }

  /**
   * @param payload = False
   */
  @ObservableException()
  getCounterpartyList(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.getCounterpartyList(payload);
  }

  /**
 * @param payload = False
 */
  @ObservableException()
  getCounterpartyListByName(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.getCounterpartyListByName(payload);
  }

  /**
   * @param payload = False
   */
  @ObservableException()
  getRequestList(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.getRequestList(payload);
  }
  /**
   * @param payload = False
   */
  @ObservableException()
  getPriceDetails(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.getPriceDetails(payload);
  }

  /**
   * @param payload = int
   */
  @ObservableException()
  getMarketPriceHistory(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.getMarketPriceHistory(payload);
  }

  /**
   * @param payload = False
   */
  @ObservableException()
  addCounterparties(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.AddCounterparties(payload);
  }

  /**
   * @param payload = False
   */
  @ObservableException()
  addRequesttoGroup(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.addRequesttoGroup(payload);
  }
  /**
   * Send RFQ
   * @param payload = int
   */
  @ObservableException()
  SendRFQ(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.SendRFQ(payload);
  }

  /**
   * Updated Selected Seller
   * @param payload = int
   */
  @ObservableException()
  UpdateSelectSeller(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.UpdateSelectSeller(payload);
  }

  /**
   * Updated supply qty,product & date
   * @param payload = False
   */
  @ObservableException()
  OtherDetails(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.OtherDetails(payload);
  }

  /**
   * Get group of request when window loads.
   * @param payload
   */
  @ObservableException()
  getGroupOfSellers(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.getGroupOfSellers(payload);
  }

  @ObservableException()
  getRequestGroup(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.getRequestGroup(payload);
  }

  /**
   * @param payload = True
   */
  @ObservableException()
  updatePrices(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.updatePrices(payload);
  }

  /**
 * @param payload = True
 */
  @ObservableException()
  updateEnegryPrices(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.updateEnegryPrices(payload);
  }
  /**
   * @param payload = True
   */
  @ObservableException()
  copyPriceDetails(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.copyPriceDetails(payload);
  }
  /**
   * @param payload = False
   */
  @ObservableException()
  saveTargetPrice(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.SaveTargetPrice(payload);
  }

  @ObservableException()
  updatePhySupplier(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.UpdatePhySupplier(payload);
  }
  /**
   * Amend RFQ
   * @param payload =
   */
  @ObservableException()
  createContractRequest(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.createContractRequest(payload);
  }

  /**
   * Amend RFQ
   * @param payload =
   */
  @ObservableException()
  updateContractRequest(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.updateContractRequest(payload);
  }

  /**
   * Preview RFQ email
   * @param payload =
   */
  @ObservableException()
  PreviewRfqMail(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.PreviewRfqMail(payload);
  }

  /* Get Existing Order's
   * @param payload =
   */
  @ObservableException()
  GetExistingOrders(payload: any): Promise<any> {
    return this.contractNegotiationApi.GetExistingOrders(payload).toPromise();
  }

  /**
   * Get Confirm Offer's
   * @param payload =
   */
  @ObservableException()
  ConfirmRfq(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.ConfirmRfq(payload);
  }

  /**
   * Skip RFQ
   * @param payload =
   */
  @ObservableException()
  SkipRFQ(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.SkipRFQ(payload);
  }

  /**
   * Save and Send RFQ
   * @param payload =
   */
  @ObservableException()
  SaveAndSendRFQ(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.SaveAndSendRFQ(payload);
  }

  @ObservableException()
  RemoveCounterparty(counterpartyId: any): Observable<unknown> {
    return this.contractNegotiationApi.RemoveCounterparty(counterpartyId);
  }

  /**
   * Revoke RFQ
   * @param payload =
   */
  @ObservableException()
  RevokeFQ(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.RevokeRFQ(payload);
  }

  /**
   * Requote RFQ
   * @param payload =
   */
  @ObservableException()
  RequoteRFQ(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.RequoteRFQ(payload);
  }

  /**
   * Discard saved mail
   * @param payload =
   */
  @ObservableException()
  RevertSavedComments(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.RevertSavedComments(payload);
  }

  @ObservableException()
  getSellerContacts(sellerId: number, locationId: number): Observable<unknown> {
    return this.contractNegotiationApi.getSellerContacts(sellerId, locationId);
  }

  @ObservableException()
  addNewSellerContact(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.addNewSellerContact(payload);
  }

  /**
   * get offer and location based costs
   * @param payload
   * @returns
   */
  @ObservableException()
  getAdditionalCosts(payload: any): Promise<any> {
    return this.contractNegotiationApi.getAdditionalCosts(payload).toPromise();
  }

  /**
   * Get additional costs defined in location master
   * @param {*} payload
   * @return {*}  {Observable<unknown>}
   * @memberof SpotNegotiationService
   */
  @ObservableException()
  getLocationCosts(locationId: number): Observable<unknown> {
    return this.contractNegotiationApi.getLocationCosts(locationId);
  }

  /**
   * save additional costs in requestadditionalcosts
   * @param {*} payload
   * @return {*}  {Observable<unknown>}
   * @memberof SpotNegotiationService
   */
  @ObservableException()
  saveOfferAdditionalCosts(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.saveOfferAdditionalCosts(payload);
  }

  /**
   * @param payload
   */
  @ObservableException()
  getRangeTotalAdditionalCosts(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.getRangeTotalAdditionalCosts(payload);
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
    return this.contractNegotiationApi.getMasterAdditionalCosts(payload);
  }

  /**
   * @param payload
   */
  @ObservableException()
  getUomConversionFactor(payload: any): Promise<any> {
    return this.contractNegotiationApi.getUomConversionFactor(payload).toPromise();;
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
    return this.contractNegotiationApi.getPriceDetailsById(
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
    return this.contractNegotiationApi.getBestContract(payload);
  }

  /**
   * @param payload
   */
  @ObservableException()
  getDocumentTypeList(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.getDocumentTypeList(payload);
  }

  /**
   * @param payload
   */
  @ObservableException()
  uploadFile(
    payload: IDocumentsCreateUploadRequest
  ): Observable<IDocumentsCreateUploadResponse> {
    return this.contractNegotiationApi.uploadFile(payload);
  }

  /**
   * @param payload
   */
  @ObservableException()
  deleteDocument(
    payload: IDocumentsDeleteRequest
  ): Observable<IDocumentsDeleteResponse> {
    return this.contractNegotiationApi.deleteDocument(payload);
  }

  /**
   * @param payload
   */
  @ObservableException()
  updateIsVerifiedDocument(
    payload: IDocumentsUpdateIsVerifiedRequest
  ): Observable<any> {
    return this.contractNegotiationApi.updateIsVerifiedDocument(payload).pipe(
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
    return this.contractNegotiationApi.updateNotes(payload);
  }

  /**
   * @param payload
   */
  @ObservableException()
  getDocuments(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.getDocuments(payload);
  }

  /**
   * @param payload
   */
  @ObservableException()
  downloadDocument(payload: IDocumentsDownloadRequest): Observable<Blob> {
    return this.contractNegotiationApi.downloadDocument(payload);
  }

  /**
   * @param payload
   */
  @ObservableException()
  delinkRequest(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.delinkRequest(payload);
  }

  @ObservableException()
  getExchangeRate(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.getExchangeRate(payload);
  }

  @ObservableException()
  applyExchangeRate(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.applyExchangeRate(payload);
  }

  /**
   * @param payload
   */
  updateNegotiationComments(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.updateNegotiationComments(payload);
  }

  /**
   * @param payload
   */
  UpdateSellerComments(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.UpdateSellerComments(payload);
  }

  /**
   * @param payload
   */
  copyNegotiationComments(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.copyNegotiationComments(payload);
  }

  /**
   * @param payload
   */
  switchReqOffBasedOnQuote(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.switchReqOffBasedOnQuote(payload);
  }

  /**
   * @param payload
   */
  UpdateProductPrices(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.UpdateProductPrices(payload);
  }

  @ObservableException()
  updateGroupComments(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.updateGroupComments(payload);
  }
  /**
 * Get Net Energy specific details
 * @param payload =
 */
  @ObservableException()
  getEnergy6MHistorys(payload: any): Promise<any> {
    return this.contractNegotiationApi.getEnergy6MHistorys(payload).toPromise();
  }


  /**
 * @param payload
 */
  updateQuoteDateGroup(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.updateQuoteDateGroup(payload);
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
    Pagination: any,
    IsSearchOnlyInName: boolean = false
  ) {
    let payload = {
      Order: Order,
      PageFilters: PageFilters,
      SortList: SortList,
      Filters: Filters,
      SearchText: SearchText,
      Pagination: Pagination
    };
    return IsSearchOnlyInName ? this.getCounterpartyListByName(payload) : this.getCounterpartyList(payload);
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
    sourceReqProOff,
    isFormulaPricing?,
    offerPriceFormulaId?
  ) {
    const productDetails = this.getRowProductDetails(row, product.id);

    if (sourceReqProOff?.hasNoQuote) {
      productDetails.price = null;
    }
    else {
      //Change with new value
      switch (field) {
        case 'offPrice':
          productDetails.price = Number(newValue.toString().replace(/,/g, ''));
          break;

        default:
          break;
      }
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
    productDetails.isFormulaPricing = isFormulaPricing;
    productDetails.offerPriceFormulaId = offerPriceFormulaId;
    productDetails.currencyId = isPriceCopied
      ? sourceReqProOff?.currencyId
      : productDetails.currencyId;


    // Total Offer(provided Offer Price is captured for all the products in the request) = Sum of Amount of all the products in the request

    if (isPriceCopied)
      productDetails.offerPriceCopiedFrom = sourceReqProOff?.id;
    productDetails.hasNoQuote = sourceReqProOff?.hasNoQuote;
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

  energyCalculationService(productId = null, locationId = null, reuestId = null) {

    let alllocationRows;
    let productSet = {};
    let checkMjkjFlag: Boolean = true;
    let locationRows;
    let maxQtyArray = {};
    this.store.selectSnapshot<any>((state: any) => {
      const currentReqId = state.spotNegotiation.currentRequestSmallInfo.id;
      locationRows = state.spotNegotiation.locations;
      alllocationRows = state.spotNegotiation.locationsRows.filter(res => {
        if (res.requestId == currentReqId && res?.requestOffers && res.totalOffer > 0) {
          if ((locationId) && (locationId == res.locationId)) {
            return res;
          }
          if ((locationId == null)) {
            return res;
          }
        }
      });
    });
    if (alllocationRows.length == 0) return;
    locationRows.forEach(main => {
      main.requestProducts.forEach(reqProds => {
        maxQtyArray[main.locationId + '-' + reqProds.productId] = reqProds.maxQuantity;
      });
    });

    //&& res2.isEnergyCalculationRequired
    alllocationRows.forEach(res1 => {
      if (res1?.requestOffers) {
        res1?.requestOffers.filter(res2 => {
          if (res2.reqProdStatus != 'Stemmed' && res2.reqProdStatus != 'Confirmed' && res2.price != null) {
            if (res2.mjkj != null && checkMjkjFlag) checkMjkjFlag = false;
            if ((productId) && (res2.quotedProductId == productId)) {
              productSet[res2.quotedProductId + '' + res2.id] = {
                'physicalSupplierCounterpartyId': res1.physicalSupplierCounterpartyId,
                'price': res2.price,
                'id': res2.id,
                'quotedProductId': res2.quotedProductId,
                'requestId': res1.requestId,
                'locationId': res1.locationId,
                'supplyQuantity': res2.supplyQuantity,
                'mjkj': res2.mjkj,
                'isSupplyQuantityEdited': res2.isSupplyQuantityEdited
              }
              return;
            }
            if (productId == null) {
              productSet[res2.quotedProductId + '' + res2.id] = {
                'physicalSupplierCounterpartyId': res1.physicalSupplierCounterpartyId,
                'price': res2.price,
                'id': res2.id,
                'quotedProductId': res2.quotedProductId,
                'requestId': res1.requestId,
                'locationId': res1.locationId,
                'supplyQuantity': res2.supplyQuantity,
                'mjkj': res2.mjkj,
                'isSupplyQuantityEdited': res2.isSupplyQuantityEdited
              }
              return;
            }
          }
        });
      }
    });

    if (Object.keys(productSet).length == 0) return;

    this.netEnergyList = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.netEnergySpecific;
    });
    if (this.netEnergyList.length == 0 && checkMjkjFlag) return;


    let differenceValue = {};
    let difTemp = {};

    Object.entries(productSet).forEach(([key, res]) => {
      let eVal = this.netEnergyList.find(fRes => fRes.locationId == res['locationId'] && fRes.physicalSupplierId == res['physicalSupplierCounterpartyId'] && fRes.productId == res['quotedProductId']);

      if (eVal?.netAverage) {
        differenceValue[res['quotedProductId'] + '' + res['id']] = res['price'] / eVal.netAverage;
        if (!difTemp[eVal.locationId + '' + eVal.productId])
          difTemp[eVal.locationId + '' + eVal.productId] = [];
        difTemp[eVal.locationId + '' + eVal.productId].push(res['price'] / eVal.netAverage);
      } else {
        if (productSet[key].mjkj == null)
          delete productSet[key];
      }
    });
    if (Object.keys(differenceValue).length == 0 && checkMjkjFlag) return;
    let updateArr = {};
    let updatePayload = [];
    let storePayload = [];
    let serverPayLoad = {};
    storePayload = cloneDeep(alllocationRows);
    Object.entries(productSet).forEach(([key, res]) => {
      let curentProductVal = this.netEnergyList.filter(fRes => fRes.locationId == res['locationId'] && fRes.physicalSupplierId == res['physicalSupplierCounterpartyId'] && fRes.productId == res['quotedProductId']);
      if (curentProductVal.length > 0) {
        const minVal = Math.min(...difTemp[curentProductVal[0].locationId + '' + curentProductVal[0].productId]);
        updateArr['id'] = res['id'];
        updateArr['mjkj'] = curentProductVal[0]?.netAverage;
        updateArr['ediff'] = (differenceValue[res['quotedProductId'] + '' + res['id']] - minVal) * parseFloat(curentProductVal[0].netAverage);
        if (res['isSupplyQuantityEdited']) {
          updateArr['tco'] = (res['price'] + updateArr['ediff']) * res['supplyQuantity'];
        } else {
          updateArr['tco'] = (res['price'] + updateArr['ediff']) * maxQtyArray[res['locationId'] + '-' + res['quotedProductId']];
        }
        updatePayload.push(updateArr);
      } else {
        updateArr['id'] = res['id'];
        updateArr['mjkj'] = null;
        updateArr['ediff'] = null;
        updateArr['tco'] = null;
        updatePayload.push(updateArr);
      }
      alllocationRows.filter((el, index) => {
        if (el.locationId == res['locationId'] && el.requestId == res['requestId']) {
          el.requestOffers.filter((inner, iIndex) => {
            if (inner.id == res['id']) {
              storePayload[index].requestOffers[iIndex].mjkj = updateArr['mjkj'];
              storePayload[index].requestOffers[iIndex].ediff = updateArr['ediff'];
              storePayload[index].requestOffers[iIndex].tco = updateArr['tco'];
            }
          });
        }
      });
      updateArr = {};
    });
    serverPayLoad = { "requestOfferEnergys": updatePayload }
    //this.store.dispatch(new EditLocationRow(storePayload));
    this.updateEnegryPrices(serverPayLoad).subscribe();
  }

  @ObservableException()
  getOfferPrice(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.getOfferPriceHistory(payload);
  }

  @ObservableException()
  getSellerRatingforNegotiation(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.getSellerRatingforNegotiation(payload);
  }

  @ObservableException()
  getContractFormulaList(payload): Observable<unknown> {
    return this.contractNegotiationApi.getContractFormulaList(payload);
  }

  @ObservableException()
  getMasterFormula(payload): Observable<unknown> {
    return this.contractNegotiationApi.getMasterFormula(payload);
  }

  //Getting Static Lists from indexedDB
  // public async getStaticListFromIDB(){
  //   const db = await openDB('Shiptech',10)
  //   db.getAll('listsCache').then(x=>
  //     this.indexedDBList = x[0].data
  //   );
  // }

  @ObservableException()
  addNewFormulaPrice(payload, requestOfferId): Observable<unknown> {
    return this.contractNegotiationApi.addNewFormulaPrice(payload, requestOfferId);
  }

  @ObservableException()
  updateFormulaPrice(payload, requestOfferId, priceConfigurationId): Observable<unknown> {
    return this.contractNegotiationApi.updateFormulaPrice(payload, requestOfferId, priceConfigurationId);
  }

  @ObservableException()
  evaluateFormulaPrice(payload): Observable<unknown> {
    return this.contractNegotiationApi.evaluateFormulaPrice(payload);
  }

  @ObservableException()
  cloneToPriceConfiguration(payload): Observable<unknown> {
    return this.contractNegotiationApi.cloneToPriceConfiguration(payload);
  }

  @ObservableException()
  orderPriceEvaluations(payload): Observable<unknown> {
    return this.contractNegotiationApi.orderPriceEvaluations(payload);
  }

  @ObservableException()
  evaluatePrices(payload): Observable<unknown> {
    return this.contractNegotiationApi.evaluatePrices(payload);
  }

  @ObservableException()
  getOfferPriceConfiguration(requestOfferId: number, priceConfigurationId: number): Observable<unknown> {
    return this.contractNegotiationApi.getOfferPriceConfiguration(requestOfferId, priceConfigurationId);
  }

  @ObservableException()
  getDefaultConversionFactor(payload): Observable<unknown> {
    return this.contractNegotiationApi.getDefaultConversionFactor(payload);
  }

  @ObservableException()
  copyPriceConfigurations(payload): Observable<unknown> {
    return this.contractNegotiationApi.copyPriceConfigurations(payload);
  }
  @ObservableException()
  removeFormula(requestOfferId, priceConfigId): Observable<unknown> {
    return this.contractNegotiationApi.removeFormula(requestOfferId, priceConfigId);
  }

  //Requres list
  @ObservableException()
  getContractRequestList(): Observable<any> {
    return this.contractNegotiationApi.contractRequestList();
  }

  //Request detail
  @ObservableException()
  getContractRequestDetails(contractRequestId): Observable<any> {
    return this.contractNegotiationApi.getcontractRequestDetails(contractRequestId);
  }

  @ObservableException()
  counterPartSelectionToggle(counterPartyIds):Observable<any> {
  return this.contractNegotiationApi.counterPartSelectionToggle(counterPartyIds);
  }

  //PreferenceCount
  @ObservableException()
  getPreferenceCount(): Observable<any> {
    return this.contractNegotiationApi.getContractPreferenceCount();
  }

  //UserFilterPreset
  @ObservableException()
  getUserFilterPresets(): Observable<any> {
    return this.contractNegotiationApi.getContractUserFilterPreset();
  }

  //Savenew/ Update UserFilterPreset
  @ObservableException()
  updateUserFilterPresets(data: any): Observable<any> {
    const payload = {
      "Payload": {
        "key": "contract-requestlist-filter-presets",
        "value": (JSON.stringify(data))
      }
    }
    return this.contractNegotiationApi.updateContractUserFilterPreset(payload);
  }

  //GetColumnpreference
  @ObservableException()
  getColumnpreference(): Observable<any> {
    return this.contractNegotiationApi.getColumnPreference();
  }

  //Savenew/ Update Columnpreference
  @ObservableException()
  updateColumnpreference(data: any): Observable<any> {
    const payload = {
      "Payload": {
        "key": "contract-requestlist-filter-presets_ColumnPreference",
        "value": (JSON.stringify(data))
      }
    }
    return this.contractNegotiationApi.updateColumnPreference(payload);
  }
  
  onCounterpartySelction(checkbox: any, element: any): void {
    console.log(element);
    if (checkbox.checked) {
      element.select = true;
      this.selectedCounterparty[element.id] = element;
    } else if (!checkbox.checked) {
      delete this.selectedCounterparty[element.id];
    }
  }

  @ObservableException()
    constructUpdateCounterparties(source = null) : Observable<any> {
        let payload = [];
        let pArray;
        let storePayload;
        let addFlag = true;
        let filterLocation;
        let successArray = {}
        let locationWarning = []
        let msgStr;
        this.store.selectSnapshot((state: ContractNegotiationStoreModel) => {
          storePayload = JSON.parse(JSON.stringify(state['contractNegotiation'].ContractRequest[0]));
          if(source != null){
            filterLocation = state['contractNegotiation'].ContractRequest[0].locations.filter(el => el['contractRequestProductId'] == source );
          }else{
            filterLocation = state['contractNegotiation'].ContractRequest[0].locations;
          }   
         filterLocation.forEach((el,kIndex) => {
              Object.entries(this.selectedCounterparty).forEach(([cId,value]) => {
                addFlag = true;
                if(el['data'].length > 0){
                  addFlag = !el['data'].some(location => location.CounterpartyId == cId );
                }
                msgStr = el['location-name']+' (<i>'+el['productName']+'</i>)';
                if(addFlag){
                  pArray = {
                    'contractRequestProductId' : el['contractRequestProductId'],
                    'counterpartyId' : cId,
                    'productId' : el.productId,
                    'locationId' : el['location-id'],
                    "isNoQuote": 0,
                    "statusId": 1,
                    'IsDeleted' :false,
                    'IsSelected' :true,
                    'Id' : 0,
                    'SpecGroupId' :71,
                    "offerPrice": 0,
                    'MinQuantity' :0,
                    'MinQuantityUomId' :5,
                    'MaxQuantity' :0,
                    'MaxQuantityUomId' :5,
                    'CurrencyId' :1,
                    'PricingTypeId' :1,
                    "contractRequestProductOfferIds": "",
                    "createdOn": "2022-12-05T05:21:28.504Z",
                    "createdById": 1
                  };

                  if(!successArray[value['name']]){
                    successArray[value['name']] = {}
                  }
                  
                  Object.assign(successArray[value['name']],
                    {[el['location-id']+'-'+el.productId] : msgStr}
                  );
                  payload.push(pArray);
              }else{
                locationWarning.push(value['name']);
              }
              });
            });
          });
          let comArray = {...successArray};
          let tempGroup = {};
          Object.entries(successArray).forEach(([key1,v1]) => {
            Object.entries(comArray).forEach(([key2,v2]) => {
              if(JSON.stringify(v1) == JSON.stringify(v2)){
                if(tempGroup[key2]) tempGroup[key2] = {}
                tempGroup[key2] = v2;
                delete comArray[key2];
              }
            });
            if(Object.keys(tempGroup).length > 0){
              let successTitle = Object.keys(tempGroup).toString() ;
              let sellerStr = ' Added successfully to the - ';
              Object.entries(tempGroup[Object.keys(tempGroup)[0]]).forEach((value,key) => {
                sellerStr += '<br><small>'+value[1]+'</small>';
              });
              this.toastr.success(sellerStr,successTitle,{enableHtml :  true});
              tempGroup = {};
            }
           });
           if(locationWarning.length > 0){
            if(source != null){
              this.toastr.warning("already exists for <br> "+ msgStr,locationWarning.toString(),{enableHtml :  true});
            }else{
              let unique = [...new Set(locationWarning)]
              this.toastr.warning(" - already exists"+ '',unique.toString(),{enableHtml :  true});
            }
           }
       //this.store.dispatch(new ContractRequest([storePayload]));
       this.selectedCounterparty = {};
       return  this.contractNegotiationApi.addCounterpartyToAllLocations(payload);
    }

}
