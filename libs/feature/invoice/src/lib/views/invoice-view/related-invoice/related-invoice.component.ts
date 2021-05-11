import { Component, OnInit, Input } from '@angular/core';
import { AGGridCellActionsComponent } from '@shiptech/core/ui/components/ds-components/ag-grid/ag-grid-cell-actions.component';
import { AGGridCellRendererComponent } from '@shiptech/core/ui/components/ds-components/ag-grid/ag-grid-cell-renderer.component';
import { GridOptions } from 'ag-grid-community';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import moment from 'moment';
import { UrlService } from '@shiptech/core/services/url/url.service';
import { AppConfig } from '@shiptech/core/config/app-config';

@Component({
  selector: 'shiptech-related-invoice',
  templateUrl: './related-invoice.component.html',
  styleUrls: ['./related-invoice.component.css']
})
export class RelatedInvoiceComponent implements OnInit {
  public gridOptions_data: GridOptions;
  rowData_aggrid: any = [];
  totalrowData = [];
  formValues:any;
  dateFormat:any;
  @Input('detailFormvalues') set _detailFormvalues(val) {
    if(val){
      this.formValues = val;
      if(this.formValues.relatedInvoices){
        this.formValues.relatedInvoices.forEach(element => {
          this.rowData_aggrid.push({
            "id": element.id,
            "order-number":element.orderId,
            "type":element.invoiceType.name,
            "date":element.invoiceDate ? moment(element.invoiceDate).format(this.dateFormat):'',
            "amount":element.invoiceAmount,
            "deductions":element.deductions,
            "paid":element.paidAmount,
            "status":element.invoiceStatus.name
          });
        });
        this.formValues.relatedInvoicesSummary.forEach(total => {
          this.totalrowData.push({
            "id": "Net Payable",
            "order-number":total.netPayable,
            "type":"",
            "date":"Total",
            "amount":total.invoiceAmountTotal,
            "deductions":total.deductionsTotal,
            "paid":total.paidAmount,
            "status":""
          });
        });
        if(this.gridOptions_data.api){
          this.gridOptions_data.api.sizeColumnsToFit(); 
        }
      }
    }
  }
  constructor(private format: TenantFormattingService, public urlService:UrlService,public appConfig: AppConfig) {
    this.dateFormat = this.format.dateFormat.replace('DDD', 'ddd').replace('dd/', 'DD/');
    this.setupGrid();
   }

  ngOnInit(): void {
    
  }

  setupGrid(){
    this.gridOptions_data = <GridOptions>{
      enableColResize: true,
      defaultColDef: {
        resizable: true,
        filtering: false,
        sortable: false
      },
      columnDefs: this.columnDef_aggrid,
      suppressRowClickSelection: true,
      suppressCellSelection: true,
      headerHeight: 35,
      rowHeight: 35,
      animateRows: false,

      onGridReady: (params) => {
        this.gridOptions_data.api = params.api;
        this.gridOptions_data.columnApi = params.columnApi;
        this.gridOptions_data.api.setPinnedBottomRowData(this.totalrowData);
        this.gridOptions_data.api.setRowData(this.rowData_aggrid);
        this.gridOptions_data.api.sizeColumnsToFit();  
        // params.api.sizeColumnsToFit();     

      },
      onFirstDataRendered(params) {
        params.api.sizeColumnsToFit();
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

  private columnDef_aggrid = [
    { headerName: 'Invoice ID', headerTooltip: 'Invoice ID', field: 'id', width: 100, cellClass: ['aggridlink aggridtextalign-center'], headerClass: ['aggrid-text-align-c'] },
    { headerName: 'Order number', headerTooltip: 'Order number', field: 'order-number', cellClass: ['aggridtextalign-left'] },
    {
      headerName: 'Invoice Type', headerTooltip: 'Invoice Type', field: 'type'
    },
    {
      headerName: 'Invoice Date', headerTooltip: 'Invoice Date', field: 'date', width: 150, 
    },
    {
      headerName: 'Invoice Amt', headerTooltip: 'Invoice Amt', field: 'amount', width: 150, 
    },
    {
      headerName: 'Deductions', headerTooltip: 'Deductions', field: 'deductions', width: 150, 
    },
    {
      headerName: 'Paid Amount', headerTooltip: 'Paid Amount', field: 'paid',  width: 150,
    },
    { headerName: 'Invoice status', headerTooltip: 'Invoice status', field: 'status',
        cellRendererFramework:AGGridCellRendererComponent, cellRendererParams: function(params) {
          var classArray:string[] =[];
            classArray.push('aggridtextalign-center');
            let newClass= params.value==='Reverted' || params.value==='Discrepancy' ?'custom-chip-type1 red-chip':
                          params.value==='Approved'?'custom-chip-type1 mediumgreen':
                          params.value==='New'?'custom-chip-type1 dark':
                          'custom-chip-type1';
                          classArray.push(newClass);
            return {cellClass: classArray.length>0?classArray:null} }}
  ];
  onCellClicked(params){
    if(params.colDef.field === 'id' && !params.rowPinned){
      this.openEditInvoice(params.data.id)
    }
  }
  openEditInvoice(invoiceId: number): void {
    window.open(
      this.urlService.editInvoice(invoiceId),
      this.appConfig.openLinksInNewTab ? '_blank' : '_self'
    );
  }
}
