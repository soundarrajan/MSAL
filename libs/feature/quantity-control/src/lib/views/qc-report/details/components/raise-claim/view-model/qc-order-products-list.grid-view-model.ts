import { ChangeDetectorRef, Injectable } from '@angular/core';
import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { ColDef, GridOptions } from 'ag-grid-community';
import { RowSelection } from '@shiptech/core/ui/components/ag-grid/type.definition';
import { QcOrderProductsListColumns, QcOrderProductsListColumnsLabels } from './qc-order-products-list.columns';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { Store } from '@ngxs/store';
import { ModuleLoggerFactory } from '../../../../../../core/logging/module-logger-factory';
import { QcReportService } from '../../../../../../services/qc-report.service';
import { catchError, first, map, switchMap, tap } from 'rxjs/operators';
import { EMPTY$ } from '@shiptech/core/utils/rxjs-operators';
import { IQcOrderProductsListItemDto } from '../../../../../../services/api/dto/qc-order-products-list-item.dto';


function model(prop: keyof IQcOrderProductsListItemDto): string {
  return prop;
}

@Injectable()
export class QcOrderProductsListGridViewModel extends BaseGridViewModel {

  gridOptions: GridOptions = {
    rowSelection: RowSelection.Single,
    animateRows: true,
    multiSortKey: 'ctrl',

    enableBrowserTooltips: true,
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter'
    }
  };

  orderNoCol: ColDef = {
    colId: QcOrderProductsListColumns.orderNo,
    headerName: QcOrderProductsListColumnsLabels.orderNo,
    field: model('orderNo'),
    hide: false,
    headerCheckboxSelection: false,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: true
  };
  counterpartyCol: ColDef = {
    colId: QcOrderProductsListColumns.counterpartyName,
    headerName: QcOrderProductsListColumnsLabels.counterpartyName,
    field: model('counterpartyName'),
    hide: false
  };
  productCol: ColDef = {
    colId: QcOrderProductsListColumns.productName,
    headerName: QcOrderProductsListColumnsLabels.productName,
    field: model('productName'),
    hide: false
  };
  confirmedQuantityCol: ColDef = {
    colId: QcOrderProductsListColumns.confirmedQuantity,
    headerName: QcOrderProductsListColumnsLabels.confirmedQuantity,
    field: model('confirmedQuantity'),
    hide: false
  };
  uomCol: ColDef = {
    colId: QcOrderProductsListColumns.uomName,
    headerName: QcOrderProductsListColumnsLabels.uomName,
    field: model('uomName'),
    hide: false
  };

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    private store: Store,
    private reportService: QcReportService
  ) {
    super('qc-order-products-list', columnPreferences, changeDetector, loggerFactory.createLogger(QcOrderProductsListGridViewModel.name));
    this.initOptions(this.gridOptions);

    this.gridReady$
      .pipe(
        first(),
        tap(() => this.gridApi.showLoadingOverlay()),
        // Note: No need for pagination or server-side filtering, everything is loaded in memory.
        switchMap(() => this.reportService.getOrderProductsList()),
        catchError(error => {
          this.gridApi.hideOverlay();
          return EMPTY$;
        }),
        map(response => response.items),
        tap(items => {
          if (!items || !items.length) {
            this.gridApi.showNoRowsOverlay();
          } else {
            this.gridApi.setRowData(items);
            this.gridApi.hideOverlay();
          }
        })
      ).subscribe();
  }

  getColumnsDefs(): ColDef[] {
    return [this.orderNoCol, this.counterpartyCol, this.productCol, this.confirmedQuantityCol, this.uomCol];
  }
}
