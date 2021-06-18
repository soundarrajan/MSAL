import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CommentsComponent } from '../comments/comments.component';
import { GridOptions } from '@ag-grid-community/core';
import { AGGridCellRendererComponent } from '../ag-grid/ag-grid-cell-renderer.component';
import { AGGridCellDataComponent } from '../ag-grid/ag-grid-celldata.component';
import { PortPopupService } from '../../services/port-popup.service';

@Component({
  selector: 'app-port-info',
  templateUrl: './port-info.component.html',
  styleUrls: ['./port-info.component.scss']
})
export class PortInfoComponent implements OnInit {

  @ViewChild(CommentsComponent) child;
  @Input('portData') portData;
  public expandComments: boolean = false;
  public gridOptions: GridOptions;
  public colResizeDefault;
  public rowCount: Number;

  constructor( private portService : PortPopupService ) {
    this.gridOptions = <GridOptions>{
      columnDefs: this.columnDefs,
      //enableColResize: true,
      //enableSorting: true,
      animateRows: true,
      headerHeight: 48,
      rowHeight: 32,
      defaultColDef: {
        filter: false,
        sortable: false,
        resizable: false
      },
      rowSelection: 'single',
      onGridReady: (params) => {
        this.gridOptions.api = params.api;
        this.gridOptions.columnApi = params.columnApi;
        this.gridOptions.api.setRowData(this.rowData);
        this.gridOptions.api.sizeColumnsToFit();
        this.rowCount = this.gridOptions.api.getDisplayedRowCount();

      },
      onColumnResized: function (params) {
      },
      onColumnVisible: function (params) {
      },
      onColumnPinned: function (params) {
      },
      onGridSizeChanged: function (params) {
        params.api.sizeColumnsToFit();
      }
    };
  }

  ngOnInit() {
    this.loadVesselArrivalDetails(this.portData.locationId);
  }

  loadVesselArrivalDetails(locationId){
    if(locationId != null){
      let req = { LocationId : 37}//locationId};
      this.portService.getVesselArrivalDetails(req).subscribe((res: any)=>{
        if(res.payload.length > 0){
          this.rowData = res.payload;
         
        }
        this.triggerClickEvent();
      })
    }

  }
  toggleComments(event) {
    event.stopPropagation();
    this.expandComments = !this.expandComments;
    this.child.toggleExpanded();
  }
  triggerClickEvent() {
    let titleEle = document.getElementsByClassName('page-title')[0] as HTMLElement;
      titleEle.click();
  }
  private columnDefs = [
    // { headerName: 'ETA', headerTooltip: 'ETA', field: 'eta', cellRendererFramework: AGGridCellRendererComponent, cellRendererParams: { cellClass: ['custom-chip dark aggrid-space'] }, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center'], width: 140 },
    { headerName: 'Vessel Name', field: 'vesselName', headerTooltip: 'Vessel Name', width: 90, cellClass: ['dark-cell aggrid-content-c'], headerClass: ['header-border-right'] },
    { headerName: 'ETA', field: 'eta', headerTooltip: 'ETA', width: 80, cellClass: ['aggrid-content-c'] },
    { headerName: 'ETD', field: 'etd', headerTooltip: 'ETD', width: 80, cellClass: ['aggrid-content-c'] },
    { headerName: 'Days', field: 'etaDays', headerTooltip: 'Days', width: 80, cellClass: ['aggrid-content-c'] },
    { headerName: 'Days', field: 'etdDays', headerTooltip: 'Days', width: 80, cellClass: ['aggrid-content-c'] },
    { headerName: '', field: 'blank' }

  ];

  public rowData = [
    // { vesselName: "EMMA MAERSK", eta: "2020-04-19 13:00", etd: "2020-04-19 13:00", etaDays: "-", etdDays: "-" },
    // { vesselName: "MCC KYOTO", eta: "2020-04-19 13:00", etd: "2020-04-19 13:00", etaDays: "-", etdDays: "-" },
    // { vesselName: "GUATEMALA", eta: "2020-04-19 13:00", etd: "2020-04-19 09:00", etaDays: "2 Days", etdDays: "2 Days" },
    // { vesselName: "MARCO POLO", eta: "2020-04-19 04:00", etd: "2020-04-19 13:00", etaDays: "3 Days", etdDays: "3 Days" },
    // { vesselName: "ARIANA", eta: "2020-04-19 13:00", etd: "2020-04-19 13:00", etaDays: "3 Days", etdDays: "3 Days" },
    // { vesselName: "MANILA MAERSK", eta: "2020-04-19 13:00", etd: "2020-04-19 13:00", etaDays: "4 Days", etdDays: "4 Days" },
    // { vesselName: "MAERSK ARIZONA", eta: "2020-04-19 13:00", etd: "2020-04-19 21:00", etaDays: "5 Days", etdDays: "5 Days" },
    // { vesselName: "MURCIA MAERSK", eta: "2020-04-19 10:00", etd: "2020-04-19 23:00", etaDays: "6 Days", etdDays: "6 Days" },
    // { vesselName: "MOSCOW MAERSK", eta: "2020-04-19 13:00", etd: "2020-04-19 18:00", etaDays: "7 Days", etdDays: "7 Days" },
    // { vesselName: "CADIZ MAERSK", eta: "2020-04-19 13:00", etd: "2020-04-19 17:00", etaDays: "8 Days", etdDays: "8 Days" }
  ];
}
