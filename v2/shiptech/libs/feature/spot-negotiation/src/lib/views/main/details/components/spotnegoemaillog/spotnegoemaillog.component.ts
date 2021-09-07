import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { EmailPreviewPopupComponent } from '../spot-negotiation-popups/email-preview-popup/email-preview-popup.component';

@Component({
  selector: 'app-spotnegoemaillog',
  templateUrl: './spotnegoemaillog.component.html',
  styleUrls: ['./spotnegoemaillog.component.css']
})
export class SpotnegoemaillogComponent implements OnInit {
  public gridOptions_data: GridOptions;
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

    { headerName: 'Mail sent to', headerTooltip: 'Mail Sent to', field: 'mailsentto',width:345,suppressSizeToFit: false },
    { headerName: 'Status', headerTooltip: 'Status', field: 'status',width:345,suppressSizeToFit: false , headerClass:['aggrid-text-align-c'], cellClass: ['aggridtextalign-center', 'bg-green-grid'], },
    { headerName: 'Sender', headerTooltip: 'Sender', field: 'sender',width:345, suppressSizeToFit: false  },
    { headerName: 'Subject', headerTooltip: 'Subject', field: 'subject',width:345 ,suppressSizeToFit: false },
    { headerName: 'Mail Date', headerTooltip: 'Mail Date', field: 'maildate', suppressSizeToFit: false },

  ];

  private rowData_grid = [

    { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
      },

      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
    },
    { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
  },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
},
{ mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
    },
    { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
  },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
},
{ mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
    },
    { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
  },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
},
{ mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
    },
    { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
  },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
},
{ mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
    },
    { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
  },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
},
{ mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
    },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
      },
    { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
    },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
    },
    { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
  },
{ mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
    },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
    },
    { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
  },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
},
{ mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
    },
    { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
  },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
},
{ mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
    },
    { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
  },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
},
{ mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
    },
    { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
  },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
},
{ mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
    },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
    },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
    },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
      },
      { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
    },
  { mailsentto:'alexanderj@inatech.com',status:'Success',sender:'alexanderj@inatech.com',subject:'Contract',maildate:'12/10/2020 10:30'
      },

     ];

  public onrowClicked (ev){
    const dialogRef = this.dialog.open(EmailPreviewPopupComponent, {
      width: '80vw',
      height: '90vh',
      panelClass: 'additional-cost-popup'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
