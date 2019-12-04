import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { GridOptions, IServerSideGetRowsParams } from 'ag-grid-community';
import {
  BooleanFilterParams,
  RowModelType,
  RowSelection,
  TypedColDef
} from '@shiptech/core/ui/components/ag-grid/type.definition';
import { AgCellTemplateComponent } from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';
import {
  QcReportsListColumns,
  QcReportsListColumnServerKeys,
  QcReportsListColumnsLabels
} from './qc-reports-list.columns';
import { IQcReportsListItemDto } from '../../../services/api/dto/qc-reports-list-item.dto';
import { SurveyStatusEnum } from '../../../core/enums/survey-status.enum';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { ModuleLoggerFactory } from '../../../core/logging/module-logger-factory';
import { serverGridInfo } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters';
import { QcReportService } from '../../../services/qc-report.service';
import { QuantityMatchStatusEnum } from '../../../core/enums/quantity-match-status';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import dateTimeAdapter from '@shiptech/core/utils/dotnet-moment-format-adapter';
import moment from 'moment';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

function model(prop: keyof IQcReportsListItemDto): keyof IQcReportsListItemDto {
  return prop;
}

@Injectable()
export class QcReportsListGridViewModel extends BaseGridViewModel {
  private dateFormat: string = 'DDD dd/MM/yyyy HH:mm';
  private quantityPrecision = 3;


  private defaultColFilterParams = {
    clearButton: true,
    applyButton: true,
    precision: () => this.quantityPrecision
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
    valueFormatter: params => params.value?.toFixed(this.quantityPrecision),
    filter: 'agNumberColumnFilter'
  };

  measuredRobBeforeDeliveryCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.measuredRobBeforeDelivery,
    colId: QcReportsListColumns.measuredRobBeforeDelivery,
    field: model('measuredRobBeforeDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => params.value?.toFixed(this.quantityPrecision),
    width: 181
  };

  diffRobBeforeDeliveryCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.diffRobBeforeDelivery,
    colId: QcReportsListColumns.diffRobBeforeDelivery,
    field: model('diffRobBeforeDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => params.value?.toFixed(this.quantityPrecision),
    cellClassRules: {
      'cell-background red': params => params.data?.diffRobBeforeDelivery < 0
    },
    width: 128
  };

  qtyBeforeDeliveryUomCol: TypedColDef<IQcReportsListItemDto, IDisplayLookupDto> = {
    headerName: QcReportsListColumnsLabels.qtyBeforeDeliveryUom,
    colId: QcReportsListColumns.qtyBeforeDeliveryUom,
    field: model('qtyBeforeDeliveryUom'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => params.value?.displayName
  };

  bdnQuantityCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.bdnQuantity,
    colId: QcReportsListColumns.bdnQuantity,
    field: model('bdnQuantity'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => params.value?.toFixed(this.quantityPrecision)
  };

  measuredDeliveredQtyCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.measuredDeliveredQty,
    colId: QcReportsListColumns.measuredDeliveredQty,
    field: model('measuredDeliveredQty'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => params.value?.toFixed(this.quantityPrecision)
  };

  diffDeliveredQtyCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.diffDeliveredQty,
    colId: QcReportsListColumns.diffDeliveredQty,
    field: model('diffDeliveredQty'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => params.value?.toFixed(this.quantityPrecision),
    cellClassRules: {
      'cell-background red': params => params.data?.diffDeliveredQty < 0
    }
  };

  qtyDeliveredUomCol: TypedColDef<IQcReportsListItemDto, IDisplayLookupDto> = {
    headerName: QcReportsListColumnsLabels.qtyDeliveredUom,
    colId: QcReportsListColumns.qtyDeliveredUom,
    field: model('qtyDeliveredUom'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => params.value?.displayName
  };

  logBookRobAfterDeliveryCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.logBookRobAfterDelivery,
    colId: QcReportsListColumns.logBookRobAfterDelivery,
    field: model('logBookRobAfterDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => params.value?.toFixed(this.quantityPrecision)
  };

  measuredRobAfterDeliveryCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.measuredRobAfterDelivery,
    colId: QcReportsListColumns.measuredRobAfterDelivery,
    field: model('measuredRobAfterDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => params.value?.toFixed(this.quantityPrecision)
  };

  diffRobAfterDeliveryCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.diffRobAfterDelivery,
    colId: QcReportsListColumns.diffRobAfterDelivery,
    field: model('diffRobAfterDelivery'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => params.value?.toFixed(this.quantityPrecision),
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
    filter: 'agNumberColumnFilter',
    valueFormatter: params => params.value?.toFixed(this.quantityPrecision)
  };

  measuredSludgeRobBeforeDischargeCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.measuredSludgeRobBeforeDischarge,
    colId: QcReportsListColumns.measuredSludgeRobBeforeDischarge,
    field: model('measuredSludgeRobBeforeDischarge'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => params.value?.toFixed(this.quantityPrecision)
  };

  diffSludgeRobBeforeDischargeCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.diffSludgeRobBeforeDischarge,
    colId: QcReportsListColumns.diffSludgeRobBeforeDischarge,
    field: model('diffSludgeRobBeforeDischarge'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => params.value?.toFixed(this.quantityPrecision),
    cellClassRules: {
      'cell-background orange': params => params.data?.diffSludgeRobBeforeDischarge < 0
    }
  };

  sludgeDischargedQtyCol: TypedColDef<IQcReportsListItemDto, number> = {
    headerName: QcReportsListColumnsLabels.sludgeDischargedQty,
    colId: QcReportsListColumns.sludgeDischargedQty,
    field: model('sludgeDischargedQty'),
    filter: 'agNumberColumnFilter',
    valueFormatter: params => params.value?.toFixed(this.quantityPrecision)
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
    this.quantityControlService.getReportsList$(serverGridInfo(params, QcReportsListColumnServerKeys)).subscribe(
      response => params.successCallback(response.items, response.totalItems),
      () => params.failCallback());
  }
}
