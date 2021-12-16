import { getNumberOfCurrencyDigits } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { GridOptions } from 'ag-grid-community';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
import { SpotNegotiationStoreModel } from 'libs/feature/spot-negotiation/src/lib/store/spot-negotiation.store';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { EmailPreviewPopupComponent } from '../spot-negotiation-popups/email-preview-popup/email-preview-popup.component';

@Component({
  selector: 'app-spotnegoemaillog',
  templateUrl: './spotnegoemaillog.component.html',
  styleUrls: ['./spotnegoemaillog.component.css']
})
export class SpotnegoemaillogComponent implements OnInit {
  public gridOptions_data: GridOptions;
  EmailLogs: any = [];
  transationIds$ : Observable<any>  = this.store.select((state)=>{return { transaction: state.spotNegotiation.groupOfRequestsId}});

  constructor(public dialog: MatDialog,
              private spotNegotiationService : SpotNegotiationService,
              private changeDetector :ChangeDetectorRef,
              private spinner :NgxSpinnerService,
              private toaster: ToastrService,
              private store : Store
             ) {
    this.gridOptions_data = <GridOptions>{
      defaultColDef: {
        resizable: true,
        filter: true,
        sortable: true
      },
      columnDefs: this.columnDef_grid,
      suppressRowClickSelection: true,
      suppressCellSelection: true,
      headerHeight: 35,
      rowHeight: 35,
      animateRows: false,
      onGridReady: (params) => {
        this.gridOptions_data.api = params.api;
        this.gridOptions_data.columnApi = params.columnApi;
      },
      onColumnResized: function (params) {
        if (params.columnApi.getAllDisplayedColumns().length <= 8 && params.type === 'columnResized' && params.finished === true && params.source === 'uiColumnDragged') {
          params.api.sizeColumnsToFit();
        }
      },
      onColumnVisible: function (params) {
        if (params.columnApi.getAllDisplayedColumns().length <= 8) {
          params.api.sizeColumnsToFit();

        }
      }
    }
   }



 public cellClassRules = {
  'bg-failed-grid': params => params.value == 'Failed',
  'bg-success-grid': params => params.value == 'Success',
  'bg-pending-grid': params => params.value == 'Pending'
 };

  private columnDef_grid = [

    { headerName: 'Mail sent to', headerTooltip: 'Mail Sent to', field: 'to',width:345,suppressSizeToFit: false },
    { headerName: 'Status', headerTooltip: 'Status', field: 'status.name',width:345,suppressSizeToFit: false , headerClass:['aggrid-text-align-c'],cellClassRules: this.cellClassRules , cellClass: ['aggridtextalign-center'], },
    { headerName: 'Sender', headerTooltip: 'Sender', field: 'from',width:345, suppressSizeToFit: false  },
    { headerName: 'Subject', headerTooltip: 'Subject', field: 'subject',width:345 ,suppressSizeToFit: false },
    { headerName: 'Mail Date', headerTooltip: 'Mail Date', field: 'sentAt', cellRenderer: (params)=>{ return moment(params.value).format('MM/DD/YYYY HH:mm')} ,suppressSizeToFit: false },

  ];

  public rowData_grid = [];
  transaction: any ;
  ngOnInit() {
    // this.transationIds$.subscribe(x=>{
    //   this.transaction = x.transaction;
    //   console.log(this.transaction);
    // } );
  }

  getEmailLogs() {
    let reqpayload = {
         Order: null,
         Filters: [
                     {ColumnName: "TransactionTypeId", Value: ""},
                     {ColumnName: "TransactionIds", Value: ""}
                  ],
         PageFilters: {Filters: []},
         Pagination: {Skip: 0, Take: 25},
         SortList: {SortList: []}
    }
    this.spinner.show();
    const emailLogs = this.spotNegotiationService.getEmailLogs(reqpayload);
    emailLogs.subscribe((res:any)=>{
      this.spinner.hide();
        if(res.payload){
            this.rowData_grid = res.payload;
            this.changeDetector.detectChanges();
        }
        else{
          this.toaster.error(res);
        }
    });
  }

  public onrowClicked (ev){
    console.log(ev);
    debugger;
    const dialogRef = this.dialog.open(EmailPreviewPopupComponent,{
      data : ev.data,
      width: '80vw',
      height: '90vh',
      panelClass: 'additional-cost-popup',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}

