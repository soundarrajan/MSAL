import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { Router } from "@angular/router";
import { EmailPreviewPopupComponent } from '../contract-negotiation-popups/email-preview-popup/email-preview-popup.component';
import { AGGridCellRendererV2Component } from '@shiptech/core/ui/components/designsystem-v2/ag-grid/ag-grid-cell-rendererv2.component';
import { AGGridCellActionsComponent } from '@shiptech/core/ui/components/designsystem-v2/ag-grid/ag-grid-cell-actions.component';


@Component({
  selector: 'app-contract-nego-emaillog',
  templateUrl: './contract-nego-emaillog.component.html',
  styleUrls: ['./contract-nego-emaillog.component.scss']
})
export class ContractNegoEmaillogComponent implements OnInit {
public theme: boolean = false;
  public gridOptions_data: GridOptions;
  private statusBGRules = {
    'bg-success': function (params) {
      return params.value === 'Success';
    },
    'bg-pending': function (params) {
      return params.value === 'Pending';
    },
    'bg-failed': function (params) {
      return params.value === 'Failed';
    }
  };
  filterList = {
    filters: [
      {
        name: 'Default',
        count: '9',
        defaultFilter: true,
        selected: true,
        pinned: true,
        position: 0
      },
      {
        name: 'All',
        count: '12',
        defaultFilter: false,
        selected: false,
        pinned: true,
        position: 1
      }
    ],
    enableMoreFilters: true,
    multiSelect: false
  }
  constructor(public dialog: MatDialog) { 
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
        this.gridOptions_data.api.sizeColumnsToFit();
        params.api.sizeColumnsToFit();
        this.gridOptions_data.api.setRowData(this.rowData_grid);

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

  ngOnInit(): void {
  }
  
  private columnDef_grid = [
    {
      headerName: '',
      field: 'check',
      filter: true,
      suppressMenu: true,
      maxWidth: 30,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      resizable: false,
      suppressNavigable: true, lockPosition: true,
      headerClass: 'header-checkbox-center checkbox-center ag-checkbox-v2',
      cellClass: 'p-1 checkbox-center ag-checkbox-v2',
      cellRendererFramework: AGGridCellActionsComponent, cellRendererParams: { type: 'row-remove-icon-cell-hover' }
    },
    { headerName: 'Mail sent to', headerTooltip: 'Mail Sent to', cellClass:'aggrid-text-resizable',tooltip: (params) => params.value, field: 'mailsentto',width:200,suppressSizeToFit: false },
    {
      headerName: 'Status', headerTooltip: 'Status', field: 'status',width:100,cellClass:'aggrid-text-resizable',
      cellRendererFramework: AGGridCellRendererV2Component, cellRendererParams: { type: 'status-circle' }
    },
    { headerName: 'Sender', headerTooltip: 'Sender', cellClass:'aggrid-text-resizable',tooltip: (params) => params.value, field: 'sender',width:150, suppressSizeToFit: false  },
    { headerName: 'Subject', headerTooltip: 'Subject', cellClass:'aggrid-text-resizable',tooltip: (params) => params.value, field: 'subject',width:345 ,suppressSizeToFit: false },
    { headerName: 'Mail Date', headerTooltip: 'Mail Date', cellClass:'aggrid-text-resizable',field: 'maildate', tooltip: (params) => params.value, suppressSizeToFit: false },
    
  ];

  private rowData_grid = [

    { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
      },
    
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Pending',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
    },
    { mailsentto:'alexanderj@inatech.com',status:'Failed',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
  },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
},
{ mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
    },
    { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
  },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
},
{ mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
    },
    { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
  },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
},
{ mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
    },
    { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
  },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
},
{ mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
    },
    { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
  },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
},
{ mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
    },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
      },
    { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
    },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
    },
    { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
  },
{ mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
    },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
    },
    { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
  },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
},
{ mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
    },
    { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
  },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
},
{ mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
    },
    { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
  },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
},
{ mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
    },
    { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
  },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
},
{ mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
    },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
    },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
    },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
    },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj',subject:'RE: Quotes for RMG 380 at Rotterdam q1 2022',maildate:'12/10/2020 10:30'
      },
    
     ];

  public onrowClicked (ev){
    const dialogRef = this.dialog.open(EmailPreviewPopupComponent, {
      width: '80vw',
      height: '90vh',
      panelClass: 'remove-padding-popup'
    });
  
    dialogRef.afterClosed().subscribe(result => {
    });
  }   

}
