import { ChangeDetectorRef, Injectable } from '@angular/core';
import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { ColDef, GridOptions, IServerSideGetRowsParams } from 'ag-grid-community';
import { RowModelType } from '@shiptech/core/ui/components/ag-grid/type.definition';
import {
  QcOrderProductsListColumns,
  QcOrderProductsListColumnsLabels,
  QcOrderProductsListItemProps
} from './qc-order-products-list.columns';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { Store } from '@ngxs/store';
import { ModuleLoggerFactory } from '../../../../core/logging/module-logger-factory';
import { QcReportDetailsService } from '../../../../services/qc-report-details.service';

@Injectable()
export class QcOrderProductsListGridViewModel extends BaseGridViewModel {

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

    multiSortKey: 'ctrl',

    enableBrowserTooltips: true,
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      width: 150
    }
  };
  orderNoCol: ColDef = {
    headerName: QcOrderProductsListColumns.orderNo,
    colId: QcOrderProductsListColumnsLabels.orderNo,
    field: this.modelProps.orderNo,
    hide: false
  };
  counterpartyCol: ColDef = {
    headerName: QcOrderProductsListColumns.counterpartyName,
    colId: QcOrderProductsListColumnsLabels.counterpartyName,
    field: this.modelProps.counterpartyName,
    hide: false
  };
  productCol: ColDef = {
    headerName: QcOrderProductsListColumns.productName,
    colId: QcOrderProductsListColumnsLabels.productName,
    field: this.modelProps.productName,
    hide: false
  };
  confirmedQuantityCol: ColDef = {
    headerName: QcOrderProductsListColumns.confirmedQuantity,
    colId: QcOrderProductsListColumnsLabels.confirmedQuantity,
    field: this.modelProps.confirmedQuantity,
    hide: false
  };
  uomCol: ColDef = {
    headerName: QcOrderProductsListColumns.uomName,
    colId: QcOrderProductsListColumnsLabels.uomName,
    field: this.modelProps.uomName,
    hide: false
  };

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    private store: Store,
    private quantityControlService: QcReportDetailsService,
    private modelProps: QcOrderProductsListItemProps
  ) {
    super('qc-order-products-list', columnPreferences, changeDetector, loggerFactory.createLogger(QcOrderProductsListGridViewModel.name));
    this.initOptions(this.gridOptions);
  }

  getColumnsDefs(): ColDef[] {
    return [this.orderNoCol, this.counterpartyCol, this.productCol, this.confirmedQuantityCol, this.uomCol];
  }

  //TODO: ADD loading overlay
  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    this.quantityControlService.getOrderProductsList().subscribe(
      response => params.successCallback(response.items, response.totalItems),
      () => params.failCallback());
  }
}
