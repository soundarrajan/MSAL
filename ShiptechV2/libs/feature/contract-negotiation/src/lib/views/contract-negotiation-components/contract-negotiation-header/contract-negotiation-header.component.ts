import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { forkJoin } from 'rxjs';
import { LocalService } from '../../../services/local-service.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateContractRequestPopupComponent } from '../contract-negotiation-popups/create-contract-request-popup/create-contract-request-popup.component';
import { ContractNegotiationDetailsComponent } from '../contract-negotiation-details/contract-negotiation-details.component';
import { OfferChatComponent } from '../offer-chat/offer-chat.component';
import { Select, Store } from '@ngxs/store';
import { isNumeric } from 'rxjs/internal-compatibility';
import { ContractNegotiationService } from '../../../services/contract-negotiation.service';
import { ActivatedRoute } from '@angular/router';
import { ContractRequest } from '../../../store/actions/ag-grid-row.action';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
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
  @Output() disbaleHeaderButtons = new EventEmitter<boolean>();
    
    
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
  chatAvailable:boolean = true
  searchText: string = "";
  masterData: any;
  contractRequestId : String;
  uniqueCounterPartyName : String; 
  totalReqQty;
  

  constructor(
    private localService: LocalService,
    public dialog: MatDialog,
    public store : Store,
    public contractService: ContractNegotiationService,
    private route: ActivatedRoute,
    public format: TenantFormattingService,
    ) { }

  ngOnInit(): void {
    const contractRequestIdFromUrl = this.route.snapshot.params.requestId;
    if(contractRequestIdFromUrl && isNumeric(contractRequestIdFromUrl)){
      this.contractService.getContractRequestDetails(contractRequestIdFromUrl)
      .subscribe(response => {
            this.contractRequestId = response['id'];
            this.localService.contractRequestDetails = JSON.parse(JSON.stringify(response));
            this.localService.getMasterListData(['Counterparty','Product','Location','Uom']).subscribe(data => {
            this.masterData = data;
            this.localService.masterData = data;
            this.contractRequestData(response);
            if(response['quantityDetails'].length > 0){
              this.totalRequestQty(response);
            }           
      });
      });
    }
    this.getJSONData();
  }

  totalRequestQty(response){
    let minMaxDet =  response['quantityDetails'].find(el => el.contractualQuantityOptionId == 1);
    let ContractualQuantityOption = this.masterData['Uom'].find(el => el.id == minMaxDet.uomId);
    this.totalReqQty = minMaxDet;
    this.totalReqQty['uomId'] = ContractualQuantityOption.name;
  }

 
  filterCounterParty(filterValuelue : string){
    this.counterpartyList = this.localService.filterCounterParty(filterValuelue);
  }

  contractRequestData(response){
    let  contractArray = { locations : []};
    let arrDet = {};
    let data = [];
    let arrMainDet = {};
    let uniqueCounterParty = [];
        Object.entries(response['contractRequestProducts']).forEach(([key, res1]) => {
         //this.contractArray['request-id'] = '001';
          let location = this.masterData['Location'].find(el => el.id == res1['locationId']);
          let mainProduct = this.masterData['Product'].find(el => el.id == res1['productId']);
          uniqueCounterParty.push(location.name);
          Object.entries(res1['contractRequestProductOffers']).forEach(([key, res2]) => {
          this.disbaleHeaderButtons.emit(false);
          let counterparty = this.masterData['Counterparty'].find(el => el.id == res2['counterpartyId']);
          let product = this.masterData['Product'].find(el => el.id == res2['productId']);           
            arrDet = {
              "check": res2['isSelected'],
              "id": res2['id'],
              "LocationId": res1['locationId'],
              "ProductId": res2['productId'],
              "isSellerSuspended": res2['isSellerSuspended'],
              //"ProductName": product?.displayName,
              "requestLocationId": '',
              "requestProductId": '',
              "RequestLocationSellerId": '',
              "CounterpartyName": this.format.htmlDecode(counterparty.name),
              "CounterpartyId": res2['counterpartyId'],
              "IsTemporarlySuspended": '',
              "GenRating": res2['genRating'],
              "PortRating": res2['portRating'],
              "QuotedProductId": '',
              "SpecGroupId": '',
              "SpecGroupName": "",
              //"MinQuantity": res2['minQuantity'],
              //"MaxQuantity": res2['maxQuantity'],
              "UomId": '',
              //"OfferPrice": res2['offerPrice'],
              "PriceCurrencyId": '',
              "PriceCurrencyName": "",
              "ValidityDate": "",
              "Status": "OfferCreated",
              "M1": '',
              "M2": '',
              "M3": '',
              "M4": '',
              "M5": '',
              "M6": '',
              "Q1": '',
              "Q2": '',
              "Q3": '',
              "Q4": '',
              "fdProduct": "",
              "fdTotalContractAmt": "",
              "fdFomulaDesc": "",
              "fdSchedule": "",
              "fdPremium": "",
              "fdAddCosts": "",
              "fdRemarks": ""
            }
            data.push(arrDet);
            arrDet = {};
          });
          let contractualQuantityOption = this.masterData['Uom'].find(el => el.id == res1['maxQuantityUomId']);
          arrMainDet = {
            'data' : data,
            "location-name": location.name,
            "location-id": res1['locationId'],
            "port-id": "1",
            "period": "M",
            "productId" : res1['productId'],
            "productName" : mainProduct.name,
            "minQuantity" : res1['minQuantity'],
            "maxQuantity" : res1['maxQuantity'],
            "contractualQuantityOption" : contractualQuantityOption.name,
            "contractRequestProductId" : res1['id']
          }
          contractArray['locations'].push(arrMainDet);
          arrMainDet = {}; data = [];
        });    
        
        let unique = [...new Set(uniqueCounterParty)];       
        this.uniqueCounterPartyName = unique.toString();
        this.allRequestDetails[0] = contractArray;
        this.store.dispatch(new ContractRequest([contractArray]));
    }

  setFocus() {
    this.localService.getMasterListData(['Counterparty']).subscribe(data => {
      this.counterpartyList = this.localService.limitCounterPartyList(data['Counterparty']);
    }); 
    this._el2.nativeElement.focus();
    this._el2.nativeElement.value = '';
    this.contractService.selectedCounterparty = {};
  }

  constructUpdateCounterparties(){
    this.contractService.constructUpdateCounterparties().subscribe(res => {
      const contractRequestIdFromUrl = this.route.snapshot.params.requestId;
      this.contractService.getContractRequestDetails(contractRequestIdFromUrl)
      .subscribe(response => {
        this.localService.contractRequestData(response);
      });
    });
  }
  

  showSearch() {
    setTimeout(() => {
      this.inputSearch.nativeElement.focus();
    }, 0);
  }
  searchInput() {
    // this.expandedSearch = false;
    //this.child.onClearSearchCounterparty();
  }
  openRequest() {
    const dialogRef = this.dialog.open(CreateContractRequestPopupComponent, {
      width: '1136px',
      minHeight: '90vh',
      maxHeight: '100vh',
      panelClass: ['additional-cost-popup', 'supplier-contact-popup'],
      data: { createReqPopup:false,rfqStatus: this.rfqSent, requestDetails: this.localService.contractRequestDetails }
    });

    dialogRef.afterClosed().subscribe(result => {
      const contractRequestIdFromUrl = this.route.snapshot.params.requestId;
      this.contractService.getContractRequestDetails(contractRequestIdFromUrl)
      .subscribe(response => {
        this.localService.contractRequestDetails = JSON.parse(JSON.stringify(response));
        this.contractRequestData(response);
        this.totalRequestQty(response);
      });
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
      this.child.onClearSearchCounterparty();
    }
  }
  searchCounterparty(userInput: string) {
    //console.log(e);
    //this.child.onSearchCounterparty(e);

    // this.store.selectSnapshot((state: ContractNegotiationStoreModel) => {
    //   state['contractNegotiation'].ContractRequest[0].locations.find(el => {
    //     if(el['location-id'] == this.locationId && el.productId == this.productId){
    //       this.gridOptions_forecast.api.setRowData(el.data);
    //     }
    //   })
    // });
    

    // if (userInput.length === 0) {
    //   const locationsRowsOriData = this.store.selectSnapshot(
    //     (state: contractNegotiation) => {
    //       return state['spotNegotiation'].LocationsOriData;
    //     }
    //   );
    //   this.store.dispatch(new SetLocationsRows(locationsRowsOriData));
    // } else {
    //   let result = this.store
    //     .selectSnapshot((state: contractNegotiation) => {
    //       return state['spotNegotiation'].LocationsOriData;
    //     })
    //     .filter(e => {
    //       if (
    //         e.sellerCounterpartyName
    //           .toLowerCase()
    //           .includes(userInput.toLowerCase())
    //       ) {
    //         return true;
    //       }
    //       return false;
    //     });
    //   this.store.dispatch(new SetLocationsRows(result));
    // }

  }

  // ************************** Need to remove code after testing ***************** start
   private getJSONData() {
  //   debugger;
  //   let allRequestDetails = [];
  //   var allRequestDetailsObservable = [];
     var allRequestCommentsObservable = [];
  //   var allRequestLocationObservable = [];
    this.requestOptions.forEach(r => {
      //allRequestDetailsObservable.push(this.localService.getContractRequestData(r.requestId));
      allRequestCommentsObservable.push(this.localService.getContractNegoChatData(r.requestId));
    });

  //   forkJoin(allRequestDetailsObservable).subscribe(res => {
  //     debugger;
  //     console.log(res);
  //     this.allRequestDetails = res;
  //     allRequestDetails.forEach(req => req.locations.forEach(loc => {
  //       allRequestLocationObservable.push(this.localService.getContractNegoJSON(req['request-id'], loc['location-id']));
  //       this.localService.getContractNegoJSON(req['request-id'], loc['location-id']).subscribe(data => {
  //         loc['data'] = data;
  //       });
  //     }
  //     ));
  //   })
    
    forkJoin(allRequestCommentsObservable).subscribe(res => {
      this.allRequestComments = res;
      if(this.allRequestComments[0].length > 0){
        this.chatAvailable = true;
      }else{
        this.chatAvailable = false;
      }
      
    });
    
    }
  // ************************** Need to remove code after testing ***************** end

}
