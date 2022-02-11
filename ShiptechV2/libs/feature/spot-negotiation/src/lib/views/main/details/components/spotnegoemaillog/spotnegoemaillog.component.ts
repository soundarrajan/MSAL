import { HttpParams } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { GridOptions } from 'ag-grid-community';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
import { SpotNegotiationStoreModel } from 'libs/feature/spot-negotiation/src/lib/store/spot-negotiation.store';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EmailPreviewPopupComponent } from '../spot-negotiation-popups/email-preview-popup/email-preview-popup.component';

@Component({
  selector: 'app-spotnegoemaillog',
  templateUrl: './spotnegoemaillog.component.html',
  styleUrls: ['./spotnegoemaillog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpotnegoemaillogComponent implements OnInit {
  public gridOptions_data: GridOptions;
  EmailLogs: any = [];
  SelectedSellerWithProds: any;
  listOfRequests: any;
  dateFormat: string;
  date: string;
  generalTenantSettings: any;

  constructor(
    public dialog: MatDialog,
    private spotNegotiationService: SpotNegotiationService,
    private changeDetector: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private store: Store,
    private route: ActivatedRoute,
    private tenantSettingsService: TenantSettingsService
  ) {
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
      animateRows: false,
      onGridReady: params => {
        this.gridOptions_data.api = params.api;
        this.gridOptions_data.columnApi = params.columnApi;
        params.api.sizeColumnsToFit();
      },
      onColumnResized: function(params) {
        if (
          params.columnApi.getAllDisplayedColumns().length <= 8 &&
          params.type === 'columnResized' &&
          params.finished === true &&
          params.source === 'uiColumnDragged'
        ) {
          params.api.sizeColumnsToFit();
        }
      },
      onColumnVisible: function(params) {
        if (params.columnApi.getAllDisplayedColumns().length <= 8) {
          params.api.sizeColumnsToFit();
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
      tooltip: (params)=>params.value
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
      tooltip: (params)=>params.value
    },
    {
      headerName: 'Subject',
      headerTooltip: 'Subject',
      field: 'subject',
      width: 345,
      suppressSizeToFit: false,
      tooltip: (params)=>params.value
    },
    {
      headerName: 'Mail Date',
      headerTooltip: 'Mail Date',
      field: 'sentAt',
      tooltip: (params)=>params.value,
      cellRenderer: params => {
        return moment(params.value).format(this.date);
      },
      suppressSizeToFit: false
    }
  ];
  public rowData_grid = [];

  ngOnInit() {
    if (this.dateFormat.includes('dd/')) {
      this.date = this.dateFormat.replace('DDD', 'ddd').replace('dd/', 'DD/');
    } else {
      this.date = this.dateFormat.replace('DDD', 'ddd').replace('dd', 'DD');
    }
  }

  getEmailLogs() {
    const groupRequestIdFromUrl = this.route.snapshot.params.spotNegotiationId;

    this.spotNegotiationService
      .getRequestGroup(groupRequestIdFromUrl)
      .subscribe((res: any) => {
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
            Pagination: { Skip: 0, Take: 1000 },
            SortList: { SortList: [] }
          };
          this.spinner.show();
          const emailLogs = this.spotNegotiationService.getEmailLogsList(
            reqpayload
          );
          emailLogs.subscribe((res: any) => {
            this.spinner.hide();
            if (res.payload) {
              this.rowData_grid = res.payload;
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

  public onrowClicked(ev) {
    const dialogRef = this.dialog.open(EmailPreviewPopupComponent, {
      data: {
        id: ev.data.id,
        ReadOnly: true
      },
      width: '80vw',
      height: '90vh',
      panelClass: 'additional-cost-popup'
    });
    dialogRef.afterClosed().subscribe(result => {});
  }
}
