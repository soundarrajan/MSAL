import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AGGridCellActionsComponent } from '@shiptech/core/ui/components/ds-components/ag-grid/ag-grid-cell-actions.component';
import { AGGridCellEditableComponent } from '@shiptech/core/ui/components/ds-components/ag-grid/ag-grid-cell-editable.component';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'shiptech-invoice-detail',
  templateUrl: './invoice-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceDetailComponent implements OnInit, OnDestroy {
  buttonToggleData = { names: ['Final', 'Provisional', 'Credit', 'Debit'] }
  
  activeBtn = 'Final';

  public gridOptions_data: GridOptions;
  public gridOptions_ac: GridOptions;
  public chipData =[
    {Title:'Invoice No', Data:''},
    {Title:'Status', Data:'Draft'},
    {Title:'Invoice Total', Data:''},
    {Title:'Estimated Total', Data:'33,898.00 USD'},
    {Title:'Total Difference', Data:'-33.898.00 USD'},
    {Title:'Provisional Inv No.', Data:''},
    {Title:'Provisional Total', Data:''},
    {Title:'Deductions', Data:'USD'},
    {Title:'Net Payable', Data:''}
  ]

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer){
    iconRegistry.addSvgIcon(
      'data-picker-gray',
      sanitizer.bypassSecurityTrustResourceUrl('../../assets/customicons/calendar-dark.svg'));

      this.gridOptions_data = <GridOptions>{
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
          this.gridOptions_data.api.sizeColumnsToFit();
          this.gridOptions_data.api.setRowData(this.rowData_aggrid);
          this.addCustomHeaderEventListener();
  
        },
        onColumnResized: function (params) {
          if (params.columnApi.getAllDisplayedColumns().length <= 9 && params.type === 'columnResized' && params.finished === true && params.source === 'uiColumnDragged') {
            params.api.sizeColumnsToFit();
          }
        },
        onColumnVisible: function (params) {
          if (params.columnApi.getAllDisplayedColumns().length <= 9) {
            params.api.sizeColumnsToFit();
  
          }
        }
      }

      this.gridOptions_ac= <GridOptions>{
        defaultColDef: {
          resizable: true,
          filtering: false,
          sortable: false
        },
        columnDefs: this.columnDef_aggrid_ac,
        suppressRowClickSelection: true,
        suppressCellSelection: true,
        headerHeight: 35,
        rowHeight: 35,
        animateRows: false,
  
        onGridReady: (params) => {
          this.gridOptions_data.api = params.api;
          this.gridOptions_data.columnApi = params.columnApi;
          this.gridOptions_data.api.sizeColumnsToFit();
          this.gridOptions_data.api.setRowData(this.rowData_aggrid);
          this.addCustomHeaderEventListener();
  
        },
        onColumnResized: function (params) {
          if (params.columnApi.getAllDisplayedColumns().length <= 9 && params.type === 'columnResized' && params.finished === true && params.source === 'uiColumnDragged') {
            params.api.sizeColumnsToFit();
          }
        },
        onColumnVisible: function (params) {
          if (params.columnApi.getAllDisplayedColumns().length <= 9) {
            params.api.sizeColumnsToFit();
  
          }
        }
      }

  } 

  
  private columnDef_aggrid = [
    {
      resizable: false,
      width: 30,
      suppressMenu: true,
      headerName: "",
      headerClass: ['aggridtextalign-center'],
      headerComponentParams: {
        template: `<span  unselectable="on">
             <div class="add-btn"></div>
             <span ref="eMenu"></span>`
      },
      cellClass: ['aggridtextalign-left'],
      cellRendererFramework: AGGridCellActionsComponent, cellRendererParams: { type: 'row-remove-icon' }
    },
    {
      headerName: 'Delivery No. / Order Product', editable: true, headerTooltip: 'Delivery No. / Order Product', field: 'cost', cellClass: ['editable-cell'],
      cellRendererFramework: AGGridCellEditableComponent, cellRendererParams: { type: 'cell-edit-dropdown', label: 'cost-type', items: ['Pay', 'Receive'] }
    },
    {
      headerName: 'Deliv Product', headerTooltip: 'Deliv Product', field: 'name', cellClass: ['editable-cell'],
      cellRendererFramework: AGGridCellEditableComponent, cellRendererParams: { type: 'cell-edit-autocomplete', label: 'cost-name' }
    },
    {
      headerName: 'Deliv. Qty', headerTooltip: 'Deliv. Qty', field: 'provider', cellClass: ['editable-cell'],
      cellRendererFramework: AGGridCellEditableComponent, cellRendererParams: { type: 'cell-edit-autocomplete', label: 'service-provider' }
    },
    {
      headerName: 'Estd. Rate', editable: true, headerTooltip: 'Estd. Rate', field: 'type', cellClass: ['editable-cell'],
      cellRendererFramework: AGGridCellEditableComponent, cellRendererParams: { type: 'cell-edit-dropdown', label: 'rate-type', items: ['Flat', 'Option 2'] }
    },
    { headerName: 'Amount', headerTooltip: 'Amount', field: 'currency' },
    { headerName: 'Invoice Product', headerTooltip: 'Invoice Product', field: 'name' },
    { headerName: 'Invoice Qty', headerTooltip: 'Invoice Qty', field: 'name' },
    { headerName: 'Invoice Rate', headerTooltip: 'Invoice Rate', field: 'name' },
    { headerName: 'Amount', headerTooltip: 'Amount', field: 'name' },
    { headerName: 'Recon status', headerTooltip: 'Recon status', field: 'name' },
    { headerName: 'Sulpher content', headerTooltip: 'Sulpher content', field: 'name' }
    // { headerName: 'Phy. supplier', headerTooltip: 'Phy. supplier', field: 'name' },
    // { headerName: 'Rate', editable: true, singleClickEdit: true, headerTooltip: 'Rate', field: 'rate', type: "numericColumn", cellClass: ['aggridtextalign-right editable-cell cell-align'] },
    // { headerName: 'UOM', headerTooltip: 'UOM', field: 'uom' },
    // { headerName: 'Invoice ID', headerTooltip: 'Invoice ID', field: 'id' },
  ];

  private columnDef_aggrid_ac = [
    {
      resizable: false,
      width: 30,
      suppressMenu: true,
      headerName: "",
      headerClass: ['aggridtextalign-center'],
      headerComponentParams: {
        template: `<span  unselectable="on">
             <div class="add-btn"></div>
             <span ref="eMenu"></span>`
      },
      cellClass: ['aggridtextalign-left'],
      cellRendererFramework: AGGridCellActionsComponent, cellRendererParams: { type: 'row-remove-icon' }
    },
    {
      headerName: 'Item', editable: true, headerTooltip: 'Item', field: 'cost', cellClass: ['editable-cell'],
      cellRendererFramework: AGGridCellEditableComponent, cellRendererParams: { type: 'cell-edit-dropdown', label: 'cost-type', items: ['Pay', 'Receive'] }
    },
    {
      headerName: 'Cost Type', headerTooltip: 'Cost Type', field: 'name', cellClass: ['editable-cell'],
      cellRendererFramework: AGGridCellEditableComponent, cellRendererParams: { type: 'cell-edit-autocomplete', label: 'cost-name' }
    },
    {
      headerName: '%of', headerTooltip: '% of', field: 'provider', cellClass: ['editable-cell'],
      cellRendererFramework: AGGridCellEditableComponent, cellRendererParams: { type: 'cell-edit-autocomplete', label: 'service-provider' }
    },
    {
      headerName: 'BDN Qty', editable: true, headerTooltip: 'BDN Qty', field: 'type', cellClass: ['editable-cell'],
      cellRendererFramework: AGGridCellEditableComponent, cellRendererParams: { type: 'cell-edit-dropdown', label: 'rate-type', items: ['Flat', 'Option 2'] }
    },
    { headerName: 'Estd. Rate', headerTooltip: 'Estd. Rate', field: 'currency' },
    { headerName: 'Amount', headerTooltip: 'Amount', field: 'name' },
    { headerName: 'Extra %', headerTooltip: 'Extra %', field: 'name' },
    { headerName: 'ExtraAmt', headerTooltip: 'ExtraAmt', field: 'name' },
    { headerName: 'Amount', headerTooltip: 'Amount', field: 'name' },
    { headerName: 'Total', headerTooltip: 'Total', field: 'name' },
    { headerName: 'Invoice Qty', headerTooltip: 'Invoice Qty', field: 'name' },
    { headerName: 'Invoice Rate', headerTooltip: 'Invoice Rate', field: 'name' },
    { headerName: 'Amount', headerTooltip: 'Amount', field: 'name' },
    { headerName: 'Extra%', headerTooltip: 'Extra%', field: 'name' },
    { headerName: 'ExtraAmt', headerTooltip: 'ExtraAmt', field: 'name' },
    { headerName: 'Total', headerTooltip: 'Total', field: 'name' },
    { headerName: 'Difference', headerTooltip: 'Difference', field: 'name' }
  ];

  private rowData_aggrid = [
    {
      type: 'Flat', provider: 'Kinder Morgan', currency: 'USD', rate: '100', cost: 'Pay', name: 'Barging', id: "", uom: "GAL"
    }
  ]

  addCustomHeaderEventListener() {
    let addButtonElement = document.getElementsByClassName('add-btn');
    addButtonElement[0].addEventListener('click', (event) => {
      this.gridOptions_data.api.applyTransaction({
        add: [{
          type: 'Flat', provider: 'Kinder Morgan', currency: 'USD', rate: '100', cost: 'Pay', name: 'Barging', id: "", uom: "GAL"
        }]
      });
    });

  }
   
  ngOnInit(): void {
      
  }

  ngOnDestroy(): void {
  }
}
