import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { BaseStoreService } from '@shiptech/core/services/base-store.service';
import { IDocumentsDownloadRequest } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-download.dto';
import { IDocumentsUpdateNotesRequest, IDocumentsUpdateNotesResponse } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-update-notes.dto';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ModuleLoggerFactory } from '../core/logging/module-logger-factory';
import { ContractNegotiationStoreModel } from '../store/contract-negotiation.store';
import { ContractNegotiationApi } from './api/contract-negotiation-api';

@Injectable()
export class ContractNegotiationService extends BaseStoreService
  implements OnDestroy {
  QuoteByDate: any;
  private gridRedrawService = new Subject<any>();
  QuoteByTimeZoneId: any;
  counterpartyTotalCount: any;
  physicalSupplierTotalCount: any;
  requestCount: any;
  hArray: any = [];
  netEnergyList: any;
  selectedCounterparty = {};
  constructor(
    protected store: Store,
    loggerFactory: ModuleLoggerFactory,
    private contractNegotiationApi: ContractNegotiationApi,
    private toastr: ToastrService,
  ) {
    super(store, loggerFactory.createLogger(ContractNegotiationService.name));
  }

          // Observable string streams
          gridRedrawService$ = this.gridRedrawService.asObservable();
          // Grid Redraw Service invoke commands
          callGridRedrawService() {
            this.gridRedrawService.next();
          }

  /* Gets the list of Email Logs
   * @param payload =
   */
  @ObservableException()
  getEmailLogsList(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.getEmailLogsList(payload);
  }

  /* Gets the Email Logs based on Id
   * @param payload =
   */
  @ObservableException()
  getEmailLogsPreview(payload: any): Observable<any> {
    return this.contractNegotiationApi.getEmailLogsPreview(payload);
  }
  @ObservableException()
  getAuditLogsList(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.getAuditLogsList(payload);
  }
  @ObservableException()
  emailLogsResendMail(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.emailLogsResendMail(payload);
  }
  /**
   * @param payload = False
   */
  @ObservableException()
  getStaticLists(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.getStaticLists(payload);
  }
  
  /*Create contract request details
   * @param payload =
   */
  @ObservableException()
  createContractRequest(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.createContractRequest(payload);
  }

  /*Update Contract request details
   * @param payload =
   */
  @ObservableException()
  updateContractRequest(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.updateContractRequest(payload);
  }

  @ObservableException()
  RemoveCounterparty(counterpartyId: any): Observable<unknown> {
    return this.contractNegotiationApi.RemoveCounterparty(counterpartyId);
  }

  /**
   * Fake populate rows
   */
  public getSpotDataJSON(): any {
    return this.store.selectSnapshot(state => {
      return state.spotNegotiation.rows;
    });
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


  ngOnDestroy(): void {
    super.onDestroy();
  }

  @ObservableException()
  getSellerRatingforNegotiation(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.getSellerRatingforNegotiation(payload);
  }

  @ObservableException()
  getContractFormulaList(payload): Observable<unknown> {
    return this.contractNegotiationApi.getContractFormulaList(payload);
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

  /**
   * @param payload // NoQuote/Enable Quote update 
   */
   switchContractReqBasedOnQuote(payload: any): Observable<unknown> {
    return this.contractNegotiationApi.switchContractReqBasedOnQuote(payload);
  }
  
  onCounterpartySelction(checkbox: any, element: any): void {
    console.log(element);
    if (checkbox.checked) {
      element.isSelected = true;
      this.selectedCounterparty[element.id] = element;
    } else if (!checkbox.checked) {
      delete this.selectedCounterparty[element.id];
    }
  }

  @ObservableException()
    constructUpdateCounterparties(source = null) : Observable<any> {
        let payload = [];
        let pArray;
        let addFlag = true;
        let filterLocation;
        let successArray = {}
        let locationWarning = []
        let msgStr;
        let allReadyexitsInLocation = JSON.parse(JSON.stringify(this.selectedCounterparty));
        let addedNewToLocation = {};
        this.store.selectSnapshot((state: ContractNegotiationStoreModel) => {
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
                    'locationId' : el['location-id'],
                    "statusId": 1,
                    'IsDeleted' :false,
                    'IsSelected' :true,
                    'Id' : 0,
                    "createdOn": "2022-12-05T05:21:28.504Z",
                    "createdById": 1
                  };

                  if(allReadyexitsInLocation[cId]){
                    delete allReadyexitsInLocation[cId];
                  }
                  addedNewToLocation[value['name']] = cId;
                  
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

          let eMessage = [];
          if(source != null){
              if(Object.keys(addedNewToLocation).length > 0){
                this.toastr.success("added successfully to the <br>"+ msgStr,Object.keys(addedNewToLocation).toString(),{enableHtml :  true,timeOut : 6000});
              }
              if(Object.keys(allReadyexitsInLocation).length > 0){
                Object.entries(allReadyexitsInLocation).forEach(([key,value]) => {
                  eMessage.push(value['name']);
                });
                this.toastr.warning(" - already exists to the <br>"+ msgStr,eMessage.toString(),{enableHtml :  true,timeOut : 6000});
              }
            }else{
              if(Object.keys(allReadyexitsInLocation).length > 0){
                Object.entries(allReadyexitsInLocation).forEach(([key,value]) => {
                  eMessage.push(value['name']);
                });
                this.toastr.warning(" - already exists in all locations"+ '',eMessage.toString(),{timeOut : 6000});
              }
              if(Object.keys(addedNewToLocation).length > 0){
                this.toastr.success(" - added successfully to all the locations"+ '',Object.keys(addedNewToLocation).toString(),{timeOut : 6000});
              }
          }
       this.selectedCounterparty = {};
       return  this.contractNegotiationApi.addCounterpartyToAllLocations(payload);
    }
    
    //No Quote contruct the payload and validation
    @ObservableException()
    constructUpdateNoQuote(source) : Observable<any> {
        let payload = [];
        let pArray;
        let reqProductOfferIds = [];
        let reqProductOffers;
        let addFlag = false;
        let filterLocation;
        let successArray = {};
        let counterpartyWarning = [];
        let alreadyNoQuoteWarning = [];
        let msgStr;
        let addedNewToLocation = {};
        this.store.selectSnapshot((state: ContractNegotiationStoreModel) => {
            filterLocation = state['contractNegotiation'].ContractRequest[0].locations;  
            filterLocation.forEach((el,kIndex) => {
              reqProductOfferIds.push([...el['data'].filter(location => location.check).map(e => e)]);
            });
         filterLocation.forEach((el,kIndex) => {
              if(el['data'].length > 0){
                addFlag = el['data'].some(location => location.check);
                 reqProductOffers=el['data'].filter(location => location.check);
              }
             reqProductOfferIds=reqProductOfferIds.reduce((acc, val) => acc.concat(val), [])
             reqProductOfferIds=reqProductOfferIds.filter(e=>e.Status=='Inquired');
              msgStr = el['location-name']+' (<i>'+el['productName']+'</i>)';
              reqProductOffers.forEach((rpo,value)=>{
                if(addFlag){
                  pArray = {
                    'ContractRequestProductOfferIds' :reqProductOfferIds.map(e => e.id),
                    'IsNoQuote' : true
                  };
                  addedNewToLocation[value['CounterpartyName']] = rpo['CounterpartyName'];
                  if(rpo['Status']=='Inquired' && !rpo['isNoQuote']){
                    successArray[value['name']] = rpo['CounterpartyName']
                  }else if(rpo['Status']=='Inquired' && rpo['isNoQuote']){
                    alreadyNoQuoteWarning.push( rpo['CounterpartyName']);
                  }
                  else{
                    counterpartyWarning.push( rpo['CounterpartyName']);
                  }

              }else{
                this.toastr.error("Please Select atleast One Counterparty");
                return;
              }
              });   
              payload=pArray;        
            });
          });
          let eMessage = [];
          if(source != null){
              if(Object.keys(addedNewToLocation).length > 0){
                this.toastr.success("Selected Offer have been marked as 'No Quote' successfully. <br>",Object.keys(addedNewToLocation).toString(),{enableHtml :  true,timeOut : 6000});
              }
              if(Object.keys(counterpartyWarning).length > 0){
                Object.entries(counterpartyWarning).forEach(([key,value]) => {
                  eMessage.push(value['name']);
                });
                this.toastr.warning("Offer Price cannot be marked as 'No Quote' as RFQ has not sent."+ msgStr,eMessage.toString(),{enableHtml :  true,timeOut : 6000});
              }
              if(Object.keys(alreadyNoQuoteWarning).length > 0){
                Object.entries(alreadyNoQuoteWarning).forEach(([key,value]) => {
                  eMessage.push(value['name']);
                });
                this.toastr.warning("Already No Quote applied."+ msgStr,eMessage.toString(),{enableHtml :  true,timeOut : 6000});
              }
            }
       return  this.contractNegotiationApi.switchContractReqBasedOnQuote(payload);
    }
  
    //Enable or No Quote contruct payload and validation
    @ObservableException()
    contructEnableOrNoQuote(data,type):Observable<any>{
      let payload = [];
      let pArray;
      if(type=='enable-Quote'){
        pArray = {
          'ContractRequestProductOfferIds' :[data.id],
          'IsNoQuote' : false
        };
        payload=pArray;  
      }else {
        pArray = {
          'ContractRequestProductOfferIds' :[data.id],
          'IsNoQuote' : true
        };
        payload=pArray;    
      }
      return  this.contractNegotiationApi.switchContractReqBasedOnQuote(payload);   
    }
  /**
   * @param payload = False
   */
  @ObservableException()
  getTenantConfiguration(): Observable<unknown> {
    return this.contractNegotiationApi.getTenantConfiguration();
  }

  /* Send RFQ
   * @param payload = 
   */
  @ObservableException()
  sendRFQ(payload: any): Observable<any> {
    return this.contractNegotiationApi.sendRFQ(payload);
  }

  /* Gets the Email Preview data based on contractRequestProductOfferId and counterPartyId
   * @param payload = 
   */
  @ObservableException()
  getPreviewRFQEmail(payload: any): Observable<any> {
    return this.contractNegotiationApi.getPreviewRFQEmail(payload);
  }

  @ObservableException()
  updatePrices(payload):Observable<any> {
    return this.contractNegotiationApi.updatePrices(payload);
  }

}
