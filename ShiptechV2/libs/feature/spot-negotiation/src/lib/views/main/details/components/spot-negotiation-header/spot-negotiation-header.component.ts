import {
  Component,
  ElementRef,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  EventEmitter
} from '@angular/core';
// import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { LocalService } from '../../../../../services/local-service.service';
import {
  SetCurrentRequest,
  SetCurrentRequestSmallInfo
} from '../../../../../store/actions/ag-grid-row.action';
import { SearchRequestPopupComponent } from '../spot-negotiation-popups/search-request-popup/search-request-popup.component';
@Component({
  selector: 'app-spot-negotiation-header',
  templateUrl: './spot-negotiation-header.component.html',
  styleUrls: ['./spot-negotiation-header.component.css']
})
export class SpotNegotiationHeaderComponent implements OnInit {
  @ViewChild('headerContainer') container: ElementRef;
  @ViewChild('requestContainer') requestcontainer: ElementRef;
  @ViewChild('inputSearch') inputSearch: ElementRef;

  // Current request;
  locations = [];
  selReqIndex = 0;
  selectAll: boolean = true;
  availWidth: any;
  requestOptions: Observable<any> = null;
  //showAddReq: boolean = false;
  displayVessel: boolean = false;
  expandedSearch: boolean = false;
  selectedRequest = '';
  expandRequestPopUp: boolean = false;
  displayedColumns: string[] = ['request', 'vessel'];
  counterpartyColumns: string[] = ['counterparty', 'blank'];
  counterpartyList: any = [];
  visibleCounterpartyList: any = [];

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
  constructor(
    private store: Store,
    private renderer: Renderer2,
    public dialog: MatDialog,
    private localService: LocalService
  ) {
    // Set counterpartyList
    this.counterpartyList = this.store.selectOnce(({ spotNegotiation }) => {
      if (this.counterpartyList.length === 0) {
        this.counterpartyList = spotNegotiation.staticLists[1].items;
        this.visibleCounterpartyList = this.counterpartyList.slice(0, 7);
      }
    });

    // Set observable;
    this.requestOptions = this.store.select(({ spotNegotiation }) => {
      if (spotNegotiation.currentRequestSmallInfo) {
        this.setLocations(spotNegotiation.currentRequestSmallInfo.locations);
      }

      return spotNegotiation.requests;
    });
  }

  @Output() selectionChange: EventEmitter<any> = new EventEmitter<any>();
  ngOnInit(): void {
    // Get data from store;
  }

  setLocations(eLocations: any): void {
    this.locations = eLocations;
  }

  removeRequest(i) {
    alert('asd');
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
    event.stopPropagation();
    this.selReqIndex = i;

    // Get small requests
    var requests;
    this.requestOptions.subscribe(e => {
      return (requests = e);
    });

    // Set current request
    this.store.dispatch(new SetCurrentRequestSmallInfo(selected));

    // Change locations
    this.setLocations(requests[i].locations);

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

  searchInput() {
    this.expandedSearch = false;
  }

  showSearch() {
    setTimeout(() => {
      this.inputSearch.nativeElement.focus();
    }, 0);
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
}
