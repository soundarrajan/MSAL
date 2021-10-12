import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { GridOptions, IServerSideGetRowsParams } from '@ag-grid-community/core';
import {
  ITypedColDef,
  RowModelType,
  RowSelection,
  TypedRowNode
} from '@shiptech/core/ui/components/ag-grid/type.definition';
import { AgCellTemplateComponent } from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';
import {
  QcReportsListColumns,
  QcReportsListColumnServerKeys,
  QcReportsListColumnsLabels
} from './qc-reports-list.columns';
import {
  IQcReportsListItemDto,
  IToleranceUomDto
} from '../../../services/api/dto/qc-reports-list-item.dto';
import { StatusLookupEnum } from '@shiptech/core/lookups/known-lookups/status/status-lookup.enum';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { ModuleLoggerFactory } from '../../../core/logging/module-logger-factory';
import { transformLocalToServeGridInfo } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters';
import { QcReportService } from '../../../services/qc-report.service';
import { ReconStatusLookupEnum } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.enum';
import { BooleanFilterParams } from '@shiptech/core/ui/components/ag-grid/ag-grid-utils';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { AppError } from '@shiptech/core/error-handling/app-error';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { ReconStatusLookup } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.service';
import { IReconStatusLookupDto } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.interface';
import { IStatusLookupDto } from '@shiptech/core/lookups/known-lookups/status/status-lookup.interface';
import { takeUntil } from 'rxjs/operators';
import { AgCheckBoxRendererComponent } from '@shiptech/core/ui/components/ag-grid/ag-check-box-renderer/ag-check-box-renderer.component';
import { AgCheckBoxHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-check-box-header/ag-check-box-header.component';
import { StatusLookup } from '@shiptech/core/lookups/known-lookups/status/status-lookup.service';

function model(prop: keyof IQcReportsListItemDto): keyof IQcReportsListItemDto {
  return prop;
}

@Injectable()
export class QcReportsListGridViewModel extends BaseGridViewModel {
  public paramsServerSide: IServerSideGetRowsParams;
  public searchText: string;
  public exportUrl: string;
  public defaultColFilterParams = {
    applyButton: true,
    resetButton: true,
    precision: () => this.format.quantityPrecision
  };
  gridOptions: GridOptions = {
    groupHeaderHeight: 20,
    headerHeight: 40,
    rowHeight: 40,

    rowModelType: RowModelType.ServerSide,
    pagination: true,
    animateRows: true,

    rowSelection: RowSelection.Multiple,
    suppressRowClickSelection: true,
    suppressContextMenu: true,

    multiSortKey: 'ctrl',

    isRowSelectable: (params: TypedRowNode<IQcReportsListItemDto>) =>
      params.data?.surveyStatus?.name !== StatusLookupEnum.Verified,
    enableBrowserTooltips: true,
    singleClickEdit: true,
    getRowNodeId: (data: IQcReportsListItemDto) =>
      data?.id?.toString() ?? Math.random().toString(),
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      filterParams: this.defaultColFilterParams
    }
  };

  selectCol: ITypedColDef<IQcReportsListItemDto> = {
    colId: QcReportsListColumns.selection,
    width: 50,
    ...AgCheckBoxHeaderComponent.withParams({}),
    ...AgCheckBoxRendererComponent.withParams<IQcReportsListItemDto>({
      isVisible: params =>
        params.data?.surveyStatus?.name !== StatusLookupEnum.Verified
    }),
    editable: false,
    filter: false,
    sortable: false,
    suppressMenu: true,
    resizable: false,
    suppressAutoSize: true,
    suppressSizeToFit: true,
    suppressMovable: true,
    suppressNavigable: true,
    suppressColumnsToolPanel: false,
    suppressFiltersToolPanel: true,
    suppressCellFlash: true,
    suppressPaste: true,
    lockPosition: true,
    lockVisible: true,
    cellClass: 'cell-border-green'
  };

  portCallId: ITypedColDef<IQcReportsListItemDto, string> = {
    headerName: QcReportsListColumnsLabels.portCallId,
    colId: QcReportsListColumns.portCallId,
    field: model('portCallId'),
    cellRendererFramework: AgCellTemplateComponent,
    width: 200
  };

  portNameCol: ITypedColDef<IQcReportsListItemDto, string> = {
    headerName: QcReportsListColumnsLabels.portName,
    colId: QcReportsListColumns.portName,
    field: model('portName'),
    cellRenderer: params => {
      var a = document.createElement('div');
      a.innerHTML = params.value;
      return a;
    },
    width: 106
  };

  vesselNameCol: ITypedColDef<IQcReportsListItemDto, string> = {
    headerName: QcReportsListColumnsLabels.vesselName,
    colId: QcReportsListColumns.vesselName,
    field: model('vesselName'),
    cellRenderer: params => {
      var a = document.createElement('div');
      a.innerHTML = params.value;
      return a;
    },
    width: 129
  };

  surveyDateCol: ITypedColDef<IQcReportsListItemDto, string> = {
    headerName: QcReportsListColumnsLabels.surveyDate,
    colId: QcReportsListColumns.surveyDate,
    field: model('surveyDate'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    width: 150
  };

  surveyStatusCol: ITypedColDef<IQcReportsListItemDto, IStatusLookupDto> = {
    headerName: QcReportsListColumnsLabels.surveyStatus,
    colId: QcReportsListColumns.surveyStatus,
    field: model('surveyStatus'),
    valueFormatter: params => params.value?.displayName,
    cellStyle: params => ({
      backgroundColor: this.statusLookup.getStatus(params.data?.surveyStatus)
        ?.code,
      color: this.statusLookup.getStatus(params.data?.surveyStatus)?.id
        ? '#fff'
        : '#333'
    }),
    width: 85
  };

  qtyMatchedStatusCol: ITypedColDef<
    IQcReportsListItemDto,
    IReconStatusLookupDto
  > = {
    headerName: QcReportsListColumnsLabels.qtyMatchedStatus,
    colId: QcReportsListColumns.qtyMatchedStatus,
    field: model('qtyMatchedStatus'),
    valueFormatter: params => params.value?.displayName,
    cellStyle: params => ({
      backgroundColor: params.data?.qtyMatchedStatus?.code ?? 'inherit',
      color: !!params.data?.qtyMatchedStatus ? '#fff' : 'inherit'
    }),
    width: 96
  };

  logBookRobBeforeDeliveryCol: ITypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.logBookRobBeforeDelivery,
    colId: QcReportsListColumns.logBookRobBeforeDelivery,
    field: model('logBookRobBeforeDelivery'),
    width: 170,
    valueFormatter: params => this.format.quantity(params.value),
    filter: 'agNumberColumnFilter'
  };

  measuredRobBeforeDeliveryCol: ITypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.measuredRobBeforeDelivery,
    colId: QcReportsListColumns.measuredRobBeforeDelivery,
    field: model('measuredRobBeforeDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    width: 195
  };

  diffRobBeforeDeliveryCol: ITypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.diffRobBeforeDelivery,
    colId: QcReportsListColumns.diffRobBeforeDelivery,
    field: model('diffRobBeforeDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    cellStyle: params =>
      this.toleranceMatchStyle(
        params.data?.diffRobBeforeDelivery,
        params.data?.qtyBeforeDeliveryUom
      ),
    width: 140
  };

  qtyBeforeDeliveryUomCol: ITypedColDef<
    IQcReportsListItemDto,
    IToleranceUomDto
  > = {
    headerName: QcReportsListColumnsLabels.qtyBeforeDeliveryUom,
    colId: QcReportsListColumns.qtyBeforeDeliveryUom,
    field: model('qtyBeforeDeliveryUom'),
    cellRenderer: params => {
      var a = document.createElement('div');
      a.innerHTML = params.value?.name;
      return a;
    },
    valueFormatter: params => params.value?.name
  };

  bdnQuantityCol: ITypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.bdnQuantity,
    colId: QcReportsListColumns.bdnQuantity,
    field: model('bdnQuantity'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  measuredDeliveredQtyCol: ITypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.measuredDeliveredQty,
    colId: QcReportsListColumns.measuredDeliveredQty,
    field: model('measuredDeliveredQty'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  diffDeliveredQtyCol: ITypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.diffDeliveredQty,
    colId: QcReportsListColumns.diffDeliveredQty,
    field: model('diffDeliveredQty'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    cellStyle: params =>
      this.toleranceMatchStyle(
        params.data?.diffDeliveredQty,
        params.data?.qtyDeliveredUom
      )
  };

  qtyDeliveredUomCol: ITypedColDef<IQcReportsListItemDto, IToleranceUomDto> = {
    headerName: QcReportsListColumnsLabels.qtyDeliveredUom,
    colId: QcReportsListColumns.qtyDeliveredUom,
    field: model('qtyDeliveredUom'),
    cellRenderer: params => {
      var a = document.createElement('div');
      a.innerHTML = params.value?.name;
      return a;
    },
    valueFormatter: params => params.value?.name
  };

  logBookRobAfterDeliveryCol: ITypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.logBookRobAfterDelivery,
    colId: QcReportsListColumns.logBookRobAfterDelivery,
    field: model('logBookRobAfterDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  measuredRobAfterDeliveryCol: ITypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.measuredRobAfterDelivery,
    colId: QcReportsListColumns.measuredRobAfterDelivery,
    field: model('measuredRobAfterDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  diffRobAfterDeliveryCol: ITypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.diffRobAfterDelivery,
    colId: QcReportsListColumns.diffRobAfterDelivery,
    field: model('diffRobAfterDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    cellStyle: params =>
      this.toleranceMatchStyle(
        params.data?.diffRobAfterDelivery,
        params?.data?.qtyAfterDeliveryUom
      )
  };

  qtyAfterDeliveryUomCol: ITypedColDef<
    IQcReportsListItemDto,
    IToleranceUomDto
  > = {
    headerName: QcReportsListColumnsLabels.qtyAfterDeliveryUom,
    colId: QcReportsListColumns.qtyAfterDeliveryUom,
    field: model('qtyAfterDeliveryUom'),
    cellRenderer: params => {
      var a = document.createElement('div');
      a.innerHTML = params.value?.name;
      return a;
    },
    valueFormatter: params => params.value?.name
  };

  logBookSludgeRobBeforeDischargeCol: ITypedColDef<
    IQcReportsListItemDto,
    number
  > = {
    headerName: QcReportsListColumnsLabels.logBookSludgeRobBeforeDischarge,
    colId: QcReportsListColumns.logBookSludgeRobBeforeDischarge,
    field: model('logBookSludgeRobBeforeDischarge'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  measuredSludgeRobBeforeDischargeCol: ITypedColDef<
    IQcReportsListItemDto,
    number
  > = {
    headerName: QcReportsListColumnsLabels.measuredSludgeRobBeforeDischarge,
    colId: QcReportsListColumns.measuredSludgeRobBeforeDischarge,
    field: model('measuredSludgeRobBeforeDischarge'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  diffSludgeRobBeforeDischargeCol: ITypedColDef<
    IQcReportsListItemDto,
    number
  > = {
    headerName: QcReportsListColumnsLabels.diffSludgeRobBeforeDischarge,
    colId: QcReportsListColumns.diffSludgeRobBeforeDischarge,
    field: model('diffSludgeRobBeforeDischarge'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    cellStyle: params =>
      this.toleranceMatchStyleSecond(
        params.data?.diffSludgeRobBeforeDischarge,
        params?.data?.qtySludgeDischargedUom
      )
  };

  sludgeDischargedQtyCol: ITypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.sludgeDischargedQty,
    colId: QcReportsListColumns.sludgeDischargedQty,
    field: model('sludgeDischargedQty'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  qtySludgeDischargedUomCol: ITypedColDef<
    IQcReportsListItemDto,
    IToleranceUomDto
  > = {
    headerName: QcReportsListColumnsLabels.qtySludgeDischargedUom,
    colId: QcReportsListColumns.qtySludgeDischargedUom,
    field: model('qtySludgeDischargedUom'),
    cellRenderer: params => {
      var a = document.createElement('div');
      a.innerHTML = params.value?.name;
      return a;
    },
    valueFormatter: params => params.value?.name
  };

  commentCol: ITypedColDef<IQcReportsListItemDto, string> = {
    headerName: QcReportsListColumnsLabels.comment,
    colId: QcReportsListColumns.comment,
    field: model('comment'),
    cellRenderer: params => {
      var a = document.createElement('div');
      a.innerHTML = params.valueFormatted ?? params.value;
      return a;
    },
    tooltipValueGetter: params => params.valueFormatted ?? params.value
  };

  isVerifiedSludgeQtyCol: ITypedColDef<IQcReportsListItemDto, string> = {
    headerName: QcReportsListColumnsLabels.isVerifiedSludgeQty,
    colId: QcReportsListColumns.isVerifiedSludgeQty,
    field: model('isVerifiedSludgeQty'),
    cellRendererFramework: AgCellTemplateComponent,
    filter: 'agNumberColumnFilter',
    filterParams: {
      ...this.defaultColFilterParams,
      ...BooleanFilterParams
    }
  };

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    private format: TenantFormattingService,
    private reconStatusLookups: ReconStatusLookup,
    private reportService: QcReportService,
    private appErrorHandler: AppErrorHandler,
    private statusLookup: StatusLookup
  ) {
    super(
      'quantity-control-grid-2',
      columnPreferences,
      changeDetector,
      loggerFactory.createLogger(QcReportsListGridViewModel.name)
    );
    this.init(this.gridOptions, true);
  }

  getColumnsDefs(): ITypedColDef[] {
    return [
      this.selectCol,
      this.portCallId,
      this.portNameCol,
      this.vesselNameCol,
      this.surveyDateCol,
      this.surveyStatusCol,
      this.qtyMatchedStatusCol,
      this.logBookRobBeforeDeliveryCol,
      this.measuredRobBeforeDeliveryCol,
      this.diffRobBeforeDeliveryCol,
      this.qtyBeforeDeliveryUomCol,
      this.bdnQuantityCol,
      this.measuredDeliveredQtyCol,
      this.diffDeliveredQtyCol,
      this.qtyDeliveredUomCol,
      this.logBookRobAfterDeliveryCol,
      this.measuredRobAfterDeliveryCol,
      this.diffRobAfterDeliveryCol,
      this.qtyAfterDeliveryUomCol,
      this.logBookSludgeRobBeforeDischargeCol,
      this.measuredSludgeRobBeforeDischargeCol,
      this.diffSludgeRobBeforeDischargeCol,
      this.sludgeDischargedQtyCol,
      this.qtySludgeDischargedUomCol,
      this.commentCol,
      this.isVerifiedSludgeQtyCol
    ];
  }

  public onSearch(value: string): void {
    this.searchText = value;
    this.gridApi.purgeServerSideCache();
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    this.paramsServerSide = params;
    this.exportUrl = this.reportService.getQcReportListExportUrl();
    this.reportService
      .getReportsList$(
        transformLocalToServeGridInfo(
          this.gridApi,
          params,
          QcReportsListColumnServerKeys,
          this.searchText
        )
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        response => params.successCallback(response.items, response.totalCount),
        () => {
          this.appErrorHandler.handleError(
            AppError.FailedToLoadMastersData('vessel')
          );
          params.failCallback();
        }
      );
  }

  private toleranceMatchStyle(
    value: number,
    toleranceUom: IToleranceUomDto
  ): Partial<CSSStyleDeclaration> {
    if (
      value === null ||
      value === undefined ||
      toleranceUom === null ||
      toleranceUom === undefined
    )
      return {
        backgroundColor: 'inherit',
        color: 'inherit'
      };

    let status = this.reconStatusLookups.matched;

    if (Math.abs(value) >= toleranceUom.maxTolerance)
      status = this.reconStatusLookups.notMatched;

    if (
      Math.abs(value) > toleranceUom.minTolerance &&
      Math.abs(value) < toleranceUom.maxTolerance
    )
      status = this.reconStatusLookups.withinLimit;

    return {
      backgroundColor:
        status.name === ReconStatusLookupEnum.Matched ? 'inherit' : status.code,
      color: status.name === ReconStatusLookupEnum.Matched ? 'inherit' : '#fff'
    };
  }

  private toleranceMatchStyleSecond(
    value: number,
    toleranceUom: IToleranceUomDto
  ): Partial<CSSStyleDeclaration> {
    if (
      value === null ||
      value === undefined ||
      toleranceUom === null ||
      toleranceUom === undefined
    )
      return {
        backgroundColor: 'inherit',
        color: 'inherit'
      };

    let status = this.reconStatusLookups.matched;

    if (Math.abs(value) >= toleranceUom.maxTolerance)
      status = this.reconStatusLookups.notMatched;

    if (
      Math.abs(value) > toleranceUom.minTolerance &&
      Math.abs(value) < toleranceUom.maxTolerance
    )
      status = this.reconStatusLookups.withinLimit;

    return {
      backgroundColor:
        status.name === ReconStatusLookupEnum.Matched ? 'inherit' : status.code,
      color: status.name === ReconStatusLookupEnum.Matched ? 'inherit' : '#fff'
    };
  }
}
