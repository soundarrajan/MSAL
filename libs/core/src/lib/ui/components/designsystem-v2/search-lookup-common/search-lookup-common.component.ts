import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridOptions } from "ag-grid-community";

@Component({
  selector: 'app-search-lookup-common',
  templateUrl: './search-lookup-common.component.html',
  styleUrls: ['./search-lookup-common.component.css']
})
export class SearchLookupCommonComponent implements OnInit {
  public isdisplaydensityhigh: boolean = false;
  public gridOptions: GridOptions;
  public columnSelection: any;

  ngOnInit() {
  }

  constructor(
    public dialogRef: MatDialogRef<SearchLookupCommonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.gridOptions = <GridOptions>{
        masterDetail: true,
        defaultColDef: {
          filter: true,
          enableSorting: true
        },
        //suppressRowTransform: true,
        columnDefs: this.columnDefs,
        enableColResize: true,
        enableSorting: true,
        filter: true,
        animateRows: true,
        suppressRowClickSelection: true,
        detailCellRendererParams: {
          detailGridOptions: {
            showHeader: false,
            headerHeight: 0,
            rowHeight: 35,
            //domLayout: 'autoHeight',
            animateRows: false,
            suppressHorizontalScroll: true,
            suppressRowClickSelection: true,
            columnDefs: [
              { headerName: '', headerTooltip: 'Trader ', field: 'trader', width: 100, headerClass: ['aggridtextalign-left']},
              { headerName: '', headerTooltip: 'Status ', field: 'status', width: 70, headerClass: ['text-center'],
              cellRenderer: function (params) {
                if(params.value === 'Active'){
                  return `<div id="custom-status-chips-v2" style="padding-top: 5px;">
                  <div class="custom-chip-type1 active chip-status">
                      <div class="truncate-100">
                          Active
                      </div>
                  </div>
                </div>`;
                }else{
                  return `<div id="custom-status-chips-v2" style="padding-top: 5px;">
                  <div class="custom-chip-type1 inactive" matTooltip="Inctive" matTooltipShowDelay="500">
                      <div class="truncate-100">
                          Inactive
                      </div>
                  </div>`;
                }
              }
            },
              { headerName: '', headerTooltip: 'Default Company', field: 'defaultcompany', width: 130, headerClass: ['aggridtextalign-left'] },
            ],
            defaultColDef: {
              flex: 1,
              sortable: true,
              resizable: true,
              filter: true,
              suppressSizeToFit: true
            },
            onFirstDataRendered(params) {
              params.api.sizeColumnsToFit();
            },
            onColumnResized: function (params) {
              if (params.columnApi.getAllDisplayedColumns().length <= 4 && params.type === 'columnResized' && params.finished === true && params.source === 'uiColumnDragged') {
                params.api.sizeColumnsToFit();
              }
            }
          },
          getDetailRowData: function (params) {
            params.successCallback(params.data.sub_data);
          }
        },
        getRowHeight: function (params) {
          if (params.node && params.node.detail) {
            //add header height + an extra 5 for margin to the total calculated detail height
            var detailPanelHeight = (params.data.sub_data.length * 5) + 33;
            return detailPanelHeight;
          }
          else return 25;
        },
        headerHeight: this.isdisplaydensityhigh ? 60 : 35,
        groupHeaderHeight: this.isdisplaydensityhigh ? 60 : 35,
        icons: {
          groupExpanded: '<img src="../../../assets/icon/collapseGridIcon.svg" style="width: 15px;margin-top:5px;"/>',
          groupContracted: '<img src="../../../assets/icon/expandGridIcon.svg" style="width: 15px;margin-top:5px;"/>'
        },
        onFirstDataRendered(params) {
          params.api.sizeColumnsToFit();
        },
        onGridReady: params => {
          this.gridOptions.api = params.api;
          this.gridOptions.columnApi = params.columnApi;
          this.gridOptions.api.sizeColumnsToFit();
          this.gridOptions.api.setRowData(this.rowData);
        }
      };
  
     }

     public columnDefs = [
      {  
        headerName: "",
        field: "",
        filter: true,
        enableSorting :true,
        suppressMenu:true,
        width:40,
        checkboxSelection:true,
        suppressSizeToFit: true,
        resizable: false,
        suppressMovable: true,
        // headerClass:'p-0',
        headerClass:'header-checkbox-center',
        cellClass:'p-1 checkbox-center',
        pinned: 'left'
      },
      {
        headerName: "Trader",
        field: "trader",
        headerClass: ["", "aggridtextalign-left"],
        width: 140,
        cellRenderer: "agGroupCellRenderer"
      },
  
      {
        headerName: "Status",
        field: "status",
        width: 100,
        headerClass: 'text-center' ,
        cellRenderer: function (params) {
          if(params.value === 'Active'){
            return `<div id="custom-status-chips-v2">
            <div class="custom-chip-type1 active chip-status">
                <div class="truncate-100">
                    Active
                </div>
            </div>
          </div>`;
          }else{
            return `<div id="custom-status-chips-v2">
            <div class="custom-chip-type1 inactive" matTooltip="Inctive" matTooltipShowDelay="500">
                <div class="truncate-100">
                    Inactive
                </div>
            </div>`;
          }
        } 
      },
      {
        headerName: "Default company",
        field: "defaultcompany",
        width: 180,
        headerClass: ["", "aggridtextalign-left"],
        //cellRendererFramework: AGGridCellRendererComponent
      }
    ];
  
  
    private rowData = [ 
      {
        trader: "Santiago.labos@company.com",
        status: "Active",
        defaultcompany: "ABC Oil Co.",
        sub_data:
        [{
          trader: 'Alexander.james@company.com',
          status: 'Active',
          defaultcompany: 'ABC Oil Co.'
        }]
      },  
      {
        trader: "Santiago.labos@company.com",
        status: "Active",
        defaultcompany: "ABC Oil Co.",
        sub_data:
        [{
          trader: 'Alexander.james@company.com',
          status: 'Active',
          defaultcompany: 'ABC Oil Co.'
        }]
      },  
      {
        trader: "Santiago.labos@company.com",
        status: "Active",
        defaultcompany: "ABC Oil Co.",
        sub_data:
        [{
          trader: 'Alexander.james@company.com',
          status: 'Active',
          defaultcompany: 'ABC Oil Co.'
        }]
      },  
      {
        trader: "Santiago.labos@company.com",
        status: "Active",
        defaultcompany: "ABC Oil Co.",
        sub_data:
        [{
          trader: 'Alexander.james@company.com',
          status: 'Active',
          defaultcompany: 'ABC Oil Co.'
        }]
      },  
      {
        trader: "Santiago.labos@company.com",
        status: "Active",
        defaultcompany: "ABC Oil Co.",
        sub_data:
        [{
          trader: 'Alexander.james@company.com',
          status: 'Active',
          defaultcompany: 'ABC Oil Co.'
        }]
      },  
      {
        trader: "Santiago.labos@company.com",
        status: "Active",
        defaultcompany: "ABC Oil Co.",
        sub_data:
        [{
          trader: 'Alexander.james@company.com',
          status: 'Active',
          defaultcompany: 'ABC Oil Co.'
        }]
      },  
      {
        trader: "Santiago.labos@company.com",
        status: "Active",
        defaultcompany: "ABC Oil Co.",
        sub_data:
        [{
          trader: 'Alexander.james@company.com',
          status: 'Active',
          defaultcompany: 'ABC Oil Co.'
        }]
      },  
      {
        trader: "Santiago.labos@company.com",
        status: "Active",
        defaultcompany: "ABC Oil Co.",
        sub_data:
        [{
          trader: 'Alexander.james@company.com',
          status: 'Active',
          defaultcompany: 'ABC Oil Co.'
        }]
      },  
      {
        trader: "Santiago.labos@company.com",
        status: "Active",
        defaultcompany: "ABC Oil Co.",
        sub_data:
        [{
          trader: 'Alexander.james@company.com',
          status: 'Active',
          defaultcompany: 'ABC Oil Co.'
        }]
      },  
      {
        trader: "Santiago.labos@company.com",
        status: "Active",
        defaultcompany: "ABC Oil Co.",
        sub_data:
        [{
          trader: 'Alexander.james@company.com',
          status: 'Active',
          defaultcompany: 'ABC Oil Co.'
        }]
      },  
      {
        trader: "Santiago.labos@company.com",
        status: "Active",
        defaultcompany: "ABC Oil Co.",
        sub_data:
        [{
          trader: 'Alexander.james@company.com',
          status: 'Active',
          defaultcompany: 'ABC Oil Co.'
        }]
      },  
      {
        trader: "Santiago.labos@company.com",
        status: "Active",
        defaultcompany: "ABC Oil Co.",
        sub_data:
        [{
          trader: 'Alexander.james@company.com',
          status: 'Active',
          defaultcompany: 'ABC Oil Co.'
        }]
      },  
      {
        trader: "Santiago.labos@company.com",
        status: "Active",
        defaultcompany: "ABC Oil Co.",
        sub_data:
        [{
          trader: 'Alexander.james@company.com',
          status: 'Active',
          defaultcompany: 'ABC Oil Co.'
        }]
      },  
      {
        trader: "Santiago.labos@company.com",
        status: "Active",
        defaultcompany: "ABC Oil Co.",
        sub_data:
        [{
          trader: 'Alexander.james@company.com',
          status: 'Active',
          defaultcompany: 'ABC Oil Co.'
        }]
      },  
      {
        trader: "Santiago.labos@company.com",
        status: "Active",
        defaultcompany: "ABC Oil Co.",
        sub_data:
        [{
          trader: 'Alexander.james@company.com',
          status: 'Active',
          defaultcompany: 'ABC Oil Co.'
        }]
      }  
    ];

}

