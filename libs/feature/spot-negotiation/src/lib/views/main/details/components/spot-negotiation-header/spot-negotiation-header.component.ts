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
import {
  AddCounterpartyToLocations,
  SetLocations,
  SetLocationsRows
} from '../../../../../store/actions/ag-grid-row.action';
import {
  SetCurrentRequestSmallInfo,
  SetAvailableContracts,
  AddRequest
} from '../../../../../store/actions/request-group-actions';
import { SpotNegotiationStoreModel } from 'libs/feature/spot-negotiation/src/lib/store/spot-negotiation.store';

import { SearchRequestPopupComponent } from '../spot-negotiation-popups/search-request-popup/search-request-popup.component';
import { SpotnegoSearchCtpyComponent } from '../spot-negotiation-popups/spotnego-counterparties/spotnego-searchctpy.component';
import { ConfirmdialogComponent } from '../spot-negotiation-popups/confirmdialog/confirmdialog.component';
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
  selectedRequestList: any = [];
  currentRequestInfo: any;
  requestsAndVessels: any = [];
  visibleRequestList: any = [];

  // requestsAndVessels = [
  //   { request: 'Demo Req 100001', vessel: 'MerinLion', selected: false },
  //   { request: 'Demo Req 100002', vessel: 'Afif', selected: false },
  //   { request: 'Demo Req 100003', vessel: 'Al Mashrab', selected: false },
  //   { request: 'Demo Req 100004', vessel: 'Afif', selected: false },
  //   { request: 'Demo Req 100005', vessel: 'MerinLion', selected: false },
  //   { request: 'Demo Req 100006', vessel: 'Afif', selected: false },
  //   { request: 'Demo Req 100007', vessel: 'MerinLion', selected: false },
  //   { request: 'Demo Req 100008', vessel: 'Al Mashrab', selected: false }
  // ];
  isLoadpage: boolean = false;
  locationsRows: any;
  currentRequestData: any[];
  locationsRowsOriData: any[];
  availableContracts = {};
  initAvailableContracts : any;
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
        if (this.requestOptions.length > 6) {
          this.displayVessel = true;
        }
        if (spotNegotiation.RequestList.length > 0) {
          this.requestsAndVessels = this.removeDuplicatesRequest(
            spotNegotiation.RequestList,
            'requestName'
          );
        }
        this.visibleRequestList = this.requestsAndVessels.slice(0, 7);
        this.locationsRows = spotNegotiation.locationsRows;
        this.currentRequestInfo = spotNegotiation.currentRequestSmallInfo;
        if (spotNegotiation.currentRequestSmallInfo) {
          this.locations =
            spotNegotiation.currentRequestSmallInfo.requestLocations;
            if (
            this.counterpartyList.length === 0 &&
            spotNegotiation.counterpartyList
            ) {
              this.counterpartyList = spotNegotiation.counterpartyList;
              this.visibleCounterpartyList = this.counterpartyList.slice(0, 7);
            }
          }
          if(!this.initAvailableContracts && this.currentRequestInfo) {
            this.initAvailableContracts = true;
            this.getBestContractForCurrentRequest(this.currentRequestInfo.id)
          }
        });
    }, 100);
  }

  delinkRequest(item) {
    if(item.status.toLowerCase().includes("stemmed")) {
      this.toastr.error("Request cannot be delinked as an order has already been created.");
      return;
    }
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      width: '500px',
      height: '250px',
      maxWidth: '500px',
      panelClass: 'confirm-dialog',
      data: {
        message: "Are you sure you want de-link the request?",
      }
    });   
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        alert("yes");
        const RequestGroupId = this.route.snapshot.params.spotNegotiationId;
        let payload = {
          groupId: parseInt(RequestGroupId),
          requestId: item.id,
        };
    
        const response = this._spotNegotiationService.delinkRequest(payload);  
        response.subscribe((res: any) => {
          console.log(res)
        });      
      } else {
        alert("nope");        
      }
    }); 
  }

  removeDuplicatesRequest(array, key) {
    return array.reduce((arr, item) => {
      const removed = arr.filter(i => i[key] !== item[key]);
      return [...removed, item];
    }, []);
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
  onRequestListCheckboxChange(checkbox: any, element: any) {
    if (checkbox.checked) {
      this.selectedRequestList.push(element);
    }

    if (!checkbox.checked) {
      this.selectedRequestList = this.selectedRequestList.filter(
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
              counterpartyTypeName: val.seller
                ? 'Seller'
                : val.supplier
                ? 'Supplier'
                : val.broker
                ? 'Broker'
                : val.sludge
                ? 'Sludge'
                : '',
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
        this.store.dispatch(
          new AddCounterpartyToLocations(futureLocationsRows)
        );
      } else {
        this.toastr.error(res.message);
        return;
      }
    });
  }

  UpdateProductsSelection(requestLocations, row) {
    if (requestLocations.length != 0) {
      let currentLocProdCount = requestLocations[0].requestProducts.length;
      for (let index = 0; index < currentLocProdCount; index++) {
        let indx = index + 1;
        let val = 'checkProd' + indx;
        const status = requestLocations[0].requestProducts[index].status;
        row[val] =
          status === 'Stemmed' || status === 'Confirmed'
            ? false
            : row.isSelected;
        //row[val] = row.isSelected;
      }
    }
  }

  getLocationRowsWithPriceDetails(rowsArray, priceDetailsArray) {
    let counterpartyList: any;
    this.store.subscribe(({ spotNegotiation, ...props }) => {
      this.currentRequestData = spotNegotiation.locations;
      counterpartyList = spotNegotiation.counterpartyList;
    });

    rowsArray.forEach((row, index) => {
      //let row = { ... reqLocSeller };
      let currentLocProd = this.currentRequestData.filter(
        row1 => row1.locationId == row.locationId
      );
      this.UpdateProductsSelection(currentLocProd, row);
      // Optimize: Check first in the same index from priceDetailsArray; if it's not the same row, we will do the map bind
      if (
        index < priceDetailsArray?.length &&
        row.id === priceDetailsArray[index]?.requestLocationSellerId
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
        row.physicalSupplierCounterpartyId =
          priceDetailsArray[index].physicalSupplierCounterpartyId;
        if (priceDetailsArray[index].physicalSupplierCounterpartyId) {
          row.physicalSupplierCounterpartyName = counterpartyList.find(
            x => x.id == priceDetailsArray[index].physicalSupplierCounterpartyId
          ).displayName;
        }
        row.totalOffer = priceDetailsArray[index].totalOffer;
        row.totalCost = priceDetailsArray[index].totalCost;

        return row;
      }

      // Else if not in the same index
      if (priceDetailsArray != undefined && priceDetailsArray?.length > 0) {
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
          row.physicalSupplierCounterpartyId =
            detailsForCurrentRow[0].physicalSupplierCounterpartyId;
          if (detailsForCurrentRow[0].physicalSupplierCounterpartyId) {
            row.physicalSupplierCounterpartyName = counterpartyList.find(
              x =>
                x.id == detailsForCurrentRow[0].physicalSupplierCounterpartyId
            ).displayName;
          }
          row.totalOffer = detailsForCurrentRow[0].totalOffer;
          row.totalCost = detailsForCurrentRow[0].totalCost;
        }
      }

      return row;
    });

    return rowsArray;
  }

  addToRequestListCheckboxOptions() {
    if (this.selectedRequestList.length > 0) {
      let selectedreqId = [];
      const RequestGroupId = this.route.snapshot.params.spotNegotiationId;
      const requests = this.store.selectSnapshot(
        (state: SpotNegotiationStoreModel) => {
          return state['spotNegotiation'].requests;
        }
      );
      this.selectedRequestList.forEach(element => {
        let filterduplicaterequest = requests.filter(
          e => e.id == element.requestId
        );
        if (filterduplicaterequest.length > 0) {
          let ErrorMessage =
            filterduplicaterequest[0].name +
            ' - ' +
            filterduplicaterequest[0].vesselName +
            ' already linked to the request.';
          this.toastr.error(ErrorMessage);
        } else {
          selectedreqId.push(element.requestId);
        }
      });
      if (this.selectedRequestList.length > 0) {
        let payload = {
          groupId: parseInt(RequestGroupId),
          requestIds: selectedreqId
        };
        const response = this._spotNegotiationService.addRequesttoGroup(
          payload
        );
        response.subscribe((res: any) => {
          if (res.error) {
            alert('Handle Error');
            return;
          } else {
            if (res['requests'] && res['requests'].length > 0) {
              this.store.dispatch(new AddRequest(res['requests']));
              res['requests'].forEach(element => {
                let SuccessMessage =
                  element.name +
                  ' - ' +
                  element.vesselName +
                  ' has been linked successfully.';
                this.toastr.success(SuccessMessage);
              });
            }
            setTimeout(() => {
              if (
                res['requestLocationSellers'] &&
                res['requestLocationSellers'].length > 0
              ) {
                this.store.dispatch(
                  new AddCounterpartyToLocations(res['requestLocationSellers'])
                );
              }
              const requests = this.store.selectSnapshot(
                (state: SpotNegotiationStoreModel) => {
                  return state['spotNegotiation'].requests;
                }
              );
              if (requests.length > 6) {
                this.displayVessel = true;
              }
            }, 500);
          }
        });
      }
    }
    //   this.toastr.error("Select atlease one Request");
    //   return;
    // }
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
    this.store.dispatch(new SetLocations(selected.requestLocations));
    var obj = {
      selReqIndex: i
    };
    this.selectionChange.emit(obj);
    this.getBestContractForCurrentRequest(selected.id);
  }

  getBestContractForCurrentRequest(selectedRequestId) : void {
    console.log(selectedRequestId);
    let payload = this.currentRequestInfo.id;
    if(!this.availableContracts[`request_${selectedRequestId}`] ) {
      this.availableContracts[`request_${selectedRequestId}`] = [];
      const response = this._spotNegotiationService.getBestContract(payload);
      response.subscribe((res: any) => {
        if (res.payload) {
          this.availableContracts[`request_${selectedRequestId}`] = res.payload;
          this.store.dispatch(new SetAvailableContracts(res.payload));
        } else {
          this.toastr.error(res.message);
          return;
        }
      });
    } else {
      this.store.dispatch(new SetAvailableContracts(this.availableContracts[`request_${this.currentRequestInfo.id}`]));
    }
  }

  openRequestPopup() {
    const RequestGroupId = this.route.snapshot.params.spotNegotiationId;
    const dialogRef = this.dialog.open(SearchRequestPopupComponent, {
      width: '100vw',
      height: '95vh',
      maxWidth: '95vw',
      panelClass: 'search-request-popup',
      data: {
        RequestGroupId: parseInt(RequestGroupId)
      }
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
  searchRequest(userInput: string): void {
    this.expandedSearch = false;

    this.visibleRequestList = this.requestsAndVessels
      .filter(e => {
        if (e.requestName.toLowerCase().includes(userInput.toLowerCase())) {
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

  showSearch(expandedSearch) {
    if (expandedSearch) {
      this.expandedSearch = false;
    } else {
      this.expandedSearch = true;
    }
    return this.expandedSearch;
  }

  searchCounterparty(userInput: string): void {
    if (userInput !== '') {
      let result = this.store
        .selectSnapshot((state: SpotNegotiationStoreModel) => {
          return state['spotNegotiation'].LocationsOriData;
        })
        .filter(e => {
          if (
            e.sellerCounterpartyName
              .toLowerCase()
              .includes(userInput.toLowerCase())
          ) {
            return true;
          }
          return false;
        });
      this.store.dispatch(new SetLocationsRows(result));
    } else {
      const locationsRowsOriData = this.store.selectSnapshot(
        (state: SpotNegotiationStoreModel) => {
          return state['spotNegotiation'].LocationsOriData;
        }
      );
      this.store.dispatch(new SetLocationsRows(locationsRowsOriData));
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
