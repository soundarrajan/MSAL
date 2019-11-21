import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { ModuleLoggerFactory } from '../../../core/logging/module-logger-factory';
import { ColDef, GridOptions, IServerSideGetRowsParams } from 'ag-grid-community';
import { RowModelType, RowSelection } from '@shiptech/core/ui/components/ag-grid/type.definition';
import { QcReportService } from '../../../services/qc-report.service';
import { getShiptechFormatFilters } from '../../../../../../../core/src/lib/grid/server-grid/mappers/shiptech-grid-filters';
import { getShiptechFormatSorts } from '../../../../../../../core/src/lib/grid/server-grid/mappers/shiptech-grid-sorts';
import { AgCellTemplateComponent } from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';
import { getShiptechFormatPagination } from '../../../../../../../core/src/lib/grid/server-grid/mappers/shiptech-grid-paging';
import { QcReportsListColumns, QcReportsListColumnsLabels, QcReportsListItemProps } from './qc-reports-list.columns';
import { QcReportsListItemModel } from '../../../services/models/qc-reports-list-item.model';
import { SurveyStatusEnum } from '../../../core/enums/survey-status.enum';

@Injectable()
export class QcReportsListGridViewModel extends BaseGridViewModel {

  public searchText: string;
  gridOptions: GridOptions = {
    groupHeaderHeight: 20,
    headerHeight: 40,
    rowHeight: 35,

    rowModelType: RowModelType.ServerSide,
    pagination: true,

    animateRows: true,

    deltaRowDataMode: false,
    suppressPaginationPanel: false,
    suppressColumnVirtualisation: false,
    rowSelection: RowSelection.Multiple,
    rowDragManaged: true,
    suppressRowClickSelection: true,

    multiSortKey: 'ctrl',

    enableBrowserTooltips: true,
    singleClickEdit: true,
    getRowNodeId: () => Math.random().toString(),
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter'
    }
  };

  selectCol: ColDef = {
    width: 50,
    checkboxSelection: true,
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

  callIdCol: ColDef = {
    headerName: QcReportsListColumnsLabels.callId,
    colId: QcReportsListColumns.callId,
    field: this.modelProps.id,
    hide: false,
    suppressToolPanel: true,
    cellRendererFramework: AgCellTemplateComponent
  };

  portCol: ColDef = {
    headerName: QcReportsListColumnsLabels.port,
    colId: QcReportsListColumns.port,
    field: this.modelProps.port,
    hide: false,
  };

  vesselNameCol: ColDef = {
    headerName: QcReportsListColumnsLabels.vesselName,
    colId: QcReportsListColumns.vesselName,
    field: this.modelProps.vesselName,
    hide: false,
    cellRendererFramework: AgCellTemplateComponent

  };

  surveyDateCol: ColDef = {
    headerName: QcReportsListColumnsLabels.surveyDate,
    colId: QcReportsListColumns.surveyDate,
    field: this.modelProps.surveyDate,
    hide: false,
  };

  surveyStatusCol: ColDef = {
    headerName: QcReportsListColumnsLabels.surveyStatus,
    colId: QcReportsListColumns.surveyStatus,
    field: this.modelProps.surveyStatus,
    hide: false,
    cellClassRules: {
      'cell-background pending': params => ((<QcReportsListItemModel>params.data) || {} as QcReportsListItemModel).surveyStatus === SurveyStatusEnum.Pending,
      'cell-background verified': params => ((<QcReportsListItemModel>params.data) || {} as QcReportsListItemModel).surveyStatus === SurveyStatusEnum.Verified
    }
  };

  matchedQuantityCol: ColDef = {
    headerName: QcReportsListColumnsLabels.matchedQuantity,
    colId: QcReportsListColumns.matchedQuantity,
    field: this.modelProps.matchedQuantity,
    hide: false
  };

  logBookRobBeforeDeliveryCol: ColDef = {
    headerName: QcReportsListColumnsLabels.logBookRobBeforeDelivery,
    colId: QcReportsListColumns.logBookRobBeforeDelivery,
    field: this.modelProps.logBookRobBeforeDelivery,
    hide: false
  };

  measuredRobBeforeDeliveryCol: ColDef = {
    headerName: QcReportsListColumnsLabels.measuredRobBeforeDelivery,
    colId: QcReportsListColumns.measuredRobBeforeDelivery,
    field: this.modelProps.measuredRobBeforeDelivery,
    hide: false
  };

  robBeforeDeliveryCol: ColDef = {
    headerName: QcReportsListColumnsLabels.robBeforeDelivery,
    colId: QcReportsListColumns.robBeforeDelivery,
    field: this.modelProps.robBeforeDelivery,
    hide: false,
    cellClassRules: {
      'cell-background red': params => ((<QcReportsListItemModel>params.data) || {} as QcReportsListItemModel).robBeforeDelivery < 0
    }
  };

  bdnQuantityCol: ColDef = {
    headerName: QcReportsListColumnsLabels.bdnQuantity,
    colId: QcReportsListColumns.bdnQuantity,
    field: this.modelProps.bdnQuantity,
    hide: false
  };

  measuredDeliveredQuantityCol: ColDef = {
    headerName: QcReportsListColumnsLabels.measuredDeliveredQuantity,
    colId: QcReportsListColumns.measuredDeliveredQuantity,
    field: this.modelProps.measuredDeliveredQuantity,
    hide: false
  };

  deliveredQuantityCol: ColDef = {
    headerName: QcReportsListColumnsLabels.deliveredQuantity,
    colId: QcReportsListColumns.deliveredQuantity,
    field: this.modelProps.deliveredQuantity,
    hide: false,
    cellClassRules: {
      'cell-background red': params => ((<QcReportsListItemModel>params.data) || {} as QcReportsListItemModel).deliveredQuantity < 0
    }
  };

  logBookRobAfterDeliveryCol: ColDef = {
    headerName: QcReportsListColumnsLabels.logBookRobAfterDelivery,
    colId: QcReportsListColumns.logBookRobAfterDelivery,
    field: this.modelProps.logBookRobAfterDelivery,
    hide: false
  };

  measuredRobAfterDeliveryCol: ColDef = {
    headerName: QcReportsListColumnsLabels.measuredRobAfterDelivery,
    colId: QcReportsListColumns.measuredRobAfterDelivery,
    field: this.modelProps.measuredRobAfterDelivery,
    hide: false
  };

  robAfterDeliveryCol: ColDef = {
    headerName: QcReportsListColumnsLabels.robAfterDelivery,
    colId: QcReportsListColumns.robAfterDelivery,
    field: this.modelProps.robAfterDelivery,
    hide: false
  };

  logBookSludgeBeforeDischargeCol: ColDef = {
    headerName: QcReportsListColumnsLabels.logBookSludgeBeforeDischarge,
    colId: QcReportsListColumns.logBookSludgeBeforeDischarge,
    field: this.modelProps.logBookSludgeBeforeDischarge,
    hide: false
  };

  measuredSludgeRobBeforeDischargeCol: ColDef = {
    headerName: QcReportsListColumnsLabels.measuredSludgeRobBeforeDischarge,
    colId: QcReportsListColumns.measuredSludgeRobBeforeDischarge,
    field: this.modelProps.measuredSludgeRobBeforeDischarge,
    hide: false
  };

  sludgeDischargedQuantityCol: ColDef = {
    headerName: QcReportsListColumnsLabels.sludgeDischargedQuantity,
    colId: QcReportsListColumns.sludgeDischargedQuantity,
    field: this.modelProps.sludgeDischargedQuantity,
    hide: false
  };

  commentCol: ColDef = {
    headerName: QcReportsListColumnsLabels.comment,
    colId: QcReportsListColumns.comment,
    field: this.modelProps.comment,
    hide: false
  };


  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    private quantityControlService: QcReportService,
    private modelProps: QcReportsListItemProps
  ) {
    super('quantity-control-grid', columnPreferences, changeDetector, loggerFactory.createLogger(QcReportsListGridViewModel.name));
    this.initOptions(this.gridOptions);
  }

  getColumnsDefs(): ColDef[] {
    return [
      this.selectCol,
      this.callIdCol,
      this.portCol,
      this.vesselNameCol,
      this.surveyDateCol,
      this.surveyStatusCol,
      this.matchedQuantityCol,
      this.logBookRobBeforeDeliveryCol,
      this.measuredRobBeforeDeliveryCol,
      this.robBeforeDeliveryCol,
      this.bdnQuantityCol,
      this.measuredDeliveredQuantityCol,
      this.deliveredQuantityCol,
      this.logBookRobAfterDeliveryCol,
      this.measuredRobAfterDeliveryCol,
      this.robAfterDeliveryCol,
      this.logBookSludgeBeforeDischargeCol,
      this.measuredSludgeRobBeforeDischargeCol,
      this.sludgeDischargedQuantityCol,
      this.commentCol
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
