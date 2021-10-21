import { Component, OnInit, ViewChild, ElementRef, } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { AGGridCellEditableComponent } from '../ag-grid/ag-grid-cell-editable.component';
import { AGGridCellActionsComponent } from '../ag-grid/ag-grid-cell-actions.component';

@Component({
  selector: 'app-editable-grid',
  templateUrl: './editable-grid.component.html',
  styleUrls: ['./editable-grid.component.css']
})
export class EditableGridComponent implements OnInit {

  public gridOptions_data: GridOptions;
  @ViewChild('addBtn', { static: false }) addBtn: ElementRef;
  constructor() {
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
  }

  ngOnInit(): void {
  }

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
      headerName: 'Cost Type', editable: true, headerTooltip: 'Cost Type', field: 'cost', cellClass: ['editable-cell'],
      cellRendererFramework: AGGridCellEditableComponent, cellRendererParams: { type: 'cell-edit-dropdown', label: 'cost-type', items: ['Pay', 'Receive'] }
    },
    {
      headerName: 'Cost Name', headerTooltip: 'Cost Name', field: 'name', cellClass: ['editable-cell'],
      cellRendererFramework: AGGridCellEditableComponent, cellRendererParams: { type: 'cell-edit-autocomplete', label: 'cost-name' }
    },
    {
      headerName: 'Service Provider', headerTooltip: 'Service Provider', field: 'provider', cellClass: ['editable-cell'],
      cellRendererFramework: AGGridCellEditableComponent, cellRendererParams: { type: 'cell-edit-autocomplete', label: 'service-provider' }
    },
    {
      headerName: 'Rate Type', editable: true, headerTooltip: 'Rate Type', field: 'type', cellClass: ['editable-cell'],
      cellRendererFramework: AGGridCellEditableComponent, cellRendererParams: { type: 'cell-edit-dropdown', label: 'rate-type', items: ['Flat', 'Option 2'] }
    },
    { headerName: 'Currency', headerTooltip: 'Currency', field: 'currency' },
    { headerName: 'Rate', editable: true, singleClickEdit: true, headerTooltip: 'Rate', field: 'rate', type: "numericColumn", cellClass: ['aggridtextalign-right editable-cell cell-align'] },
    { headerName: 'UOM', headerTooltip: 'UOM', field: 'uom' },
    { headerName: 'Invoice ID', headerTooltip: 'Invoice ID', field: 'id' },
  ];

  private rowData_aggrid = [

    {
      type: 'Flat', provider: 'Kinder Morgan', currency: 'USD', rate: '100', cost: 'Pay', name: 'Barging', id: "", uom: "GAL"
    }
  ]
}
