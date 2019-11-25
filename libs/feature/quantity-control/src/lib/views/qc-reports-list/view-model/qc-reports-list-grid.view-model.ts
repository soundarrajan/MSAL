import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { ColDef, GridOptions, IServerSideGetRowsParams } from 'ag-grid-community';
import { RowModelType, RowSelection, TypedColDef } from '@shiptech/core/ui/components/ag-grid/type.definition';
import { AgCellTemplateComponent } from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';
import { QcReportsListColumns, QcReportsListColumnsLabels } from './qc-reports-list.columns';
import { IQcReportsListItemDto } from '../../../services/api/dto/qc-reports-list-item.dto';
import { SurveyStatusEnum } from '../../../core/enums/survey-status.enum';
import { getShiptechFormatPagination } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-paging';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { ModuleLoggerFactory } from '../../../core/logging/module-logger-factory';
import { getShiptechFormatFilters } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters';
import { QcReportService } from '../../../services/qc-report.service';
import { getShiptechFormatSorts } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-sorts';
import { QuantityMatchStatusEnum } from '../../../core/enums/quantity-match-status';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import dateTimeAdapter from '@shiptech/core/utils/dotnet-moment-format-adapter';
import moment from 'moment';
import { truncateDecimals } from '@shiptech/core/utils/math';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

function model(prop: keyof IQcReportsListItemDto): string {
  return prop;
}

@Injectable()
export class QcReportsListGridViewModel extends BaseGridViewModel {
  private dateFormat: string = 'DDD dd/MM/yyyy HH:mm';
  private quantityPrecision = 3;

  public searchText: string;
  gridOptions: GridOptions = {
    groupHeaderHeight: 20,
    headerHeight: 40,
    rowHeight: 35,

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
      filter: 'agTextColumnFilter'
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
    suppressToolPanel: true,
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

  surveyDateCol: TypedColDef<IQcReportsListItemDto, Date | string> = {
    headerName: QcReportsListColumnsLabels.surveyDate,
    colId: QcReportsListColumns.surveyDate,
    field: model('surveyDate'),
    valueFormatter: params => params.value ? moment(params.value).format(dateTimeAdapter.fromDotNet(this.dateFormat)) : undefined,
    width: 150
  };

  surveyStatusCol: TypedColDef<IQcReportsListItemDto, IDisplayLookupDto> = {
    headerName: QcReportsListColumnsLabels.surveyStatus,
    colId: QcReportsListColumns.surveyStatus,
    field: model('surveyStatus'),
    valueFormatter: params => params.value?.displayName,
    cellClassRules: {
      'cell-background pending': params => params.data?.surveyStatus?.name === SurveyStatusEnum.Pending,
      'cell-background verified': params => params.data?.surveyStatus?.name === SurveyStatusEnum.Verified
    },
    width: 78
  };

  qtyMatchedStatusCol: TypedColDef<IQcReportsListItemDto, IDisplayLookupDto> = {
    headerName: QcReportsListColumnsLabels.qtyMatchedStatus,
    colId: QcReportsListColumns.qtyMatchedStatus,
    field: model('qtyMatchedStatus'),
    valueFormatter: params => params.value?.displayName,
    cellClassRules: {
      'cell-background matched': params => params.data?.qtyMatchedStatus?.name === QuantityMatchStatusEnum.Matched,
      'cell-background matched-withing-limit': params => params.data?.qtyMatchedStatus?.name === QuantityMatchStatusEnum.WithinLimit,
      'cell-background not-matched': params => params.data?.qtyMatchedStatus?.name === QuantityMatchStatusEnum.NotMatched
    },
    width: 96
  };

  logBookRobBeforeDeliveryCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.logBookRobBeforeDelivery,
    colId: QcReportsListColumns.logBookRobBeforeDelivery,
    field: model('logBookRobBeforeDelivery'),
    width: 153,
    valueFormatter: params => truncateDecimals(params.value, this.quantityPrecision)?.toString()
  };

  measuredRobBeforeDeliveryCol: ColDef = {
    headerName: QcReportsListColumnsLabels.measuredRobBeforeDelivery,
    colId: QcReportsListColumns.measuredRobBeforeDelivery,
    field: model('measuredRobBeforeDelivery'),
    valueFormatter: params => truncateDecimals(params.value, this.quantityPrecision)?.toString(),
    width: 181,
  };

  diffRobBeforeDeliveryCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.diffRobBeforeDelivery,
    colId: QcReportsListColumns.diffRobBeforeDelivery,
    field: model('diffRobBeforeDelivery'),
    valueFormatter: params => truncateDecimals(params.value, this.quantityPrecision)?.toString(),
    cellClassRules: {
      'cell-background red': params => params.data?.diffRobBeforeDelivery < 0
    },
    width: 128,
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
    valueFormatter: params => truncateDecimals(params.value, this.quantityPrecision)?.toString()
  };

  measuredDeliveredQtyCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.measuredDeliveredQty,
    colId: QcReportsListColumns.measuredDeliveredQty,
    field: model('measuredDeliveredQty'),
    valueFormatter: params => truncateDecimals(params.value, this.quantityPrecision)?.toString()
  };

  diffDeliveredQtyCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.diffDeliveredQty,
    colId: QcReportsListColumns.diffDeliveredQty,
    field: model('diffDeliveredQty'),
    valueFormatter: params => truncateDecimals(params.value, this.quantityPrecision)?.toString(),
    cellClassRules: {
      'cell-background red': params => params.data?.diffDeliveredQty < 0
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
    valueFormatter: params => truncateDecimals(params.value, this.quantityPrecision)?.toString()
  };

  measuredRobAfterDeliveryCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.measuredRobAfterDelivery,
    colId: QcReportsListColumns.measuredRobAfterDelivery,
    field: model('measuredRobAfterDelivery'),
    valueFormatter: params => truncateDecimals(params.value, this.quantityPrecision)?.toString()
  };

  diffRobAfterDeliveryCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.diffRobAfterDelivery,
    colId: QcReportsListColumns.diffRobAfterDelivery,
    field: model('diffRobAfterDelivery'),
    valueFormatter: params => truncateDecimals(params.value, this.quantityPrecision)?.toString(),
    cellClassRules: {
      'cell-background orange': params => params.data?.diffRobAfterDelivery < 0
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
    valueFormatter: params => truncateDecimals(params.value, this.quantityPrecision)?.toString()
  };

  measuredSludgeRobBeforeDischargeCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.measuredSludgeRobBeforeDischarge,
    colId: QcReportsListColumns.measuredSludgeRobBeforeDischarge,
    field: model('measuredSludgeRobBeforeDischarge'),
    valueFormatter: params => truncateDecimals(params.value, this.quantityPrecision)?.toString()
  };

  diffSludgeRobBeforeDischargeCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.diffSludgeRobBeforeDischarge,
    colId: QcReportsListColumns.diffSludgeRobBeforeDischarge,
    field: model('diffSludgeRobBeforeDischarge'),
    valueFormatter: params => truncateDecimals(params.value, this.quantityPrecision)?.toString(),
    cellClassRules: {
      'cell-background orange': params => params.data?.diffSludgeRobBeforeDischarge < 0
    }
  };

  sludgeDischargedQtyCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.sludgeDischargedQty,
    colId: QcReportsListColumns.sludgeDischargedQty,
    field: model('sludgeDischargedQty'),
    valueFormatter: params => truncateDecimals(params.value, this.quantityPrecision)?.toString()
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
    cellRendererFramework: AgCellTemplateComponent
  };

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    tenantSettings: TenantSettingsService,
    private quantityControlService: QcReportService
  ) {
    super('quantity-control-grid', columnPreferences, changeDetector, loggerFactory.createLogger(QcReportsListGridViewModel.name));
    this.initOptions(this.gridOptions);

    const generalTenantSettings = tenantSettings.getGeneralTenantSettings();

    this.dateFormat = generalTenantSettings.tenantFormats.dateFormat.name;
    this.quantityPrecision = generalTenantSettings.defaultValues.quantityPrecision;
  }

  getColumnsDefs(): ColDef[] {
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
    this.quantityControlService.getReportsList({
      pagination: getShiptechFormatPagination(params),
      sortList: getShiptechFormatSorts(params),
      filters: getShiptechFormatFilters(params),
      searchText: this.searchText
    }).subscribe(
      response => params.successCallback(response.items, response.totalItems),
      () => params.failCallback());
  }
}
