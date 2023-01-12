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
  @ObservableException()
  updatePrices(payload):Observable<any> {
    return this.contractNegotiationApi.updatePrices(payload);
  }

}
