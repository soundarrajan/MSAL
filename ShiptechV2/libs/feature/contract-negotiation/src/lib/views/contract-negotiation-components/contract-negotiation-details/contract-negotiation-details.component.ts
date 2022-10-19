import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LocalService } from '../../../services/local-service.service';

@Component({
  selector: 'app-contract-negotiation-details',
  templateUrl: './contract-negotiation-details.component.html',
  styleUrls: ['./contract-negotiation-details.component.scss']
})
export class ContractNegotiationDetailsComponent implements OnInit {
  today = new FormControl(new Date());
  @Input() requests;
  @Input() rfqSent;
  @Input() noQuote;
  @Input() selectedRequestIndex;

  public portIndex: number = 0;
  public fullHeaderWidth: any;
  statusList = [
    { key: 'AwaitingApproval', name: 'Awaiting Approval', className: 'await', count: 0 },
    { key: 'Approved', name: 'Approved', className: 'approved', count: 0 },
    { key: 'Rejected', name: 'Rejected', className: 'rejected', count: 0 },
    { key: 'Contracted', name: 'Contracted', className: 'contracted', count: 0 }
  ];
  rowData = [];
  rowDataBackup = [];
  counterpartyColumns: string[] = ['counterparty', 'blank'];
  counterpartyList = [
    { 'counterparty': 'American President lines llc', 'selected': true },
    { 'counterparty': 'ANL container line', 'selected': true },
    { 'counterparty': 'Anil Singapore ltd', 'selected': true },
    { 'counterparty': 'APL Co. Pte Ltd', 'selected': false },
    { 'counterparty': 'CCISC', 'selected': false },
    { 'counterparty': 'CMA CGM	', 'selected': false },
    { 'counterparty': 'CMA CGM Algeria', 'selected': false },
    { 'counterparty': 'CNC', 'selected': false },
    { 'counterparty': 'CNC A Brand of APL Co Pte Ltd', 'selected': false },
    { 'counterparty': 'Coastal Navigation Co Ltd', 'selected': false },
    { 'counterparty': 'Cointainership Ltd', 'selected': false },
    { 'counterparty': 'Demo Company', 'selected': false }
  ];
  chipSelected = "1";
  pinnedColumnWidth: any;

  ngOnInit(): void {

  }

  ngOnChanges() {
    // this.localService.setContractNegoData(this.requests[this.selectedRequestIndex]?.locations);

    this.rowData = this.requests[this.selectedRequestIndex]?.locations;
    this.rowDataBackup = this.requests[this.selectedRequestIndex]?.locations;
  }
  ngAfterViewInit() {

  }

  constructor(private localService: LocalService) {
  }
  private _filter(data, value: string): [] {
    const filterValue = value.toLowerCase();
    data.forEach((item) => {
      item.data = item.data.filter(option => option.name.toLowerCase().includes(filterValue));
    })
    return data;
  }

  onSearchCounterparty(input) {
    this.rowData = this._filter(this.rowDataBackup, input);
  }
  onClearSearchCounterparty() {
    this.rowData = this.rowDataBackup;
  }
  togglePanel(flag,val) {
    let overlay = document.querySelector('.cdk-overlay-container');

    if (flag) {
      overlay.classList.add('panel-overlay-class');
    }
    else {
      overlay.classList.remove('panel-overlay-class');

    }
    this.localService.updatePeriodicity(val);
  }

  getPinnedColumnWidth(width){
    this.pinnedColumnWidth = {
      width: width+'px'
    }
  }

  onChipSelection(chipVal){
    this.chipSelected = chipVal;
    this.localService.updateChipSelected(chipVal);
  }

  getNodeData(data){
    for(let item of this.statusList){
      if(item.key === data.key && data.key!== null){
        item.count = data.allChildrenCount;
      }
    }
  }
}

