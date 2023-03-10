import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { forkJoin } from 'rxjs';
import { LocalService } from '../../../services/local-service.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateContractRequestPopupComponent } from '../contract-negotiation-popups/create-contract-request-popup/create-contract-request-popup.component';
import { ContractNegotiationDetailsComponent } from '../contract-negotiation-details/contract-negotiation-details.component';
import { OfferChatComponent } from '../offer-chat/offer-chat.component';
import { Store } from '@ngxs/store';
import { isNumeric } from 'rxjs/internal-compatibility';
import { ContractNegotiationService } from '../../../services/contract-negotiation.service';
import { ActivatedRoute } from '@angular/router';
import { ContractRequest } from '../../../store/actions/ag-grid-row.action';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { ContractNegotiationStoreModel } from '../../../store/contract-negotiation.store';
import { SpotNegotiationStoreModel } from 'libs/feature/spot-negotiation/src/lib/store/spot-negotiation.store';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
import { SetCounterpartyList } from 'libs/feature/spot-negotiation/src/lib/store/actions/ag-grid-row.action';
import { ToastrService } from 'ngx-toastr';
import { SearchAllCounterpartiesComponent } from 'libs/feature/spot-negotiation/src/lib/views/main/details/components/spot-negotiation-popups/search-all-counterparties/search-all-counterparties.component';
@Component({
  selector: 'app-contract-negotiation-header',
  templateUrl: './contract-negotiation-header.component.html',
  styleUrls: ['./contract-negotiation-header.component.scss']
})
export class ContractNegotiationHeaderComponent implements OnInit {
  @Input() rfqSent;
  @Input() noQuote;
  @ViewChild('inputBox2') _el2: ElementRef;
  @ViewChild('inputSearch') inputSearch: ElementRef;
  @ViewChild(ContractNegotiationDetailsComponent) child: ContractNegotiationDetailsComponent;
  @ViewChild(OfferChatComponent) childChat: OfferChatComponent;
  @ViewChild('ports') ports: ElementRef;
  @Output() contractRequestStatus = new EventEmitter<string>();
  @ViewChild('menuTrigger') trigger;    
    
  allRequestDetails = {};
  allRequestComments = [];
  contractReq;
  requestOptions = [
    {
      request: '10001', requestId: '10001'
    }
  ];
  gridDataSets = [];
  counterpartyColumns: string[] = ['counterparty', 'blank'];
  counterpartyList;
  selReqIndex = 0;
  expandedSearch: boolean = false;
  chatAvailable:boolean = false
  searchText: string = "";
  masterData: any;
  contractRequestId : String;
  uniqueLocationNames : String = ''; 
  totalReqQty;
  counterpartyBackup;
  

  constructor(
    private localService: LocalService,
    public dialog: MatDialog,
    public store : Store,
    public contractService: ContractNegotiationService,
    private route: ActivatedRoute,
    public format: TenantFormattingService,
    private ref: ChangeDetectorRef,
    private spotNegotiationService: SpotNegotiationService,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
    
    const contractRequestIdFromUrl = this.route.snapshot.params.requestId;
    if(contractRequestIdFromUrl && isNumeric(contractRequestIdFromUrl)){
      const contractRequestIdFromUrl = this.route.snapshot.params.requestId;
      var payload = {
       ?? "contractRequestId": contractRequestIdFromUrl
       };
      this.contractService.getContractRequestOfferChat(payload)
      .subscribe(response => {
        if(response.length > 0){
          this.chatAvailable = true;
        }else{
          this.chatAvailable = false;
        }
      });
      this.getCounterpartyList();
      this.contractService.getContractRequestDetails(contractRequestIdFromUrl)
      .subscribe(response => {
        this.contractRequestId = response['id'];
        this.contractRequestStatus.emit(response['status']);
        this.localService.contractRequestDetails = JSON.parse(JSON.stringify(response));
        this.localService.getMasterDataList().then(data => {
          this.masterData = data;
          this.localService.masterData = data;
          this.localService.contractRequestData(response).then( () => {
            this.uniqueLocationNames = this.localService.uniqueLocations;
            this.allRequestDetails[0] = this.localService.allRequestDetails;
            this.ref.markForCheck();
           
          });

          if(response['quantityDetails'] && response['quantityDetails'].length > 0){
              this.totalRequestQty(JSON.parse(JSON.stringify(response)));
          } 
        });
      
      // this.localService.getMasterListData(['BrokerWithInactive','SellerWithInactive','SupplierWithInactive','ServiceProviderWithInactive']).subscribe(data => {
      //   let mergeArray = [
      //     ...data['BrokerWithInactive'],
      //     ...data['SellerWithInactive'],
      //     ...data['SupplierWithInactive'],
      //     ...data['ServiceProviderWithInactive']
      //   ];
      //   setTimeout(() => {
      //    // this.localService.masterData['Counterparty'] = this.masterData['Counterparty'] = mergeArray;
            
      //   }, 100);
      // });
      });
    }
  
  }

  updatechatAvailableStatus(chatStatus:boolean){
      this.chatAvailable = chatStatus;
  }  

  totalRequestQty(response){
    let minMaxDet =  response['quantityDetails']?.find(el => el.contractualQuantityOptionId == 1);
    let ContractualQuantityOption = this.masterData['Uom']?.find(el => el.id == minMaxDet.uomId);
    this.totalReqQty = minMaxDet;
    this.totalReqQty['uomId'] = ContractualQuantityOption.name;
  }
 
  filterCounterParty(filterValuelue : string){
      this.counterpartyList = this.localService.filterCounterParty(filterValuelue);
  }

  getCounterpartyList(): void {
    const response = this.spotNegotiationService.getResponse(null, { Filters: [] }, { SortList: [] }, [{ ColumnName: 'CounterpartyTypes', Value: '1,2,3,11' }], null, { Skip:0, Take: 25 })
    response.subscribe((res: any) => {
      if(res?.message == 'Unauthorized'){
        return;
      }
      if (res?.error) {
        console.log('Handle Error');
        return;
      } else {
        if (res?.payload?.length > 0) {
          this.spotNegotiationService.counterpartyTotalCount = res.matchedCount;
          res.payload.forEach(element => {
            element.isSelected = false;
            element.name = this.format.htmlDecode(element.name);
          });
        }
        // Populate Store
        this.store.dispatch(new SetCounterpartyList(res.payload));
      }
    });
  }
  setFocus() {
    this.store.selectSnapshot((state: SpotNegotiationStoreModel) => {      
      this.counterpartyList = this.localService.limitCounterPartyList(
        JSON.parse(JSON.stringify(state['spotNegotiation'].counterpartyList))
        );
    });
    this._el2.nativeElement.focus();
    this._el2.nativeElement.value = '';
    this.contractService.selectedCounterparty = {};
  }

  constructUpdateCounterparties(){
  if(Object.keys(this.contractService.selectedCounterparty).length > 0){ 
  this.contractService.newlyAddedCounterparty = [];
  this.contractService.constructUpdateCounterparties()?.subscribe(res => {
    const contractRequestIdFromUrl = this.route.snapshot.params.requestId;
    this.contractService.getContractRequestDetails(contractRequestIdFromUrl)
    .subscribe(response => {
      if(response.status != 'Open'){
        this.localService.selectNewlyAddedCounterParty(response,this.contractService.newlyAddedCounterparty)
        .then((selectedResponse)=>{
          this.localService.contractRequestData(selectedResponse);
        });
      }else{
        this.localService.contractRequestData(response);
      }
    });
  });
  }else{
    this.toastr.error("Please Select atleast One Counterparty");
  }
  }
  

  showSearch() {
    setTimeout(() => {
      this.inputSearch.nativeElement.focus();
    }, 0);
    this.counterpartyBackup = this.store.selectSnapshot((state: ContractNegotiationStoreModel) => {
      return state['contractNegotiation'].ContractRequest[0].locations;
   });
  }
  searchInput() {
    // this.expandedSearch = false;
    //this.child.onClearSearchCounterparty();
  }
  openRequest() {
    this.contractService.getContractRequestDetails(this.route.snapshot.params.requestId)
    .subscribe(response => {
      if(response?.message === 'Unauthorized') { return; }
      this.localService.contractRequestDetails = JSON.parse(JSON.stringify(response));
      const dialogRef = this.dialog.open(CreateContractRequestPopupComponent, {
        width: '1136px',
        minHeight: '90vh',
        maxHeight: '100vh',
        panelClass: ['additional-cost-popup', 'supplier-contact-popup'],
        data: { createReqPopup:false,rfqStatus: this.rfqSent, contractRequestDetails: JSON.parse(JSON.stringify(response)), requestId: this.route.snapshot.params.requestId }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result == true) return;
        const contractRequestIdFromUrl = this.route.snapshot.params.requestId;
        this.contractService.getContractRequestDetails(contractRequestIdFromUrl)
        .subscribe(response => {
          if(response?.message === 'Unauthorized') { return; }
          this.localService.contractRequestDetails = JSON.parse(JSON.stringify(response));
          this.localService.contractRequestData(response).then(() => {
            this.uniqueLocationNames = this.localService.uniqueLocations;
            this.allRequestDetails[0] = this.localService.allRequestDetails;
          })
          this.totalRequestQty(JSON.parse(JSON.stringify(response)));
        });
      });
    });
  }
  searchCounterpartyLookUp(){
    this.trigger.closeMenu();
    this.contractService.selectedCounterparty = {};
    const dialogRef = this.dialog.open(SearchAllCounterpartiesComponent, {
      width: '100vw',
      height: '95vh',
      maxWidth: '95vw',
      panelClass: 'search-request-popup',
      data: {
        AddCounterpartiesAcrossLocations: true,
        source : 'contract-negotation'
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res.data){
        res.data.forEach(el => {
          this.contractService.selectedCounterparty[el.id] = el;
        });
        this.constructUpdateCounterparties();
      }
    });
  }

  scrollPort1(index, el, count) {
    this.child.scrollPortToggle(index);
    let portVal = "port" + el;
    let portId = "#" + portVal;
    var ele = this.ports.nativeElement.querySelector(portId);
    setTimeout(()=>{ 
    ele.scrollIntoView();
    },500);

    /* let portVal = "port" + el;
    let portId = "#" + portVal;
    var ele = this.ports.nativeElement.querySelector(portId);
    ele.scrollIntoView(); */
  }
  scrollComments(el: HTMLElement) {
    el.scrollIntoView();
    this.childChat.toggleChat();
    this.child.panelClosed();
    //el.scrollIntoView();
  }

  clearCounterparty(event) {
    if (event.target.value == '') {
      this.store.dispatch(new ContractRequest([{'locations' : this.counterpartyBackup}]));
    }
  }
  searchCounterparty(userInput: string) {
    let filterData = JSON.parse(JSON.stringify(this.counterpartyBackup));
    for(let inc = 0; inc < filterData.length; inc++ ){
     filterData[inc].data = [];
    }
    this.counterpartyBackup.filter((el,index) => {
      filterData[index].data =  el['data'].filter((inner) => {
        if(inner.CounterpartyName?.toLowerCase().includes(userInput.toLocaleLowerCase())){
          return inner;
        }
      });
    })
    this.store.dispatch(new ContractRequest([{'locations' : filterData}]));
  
  }

 
}



