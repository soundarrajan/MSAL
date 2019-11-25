import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { ColDef, GridOptions, IServerSideGetRowsParams } from 'ag-grid-community';
import { RowModelType, RowSelection } from '@shiptech/core/ui/components/ag-grid/type.definition';
import { AgCellTemplateComponent } from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';
import { QcReportsListColumns, QcReportsListColumnsLabels } from './qc-reports-list.columns';
import { IQcReportsListItemDto } from '../../../services/api/dto/qc-reports-list-item.dto';
import { SurveyStatusEnum } from '../../../core/enums/survey-status.enum';
import { nullable } from '@shiptech/core/utils/nullable';
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
  private quantityPrecision  = 3;

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
    getRowNodeId: (data: IQcReportsListItemDto) => data.id.toString(),
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter'
    }
  };

  selectCol: ColDef = {
    colId: QcReportsListColumns.selection,
    width: 50,
    checkboxSelection: params => (<IQcReportsListItemDto>params.data).surveyStatus.name === SurveyStatusEnum.New || (<IQcReportsListItemDto>params.data).surveyStatus.name === SurveyStatusEnum.Pending,
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

  portCallId: ColDef = {
    headerName: QcReportsListColumnsLabels.portCallId,
    colId: QcReportsListColumns.portCallId,
    field: model('portCallId'),
    cellRendererFramework: AgCellTemplateComponent
  };

  portNameCol: ColDef = {
    headerName: QcReportsListColumnsLabels.portName,
    colId: QcReportsListColumns.portName,
    field: model('portName')
  };

  vesselNameCol: ColDef = {
    headerName: QcReportsListColumnsLabels.vesselName,
    colId: QcReportsListColumns.vesselName,
    field: model('vesselName')
  };

  surveyDateCol: ColDef = {
    headerName: QcReportsListColumnsLabels.surveyDate,
    colId: QcReportsListColumns.surveyDate,
    field: model('surveyDate'),
    valueFormatter: params => moment(params.value).format(dateTimeAdapter.fromDotNet(this.dateFormat))
  };

  surveyStatusCol: ColDef = {
    headerName: QcReportsListColumnsLabels.surveyStatus,
    colId: QcReportsListColumns.surveyStatus,
    field: model('surveyStatus'),
    valueFormatter: params => nullable<IDisplayLookupDto>(params.value).displayName,
    cellClassRules: {
      'cell-background pending': params => nullable<IDisplayLookupDto>(nullable<IQcReportsListItemDto>(params.data).surveyStatus).name === SurveyStatusEnum.Pending,
      'cell-background verified': params => nullable<IDisplayLookupDto>(nullable<IQcReportsListItemDto>(params.data).surveyStatus).name === SurveyStatusEnum.Verified
    }
  };

  qtyMatchedStatusCol: ColDef = {
    headerName: QcReportsListColumnsLabels.qtyMatchedStatus,
    colId: QcReportsListColumns.qtyMatchedStatus,
    field: model('qtyMatchedStatus'),
    valueFormatter: params => nullable<IDisplayLookupDto>(params.value).displayName,
    cellClassRules: {
      'cell-background matched': params => nullable<IDisplayLookupDto>(nullable<IQcReportsListItemDto>(params.data).qtyMatchedStatus).name === QuantityMatchStatusEnum.Matched,
      'cell-background matched-withing-limit': params => nullable<IDisplayLookupDto>(nullable<IQcReportsListItemDto>(params.data).qtyMatchedStatus).name === QuantityMatchStatusEnum.WithinLimit,
      'cell-background not-matched': params => nullable<IDisplayLookupDto>(nullable<IQcReportsListItemDto>(params.data).qtyMatchedStatus).name === QuantityMatchStatusEnum.NotMatched
    }
  };

  logBookRobBeforeDeliveryCol: ColDef = {
    headerName: QcReportsListColumnsLabels.logBookRobBeforeDelivery,
    colId: QcReportsListColumns.logBookRobBeforeDelivery,
    field: model('logBookRobBeforeDelivery'),
    valueFormatter: params => (truncateDecimals(params.value, this.quantityPrecision) || '') .toString()
  };

  measuredRobBeforeDeliveryCol: ColDef = {
    headerName: QcReportsListColumnsLabels.measuredRobBeforeDelivery,
    colId: QcReportsListColumns.measuredRobBeforeDelivery,
    field: model('measuredRobBeforeDelivery'),
    valueFormatter: params => (truncateDecimals(params.value, this.quantityPrecision) || '') .toString()
  };

  diffRobBeforeDeliveryCol: ColDef = {
    headerName: QcReportsListColumnsLabels.diffRobBeforeDelivery,
    colId: QcReportsListColumns.diffRobBeforeDelivery,
    field: model('diffRobBeforeDelivery'),
    valueFormatter: params => (truncateDecimals(params.value, this.quantityPrecision) || '') .toString(),
    cellClassRules: {
      'cell-background red': params => nullable<IQcReportsListItemDto>(params.data).diffRobBeforeDelivery < 0
    }
  };

  qtyBeforeDeliveryUomCol: ColDef = {
    headerName: QcReportsListColumnsLabels.qtyBeforeDeliveryUom,
    colId: QcReportsListColumns.qtyBeforeDeliveryUom,
    field: model('qtyBeforeDeliveryUom'),
    valueFormatter: params => nullable<IDisplayLookupDto>(params.value).displayName
  };

  bdnQuantityCol: ColDef = {
    headerName: QcReportsListColumnsLabels.bdnQuantity,
    colId: QcReportsListColumns.bdnQuantity,
    field: model('bdnQuantity'),
    valueFormatter: params => (truncateDecimals(params.value, this.quantityPrecision) || '') .toString(),
  };

  measuredDeliveredQtyCol: ColDef = {
    headerName: QcReportsListColumnsLabels.measuredDeliveredQty,
    colId: QcReportsListColumns.measuredDeliveredQty,
    field: model('measuredDeliveredQty'),
    valueFormatter: params => (truncateDecimals(params.value, this.quantityPrecision) || '') .toString(),
  };

  diffDeliveredQtyCol: ColDef = {
    headerName: QcReportsListColumnsLabels.diffDeliveredQty,
    colId: QcReportsListColumns.diffDeliveredQty,
    field: model('diffDeliveredQty'),
    valueFormatter: params => (truncateDecimals(params.value, this.quantityPrecision) || '') .toString(),
    cellClassRules: {
      'cell-background red': params => nullable<IQcReportsListItemDto>(params.data).diffDeliveredQty < 0
    }
  };

  qtyDeliveredUomCol: ColDef = {
    headerName: QcReportsListColumnsLabels.qtyDeliveredUom,
    colId: QcReportsListColumns.qtyDeliveredUom,
    field: model('qtyDeliveredUom'),
    valueFormatter: params => nullable<IDisplayLookupDto>(params.value).displayName
  };

  logBookRobAfterDeliveryCol: ColDef = {
    headerName: QcReportsListColumnsLabels.logBookRobAfterDelivery,
    colId: QcReportsListColumns.logBookRobAfterDelivery,
    field: model('logBookRobAfterDelivery'),
    valueFormatter: params => (truncateDecimals(params.value, this.quantityPrecision) || '') .toString(),
  };

  measuredRobAfterDeliveryCol: ColDef = {
    headerName: QcReportsListColumnsLabels.measuredRobAfterDelivery,
    colId: QcReportsListColumns.measuredRobAfterDelivery,
    field: model('measuredRobAfterDelivery'),
    valueFormatter: params => (truncateDecimals(params.value, this.quantityPrecision) || '') .toString(),
  };

  diffRobAfterDeliveryCol: ColDef = {
    headerName: QcReportsListColumnsLabels.diffRobAfterDelivery,
    colId: QcReportsListColumns.diffRobAfterDelivery,
    field: model('diffRobAfterDelivery'),
    valueFormatter: params => (truncateDecimals(params.value, this.quantityPrecision) || '') .toString(),
    cellClassRules: {
      'cell-background orange': params => nullable<IQcReportsListItemDto>(params.data).diffRobAfterDelivery < 0
    }
  };

  qtyAfterDeliveryUomCol: ColDef = {
    headerName: QcReportsListColumnsLabels.qtyAfterDeliveryUom,
    colId: QcReportsListColumns.qtyAfterDeliveryUom,
    field: model('qtyAfterDeliveryUom'),
    valueFormatter: params => nullable<IDisplayLookupDto>(params.value).displayName
  };

  logBookSludgeRobBeforeDischargeCol: ColDef = {
    headerName: QcReportsListColumnsLabels.logBookSludgeRobBeforeDischarge,
    colId: QcReportsListColumns.logBookSludgeRobBeforeDischarge,
    field: model('logBookSludgeRobBeforeDischarge'),
    valueFormatter: params => (truncateDecimals(params.value, this.quantityPrecision) || '') .toString(),
  };

  measuredSludgeRobBeforeDischargeCol: ColDef = {
    headerName: QcReportsListColumnsLabels.measuredSludgeRobBeforeDischarge,
    colId: QcReportsListColumns.measuredSludgeRobBeforeDischarge,
    field: model('measuredSludgeRobBeforeDischarge'),
    valueFormatter: params => (truncateDecimals(params.value, this.quantityPrecision) || '') .toString(),
  };

  diffSludgeRobBeforeDischargeCol: ColDef = {
    headerName: QcReportsListColumnsLabels.diffSludgeRobBeforeDischarge,
    colId: QcReportsListColumns.diffSludgeRobBeforeDischarge,
    field: model('diffSludgeRobBeforeDischarge'),
    valueFormatter: params => (truncateDecimals(params.value, this.quantityPrecision) || '') .toString(),
    cellClassRules: {
      'cell-background orange': params => nullable<IQcReportsListItemDto>(params.data).diffSludgeRobBeforeDischarge < 0
    }
  };

  sludgeDischargedQtyCol: ColDef = {
    headerName: QcReportsListColumnsLabels.sludgeDischargedQty,
    colId: QcReportsListColumns.sludgeDischargedQty,
    field: model('sludgeDischargedQty'),
    valueFormatter: params => (truncateDecimals(params.value, this.quantityPrecision) || '') .toString(),
  };

  qtySludgeDischargedUomCol: ColDef = {
    headerName: QcReportsListColumnsLabels.qtySludgeDischargedUom,
    colId: QcReportsListColumns.qtySludgeDischargedUom,
    field: model('qtySludgeDischargedUom'),
    valueFormatter: params => nullable<IDisplayLookupDto>(params.value).displayName
  };

  commentCol: ColDef = {
    headerName: QcReportsListColumnsLabels.comment,
    colId: QcReportsListColumns.comment,
    field: model('comment')
  };

  isVerifiedSludgeQtyCol: ColDef = {
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
