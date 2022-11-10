import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { forkJoin } from 'rxjs';
import { LocalService } from '../../../services/local-service.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateContractRequestPopupComponent } from '../contract-negotiation-popups/create-contract-request-popup/create-contract-request-popup.component';
import { ContractNegotiationDetailsComponent } from '../contract-negotiation-details/contract-negotiation-details.component';
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
  @ViewChild('ports') ports: ElementRef;
  allRequestDetails = [];
  allRequestComments = [];
  requestOptions = [
    {
      request: '10001', requestId: '10001'
    }
  ];
  gridDataSets = [];
  counterpartyColumns: string[] = ['counterparty', 'blank'];
  counterpartyList = [
    { 'counterparty': 'Shell North America Division', 'selected': false },
    { 'counterparty': 'Trefoil Oil and Sales', 'selected': false },
    { 'counterparty': 'Shell North America Corporation', 'selected': false },
    { 'counterparty': 'Shell North America Corporation', 'selected': false },
    { 'counterparty': 'Shell North America Corporation', 'selected': false },
    { 'counterparty': 'Shell North America Corporation', 'selected': false },
    { 'counterparty': 'Shell North America Corporation', 'selected': false },
    { 'counterparty': 'Shell North America Corporation', 'selected': false },
    { 'counterparty': 'Shell North America Corporation', 'selected': false },
    { 'counterparty': 'Shell North America Corporation', 'selected': false },
    { 'counterparty': 'Shell North America Corporation', 'selected': false },
    { 'counterparty': 'Shell North America Corporation', 'selected': false },
    { 'counterparty': 'Shell North America Corporation', 'selected': false }
  ];
  selReqIndex = 0;
  expandedSearch: boolean = false;
  lightChatIcon:boolean = true;
  searchText: string = "";

  constructor(private localService: LocalService, public dialog: MatDialog) { }

  ngOnInit(): void {
    // debugger;
    // let id = this.localService.contractRequestDetails;
    this.getJSONData();
  }

  setFocus() {
    this._el2.nativeElement.focus();
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
      data: { createReqPopup:false,rfqStatus: this.rfqSent }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  scrollPort1(index, el, count) {
    //console.log(count);
    let portVal = "port" + el;
    //let ele = document.getElementById(portval);
    let portId = "#" + portVal;
    var ele = this.ports.nativeElement.querySelector(portId);
    ele.scrollIntoView();
    // if(el!=count){
    //   ele.scrollIntoView();
    //   setTimeout(()=>{ 
    //     this.child.scrollExpand(index);
    //     },0);
    // }else{
    //   setTimeout(()=>{ 
    //     this.child.scrollExpand(index);
    //     },0);
    // }
  }
  scrollComments(el: HTMLElement) {
    el.scrollIntoView();
  }

  clearCounterparty(event) {
    if (event.target.value == '') {
      this.child.onClearSearchCounterparty();
    }
  }
  searchCounterparty(e) {
    //console.log(e);
    this.child.onSearchCounterparty(e);
  }

  private getJSONData() {
    this.allRequestDetails = [];
    var allRequestDetailsObservable = [];
    var allRequestCommentsObservable = [];
    var allRequestLocationObservable = [];
    this.requestOptions.forEach(r => {
      allRequestDetailsObservable.push(this.localService.getContractRequestData(r.requestId));
      allRequestCommentsObservable.push(this.localService.getContractNegoChatData(r.requestId));
    });
    forkJoin(allRequestDetailsObservable).subscribe(res => {
      this.allRequestDetails = res;
      this.allRequestDetails.forEach(req => req.locations.forEach(loc => {
        allRequestLocationObservable.push(this.localService.getContractNegoJSON(req['request-id'], loc['location-id']));
        this.localService.getContractNegoJSON(req['request-id'], loc['location-id']).subscribe(data => {
          loc['data'] = data;
        });


      }

      ))
    })
    forkJoin(allRequestCommentsObservable).subscribe(res => {
      this.allRequestComments = res;
      if(this.allRequestComments[0].length > 0){
        this.lightChatIcon = false;
      }else{
        this.lightChatIcon = true;
      }
    })


  }

}
