import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { MatDialog } from '@angular/material/dialog';
import { GridOptions } from '@ag-grid-enterprise/all-modules';
import { ActivatedRoute, Router } from "@angular/router";
import { EmailPreviewPopupComponent } from '../contract-negotiation-popups/email-preview-popup/email-preview-popup.component';
import { AGGridCellRendererV2Component } from '@shiptech/core/ui/components/designsystem-v2/ag-grid/ag-grid-cell-rendererv2.component';
import { AGGridCellActionsComponent } from '@shiptech/core/ui/components/designsystem-v2/ag-grid/ag-grid-cell-actions.component';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
import { Store } from '@ngxs/store';
import { SetRequestGroupId } from 'libs/feature/spot-negotiation/src/lib/store/actions/request-group-actions';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-contract-nego-emaillog',
  templateUrl: './contract-nego-emaillog.component.html',
  styleUrls: ['./contract-nego-emaillog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractNegoEmaillogComponent implements OnInit {
  dateFormat: string;
  date: string;
  generalTenantSettings: any;
  public pageSize: number;
  public totalItems: number;
  listOfRequests: any;
  public theme: boolean = false;
  public gridOptions_data: GridOptions;
  public overlayLoadingTemplate =
    '<span class="ag-overlay-loading-center" style="color:white;border-radius:20px; border: 2px solid #5C5C5B; background: #5C5C5B ;">Loading Rows...</span>';
  public overlayNoRowsTemplate = '<span>No rows to show</span>';
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
  constructor(
    public dialog: MatDialog,
    private spotNegotiationService: SpotNegotiationService,
    private route: ActivatedRoute,
    private store: Store,
    private changeDetector: ChangeDetectorRef,
    private toaster: ToastrService, 
    private spinner: NgxSpinnerService,
    private tenantSettingsService: TenantSettingsService) 
    { 

     this.generalTenantSettings = tenantSettingsService.getGeneralTenantSettings();
    this.dateFormat = this.generalTenantSettings.tenantFormats.dateFormat.name;
   
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
        rowSelection: 'multiple',
        animateRows: false,
        onGridReady: params => {
          this.gridOptions_data.api = params.api;
          this.gridOptions_data.columnApi = params.columnApi;
          params.api?.sizeColumnsToFit();
          this.gridOptions_data?.api.showLoadingOverlay();
        },
        onColumnResized: function(params) {
          if (
            params.columnApi.getAllDisplayedColumns().length <= 8 &&
            params.type === 'columnResized' &&
            params.finished === true &&
            params.source === 'uiColumnDragged'
          ) {
            params.api?.sizeColumnsToFit();
          }
        },
        onColumnVisible: function(params) {
          if (params.columnApi.getAllDisplayedColumns().length <= 8) {
            params.api?.sizeColumnsToFit();
          }
        }
      };
   }
   public cellClassRules = {
    'bg-failed-grid': params => params.value == 'Failed',
    'bg-success-grid': params => params.value == 'Sent',
    'bg-pending-grid': params => params.value == 'Pending'
  };

  private columnDef_grid = [
    {
      headerName: 'Mail sent to',
      headerTooltip: 'Mail Sent to',
      field: 'to',
      width: 345,
      suppressSizeToFit: false,
      tooltipValueGetter: params => params.value
    },
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
    {
      headerName: 'Status',
      headerTooltip: 'Status',
      field: 'status.name',
      width: 345,
      suppressSizeToFit: false,
      headerClass: ['aggrid-text-align-c'],
      cellClassRules: this.cellClassRules,
      cellClass: ['aggridtextalign-center']
    },
    {
      headerName: 'Sender',
      headerTooltip: 'Sender',
      field: 'from',
      width: 345,
      suppressSizeToFit: false,
      tooltipValueGetter: params => params.value
    },
    {
      headerName: 'Subject',
      headerTooltip: 'Subject',
      field: 'subject',
      width: 345,
      suppressSizeToFit: false,
      tooltipValueGetter: params => params.value
    },
    {
      headerName: 'Mail Date',
      headerTooltip: 'Mail Date',
      field: 'sentAt',
      tooltipValueGetter: params => moment(params.value).format(this.date),
      cellRenderer: params => {
        return moment(params.value).format(this.date);
      },
      suppressSizeToFit: false
    }
  ];

  ngOnInit(): void {
    if (this.dateFormat.includes('dd/')) {
      this.date = this.dateFormat.replace('DDD', 'ddd').replace('dd/', 'DD/');
    } else {
      this.date = this.dateFormat.replace('DDD', 'ddd').replace('dd', 'DD');
    }
  }
   getEmailLogs() {
    const groupRequestIdFromUrl = this.route.snapshot.params.requestId;
    this.store.dispatch(new SetRequestGroupId(groupRequestIdFromUrl));
    this.pageSize = 25;
    this.spotNegotiationService
      .getRequestGroup(groupRequestIdFromUrl)
      .subscribe((res: any) => {
        if (res?.message == 'Unauthorized') {
          return;
        }
        this.listOfRequests = res.requests;
        if (this.listOfRequests != null) {
          let reqpayload = {
            Order: null,
            Filters: [
              { ColumnName: 'TransactionTypeId', Value: '1,10,11,12,13,21' },
              {
                ColumnName: 'TransactionIds',
                Value: this.listOfRequests.map(req => req.id).join(',')
              }
            ],
            PageFilters: { Filters: [] },
            Pagination: { Skip: 0, Take: this.pageSize },
            SortList: { SortList: [] }
          };
          //this.gridOptions_data.api.showLoadingOverlay();
          const emailLogs = this.spotNegotiationService.getEmailLogsList(
            reqpayload
          );
          emailLogs.subscribe((res: any) => {
            //this.spinner.hide();
            this.gridOptions_data.api?.hideOverlay();
            if (res?.message == 'Unauthorized') {
              return;
            }
            if (res.payload) {
              this.totalItems = res.matchedCount;
              console.log(res.payload);
              //this.rowData_grid = res.payload;
              this.gridOptions_data.api?.setRowData(res.payload);
              if (!this.changeDetector['destroyed']) {
                this.changeDetector.detectChanges();
              }
            } else {
              this.toaster.error(res);
            }
          });
        }
      });
  }
  public onrowClicked (ev){
    const dialogRef = this.dialog.open(EmailPreviewPopupComponent, {
      data: {
        id: ev.data.id,
        ReadOnly: true
      },
      width: '80vw',
      height: '90vh',
      panelClass: 'remove-padding-popup'
    });
  
    dialogRef.afterClosed().subscribe(result => {});
  }   

}
