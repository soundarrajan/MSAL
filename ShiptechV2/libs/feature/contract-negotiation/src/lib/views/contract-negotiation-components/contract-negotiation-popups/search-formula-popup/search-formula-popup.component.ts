import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { AGGridCellRendererComponent } from '@shiptech/core/ui/components/ds-components/ag-grid/ag-grid-cell-renderer.component';


@Component({
  selector: 'app-search-formula-popup',
  templateUrl: './search-formula-popup.component.html',
  styleUrls: ['./search-formula-popup.component.scss']
})
export class SearchFormulaPopupComponent implements OnInit {

  public dialog_gridOptions: GridOptions;
  public rowCount: Number;
  public formulaSelected:boolean = false;
  public formulaValue:string = "";
  public hoverRowDetails =
      [
          { label: "Day Opening Balance", value: "5000 MT" },
          { label: "In", value: "3000 MT" },
          { label: "Out", value: "-5000 MT" },
          { label: "Transfer Out", value: "-2000 MT" },
          { label: "Transfer In", value: "0 MT" },
          { label: "Gain", value: "20 MT" },
          { label: "Loss", value: "0 MT" },
          { label: "Adj In", value: "0 MT" },
          { label: "Adj Out", value: "0 MT" },
          { label: "Day Closing Balance", value: "1020 MT" }
      ];
  ngOnInit() {
  }
  constructor(private router: Router,
      public dialogRef: MatDialogRef<SearchFormulaPopupComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      this.dialog_gridOptions = <GridOptions>{
          defaultColDef: {
              filter: true,
              sortable: true,
              resizable: true
          },
          columnDefs: this.columnDefs,
          suppressRowClickSelection: true,
          suppressHorizontalScroll: true,
          scrollbarWidth: 0,
          headerHeight: 30,
          rowHeight: 30,
          rowSelection: 'single',
          onGridReady: params => {
              this.dialog_gridOptions.api = params.api;
              this.dialog_gridOptions.columnApi = params.columnApi;
              this.dialog_gridOptions.api.sizeColumnsToFit();
              this.dialog_gridOptions.api.setRowData(this.rowData);
              this.rowCount = this.dialog_gridOptions.api.getDisplayedRowCount();
          },
          getRowStyle: function (params) {
              if (params.node.rowPinned) {
                  return { 'font-weight': '500', 'font-size': '20px' };
              }
          },
          onColumnResized: function (params) {
              if (params.columnApi.getAllDisplayedColumns().length <= 5 && params.type === 'columnResized' && params.finished === true && params.source === 'uiColumnDragged') {
                  params.api.sizeColumnsToFit();
                  //suppressHorizontalScroll = false;
              }
          }
      };
  }
  tankSummary() {
      this.router.navigate([]).then(result => {  window.open('techoil/opsinventory/tankSummary', '_blank'); });
  }
  public columnDefs = [
        {
            headerName: '',
            field: 'check',
            filter: true,
            suppressMenu: true,
            width: 35,
            checkboxSelection: true,
            resizable: false,
            suppressMovable: true,
            headerClass: 'header-checkbox-center checkbox-center ag-checkbox-v2',
            cellClass: 'p-1 checkbox-center ag-checkbox-v2',
        },
        {
          headerName: "ID",
          headerTooltip: "ID",
          field: "id",
          width: 150,
          
        },
        {
            headerName: "Formula Description",
            headerTooltip: "Formula Description",
            field: "description",minWidth: 150
            
        },
        {
            headerName: "Created By",
            headerTooltip: "Created By",
            field: "createdBy",minWidth: 150
           
        },
        {
            headerName: "Created On",
            headerTooltip: "Created On",
            field: "createdOn",minWidth: 150
            
        },
        {
            headerName: "Last Modified By",
            headerTooltip: "Last Modified By",
            field: "modifiedBy",minWidth: 150
            
        },
        {
            headerName: "Last Modified On",
            headerTooltip: "Last Modified On",
            field: "modifiedOn",minWidth: 150
            
        },
        { 
            headerName: 'Active', headerTooltip: 'Active', field: 'active', suppressMenu: true,minWidth: 150,
            cellRendererFramework:AGGridCellRendererComponent, cellClass: ['aggridtextalign-center'],
            cellRendererParams: function(params) { 
            var classArray:string[] =[]; 
                classArray.push('aggridtextalign-center');
                let newClass= params.value==='Active'?'custom-chip palegreen':
                            'custom-chip dark';
                            classArray.push(newClass);
                return {cellClass: classArray.length>0?classArray:null} }},
        
  ];

  public numberFormatter(params) {
      if (isNaN(params.value))
          return params.value;
      else
          return params.value.toFixed(4);
  }

  private rowData = [
    {
      id:'112837',description:'Draft MOPS 380 cst 3.5% (PPX DK 00)',createdBy:'Santiago.labos@company.com',
      createdOn:'12/10/2020 10:30',modifiedBy:'Santiago.labos@company.com',modifiedOn:'12/10/2020 10:30',active:'Active'
    },
    {
      id:'112837',description:'280202022',createdBy:'Santiago.labos@company.com',
      createdOn:'12/10/2020 10:30',modifiedBy:'Santiago.labos@company.com',modifiedOn:'12/10/2020 10:30',active:'Active'
    },
    {
      id:'112837',description:'AutoFormula',createdBy:'Santiago.labos@company.com',
      createdOn:'12/10/2020 10:30',modifiedBy:'Santiago.labos@company.com',modifiedOn:'12/10/2020 10:30',active:'Active'
    },
    {
      id:'112837',description:'Draft MOPS 380 cst 3.5% (PPX DK 00)',createdBy:'Santiago.labos@company.com',
      createdOn:'12/10/2020 10:30',modifiedBy:'Santiago.labos@company.com',modifiedOn:'12/10/2020 10:30',active:'Active'
    },
    {
      id:'112837',description:'280202022',createdBy:'Santiago.labos@company.com',
      createdOn:'12/10/2020 10:30',modifiedBy:'Santiago.labos@company.com',modifiedOn:'12/10/2020 10:30',active:'Active'
    },
    {
      id:'112837',description:'AutoFormula',createdBy:'Santiago.labos@company.com',
      createdOn:'12/10/2020 10:30',modifiedBy:'Santiago.labos@company.com',modifiedOn:'12/10/2020 10:30',active:'Active'
    },
    {
      id:'112837',description:'Draft MOPS 380 cst 3.5% (PPX DK 00)',createdBy:'Santiago.labos@company.com',
      createdOn:'12/10/2020 10:30',modifiedBy:'Santiago.labos@company.com',modifiedOn:'12/10/2020 10:30',active:'Active'
    },
    {
      id:'112837',description:'280202022',createdBy:'Santiago.labos@company.com',
      createdOn:'12/10/2020 10:30',modifiedBy:'Santiago.labos@company.com',modifiedOn:'12/10/2020 10:30',active:'Active'
    },
    {
      id:'112837',description:'AutoFormula',createdBy:'Santiago.labos@company.com',
      createdOn:'12/10/2020 10:30',modifiedBy:'Santiago.labos@company.com',modifiedOn:'12/10/2020 10:30',active:'Active'
    },
    {
      id:'112837',description:'Draft MOPS 380 cst 3.5% (PPX DK 00)',createdBy:'Santiago.labos@company.com',
      createdOn:'12/10/2020 10:30',modifiedBy:'Santiago.labos@company.com',modifiedOn:'12/10/2020 10:30',active:'Active'
    },
    {
      id:'112837',description:'280202022',createdBy:'Santiago.labos@company.com',
      createdOn:'12/10/2020 10:30',modifiedBy:'Santiago.labos@company.com',modifiedOn:'12/10/2020 10:30',active:'Active'
    },
    {
      id:'112837',description:'AutoFormula',createdBy:'Santiago.labos@company.com',
      createdOn:'12/10/2020 10:30',modifiedBy:'Santiago.labos@company.com',modifiedOn:'12/10/2020 10:30',active:'Active'
    },
    {
      id:'112837',description:'Draft MOPS 380 cst 3.5% (PPX DK 00)',createdBy:'Santiago.labos@company.com',
      createdOn:'12/10/2020 10:30',modifiedBy:'Santiago.labos@company.com',modifiedOn:'12/10/2020 10:30',active:'Active'
    },
    {
      id:'112837',description:'280202022',createdBy:'Santiago.labos@company.com',
      createdOn:'12/10/2020 10:30',modifiedBy:'Santiago.labos@company.com',modifiedOn:'12/10/2020 10:30',active:'Active'
    },
    {
      id:'112837',description:'AutoFormula',createdBy:'Santiago.labos@company.com',
      createdOn:'12/10/2020 10:30',modifiedBy:'Santiago.labos@company.com',modifiedOn:'12/10/2020 10:30',active:'Active'
    },
    {
      id:'112837',description:'Draft MOPS 380 cst 3.5% (PPX DK 00)',createdBy:'Santiago.labos@company.com',
      createdOn:'12/10/2020 10:30',modifiedBy:'Santiago.labos@company.com',modifiedOn:'12/10/2020 10:30',active:'Active'
    },
    {
      id:'112837',description:'280202022',createdBy:'Santiago.labos@company.com',
      createdOn:'12/10/2020 10:30',modifiedBy:'Santiago.labos@company.com',modifiedOn:'12/10/2020 10:30',active:'Active'
    },
    {
      id:'112837',description:'AutoFormula',createdBy:'Santiago.labos@company.com',
      createdOn:'12/10/2020 10:30',modifiedBy:'Santiago.labos@company.com',modifiedOn:'12/10/2020 10:30',active:'Active'
    },
    {
      id:'112837',description:'Draft MOPS 380 cst 3.5% (PPX DK 00)',createdBy:'Santiago.labos@company.com',
      createdOn:'12/10/2020 10:30',modifiedBy:'Santiago.labos@company.com',modifiedOn:'12/10/2020 10:30',active:'Active'
    },
    {
      id:'112837',description:'280202022',createdBy:'Santiago.labos@company.com',
      createdOn:'12/10/2020 10:30',modifiedBy:'Santiago.labos@company.com',modifiedOn:'12/10/2020 10:30',active:'Active'
    },
    {
      id:'112837',description:'AutoFormula',createdBy:'Santiago.labos@company.com',
      createdOn:'12/10/2020 10:30',modifiedBy:'Santiago.labos@company.com',modifiedOn:'12/10/2020 10:30',active:'Active'
    },
    {
      id:'112837',description:'AutoFormula',createdBy:'Santiago.labos@company.com',
      createdOn:'12/10/2020 10:30',modifiedBy:'Santiago.labos@company.com',modifiedOn:'12/10/2020 10:30',active:'Active'
    },
    {
      id:'112837',description:'Draft MOPS 380 cst 3.5% (PPX DK 00)',createdBy:'Santiago.labos@company.com',
      createdOn:'12/10/2020 10:30',modifiedBy:'Santiago.labos@company.com',modifiedOn:'12/10/2020 10:30',active:'Active'
    },
    {
      id:'112837',description:'280202022',createdBy:'Santiago.labos@company.com',
      createdOn:'12/10/2020 10:30',modifiedBy:'Santiago.labos@company.com',modifiedOn:'12/10/2020 10:30',active:'Active'
    },
    {
      id:'112837',description:'AutoFormula',createdBy:'Santiago.labos@company.com',
      createdOn:'12/10/2020 10:30',modifiedBy:'Santiago.labos@company.com',modifiedOn:'12/10/2020 10:30',active:'Active'
    },
    
  ];

  onSelectionChanged(ev){
    //alert("");
    this.formulaSelected=true;
    var selectedRows = this.dialog_gridOptions.api.getSelectedRows();
    this.formulaValue = selectedRows[0].description;
  }

  proceed() {
      this.dialogRef.close({data:this.formulaValue});
  }

}
