import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { AGGridCellRendererComponent } from '../../../ag-grid/ag-grid-cell-renderer.component';
import { AggridLinkComponent } from '../../../ag-grid/ag-grid-link.component';

@Component({
  selector: 'app-mov-details',
  templateUrl: './mov-details.component.html',
  styleUrls: ['./mov-details.component.css']
})
export class MovDetailsComponent implements OnInit {
  public dialog_gridOptions: GridOptions;
  public isdisplaydensityhigh:boolean = false;
  public rowCount:Number;
  ngOnInit() {
    //this.dialog_gridOptions.api.sizeColumnsToFit();
  }
  ngAfterViewInit() {
    //this.dialog_gridOptions.api.sizeColumnsToFit();
  }
  close(){
    this.dialogRef.close();
  }
  constructor(private router: Router,
      public dialogRef: MatDialogRef<MovDetailsComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      this.dialog_gridOptions = <GridOptions>{
          defaultColDef: {
              filter: true,
              sortable: true,
              resizable: true
          },
          columnDefs: this.columnDefs,
          suppressRowClickSelection: true,
          getRowHeight:(params) => {
            return this.isdisplaydensityhigh? 48:25
          },
          headerHeight:this.isdisplaydensityhigh? 60:30,
          groupHeaderHeight:this.isdisplaydensityhigh? 60:30,
          // groupIncludeTotalFooter: true,
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
              }
          }
      };
  }
  tankSummary() {
      this.dialogRef.close();
      this.router.navigate(['opsinventory/tankSummary']);
  }
  private columnDefs = [

    {
      headerName:'Delivery ID',headerTooltip:'Delivery ID',
      field: 'delID',
      cellRendererFramework:AggridLinkComponent,
      //pinned: 'left',
      cellClass: function(params) {
        var classArray:string[] =[];
          // let newClass= params.data.status==='Confirmed'?'aggrid-left-ribbon darkgreen':
          //               params.data.status==='Unconfirmed'?'aggrid-left-ribbon amber':
          //               params.data.status==='Settled'?'aggrid-left-ribbon lightgreen':
          //               'aggrid-left-ribbon dark';
          //               classArray.push(newClass);
          return classArray.length>0?classArray:null }
    },
    {
        headerName:'Movement ID',headerTooltip:'Movement ID',
        field: 'movId',
        cellRendererFramework:AggridLinkComponent,
        //pinned: 'left',
        cellClass: function(params) {
          var classArray:string[] =[];
            // let newClass= params.data.status==='Confirmed'?'aggrid-left-ribbon darkgreen':
            //               params.data.status==='Unconfirmed'?'aggrid-left-ribbon amber':
            //               params.data.status==='Settled'?'aggrid-left-ribbon lightgreen':
            //               'aggrid-left-ribbon dark';
            //               classArray.push(newClass);
            return classArray.length>0?classArray:null }
      },
    {headerName: 'Movement Date', field: 'movDate',headerTooltip:'Movement Date',
    cellClass: ["aggridtextalign-center"],
    headerClass: ["", "aggrid-text-align-c"],
    width: 180,
    cellRendererFramework: AGGridCellRendererComponent,
    cellRendererParams: { cellClass: ["custom-chip dark"] }
    },
    {headerName: 'Qty', field: 'qty',headerTooltip:'Qty' },
    {headerName: 'Qty UOM', field: 'qtyUOM',headerTooltip:'qtyUOM'},
    {headerName: 'Value', field: 'value',headerTooltip:'Value'},
    {headerName: 'Value UOM', field: 'valueUOM',headerTooltip:'Value UOM'},

  ];

private rowData = [

  {
    delID: 'PB00123-1', movId: 'MOV000122', movDate: '29 - Aug - 2020 17:32', qty: '10,000', qtyUOM: 'BBL', value: '10,000', valueUOM:'BBL'
  },
  {
    delID: 'PB00123-1', movId: 'MOV000122', movDate: '29 - Aug - 2020 17:32', qty: '10,000', qtyUOM: 'BBL', value: '10,000', valueUOM:'BBL'
  },
  {
    delID: 'PB00123-1', movId: 'MOV000122', movDate: '29 - Aug - 2020 17:32', qty: '10,000', qtyUOM: 'BBL', value: '10,000', valueUOM:'BBL'
  },
  {
    delID: 'PB00123-1', movId: 'MOV000122', movDate: '29 - Aug - 2020 17:32', qty: '10,000', qtyUOM: 'BBL', value: '10,000', valueUOM:'BBL'
  },
  {
    delID: 'PB00123-1', movId: 'MOV000122', movDate: '29 - Aug - 2020 17:32', qty: '10,000', qtyUOM: 'BBL', value: '10,000', valueUOM:'BBL'
  },
  {
    delID: 'PB00123-1', movId: 'MOV000122', movDate: '29 - Aug - 2020 17:32', qty: '10,000', qtyUOM: 'BBL', value: '10,000', valueUOM:'BBL'
  },
  {
    delID: 'PB00123-1', movId: 'MOV000122', movDate: '29 - Aug - 2020 17:32', qty: '10,000', qtyUOM: 'BBL', value: '10,000', valueUOM:'BBL'
  },
  {
    delID: 'PB00123-1', movId: 'MOV000122', movDate: '29 - Aug - 2020 17:32', qty: '10,000', qtyUOM: 'BBL', value: '10,000', valueUOM:'BBL'
  },
  {
    delID: 'PB00123-1', movId: 'MOV000122', movDate: '29 - Aug - 2020 17:32', qty: '10,000', qtyUOM: 'BBL', value: '10,000', valueUOM:'BBL'
  },
  {
    delID: 'PB00123-1', movId: 'MOV000122', movDate: '29 - Aug - 2020 17:32', qty: '10,000', qtyUOM: 'BBL', value: '10,000', valueUOM:'BBL'
  },
  {
    delID: 'PB00123-1', movId: 'MOV000122', movDate: '29 - Aug - 2020 17:32', qty: '10,000', qtyUOM: 'BBL', value: '10,000', valueUOM:'BBL'
  },
  {
    delID: 'PB00123-1', movId: 'MOV000122', movDate: '29 - Aug - 2020 17:32', qty: '10,000', qtyUOM: 'BBL', value: '10,000', valueUOM:'BBL'
  },
  {
    delID: 'PB00123-1', movId: 'MOV000122', movDate: '29 - Aug - 2020 17:32', qty: '10,000', qtyUOM: 'BBL', value: '10,000', valueUOM:'BBL'
  },
  {
    delID: 'PB00123-1', movId: 'MOV000122', movDate: '29 - Aug - 2020 17:32', qty: '10,000', qtyUOM: 'BBL', value: '10,000', valueUOM:'BBL'
  },
  {
    delID: 'PB00123-1', movId: 'MOV000122', movDate: '29 - Aug - 2020 17:32', qty: '10,000', qtyUOM: 'BBL', value: '10,000', valueUOM:'BBL'
  },
  {
    delID: 'PB00123-1', movId: 'MOV000122', movDate: '29 - Aug - 2020 17:32', qty: '10,000', qtyUOM: 'BBL', value: '10,000', valueUOM:'BBL'
  },
  {
    delID: 'PB00123-1', movId: 'MOV000122', movDate: '29 - Aug - 2020 17:32', qty: '10,000', qtyUOM: 'BBL', value: '10,000', valueUOM:'BBL'
  },
  {
    delID: 'PB00123-1', movId: 'MOV000122', movDate: '29 - Aug - 2020 17:32', qty: '10,000', qtyUOM: 'BBL', value: '10,000', valueUOM:'BBL'
  },
  {
    delID: 'PB00123-1', movId: 'MOV000122', movDate: '29 - Aug - 2020 17:32', qty: '10,000', qtyUOM: 'BBL', value: '10,000', valueUOM:'BBL'
  },
  {
    delID: 'PB00123-1', movId: 'MOV000122', movDate: '29 - Aug - 2020 17:32', qty: '10,000', qtyUOM: 'BBL', value: '10,000', valueUOM:'BBL'
  },
  {
    delID: 'PB00123-1', movId: 'MOV000122', movDate: '29 - Aug - 2020 17:32', qty: '10,000', qtyUOM: 'BBL', value: '10,000', valueUOM:'BBL'
  },
  {
    delID: 'PB00123-1', movId: 'MOV000122', movDate: '29 - Aug - 2020 17:32', qty: '10,000', qtyUOM: 'BBL', value: '10,000', valueUOM:'BBL'
  },
  {
    delID: 'PB00123-1', movId: 'MOV000122', movDate: '29 - Aug - 2020 17:32', qty: '10,000', qtyUOM: 'BBL', value: '10,000', valueUOM:'BBL'
  },
  {
    delID: 'PB00123-1', movId: 'MOV000122', movDate: '29 - Aug - 2020 17:32', qty: '10,000', qtyUOM: 'BBL', value: '10,000', valueUOM:'BBL'
  },
  {
    delID: 'PB00123-1', movId: 'MOV000122', movDate: '29 - Aug - 2020 17:32', qty: '10,000', qtyUOM: 'BBL', value: '10,000', valueUOM:'BBL'
  },
  {
    delID: 'PB00123-1', movId: 'MOV000122', movDate: '29 - Aug - 2020 17:32', qty: '10,000', qtyUOM: 'BBL', value: '10,000', valueUOM:'BBL'
  },
  {
    delID: 'PB00123-1', movId: 'MOV000122', movDate: '29 - Aug - 2020 17:32', qty: '10,000', qtyUOM: 'BBL', value: '10,000', valueUOM:'BBL'
  },
  {
    delID: 'PB00123-1', movId: 'MOV000122', movDate: '29 - Aug - 2020 17:32', qty: '10,000', qtyUOM: 'BBL', value: '10,000', valueUOM:'BBL'
  },



];

  closeDialog() {
      this.dialogRef.close();
  }

}

