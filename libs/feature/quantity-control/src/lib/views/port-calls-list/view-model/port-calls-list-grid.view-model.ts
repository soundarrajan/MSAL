import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { ModuleLoggerFactory } from '../../../core/logging/module-logger-factory';
import { ColDef, GridOptions, IServerSideGetRowsParams } from 'ag-grid-community';
import { RowModelType, RowSelection } from '@shiptech/core/ui/components/ag-grid/type.definition';
import { PortCallDetailsService } from '../../../services/port-call-details.service';
import { getShiptechFormatFilters } from '../../../core/mappers/shiptech-grid-filters';
import { getShiptechFormatSorts } from '../../../core/mappers/shiptech-grid-sorts';
import { AgTemplateRendererComponent } from '@shiptech/core/ui/components/ag-grid/ag-template-renderer/ag-template-renderer.component';
import { getShiptechFormatPagination } from '../../../core/mappers/shiptech-grid-paging';
import { PortCallListItemProps, PortCallsListColumns, PortCallsListColumnsLabels } from './port-calls-list.columns';

@Injectable()
export class PortCallsListGridViewModel extends BaseGridViewModel {

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
    suppressColumnVirtualisation: true,
    rowSelection: RowSelection.Single,
    rowDragManaged: true,
    suppressRowClickSelection: true,

    multiSortKey: 'ctrl',

    enableBrowserTooltips: true,
    singleClickEdit: true,
    getRowNodeId: () => Math.random().toString(),
    defaultColDef: {
      sortable: true,
      filter: 'agTextColumnFilter',
      width: 150
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
    headerName: PortCallsListColumnsLabels.callId,
    colId: PortCallsListColumns.callId,
    field: this.modelProps.id,
    width: 50,
    hide: false,
    resizable: false,
    suppressToolPanel: true,
    cellRendererFramework: AgTemplateRendererComponent
  };

  portCol: ColDef = {
    headerName: PortCallsListColumnsLabels.port,
    colId: PortCallsListColumns.port,
    field: this.modelProps.port,
    width: 50,
    hide: false,
    resizable: false,
  };

  vesselNameCol: ColDef = {
    headerName: PortCallsListColumnsLabels.vesselName,
    colId: PortCallsListColumns.vesselName,
    field: this.modelProps.vesselName,
    width: 50,
    hide: false,
    resizable: false
  };

  surveyDateCol: ColDef = {
    headerName: PortCallsListColumnsLabels.surveyDate,
    colId: PortCallsListColumns.surveyDate,
    field: this.modelProps.surveyDate,
    width: 50,
    hide: false,
    resizable: false
  };

  surveyStatusCol: ColDef = {
    headerName: PortCallsListColumnsLabels.surveyStatus,
    colId: PortCallsListColumns.surveyStatus,
    field: this.modelProps.surveyStatus,
    width: 50,
    hide: false,
    resizable: false
  };

  matchedQuantityCol: ColDef = {
    headerName: PortCallsListColumnsLabels.matchedQuantity,
    colId: PortCallsListColumns.matchedQuantity,
    field: this.modelProps.matchedQuantity,
    width: 50,
    hide: false,
    resizable: false
  };

  logBookRobBeforeDeliveryCol: ColDef = {
    headerName: PortCallsListColumnsLabels.logBookRobBeforeDelivery,
    colId: PortCallsListColumns.logBookRobBeforeDelivery,
    field: this.modelProps.logBookRobBeforeDelivery,
    width: 50,
    hide: false,
    resizable: false
  };

  measuredRobBeforeDeliveryCol: ColDef = {
    headerName: PortCallsListColumnsLabels.measuredRobBeforeDelivery,
    colId: PortCallsListColumns.measuredRobBeforeDelivery,
    field: this.modelProps.measuredRobBeforeDelivery,
    width: 50,
    hide: false,
    resizable: false
  };

  robBeforeDeliveryCol: ColDef = {
    headerName: PortCallsListColumnsLabels.robBeforeDelivery,
    colId: PortCallsListColumns.robBeforeDelivery,
    field: this.modelProps.robBeforeDelivery,
    width: 50,
    hide: false,
    resizable: false
  };

  bdnQuantityCol: ColDef = {
    headerName: PortCallsListColumnsLabels.bdnQuantity,
    colId: PortCallsListColumns.bdnQuantity,
    field: this.modelProps.bdnQuantity,
    width: 50,
    hide: false,
    resizable: false
  };

  measuredDeliveredQuantityCol: ColDef = {
    headerName: PortCallsListColumnsLabels.measuredDeliveredQuantity,
    colId: PortCallsListColumns.measuredDeliveredQuantity,
    field: this.modelProps.measuredDeliveredQuantity,
    width: 50,
    hide: false,
    resizable: false
  };

  deliveredQuantityCol: ColDef = {
    headerName: PortCallsListColumnsLabels.deliveredQuantity,
    colId: PortCallsListColumns.deliveredQuantity,
    field: this.modelProps.deliveredQuantity,
    width: 50,
    hide: false,
    resizable: false
  };

  logBookRobAfterDeliveryCol: ColDef = {
    headerName: PortCallsListColumnsLabels.logBookRobAfterDelivery,
    colId: PortCallsListColumns.logBookRobAfterDelivery,
    field: this.modelProps.logBookRobAfterDelivery,
    width: 50,
    hide: false,
    resizable: false
  };

  measuredRobAfterDeliveryCol: ColDef = {
    headerName: PortCallsListColumnsLabels.measuredRobAfterDelivery,
    colId: PortCallsListColumns.measuredRobAfterDelivery,
    field: this.modelProps.measuredRobAfterDelivery,
    width: 50,
    hide: false,
    resizable: false
  };

  robAfterDeliveryCol: ColDef = {
    headerName: PortCallsListColumnsLabels.robAfterDelivery,
    colId: PortCallsListColumns.robAfterDelivery,
    field: this.modelProps.robAfterDelivery,
    width: 50,
    hide: false,
    resizable: false
  };

  logBookSludgeBeforeDischargeCol: ColDef = {
    headerName: PortCallsListColumnsLabels.logBookSludgeBeforeDischarge,
    colId: PortCallsListColumns.logBookSludgeBeforeDischarge,
    field: this.modelProps.logBookSludgeBeforeDischarge,
    width: 50,
    hide: false,
    resizable: false
  };

  measuredSludgeRobBeforeDischargeCol: ColDef = {
    headerName: PortCallsListColumnsLabels.measuredSludgeRobBeforeDischarge,
    colId: PortCallsListColumns.measuredSludgeRobBeforeDischarge,
    field: this.modelProps.measuredSludgeRobBeforeDischarge,
    width: 50,
    hide: false,
    resizable: false
  };

  sludgeDischargedQuantityCol: ColDef = {
    headerName: PortCallsListColumnsLabels.sludgeDischargedQuantity,
    colId: PortCallsListColumns.sludgeDischargedQuantity,
    field: this.modelProps.sludgeDischargedQuantity,
    width: 50,
    hide: false,
    resizable: false
  };

  commentCol: ColDef = {
    headerName: PortCallsListColumnsLabels.comment,
    colId: PortCallsListColumns.comment,
    field: this.modelProps.comment,
    width: 50,
    hide: false,
    resizable: false
  };


  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    private quantityControlService: PortCallDetailsService,
    private modelProps: PortCallListItemProps
  ) {
    super('quantity-control-grid', columnPreferences, changeDetector, loggerFactory.createLogger(PortCallsListGridViewModel.name));
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
    this.quantityControlService.getPortCalls({
      pagination: getShiptechFormatPagination(params),
      sorts: getShiptechFormatSorts(params),
      filters: getShiptechFormatFilters(params),
      searchText: this.searchText
    }).subscribe(
      response => {
        console.log('RESPONSE', response);
        params.successCallback(response.items, 100);
      },
      () => params.failCallback());
  }
}
