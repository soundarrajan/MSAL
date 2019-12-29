import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { GridOptions, IServerSideGetRowsParams } from 'ag-grid-community';
import { RowModelType, RowSelection, TypedColDef } from '@shiptech/core/ui/components/ag-grid/type.definition';
import { AgCellTemplateComponent } from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';
import { QcReportsListColumns, QcReportsListColumnServerKeys, QcReportsListColumnsLabels } from './qc-reports-list.columns';
import { IQcReportsListItemDto } from '../../../services/api/dto/qc-reports-list-item.dto';
import { SurveyStatusEnum } from '../../../core/enums/survey-status.enum';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { ModuleLoggerFactory } from '../../../core/logging/module-logger-factory';
import { transformLocalToServeGridInfo } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters';
import { QcReportService } from '../../../services/qc-report.service';
import { QuantityMatchStatusEnum } from '../../../core/enums/quantity-match-status';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { BooleanFilterParams } from '@shiptech/core/ui/components/ag-grid/ag-grid-utils';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { AppError } from '@shiptech/core/error-handling/app-error';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { IDeliveryTenantSettings } from '../../../core/settings/delivery-tenant-settings';
import { TenantSettingsModuleName } from '@shiptech/core/store/states/tenant/tenant-settings.interface';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';

function model(prop: keyof IQcReportsListItemDto): keyof IQcReportsListItemDto {
  return prop;
}

@Injectable()
export class QcReportsListGridViewModel extends BaseGridViewModel {

  private defaultColFilterParams = {
    clearButton: true,
    applyButton: true,
    precision: () => this.format.quantityPrecision
  };

  public searchText: string;
  gridOptions: GridOptions = {
    groupHeaderHeight: 20,
    headerHeight: 40,
    rowHeight: 40,

    rowModelType: RowModelType.ServerSide,
    pagination: true,
    animateRows: true,

    rowSelection: RowSelection.Multiple,
    suppressRowClickSelection: true,

    multiSortKey: 'ctrl',

    enableBrowserTooltips: true,
    singleClickEdit: true,
    getRowNodeId: (data: IQcReportsListItemDto) => data?.id?.toString() ?? Math.random().toString(),
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      filterParams: this.defaultColFilterParams
    }
  };

  selectCol: TypedColDef<IQcReportsListItemDto> = {
    colId: QcReportsListColumns.selection,
    width: 50,
    checkboxSelection: params => params.data?.surveyStatus?.name === SurveyStatusEnum.New || params.data?.surveyStatus?.name === SurveyStatusEnum.Pending,
    editable: false,
    filter: false,
    sortable: false,
    suppressMenu: true,
    resizable: false,
    suppressAutoSize: true,
    suppressSizeToFit: true,
    suppressMovable: true,
    suppressNavigable: true,
    suppressColumnsToolPanel: true,
    suppressFiltersToolPanel: true,
    suppressCellFlash: true,
    suppressPaste: true,
    lockPosition: true,
    lockVisible: true,
    cellClass: 'cell-border-green'
  };

  portCallId: TypedColDef<IQcReportsListItemDto, string> = {
    headerName: QcReportsListColumnsLabels.portCallId,
    colId: QcReportsListColumns.portCallId,
    field: model('portCallId'),
    cellRendererFramework: AgCellTemplateComponent
  };

  portNameCol: TypedColDef<IQcReportsListItemDto, string> = {
    headerName: QcReportsListColumnsLabels.portName,
    colId: QcReportsListColumns.portName,
    field: model('portName'),
    width: 106
  };

  vesselNameCol: TypedColDef<IQcReportsListItemDto, string> = {
    headerName: QcReportsListColumnsLabels.vesselName,
    colId: QcReportsListColumns.vesselName,
    field: model('vesselName'),
    width: 129
  };

  surveyDateCol: TypedColDef<IQcReportsListItemDto, string> = {
    headerName: QcReportsListColumnsLabels.surveyDate,
    colId: QcReportsListColumns.surveyDate,
    field: model('surveyDate'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    width: 150
  };

  surveyStatusCol: TypedColDef<IQcReportsListItemDto, IDisplayLookupDto> = {
    headerName: QcReportsListColumnsLabels.surveyStatus,
    colId: QcReportsListColumns.surveyStatus,
    field: model('surveyStatus'),
    valueFormatter: params => params.value?.displayName,
    cellClass: 'cell-background',
    cellClassRules: {
      'pending': params => params.data?.surveyStatus?.name === SurveyStatusEnum.Pending,
      'verified': params => params.data?.surveyStatus?.name === SurveyStatusEnum.Verified
    },
    width: 78
  };

  qtyMatchedStatusCol: TypedColDef<IQcReportsListItemDto, IDisplayLookupDto> = {
    headerName: QcReportsListColumnsLabels.qtyMatchedStatus,
    colId: QcReportsListColumns.qtyMatchedStatus,
    field: model('qtyMatchedStatus'),
    valueFormatter: params => params.value?.displayName,
    cellClass: 'cell-background',
    cellClassRules: {
      'matched': params => params.data?.qtyMatchedStatus?.name === QuantityMatchStatusEnum.Matched,
      'matched-withing-limit': params => params.data?.qtyMatchedStatus?.name === QuantityMatchStatusEnum.WithinLimit,
      'not-matched': params => params.data?.qtyMatchedStatus?.name === QuantityMatchStatusEnum.NotMatched
    },
    width: 96
  };

  logBookRobBeforeDeliveryCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.logBookRobBeforeDelivery,
    colId: QcReportsListColumns.logBookRobBeforeDelivery,
    field: model('logBookRobBeforeDelivery'),
    width: 153,
    valueFormatter: params => this.format.quantity(params.value),
    filter: 'agNumberColumnFilter'
  };

  measuredRobBeforeDeliveryCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.measuredRobBeforeDelivery,
    colId: QcReportsListColumns.measuredRobBeforeDelivery,
    field: model('measuredRobBeforeDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    width: 181
  };

  diffRobBeforeDeliveryCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.diffRobBeforeDelivery,
    colId: QcReportsListColumns.diffRobBeforeDelivery,
    field: model('diffRobBeforeDelivery'),
    filter: 'agNumberColumnFilter',
    cellClass: 'cell-background',
    valueFormatter: params => this.format.quantity(params.value),
    cellClassRules: {
      'not-matched': params => Math.abs(params.data?.diffRobBeforeDelivery) > this.maxToleranceLimit,
      'matched-withing-limit': params => Math.abs(params.data?.diffRobBeforeDelivery) < this.minToleranceLimit,
    },
    width: 128
  };

  qtyBeforeDeliveryUomCol: TypedColDef<IQcReportsListItemDto, IDisplayLookupDto> = {
    headerName: QcReportsListColumnsLabels.qtyBeforeDeliveryUom,
    colId: QcReportsListColumns.qtyBeforeDeliveryUom,
    field: model('qtyBeforeDeliveryUom'),
    valueFormatter: params => params.value?.displayName
  };

  bdnQuantityCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.bdnQuantity,
    colId: QcReportsListColumns.bdnQuantity,
    field: model('bdnQuantity'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  measuredDeliveredQtyCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.measuredDeliveredQty,
    colId: QcReportsListColumns.measuredDeliveredQty,
    field: model('measuredDeliveredQty'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  diffDeliveredQtyCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.diffDeliveredQty,
    colId: QcReportsListColumns.diffDeliveredQty,
    field: model('diffDeliveredQty'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    cellClass: 'cell-background',
    cellClassRules: {
      'not-matched': params => Math.abs(params.data?.diffDeliveredQty) > this.maxToleranceLimit,
      'matched-withing-limit': params => Math.abs(params.data?.diffDeliveredQty) < this.minToleranceLimit,
    }
  };

  qtyDeliveredUomCol: TypedColDef<IQcReportsListItemDto, IDisplayLookupDto> = {
    headerName: QcReportsListColumnsLabels.qtyDeliveredUom,
    colId: QcReportsListColumns.qtyDeliveredUom,
    field: model('qtyDeliveredUom'),
    valueFormatter: params => params.value?.displayName
  };

  logBookRobAfterDeliveryCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.logBookRobAfterDelivery,
    colId: QcReportsListColumns.logBookRobAfterDelivery,
    field: model('logBookRobAfterDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  measuredRobAfterDeliveryCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.measuredRobAfterDelivery,
    colId: QcReportsListColumns.measuredRobAfterDelivery,
    field: model('measuredRobAfterDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  diffRobAfterDeliveryCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.diffRobAfterDelivery,
    colId: QcReportsListColumns.diffRobAfterDelivery,
    field: model('diffRobAfterDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    cellClass: 'cell-background',
    cellClassRules: {
      'not-matched': params => Math.abs(params.data?.diffRobAfterDelivery) > this.maxToleranceLimit,
      'matched-withing-limit': params => Math.abs(params.data?.diffRobAfterDelivery) < this.minToleranceLimit,
    }
  };

  qtyAfterDeliveryUomCol: TypedColDef<IQcReportsListItemDto, IDisplayLookupDto> = {
    headerName: QcReportsListColumnsLabels.qtyAfterDeliveryUom,
    colId: QcReportsListColumns.qtyAfterDeliveryUom,
    field: model('qtyAfterDeliveryUom'),
    valueFormatter: params => params.value?.displayName
  };

  logBookSludgeRobBeforeDischargeCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.logBookSludgeRobBeforeDischarge,
    colId: QcReportsListColumns.logBookSludgeRobBeforeDischarge,
    field: model('logBookSludgeRobBeforeDischarge'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  measuredSludgeRobBeforeDischargeCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.measuredSludgeRobBeforeDischarge,
    colId: QcReportsListColumns.measuredSludgeRobBeforeDischarge,
    field: model('measuredSludgeRobBeforeDischarge'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  diffSludgeRobBeforeDischargeCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.diffSludgeRobBeforeDischarge,
    colId: QcReportsListColumns.diffSludgeRobBeforeDischarge,
    field: model('diffSludgeRobBeforeDischarge'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value),
    cellClass: 'cell-background',
    cellClassRules: {
      'matched-withing-limit': params => params.data?.diffSludgeRobBeforeDischarge < 0 // TODO: Wrong calculation, needs tolerance
    }
  };

  sludgeDischargedQtyCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.sludgeDischargedQty,
    colId: QcReportsListColumns.sludgeDischargedQty,
    field: model('sludgeDischargedQty'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => this.format.quantity(params.value)
  };

  qtySludgeDischargedUomCol: TypedColDef<IQcReportsListItemDto, IDisplayLookupDto> = {
    headerName: QcReportsListColumnsLabels.qtySludgeDischargedUom,
    colId: QcReportsListColumns.qtySludgeDischargedUom,
    field: model('qtySludgeDischargedUom'),
    valueFormatter: params => params.value?.displayName
  };

  commentCol: TypedColDef<IQcReportsListItemDto, string> = {
    headerName: QcReportsListColumnsLabels.comment,
    colId: QcReportsListColumns.comment,
    field: model('comment')
  };

  isVerifiedSludgeQtyCol: TypedColDef<IQcReportsListItemDto, string> = {
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

  private readonly minToleranceLimit;
  private readonly maxToleranceLimit;

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    tenantSettings: TenantSettingsService,
    private format: TenantFormattingService,
    private quantityControlService: QcReportService,
    private appErrorHandler: AppErrorHandler
  ) {
    super('quantity-control-grid', columnPreferences, changeDetector, loggerFactory.createLogger(QcReportsListGridViewModel.name));
    this.init(this.gridOptions, true);

    const deliveryTenantSettings = tenantSettings.getModuleTenantSettings<IDeliveryTenantSettings>(TenantSettingsModuleName.Delivery);
    this.minToleranceLimit = deliveryTenantSettings.minToleranceLimit;
    this.maxToleranceLimit = deliveryTenantSettings.maxToleranceLimit;
  }

  getColumnsDefs(): TypedColDef[] {
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
    this.quantityControlService.getReportsList$(transformLocalToServeGridInfo(params, QcReportsListColumnServerKeys, this.searchText)).subscribe(
      response => params.successCallback(response.items, response.totalCount),
      () => {
        this.appErrorHandler.handleError(AppError.FailedToLoadMastersData('vessel'));
        params.failCallback();
      });
  }
}
