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
  QcReportsListColumnsLabels,
  QcReportsListExportColumns
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
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { IDeliveryTenantSettings } from '../../../core/settings/delivery-tenant-settings';
import { TenantSettingsModuleName } from '@shiptech/core/store/states/tenant/tenant-settings.interface';

function model(prop: keyof IQcReportsListItemDto): keyof IQcReportsListItemDto {
  return prop;
}

@Injectable()
export class QcReportsListGridViewModel extends BaseGridViewModel {
  public paramsServerSide: IServerSideGetRowsParams;
  public searchText: string;
  public exportUrl: string;
  public defaultColFilterParams = {
    buttons:['reset', 'apply'],
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
    dtoForExport: QcReportsListExportColumns.portCallId,
    field: model('portCallId'),
    cellRendererFramework: AgCellTemplateComponent,
    width: 200
  };

  portNameCol: ITypedColDef<IQcReportsListItemDto, string> = {
    headerName: QcReportsListColumnsLabels.portName,
    colId: QcReportsListColumns.portName,
    dtoForExport: QcReportsListExportColumns.portName,
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
    dtoForExport: QcReportsListExportColumns.vesselName,
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
    dtoForExport: QcReportsListExportColumns.surveyDate,
    field: model('surveyDate'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    width: 150
  };

  surveyStatusCol: ITypedColDef<IQcReportsListItemDto, IStatusLookupDto> = {
    headerName: QcReportsListColumnsLabels.surveyStatus,
    colId: QcReportsListColumns.surveyStatus,
    dtoForExport: QcReportsListExportColumns.surveyStatus,
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
    dtoForExport: QcReportsListExportColumns.qtyMatchedStatus,
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
    dtoForExport: QcReportsListExportColumns.logBookRobBeforeDelivery,
    field: model('logBookRobBeforeDelivery'),
    width: 200,
    valueFormatter: params => this.format.quantity(params.value),
    filter: 'agNumberColumnFilter'
  };

  measuredRobBeforeDeliveryCol: ITypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.measuredRobBeforeDelivery,
    colId: QcReportsListColumns.measuredRobBeforeDelivery,
    dtoForExport: QcReportsListExportColumns.measuredRobBeforeDelivery,
    field: model('measuredRobBeforeDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    width: 210
  };

  diffRobBeforeDeliveryCol: ITypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.diffRobBeforeDelivery,
    colId: QcReportsListColumns.diffRobBeforeDelivery,
    dtoForExport: QcReportsListExportColumns.diffRobBeforeDelivery,
    field: model('diffRobBeforeDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    cellStyle: params =>
      this.getMatchStatusForRobBeforeDiffAndDeliveredDiff(
        params.data?.diffRobBeforeDelivery,
        this.robTolerance
      ),
    width: 140
  };

  qtyBeforeDeliveryUomCol: ITypedColDef<
    IQcReportsListItemDto,
    IToleranceUomDto
  > = {
    headerName: QcReportsListColumnsLabels.qtyBeforeDeliveryUom,
    colId: QcReportsListColumns.qtyBeforeDeliveryUom,
    dtoForExport: QcReportsListExportColumns.qtyBeforeDeliveryUom,
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
    dtoForExport: QcReportsListExportColumns.bdnQuantity,
    field: model('bdnQuantity'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  measuredDeliveredQtyCol: ITypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.measuredDeliveredQty,
    colId: QcReportsListColumns.measuredDeliveredQty,
    dtoForExport: QcReportsListExportColumns.measuredDeliveredQty,
    field: model('measuredDeliveredQty'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  diffDeliveredQtyCol: ITypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.diffDeliveredQty,
    colId: QcReportsListColumns.diffDeliveredQty,
    dtoForExport: QcReportsListExportColumns.diffDeliveredQty,
    field: model('diffDeliveredQty'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    cellStyle: params =>
      this.getMatchStatusForRobBeforeDiffAndDeliveredDiff(
        params.data?.diffDeliveredQty,
        this.bdnTolerance
      )
  };

  qtyDeliveredUomCol: ITypedColDef<IQcReportsListItemDto, IToleranceUomDto> = {
    headerName: QcReportsListColumnsLabels.qtyDeliveredUom,
    colId: QcReportsListColumns.qtyDeliveredUom,
    dtoForExport: QcReportsListExportColumns.qtyDeliveredUom,
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
    dtoForExport: QcReportsListExportColumns.logBookRobAfterDelivery,
    field: model('logBookRobAfterDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  measuredRobAfterDeliveryCol: ITypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.measuredRobAfterDelivery,
    colId: QcReportsListColumns.measuredRobAfterDelivery,
    dtoForExport: QcReportsListExportColumns.measuredRobAfterDelivery,
    field: model('measuredRobAfterDelivery'),
    filter: 'agNumberColumnFilter',
    width: 240,
    valueFormatter: params => this.format.quantity(params.value)
  };

  diffRobAfterDeliveryCol: ITypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.diffRobAfterDelivery,
    colId: QcReportsListColumns.diffRobAfterDelivery,
    dtoForExport: QcReportsListExportColumns.diffRobAfterDelivery,
    field: model('diffRobAfterDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    cellStyle: params =>
      this.getMatchStatusForRobAfterDiff(params.data?.diffRobAfterDelivery, 0)
  };

  qtyAfterDeliveryUomCol: ITypedColDef<
    IQcReportsListItemDto,
    IToleranceUomDto
  > = {
    headerName: QcReportsListColumnsLabels.qtyAfterDeliveryUom,
    colId: QcReportsListColumns.qtyAfterDeliveryUom,
    dtoForExport: QcReportsListExportColumns.qtyAfterDeliveryUom,
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
    dtoForExport: QcReportsListExportColumns.logBookSludgeRobBeforeDischarge,
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
    dtoForExport: QcReportsListExportColumns.measuredSludgeRobBeforeDischarge,
    field: model('measuredSludgeRobBeforeDischarge'),
    filter: 'agNumberColumnFilter',
    width: 230,
    valueFormatter: params => this.format.quantity(params.value)
  };

  diffSludgeRobBeforeDischargeCol: ITypedColDef<
    IQcReportsListItemDto,
    number
  > = {
    headerName: QcReportsListColumnsLabels.diffSludgeRobBeforeDischarge,
    colId: QcReportsListColumns.diffSludgeRobBeforeDischarge,
    dtoForExport: QcReportsListExportColumns.diffSludgeRobBeforeDischarge,
    field: model('diffSludgeRobBeforeDischarge'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    cellStyle: params =>
      this.getMatchStatusForRobBeforeDiffAndDeliveredDiff(
        params.data?.diffSludgeRobBeforeDischarge,
        this.robTolerance
      )
  };

  sludgeDischargedQtyCol: ITypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.sludgeDischargedQty,
    colId: QcReportsListColumns.sludgeDischargedQty,
    dtoForExport: QcReportsListExportColumns.sludgeDischargedQty,
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
    dtoForExport: QcReportsListExportColumns.qtySludgeDischargedUom,
    field: model('qtySludgeDischargedUom'),
    cellRenderer: params => {
      var a = document.createElement('div');
      a.innerHTML = params.value?.name;
      return a;
    },
    valueFormatter: params => params.value?.name
  };

  logBookBilgeRobBeforeDischargeCol: ITypedColDef<
    IQcReportsListItemDto,
    number
  > = {
    headerName: QcReportsListColumnsLabels.logBookBilgeRobBeforeDischarge,
    colId: QcReportsListColumns.logBookBilgeRobBeforeDischarge,
    dtoForExport: QcReportsListExportColumns.logBookBilgeRobBeforeDischarge,
    field: model('logBookBilgeRobBeforeDischarge'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  measuredBilgeRobBeforeDischargeCol: ITypedColDef<
    IQcReportsListItemDto,
    number
  > = {
    headerName: QcReportsListColumnsLabels.measuredBilgeRobBeforeDischarge,
    colId: QcReportsListColumns.measuredBilgeRobBeforeDischarge,
    dtoForExport: QcReportsListExportColumns.measuredBilgeRobBeforeDischarge,
    field: model('measuredBilgeRobBeforeDischarge'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  diffBilgeRobBeforeDischargeCol: ITypedColDef<
    IQcReportsListItemDto,
    number
  > = {
    headerName: QcReportsListColumnsLabels.diffBilgeRobBeforeDischarge,
    colId: QcReportsListColumns.diffBilgeRobBeforeDischarge,
    dtoForExport: QcReportsListExportColumns.diffBilgeRobBeforeDischarge,
    field: model('diffBilgeRobBeforeDischarge'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    cellStyle: params =>
      this.getMatchStatusForRobBeforeDiffAndDeliveredDiff(
        params.data?.diffBilgeRobBeforeDischarge,
        this.robTolerance
      )
  };

  bilgeDischargedQtyCol: ITypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.bilgeDischargedQty,
    colId: QcReportsListColumns.bilgeDischargedQty,
    dtoForExport: QcReportsListExportColumns.bilgeDischargedQty,
    field: model('bilgeDischargedQty'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  qtyBilgeDischargedUomCol: ITypedColDef<
    IQcReportsListItemDto,
    IToleranceUomDto
  > = {
    headerName: QcReportsListColumnsLabels.qtyBilgeDischargedUom,
    colId: QcReportsListColumns.qtyBilgeDischargedUom,
    dtoForExport: QcReportsListExportColumns.qtyBilgeDischargedUom,
    field: model('qtyBilgeDischargedUom'),
    cellRenderer: params => {
      var a = document.createElement('div');
      a.innerHTML = params.value?.name;
      return a;
    },
    valueFormatter: params => params.value?.name
  };

  logBookEGCSRobBeforeDischargeCol: ITypedColDef<
    IQcReportsListItemDto,
    number
  > = {
    headerName: QcReportsListColumnsLabels.logBookEGCSRobBeforeDischarge,
    colId: QcReportsListColumns.logBookEGCSRobBeforeDischarge,
    dtoForExport: QcReportsListExportColumns.logBookEGCSRobBeforeDischarge,
    field: model('logBookEGCSRobBeforeDischarge'),
    filter: 'agNumberColumnFilter',
    width: 240,
    valueFormatter: params => this.format.quantity(params.value)
  };

  measuredEGCSRobBeforeDischargeCol: ITypedColDef<
    IQcReportsListItemDto,
    number
  > = {
    headerName: QcReportsListColumnsLabels.measuredEGCSRobBeforeDischarge,
    colId: QcReportsListColumns.measuredEGCSRobBeforeDischarge,
    dtoForExport: QcReportsListExportColumns.measuredEGCSRobBeforeDischarge,
    field: model('measuredEGCSRobBeforeDischarge'),
    filter: 'agNumberColumnFilter',
    width: 240,
    valueFormatter: params => this.format.quantity(params.value)
  };

  diffEGCSRobBeforeDischargeCol: ITypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.diffEGCSRobBeforeDischarge,
    colId: QcReportsListColumns.diffEGCSRobBeforeDischarge,
    dtoForExport: QcReportsListExportColumns.diffEGCSRobBeforeDischarge,
    field: model('diffEGCSRobBeforeDischarge'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    cellStyle: params =>
      this.getMatchStatusForRobBeforeDiffAndDeliveredDiff(
        params.data?.diffEGCSRobBeforeDischarge,
        this.robTolerance
      )
  };

  egcsDischargedQtyCol: ITypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.egcsDischargedQty,
    colId: QcReportsListColumns.egcsDischargedQty,
    dtoForExport: QcReportsListExportColumns.egcsDischargedQty,
    field: model('egcsDischargedQty'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  qtyEGCSDischargedUomCol: ITypedColDef<
    IQcReportsListItemDto,
    IToleranceUomDto
  > = {
    headerName: QcReportsListColumnsLabels.qtyEGCSDischargedUom,
    colId: QcReportsListColumns.qtyEGCSDischargedUom,
    dtoForExport: QcReportsListExportColumns.qtyEGCSDischargedUom,
    field: model('qtyEGCSDischargedUom'),
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
    dtoForExport: QcReportsListExportColumns.comment,
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
    dtoForExport: QcReportsListExportColumns.isVerifiedSludgeQty,
    field: model('isVerifiedSludgeQty'),
    cellRendererFramework: AgCellTemplateComponent,
    filter: 'agNumberColumnFilter',
    filterParams: {
      ...this.defaultColFilterParams,
      ...BooleanFilterParams
    }
  };
  private readonly robTolerance;
  private readonly bdnTolerance;

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    private format: TenantFormattingService,
    private reconStatusLookups: ReconStatusLookup,
    private reportService: QcReportService,
    private appErrorHandler: AppErrorHandler,
    private statusLookup: StatusLookup,
    tenantSettings: TenantSettingsService
  ) {
    super(
      'quantity-control-grid-v3',
      columnPreferences,
      changeDetector,
      loggerFactory.createLogger(QcReportsListGridViewModel.name)
    );

    this.init(this.gridOptions, true);

    const deliveryTenantSettings = tenantSettings.getModuleTenantSettings<
      IDeliveryTenantSettings
    >(TenantSettingsModuleName.Delivery);

    this.robTolerance = deliveryTenantSettings.robTolerance;
    this.bdnTolerance = deliveryTenantSettings.maxToleranceLimit;
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
      this.logBookBilgeRobBeforeDischargeCol,
      this.measuredBilgeRobBeforeDischargeCol,
      this.diffBilgeRobBeforeDischargeCol,
      this.bilgeDischargedQtyCol,
      this.qtyBilgeDischargedUomCol,
      this.logBookEGCSRobBeforeDischargeCol,
      this.measuredEGCSRobBeforeDischargeCol,
      this.diffEGCSRobBeforeDischargeCol,
      this.egcsDischargedQtyCol,
      this.qtyEGCSDischargedUomCol,
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

  private getMatchStatusForRobBeforeDiffAndDeliveredDiff(
    value: number,
    tolerance: number
  ): Partial<CSSStyleDeclaration> {
    if (value === null || value === undefined)
      return {
        backgroundColor: 'inherit',
        color: 'inherit'
      };

    let status = this.reconStatusLookups.matched;

    if (Math.abs(value) > tolerance)
      status = this.reconStatusLookups.notMatched;
    if (Math.abs(value) <= tolerance) status = this.reconStatusLookups.matched;

    return {
      backgroundColor: status.code,
      color: '#fff'
    };
  }

  public getMatchStatusForRobAfterDiff(
    value: number,
    tolerance: number
  ): Partial<CSSStyleDeclaration> {
    if (value === null || value === undefined)
      return {
        backgroundColor: 'inherit',
        color: 'inherit'
      };

    let status = this.reconStatusLookups.matched;

    if (Math.abs(value) != 0) status = this.reconStatusLookups.notMatched;

    if (Math.abs(value) == tolerance) status = this.reconStatusLookups.matched;

    return {
      backgroundColor: status.code,
      color: '#fff'
    };
  }
}
