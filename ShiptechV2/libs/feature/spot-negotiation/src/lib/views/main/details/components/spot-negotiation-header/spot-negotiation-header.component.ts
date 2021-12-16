import {
  Component,
  ElementRef,
  OnInit,
  Output,
  Renderer2,
  AfterViewInit,
  ViewChild,
  EventEmitter,
  Input
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import { Store } from '@ngxs/store';
import { SpnegoAddCounterpartyModel } from 'libs/feature/spot-negotiation/src/lib/core/models/spnego-addcounterparty.model';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
import { ToastrService } from 'ngx-toastr';
import { AddCounterpartyToLocations, SetLocations, SetLocationsRows } from '../../../../../store/actions/ag-grid-row.action';
import { SetCurrentRequestSmallInfo } from '../../../../../store/actions/request-group-actions';
import { SearchRequestPopupComponent } from '../spot-negotiation-popups/search-request-popup/search-request-popup.component';
import { SpotnegoSearchCtpyComponent } from '../spot-negotiation-popups/spotnego-counterparties/spotnego-searchctpy.component';
@Component({
  selector: 'app-spot-negotiation-header',
  templateUrl: './spot-negotiation-header.component.html',
  styleUrls: ['./spot-negotiation-header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpotNegotiationHeaderComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContainer') container: ElementRef;
  @ViewChild('requestContainer') requestcontainer: ElementRef;
  @ViewChild('inputSearch') inputSearch: ElementRef;

  // Current request;
  locations = [];
  selReqIndex = 0;
  selectAll: boolean = true;
  availWidth: any;
  requestOptions: any;
  //showAddReq: boolean = false;
  displayVessel: boolean = false;
  expandedSearch: boolean = false;
  selectedRequest = '';
  expandRequestPopUp: boolean = false;
  displayedColumns: string[] = ['request', 'vessel'];
  counterpartyColumns: string[] = ['counterparty', 'blank'];
  counterpartyList: any = [];
  visibleCounterpartyList: any = [];
  selectedCounterparty: any = [];
  currentRequestInfo:any;

  requestsAndVessels = [
    { request: 'Demo Req 100001', vessel: 'MerinLion', selected: false },
    { request: 'Demo Req 100002', vessel: 'Afif', selected: false },
    { request: 'Demo Req 100003', vessel: 'Al Mashrab', selected: false },
    { request: 'Demo Req 100004', vessel: 'Afif', selected: false },
    { request: 'Demo Req 100005', vessel: 'MerinLion', selected: false },
    { request: 'Demo Req 100006', vessel: 'Afif', selected: false },
    { request: 'Demo Req 100007', vessel: 'MerinLion', selected: false },
    { request: 'Demo Req 100008', vessel: 'Al Mashrab', selected: false }
  ];
  isLoadpage: boolean = false;
  locationsRows: any;
  currentRequestData: any[];

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private _spotNegotiationService: SpotNegotiationService,
    private renderer: Renderer2,
    public dialog: MatDialog,
    private changeDetector: ChangeDetectorRef
  ) {
    // Set observable;
  }

  @Output() selectionChange: EventEmitter<any> = new EventEmitter<any>();
  ngOnInit(): void {
    // Get data from store;

    setTimeout(() => {
      this.store.subscribe(({ spotNegotiation }) => {
        this.requestOptions = spotNegotiation.requests;
        this.locationsRows=spotNegotiation.locationsRows;
        this.currentRequestInfo = spotNegotiation.currentRequestSmallInfo;
        if (spotNegotiation.currentRequestSmallInfo) {
          this.locations = spotNegotiation.currentRequestSmallInfo.requestLocations;
          if (this.counterpartyList.length === 0 && spotNegotiation.counterpartyList) {
            this.counterpartyList = spotNegotiation.counterpartyList;
            this.visibleCounterpartyList = this.counterpartyList.slice(0, 7);
          }
        }
      });
    }, 100);
  }



  removeRequest(i) {
    alert('asd');
  }

  onCounterpartyCheckboxChange(checkbox: any, element: any): void {
    if (checkbox.checked) {
      // Add to selected counterparty list
      this.selectedCounterparty.push(element);
    }

    if (!checkbox.checked) {
      // Remove from selected counterparty list
      this.selectedCounterparty = this.selectedCounterparty.filter(
        e => e.id !== element.id
      );
    }
  }

  toBeAddedCounterparties(): SpnegoAddCounterpartyModel[] {
    if (this.requestOptions) {
      let selectedCounterparties = [];

      //current RequestGroupId
      let RequestGroupId = parseInt(this.requestOptions[0].requestGroupId);

      //Looping through all the Request Locations
      this.requestOptions[0].requestLocations.forEach(reqLoc => {
        let perLocationCtpys = this.selectedCounterparty.map(
          val =>
            <SpnegoAddCounterpartyModel>{
              requestGroupId: RequestGroupId,
              requestLocationId: reqLoc.id,
              locationId: reqLoc.locationId,
              id: 0,
              name: '',
              counterpartytypeId: 0,
              counterpartyTypeName: (val.seller)? 'Seller': (val.supplier)? 'Supplier' : (val.broker)? 'Broker' : (val.sludge)? 'Sludge' : '',
              genPrice: '',
              genRating: '',
              isDeleted: false,
              isSelected: true,
              mail: '',
              portPrice: '',
              portRating: '',
              prefferedProductIds: '',
              sellerComments: '',
              sellerCounterpartyId: val.id,
              sellerCounterpartyName: val.name,
              senRating: ''
            }
        );
        selectedCounterparties.push(...perLocationCtpys);
      });

      return selectedCounterparties;
    } else {
      return Array<SpnegoAddCounterpartyModel>();
    }
  }

  addCounterpartyAcrossLocations() {
    const selectedCounterparties = this.toBeAddedCounterparties();
    if (selectedCounterparties.length == 0) return;

    const RequestGroupId = this.route.snapshot.params.spotNegotiationId;
    let payload = {
      requestGroupId: parseInt(RequestGroupId),
      requestId: this.currentRequestInfo.id,
      isAllLocation: true,
      counterparties: selectedCounterparties
    };

    const response = this._spotNegotiationService.addCounterparties(payload);
    response.subscribe((res: any) => {
      if (res.status) {
        debugger;
        this.toastr.success(res.message);
        // Add in Store
        // this.store.dispatch(
        //   new AddCounterpartyToLocations(res.counterparties)
        // );
        //if(res.sellerOffers?.length>0){
        const futureLocationsRows = this.getLocationRowsWithPriceDetails(
          res.counterparties,
          res.sellerOffers
         );
        // this.store.dispatch(new AddCounterpartyToLocationsWithOffers(futureLocationsRows));
        // }
        // else
        this.store.dispatch(new AddCounterpartyToLocations(futureLocationsRows));
      } else {
        this.toastr.error(res.message);
        return;
      }
    });
  }

  UpdateProductsSelection(requestLocations, row){
    if(requestLocations.length != 0){
      let currentLocProdCount = requestLocations[0].requestProducts.length;
      for (let index = 0; index < currentLocProdCount; index++) {
        let indx = index +1;
        let val = "checkProd" + indx;
        const status = requestLocations[0].requestProducts[index].status;
        row[val] =  status === 'Stemmed' || status === 'Confirmed'? false : row.isSelected;
        //row[val] = row.isSelected;
      }
    }
   }

  getLocationRowsWithPriceDetails(rowsArray, priceDetailsArray) {
    let counterpartyList : any;
    this.store.subscribe(({ spotNegotiation, ...props }) => {
      this.currentRequestData = spotNegotiation.locations;
      counterpartyList = spotNegotiation.counterpartyList;
    });

    rowsArray.forEach((row, index) => {
      //let row = { ... reqLocSeller };
      let currentLocProd= this.currentRequestData.filter(row1 => row1.locationId == row.locationId);
      this.UpdateProductsSelection(currentLocProd,row);
      // Optimize: Check first in the same index from priceDetailsArray; if it's not the same row, we will do the map bind
      if (
        index < priceDetailsArray?.length &&
        row.id ===
        priceDetailsArray[index]?.requestLocationSellerId
      ) {
        row.requestOffers = priceDetailsArray[index].requestOffers;
        row.requestOffers.forEach(element1 => {
          if (
            element1.requestProductId != undefined &&
            element1.requestProductId != null &&
            this.currentRequestData?.length > 0
          ) {
            if (
              currentLocProd.length > 0 &&
              currentLocProd[0].requestProducts.length > 0
            ) {
              let FilterProdut = currentLocProd[0].requestProducts.filter(
                col => col.id == element1.requestProductId
              );
              if (
                FilterProdut.length > 0 &&
                FilterProdut[0].status != undefined &&
                FilterProdut[0].status == 'Stemmed'
              ) {
                row.isEditable = true;
              }
            }
          }
        });
        row.isSelected = priceDetailsArray[index].isSelected;
        row.physicalSupplierCounterpartyId =  priceDetailsArray[index].physicalSupplierCounterpartyId;
        if(priceDetailsArray[index].physicalSupplierCounterpartyId){
            row.physicalSupplierCounterpartyName = counterpartyList.find(x=>x.id == priceDetailsArray[index].physicalSupplierCounterpartyId).displayName;
        }
        row.totalOffer = priceDetailsArray[index].totalOffer;
        return row;
      }

      // Else if not in the same index
  if(priceDetailsArray != undefined && priceDetailsArray?.length >0){
      const detailsForCurrentRow = priceDetailsArray?.filter(
        e => e?.requestLocationSellerId === row.id
      );

      // We found something
      if (detailsForCurrentRow.length > 0) {
        row.requestOffers = detailsForCurrentRow[0].requestOffers;
        row.requestOffers.forEach(element1 => {
          if (
            element1.requestProductId != undefined &&
            element1.requestProductId != null &&
            this.currentRequestData?.length > 0
          ) {
            if (
              currentLocProd.length > 0 &&
              currentLocProd[0].requestProducts.length > 0
            ) {
              let FilterProdut = currentLocProd[0].requestProducts.filter(
                col => col.id == element1.requestProductId
              );
              if (
                FilterProdut.length > 0 &&
                FilterProdut[0].status != undefined &&
                FilterProdut[0].status == 'Stemmed'
              ) {
                row.isEditable = true;
              }
            }
          }
        });
        row.isSelected = detailsForCurrentRow[0].isSelected;
        row.physicalSupplierCounterpartyId =  detailsForCurrentRow[0].physicalSupplierCounterpartyId;
        if(detailsForCurrentRow[0].physicalSupplierCounterpartyId){
        row.physicalSupplierCounterpartyName = counterpartyList.find(x=>x.id == detailsForCurrentRow[0].physicalSupplierCounterpartyId).displayName;}
        row.totalOffer = detailsForCurrentRow[0].totalOffer;
      }
  }


      return row;
    });

    return rowsArray;
  }


  addToCheckboxOptions() {
    var selectedVessel = this.requestsAndVessels.filter(
      item => item.selected == true
    );
    for (var val of selectedVessel) {
      this.locations.push({
        'location-name': 'ROTTERDAM',
        'location-id': '1234',
        'port-id': '1'
      });
      const arrayIndex = this.requestsAndVessels.indexOf(val);
      this.requestsAndVessels.splice(arrayIndex, 1);
    }
    setTimeout(() => {
      var headerWidth = this.container.nativeElement.offsetWidth;
      var reqWidth = this.requestcontainer.nativeElement.offsetWidth;
      this.availWidth = headerWidth - reqWidth;
      if (this.availWidth < 150) {
        this.displayVessel = true;
      } else {
      }
    }, 0);
    this.selectedRequest = '';
  }

  selectRequest(event, i, selected) {
    event.preventDefault();
    this.selReqIndex = i;

    // Stop if clicked on same request;
    if (this.selReqIndex != i) {
      return null;
    }
    // Set current request
    this.store.dispatch(new SetCurrentRequestSmallInfo(selected));
    this.store.dispatch(new SetLocations(selected.requestLocations))
    var obj = {
      selReqIndex: i
    };
    this.selectionChange.emit(obj);
  }

  openRequestPopup() {
    const dialogRef = this.dialog.open(SearchRequestPopupComponent, {
      width: '100vw',
      height: '95vh',
      maxWidth: '95vw',
      panelClass: 'search-request-popup'
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  openCounterpartyPopup() {
    const RequestGroupId = this.route.snapshot.params.spotNegotiationId;

    const dialogRef = this.dialog.open(SpotnegoSearchCtpyComponent, {
      width: '100vw',
      height: '95vh',
      maxWidth: '95vw',
      panelClass: 'search-request-popup',
      data: {
        AddCounterpartiesAcrossLocations: true,
        RequestGroupId: parseInt(RequestGroupId)
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  search(userInput: string): void {
    this.expandedSearch = false;

    this.visibleCounterpartyList = this.counterpartyList
      .filter(e => {
        if (e.name.toLowerCase().includes(userInput.toLowerCase())) {
          return true;
        }
        return false;
      })
      .slice(0, 7);
  }

  limitStrLength = (text, max_length) => {
    if (text.length > max_length - 3) {
      return text.substring(0, max_length).trimEnd() + '...';
    }

    return text;
  };

  showSearch() {
    setTimeout(() => {
      this.inputSearch.nativeElement.focus();
    }, 0);
  }

  searchCounterparty(userInput: string): void {
    if(userInput!==''){
      let result = this.locationsRows
      .filter(e => {
        if (e.sellerCounterpartyName.toLowerCase().includes(userInput.toLowerCase())) {
          return true;
        }
        return false;
      });
      this.store.dispatch(new SetLocationsRows(result));
    }
   else{
        return;
   }
  }

  scrollPort1(el: HTMLElement) {
    el.scrollIntoView();
  }

  scrollComments(el: HTMLElement) {
    el.scrollIntoView();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      //this.inputSearch.nativeElement.focus();
    }, 0);
  }

  openRequestTab(event: any, request: any) {
    event.preventDefault();
    event.stopPropagation();
    const baseOrigin = new URL(window.location.href).origin;
    window.open(`${baseOrigin}/#/edit-request/${request.id}`, '_blank');
  }
}
