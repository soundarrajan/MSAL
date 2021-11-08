import { ChangeDetectorRef, Injectable } from '@angular/core';
import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import {
  GridOptions,
  IServerSideGetRowsParams,
  RowNode
} from '@ag-grid-community/core';
import {
  ITypedColDef,
  RowModelType,
  RowSelection
} from '@shiptech/core/ui/components/ag-grid/type.definition';

import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';

import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { transformLocalToServeGridInfo } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters';
import { takeUntil } from 'rxjs/operators';
import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';
import { AgCellTemplateComponent } from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';

import { DatabaseManipulation } from '@shiptech/core/legacy-cache/database-manipulation.service';
import { IScheduleDashboardLabelConfigurationDto } from '@shiptech/core/lookups/schedule-dashboard-label-configuration.dto.interface';
import { AgAsyncBackgroundFillComponent } from '@shiptech/core/ui/components/ag-grid/ag-async-background-fill/ag-async-background-fill.component';

import { ModuleLoggerFactory } from 'libs/feature/control-tower/src/lib/core/logging/module-logger-factory';
import { ModuleError } from 'libs/feature/control-tower/src/lib/core/error-handling/module-error';
import { AGGridCellActionsComponent } from '@shiptech/core/ui/components/designsystem-v2/ag-grid/ag-grid-cell-actions.component';
import { AGGridCellRendererAsyncStatusComponent } from '@shiptech/core/ui/components/designsystem-v2/ag-grid/ag-grid-cell-async-status/ag-grid-cell-async-status.component';

import { ControlTowerService } from 'libs/feature/control-tower/src/lib/services/control-tower.service';
import { IControlTowerQuantitySupplyDifferenceItemDto } from 'libs/feature/control-tower/src/lib/services/api/dto/control-tower-list-item.dto';
import { FormControl } from '@angular/forms';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';

import moment from 'moment';

import {
  ControlTowerQuantitySupplyDifferenceListColumns,
  ControlTowerQuantitySupplyDifferenceListColumnServerKeys,
  ControlTowerQuantitySupplyDifferenceListColumnsLabels,
  ControlTowerQuantitySupplyDifferenceListExportColumns
} from '../list-columns/control-tower-quantity-supply-difference-list.columns';

import {
  ControlTowerProgressColors,
  IControlTowerRowPopup
} from '../control-tower-general-enums';
import { RowstatusOnchangeQuantityrobdiffPopupComponent } from '@shiptech/core/ui/components/designsystem-v2/rowstatus-onchange-quantityrobdiff-popup/rowstatus-onchange-quantityrobdiff-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { __values } from 'tslib';
import { ToastrService } from 'ngx-toastr';

function model(
  prop: keyof IControlTowerQuantitySupplyDifferenceItemDto
): keyof IControlTowerQuantitySupplyDifferenceItemDto {
  return prop;
}

@Injectable()
export class ControlTowerQuantitySupplyDifferenceListGridViewModel extends BaseGridViewModel {
  public searchText: string;
  public differenceType: ILookupDto;
  public exportUrl: string;
  public newFilterSelected: boolean = false;
  public fromDate = new FormControl(
    moment()
      .subtract(7, 'days')
      .format('YYYY-MM-DD')
  );
  public toDate = new FormControl(moment().format('YYYY-MM-DD'));

  public toggleNewFilter: boolean = true;
  public toggleMASFilter: boolean = true;
  public toggleResolvedFilter: boolean = true;
  public noOfNew: number;
  public noOfMarkedAsSeen: number;
  public noOfResolved: number;

  public defaultColFilterParams = {
    resetButton: true,
    applyButton: true,
    precision: () => this.format.quantityPrecision
  };
  gridOptions: GridOptions = {
    enableColResize: true,
    suppressRowClickSelection: true,
    animateRows: true,
    groupHeaderHeight: 20,
    headerHeight: 40,
    rowHeight: 40,
    rowModelType: RowModelType.ServerSide,
    pagination: true,
    rowSelection: RowSelection.Single,
    suppressContextMenu: true,
    multiSortKey: 'ctrl',
    singleClickEdit: true,
    getRowNodeId: (data: IControlTowerQuantitySupplyDifferenceItemDto) => {
      return data?.id?.toString() ?? Math.random().toString();
    },
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      filterParams: this.defaultColFilterParams
    },
    onGridReady: params => {
      params.api.sizeColumnsToFit();
    }
  };

  portCallCol: ITypedColDef<
    IControlTowerQuantitySupplyDifferenceItemDto,
    ILookupDto
  > = {
    headerName: ControlTowerQuantitySupplyDifferenceListColumnsLabels.portCall,
    headerTooltip:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.portCall,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.portCall,
    field: model('portCall'),
    dtoForExport:
      ControlTowerQuantitySupplyDifferenceListExportColumns.portCall,
    cellRenderer: params => {
      if (params.value) {
        const a = document.createElement('a');
        a.innerHTML = params.value?.portCallId;
        a.href = `/quantity-control/report/${params.data.quantityControlReport.id}/details`;
        a.setAttribute('target', '_blank');
        return a;
      }
      return null;
    },
    width: 200
  };

  portCol: ITypedColDef<
    IControlTowerQuantitySupplyDifferenceItemDto,
    string
  > = {
    headerName: ControlTowerQuantitySupplyDifferenceListColumnsLabels.port,
    headerTooltip: ControlTowerQuantitySupplyDifferenceListColumnsLabels.port,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.port,
    field: model('port'),
    dtoForExport: ControlTowerQuantitySupplyDifferenceListExportColumns.port,
    width: 150
  };

  vesselCol: ITypedColDef<
    IControlTowerQuantitySupplyDifferenceItemDto,
    ILookupDto
  > = {
    headerName: ControlTowerQuantitySupplyDifferenceListColumnsLabels.vessel,
    headerTooltip: ControlTowerQuantitySupplyDifferenceListColumnsLabels.vessel,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.vessel,
    field: model('vessel'),
    dtoForExport: ControlTowerQuantitySupplyDifferenceListExportColumns.vessel,
    valueFormatter: params => params.value?.name,
    width: 150
  };

  etaCol: ITypedColDef<IControlTowerQuantitySupplyDifferenceItemDto, string> = {
    headerName: ControlTowerQuantitySupplyDifferenceListColumnsLabels.eta,
    headerTooltip: ControlTowerQuantitySupplyDifferenceListColumnsLabels.eta,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.eta,
    field: model('eta'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    dtoForExport: ControlTowerQuantitySupplyDifferenceListExportColumns.eta,
    width: 150
  };

  surveyorDate: ITypedColDef<
    IControlTowerQuantitySupplyDifferenceItemDto,
    string
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.surveyorDate,
    headerTooltip:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.surveyorDate,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.surveyorDate,
    field: model('surveyorDate'),
    dtoForExport:
      ControlTowerQuantitySupplyDifferenceListExportColumns.surveyorDate,
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    width: 150
  };

  emailToVesselCol: ITypedColDef<
    IControlTowerQuantitySupplyDifferenceItemDto,
    boolean
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.emailToVessel,
    headerTooltip:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.emailToVessel,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.emailToVessel,
    field: model('emailToVessel'),
    dtoForExport:
      ControlTowerQuantitySupplyDifferenceListExportColumns.emailToVessel,
    cellRenderer: params => {
      const a = document.createElement('span');
      a.innerHTML = params.value ? 'Yes' : 'No';
      params.value ? a.classList.add('success') : a.classList.add('denger');
      return a;
    },
    cellClass: 'cell-background',
    width: 150
  };

  vesselToWatchCol: ITypedColDef<
    IControlTowerQuantitySupplyDifferenceItemDto,
    boolean
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.vesselToWatch,
    headerTooltip:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.vesselToWatch,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.vesselToWatch,
    field: model('vesselToWatch'),
    dtoForExport:
      ControlTowerQuantitySupplyDifferenceListExportColumns.vesselToWatch,
    cellRenderer: params => {
      const a = document.createElement('span');
      a.innerHTML = params.value ? 'Yes' : 'No';
      !params.value ? a.classList.add('success') : a.classList.add('denger');
      return a;
    },
    cellClass: 'cell-background',
    width: 150
  };

  productTypeCol: ITypedColDef<
    IControlTowerQuantitySupplyDifferenceItemDto,
    ILookupDto
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.productType,
    headerTooltip:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.productType,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.productType,
    field: model('productType'),
    dtoForExport:
      ControlTowerQuantitySupplyDifferenceListExportColumns.productType,
    cellRenderer: params => {
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => a.productType?.name ?? '-'
        );
        return mergedValues.join('<br>');
      }
    },
    width: 150
  };

  bdnQuantityCol: ITypedColDef<
    IControlTowerQuantitySupplyDifferenceItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.bdnQuantity,
    headerTooltip:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.bdnQuantity,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.bdnQuantity,
    field: model('id'),
    dtoForExport:
      ControlTowerQuantitySupplyDifferenceListExportColumns.bdnQuantity,
    cellRenderer: params => {
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => a.bdnQuantity ?? '-'
        );
        return mergedValues.join('<br>');
      }
    },
    filter: 'agNumberColumnFilter',
    width: 150
  };

  measuredDeliveredQty: ITypedColDef<
    IControlTowerQuantitySupplyDifferenceItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.measuredDeliveredQty,
    headerTooltip:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.measuredDeliveredQty,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.measuredDeliveredQty,
    dtoForExport:
      ControlTowerQuantitySupplyDifferenceListExportColumns.measuredDeliveredQty,
    cellRenderer: params => {
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => a.measuredDeliveredQuantity ?? '-'
        );
        return mergedValues.join('<br>');
      }
    },
    field: model('measuredDeliveredQty'),
    filter: 'agNumberColumnFilter',
    width: 150
  };

  differenceInQtyCol: ITypedColDef<
    IControlTowerQuantitySupplyDifferenceItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.differenceInQty,
    headerTooltip:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.differenceInQty,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.differenceInQty,
    field: model('differenceInQty'),
    autoHeight:true,
    wrapText:true,
    dtoForExport:
      ControlTowerQuantitySupplyDifferenceListExportColumns.differenceInQty,
    cellRenderer: params => {
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => a.differenceInSupplyQuantity ?? '-'
        );
        return mergedValues.join('<br>');
      }
    },
    filter: 'agNumberColumnFilter',
    width: 150
  };
  sumOfOrderQtyCol: ITypedColDef<
    IControlTowerQuantitySupplyDifferenceItemDto,
    number
  > = {
    headerName:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.sumOfOrderQtyCol,
    headerTooltip:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.sumOfOrderQtyCol,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.sumOfOrderQtyCol,
    field: model('sumOfOrderQtyCol'),
    dtoForExport:
      ControlTowerQuantitySupplyDifferenceListExportColumns.sumOfOrderQtyCol,
    cellRenderer: params => {
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => a.sumOfOrderQuantity ?? '-'
        );
        return mergedValues.join('<br>');
      }
    },
    filter: 'agNumberColumnFilter',
    width: 150
  };

  qtyUomCol: ITypedColDef<
    IControlTowerQuantitySupplyDifferenceItemDto,
    ILookupDto
  > = {
    headerName: ControlTowerQuantitySupplyDifferenceListColumnsLabels.qtyUom,
    headerTooltip: ControlTowerQuantitySupplyDifferenceListColumnsLabels.qtyUom,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.qtyUom,
    field: model('qtyUom'),
    dtoForExport: ControlTowerQuantitySupplyDifferenceListExportColumns.qtyUom,
    cellRenderer: params => {
      if (params.data) {
        let mergedValues = params.data.quantityReportDetails.map(
          a => a.supplyUom?.name ?? '-'
        );
        return mergedValues.join('<br>');
      }
    },
    width: 150
  };

  progressCol: ITypedColDef<
    IControlTowerQuantitySupplyDifferenceItemDto,
    IScheduleDashboardLabelConfigurationDto
  > = {
    headerName: ControlTowerQuantitySupplyDifferenceListColumnsLabels.progress,
    headerTooltip:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.progress,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.progress,
    field: model('progress'),
    dtoForExport:
      ControlTowerQuantitySupplyDifferenceListExportColumns.progress,
    cellRenderer: params => {
      if (params.value) {
        return this.computeProgressCellColor(params.value);
      }
    },
    width: 150
  };

  actionsCol: ITypedColDef<IControlTowerQuantitySupplyDifferenceItemDto> = {
    headerName: ControlTowerQuantitySupplyDifferenceListColumnsLabels.actions,
    headerTooltip:
      ControlTowerQuantitySupplyDifferenceListColumnsLabels.actions,
    colId: ControlTowerQuantitySupplyDifferenceListColumns.actions,
    headerClass: ['aggrid-text-align-c'],
    cellClass: ['aggridtextalign-center'],
    cellRendererFramework: AGGridCellActionsComponent,
    cellRendererParams: { type: 'actions' },
    resizable: false,
    suppressMovable: true,
    width: 110
  };

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    public dialog: MatDialog,
    private format: TenantFormattingService,
    private legacyLookupsDatabase: LegacyLookupsDatabase,
    private controlTowerService: ControlTowerService,
    private appErrorHandler: AppErrorHandler,
    private databaseManipulation: DatabaseManipulation,
    private toastr: ToastrService
  ) {
    super(
      'control-tower-quantity-supply-list-grid-5',
      columnPreferences,
      changeDetector,
      loggerFactory.createLogger(
        ControlTowerQuantitySupplyDifferenceListGridViewModel.name
      )
    );
    this.init(this.gridOptions, true);
    this.legacyLookupsDatabase
      .getTableByName('robDifferenceType')
      .then(response => {
        this.differenceType = response.filter(obj => obj.name == 'Supply')[0];
      });
  }

  getColumnsDefs(): any[] {
    return [
      this.portCallCol,
      this.portCol,
      this.vesselCol,
      this.etaCol,
      this.surveyorDate,
      this.emailToVesselCol,
      this.vesselToWatchCol,
      this.productTypeCol,
      this.bdnQuantityCol,
      this.measuredDeliveredQty,
      this.differenceInQtyCol,
      this.sumOfOrderQtyCol,
      this.qtyUomCol,
      this.progressCol,
      this.actionsCol
    ];
  }

  public onSearch(value: string): void {
    this.searchText = value;
    this.gridApi.purgeServerSideCache();
  }

  public updateValues(ev, values): void {
    if (values) {
      let payloadData = {
        differenceType: this.differenceType,
        quantityControlReport: {
          id: ev.data.quantityControlReport.id
        },
        status: values.data.status,
        comments: values.data.comments
      };

      this.controlTowerService
        .saveQuantityResiduePopUp(payloadData, payloadData => {
          console.log('asd');
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((response: any) => {
          if (typeof response == 'string') {
            this.toastr.error(response);
          } else {
            this.gridApi.purgeServerSideCache();
          }
        });
    }
    return;
  }
  public filterGridNew(statusName: string): void {
    if (this.toggleNewFilter) {
      this.filterByStatus(statusName);
    } else {
      this.filterByStatus('');
    }
  }

  public filterGridMAS(statusName: string): void {
    if (this.toggleMASFilter) {
      this.filterByStatus(statusName);
    } else {
      this.filterByStatus('');
    }
  }

  public filterGridResolved(statusName: string): void {
    if (this.toggleResolvedFilter) {
      this.filterByStatus(statusName);
    } else {
      this.filterByStatus('');
    }
  }

  public filterByStatus(statusName: string): void {
    const grid = this.gridApi.getFilterModel();
    grid['progress'] = {
      filterType: 'text',
      type: 'equals',
      filter: statusName
    };
    this.gridApi.setFilterModel(grid);
  }

  public checkStatusAvailable(): void {
    this.toggleNewFilter = true;
    this.toggleMASFilter = true;
    this.toggleResolvedFilter = true;
    const grid = this.gridApi.getFilterModel();
    for (let [key, value] of Object.entries(grid)) {
      if (key == 'progress') {
        if ((<any>value).type == 'equals') {
          if ((<any>value).filter === 'New') {
            this.toggleNewFilter = !this.toggleNewFilter;
            this.toggleMASFilter = true;
            this.toggleResolvedFilter = true;
          } else if ((<any>value).filter === 'MarkedAsSeen') {
            this.toggleMASFilter = !this.toggleMASFilter;
            this.toggleNewFilter = true;
            this.toggleResolvedFilter = true;
          } else if ((<any>value).filter === 'Resolved') {
            this.toggleResolvedFilter = !this.toggleResolvedFilter;
            this.toggleNewFilter = true;
            this.toggleMASFilter = true;
          }
        }
      }
    }
  }

  public filterByDate(from: string, to: string): void {
    const grid = this.gridApi.getFilterModel();
    grid['surveyorDate'] = {
      dateFrom: from,
      dateTo: to,
      type: 'inRange',
      filterType: 'date'
    };
    this.gridApi.setFilterModel(grid);
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    this.checkStatusAvailable();
    this.paramsServerSide = params;
    this.exportUrl = this.controlTowerService.getControlTowerQuantitySupplyDifferenceListExportUrl();
    this.controlTowerService
      .getControlTowerQuantitySupplyDifferenceList$(
        transformLocalToServeGridInfo(
          this.gridApi,
          params,
          ControlTowerQuantitySupplyDifferenceListColumnServerKeys,
          this.searchText
        )
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        response => {
          this.noOfNew = response.payload.noOfNew;
          this.noOfMarkedAsSeen = response.payload.noOfMarkedAsSeen;
          this.noOfResolved = response.payload.noOfResolved;
          params.successCallback(
            response.payload.items,
            response.payload.items[0]?.totalCount ?? 0
          );
        },
        () => {
          this.appErrorHandler.handleError(
            ModuleError.LoadControlTowerQuantitySupplyDifferenceFailed
          );
          params.failCallback();
        }
      );
  }

  computeProgressCellColor(value: ILookupDto) {
    let bgColor = 'none';
    switch (value.name) {
      case 'New':
        bgColor = ControlTowerProgressColors.new;
        break;
      case 'Marked as Seen':
        bgColor = ControlTowerProgressColors.markedAsSeen;
        break;
      case 'Resolved':
        bgColor = ControlTowerProgressColors.resolved;
        break;
    }
    return `<a class="btn-25" style="background-color:${bgColor}; color:#fff">${value.name}</a>`;
  }

  actionCellClicked = (ev: any) => {
    this.legacyLookupsDatabase
      .getTableByName('robDifferenceType')
      .then(response => {
        let rowData = ev.node.data;

        let productTypeList = rowData.quantityReportDetails.map(obj => {
          let rowObj = {};
          rowObj['productType'] = obj.productType.name;
          rowObj['bdnQuantity'] = obj.bdnQuantity;
          rowObj['measuredQuantity'] = obj.measuredDeliveredQuantity;
          rowObj['differenceQuantity'] = obj.differenceInSupplyQuantity;
          rowObj['uom'] = obj.supplyUom.name;
          return rowObj;
        });

        let dialogData: IControlTowerRowPopup = {
          popupType: 'supply',
          title: 'Quantity Supply Difference',
          measuredQuantityLabel: 'Measured Delivered Qty',
          differenceQuantityLabel: 'Difference in Qty',
          vessel: rowData.vessel,
          port: rowData.port,
          portCall: rowData.portCall.portCallId,
          quantityReportId: rowData.quantityControlReport.id,
          progressId: rowData.progress.id,
          productTypeList: productTypeList
        };

        let payloadData = {
          differenceType: response.filter(obj => obj.name == 'Supply')[0],
          quantityControlReport: {
            id: rowData.quantityControlReport.id
          }
        };

        this.controlTowerService
          .getQuantityResiduePopUp(payloadData, payloadData => {
            console.log('asd');
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            response => {
              dialogData.changeLog = response.payload.changeLog;
              const dialogRef = this.dialog.open(
                RowstatusOnchangeQuantityrobdiffPopupComponent,
                {
                  width: '520px',
                  height: 'auto',
                  maxHeight: '536px',
                  backdropClass: 'dark-popupBackdropClass',
                  panelClass: 'light-theme',
                  data: dialogData
                }
              );
              dialogRef.afterClosed().subscribe(result => {
                console.log(`Dialog result: ${result}`);
                console.log(ev);
                this.savePopupChanges(ev, result);
              });
            },
            () => {
              this.appErrorHandler.handleError(
                ModuleError.LoadControlTowerQuantitySupplyDifferencePopupFailed
              );
            }
          );
      });
  };

  savePopupChanges = (ev, result) => {
    if (result) {
      let payloadData = {
        differenceType: this.differenceType,
        quantityControlReport: {
          id: ev.data.quantityControlReport.id
        },
        status: result.data.status,
        comments: result.data.comments
      };

      this.controlTowerService
        .saveQuantityResiduePopUp(payloadData, payloadData => {
          console.log('asd');
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    }
  };
}
