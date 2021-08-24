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
  selectedReqIndex = 0;
  selectedReqIndexes = [0, 1, 2];
  selectAll: boolean = true;
  availWidth: any;
  requestOptions = [
    {
      request: 'Req 12321',
      vessel: 'Merlion',
      selected: true
    },
    {
      request: 'Req 12322',
      vessel: 'Afif',
      selected: true
    },
    {
      request: 'Req 12323',
      vessel: 'Al Mashrab',
      selected: true
    }
  ];
  //showAddReq: boolean = false;
  displayVessel: boolean = false;
  expandedSearch: boolean = false;
  selectedRequest = '';
  expandRequestPopUp: boolean = false;
  displayedColumns: string[] = ['request', 'vessel'];
  counterpartyColumns: string[] = ['counterparty', 'blank'];
  counterpartyList = [
    { counterparty: 'Shell North America Division', selected: false },
    { counterparty: 'Shell North America Division', selected: false },
    { counterparty: 'Trefoil Oil and Sales', selected: false },
    { counterparty: 'Shell North America Corporation', selected: false },
    { counterparty: 'Shell North America Corporation', selected: false },
    { counterparty: 'Shell North America Corporation', selected: false },
    { counterparty: 'Shell North America Corporation', selected: false },
    { counterparty: 'Shell North America Corporation', selected: false }
  ];
  requestsAndVessels = [
    { request: 'Req 100001', vessel: 'MerinLion', selected: false },
    { request: 'Req 100002', vessel: 'Afif', selected: false },
    { request: 'Req 100003', vessel: 'Al Mashrab', selected: false },
    { request: 'Req 100004', vessel: 'Afif', selected: false },
    { request: 'Req 100005', vessel: 'MerinLion', selected: false },
    { request: 'Req 100006', vessel: 'Afif', selected: false },
    { request: 'Req 100007', vessel: 'MerinLion', selected: false },
    { request: 'Req 100008', vessel: 'Al Mashrab', selected: false }
  ];
  constructor(private renderer: Renderer2, public dialog: MatDialog) {}
  @Output() selectionChange: EventEmitter<any> = new EventEmitter<any>();
  ngOnInit(): void {}

  openRequestInNewTab(requestId: string): void {
    window
      .open(window.location.origin + '#/edit-request/' + requestId, '_blank')
      .focus();
  }
  /*   addNewRequest(){
    this.showAddReq = !this.showAddReq;
  } */

  // Get request from name;
  getRequestIDfromName(request: string): string {
    return request.split(' ')[1];
  }

  removeRequest(i) {
    this.requestOptions.splice(i, 1);
    //this.displayVessel = false;
    setTimeout(() => {
      var headerWidth = this.container.nativeElement.offsetWidth;
      var reqWidth = this.requestcontainer.nativeElement.offsetWidth;
      this.availWidth = headerWidth - reqWidth;
      console.log(this.availWidth);
      if (this.availWidth < 485 || this.requestOptions.length > 5) {
        this.displayVessel = true;
      } else {
        this.displayVessel = false;
        //alert("b");
      }
    }, 0);
  }

  addToCheckboxOptions() {
    var selectedVessel = this.requestsAndVessels.filter(
      item => item.selected == true
    );
    for (var val of selectedVessel) {
      this.requestOptions.push({
        request: val.request,
        vessel: val.vessel,
        selected: true
      });
      const arrayIndex = this.requestsAndVessels.indexOf(val);
      this.requestsAndVessels.splice(arrayIndex, 1);
    }
    //console.log(this.requestsAndVessels);
    //this.showAddReq = false;
    setTimeout(() => {
      var headerWidth = this.container.nativeElement.offsetWidth;
      var reqWidth = this.requestcontainer.nativeElement.offsetWidth;
      this.availWidth = headerWidth - reqWidth;
      //console.log(this.availWidth);
      if (this.availWidth < 150) {
        this.displayVessel = true;
      } else {
        //this.displayVessel = false;
        //alert("b");
      }
    }, 0);
    this.selectedRequest = '';
  }

  selectedReqBtn = 0;
  selectRequest(event, i, selected) {
    event.preventDefault();
    event.stopPropagation();
    this.selectedReqBtn = i;
    var checkedItems = this.requestOptions.reduce(function(acc, curr, index) {
      if (curr.selected) {
        acc.push(index);
      }
      return acc;
    }, []);
    var obj = {
      seletedreqIndex: i,
      checkedreqindexes: checkedItems
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

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  reqSelectionChange(evt) {
    if (evt) {
      this.selectedReqIndex = evt.seletedreqIndex;
      this.selectedReqIndexes = evt.checkedreqindexes;
    }
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
