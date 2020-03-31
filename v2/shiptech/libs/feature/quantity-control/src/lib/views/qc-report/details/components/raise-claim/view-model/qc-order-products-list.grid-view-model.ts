import { ChangeDetectorRef, Injectable } from '@angular/core';
import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { GridOptions } from '@ag-grid-community/core';
import {
  ITypedColDef,
  ITypedColGroupDef,
  RowSelection
} from '@shiptech/core/ui/components/ag-grid/type.definition';
import {
  QcOrderProductsListColumns,
  QcOrderProductsListColumnsLabels
} from './qc-order-products-list.columns';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { Store } from '@ngxs/store';
import { ModuleLoggerFactory } from '../../../../../../core/logging/module-logger-factory';
import { QcReportService } from '../../../../../../services/qc-report.service';
import { catchError, first, map, switchMap, tap } from 'rxjs/operators';
import { EMPTY$ } from '@shiptech/core/utils/rxjs-operators';
import { IQcOrderProductsListItemDto } from '../../../../../../services/api/dto/qc-order-products-list-item.dto';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { AgCheckBoxRendererComponent } from '@shiptech/core/ui/components/ag-grid/ag-check-box-renderer/ag-check-box-renderer.component';

function model(
  prop: keyof IQcOrderProductsListItemDto
): keyof IQcOrderProductsListItemDto {
  return prop;
}

@Injectable()
export class QcOrderProductsListGridViewModel extends BaseGridViewModel {
  public defaultColFilterParams = {
    resetButton: true,
    applyButton: true,
    precision: () => this.format.quantityPrecision
  };
  gridOptions: GridOptions = {
    rowSelection: RowSelection.Single,
    animateRows: true,
    multiSortKey: 'ctrl',

    enableBrowserTooltips: true,
    suppressContextMenu: true,

    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      filterParams: this.defaultColFilterParams
    }
  };

  selectCol: ITypedColDef = {
    colId: QcOrderProductsListColumns.selection,
    width: 50,
    checkboxSelection: false,
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
    suppressCellFlash: false,
    suppressPaste: true,
    lockPosition: true,
    lockVisible: true,
    cellClass: 'cell-border-green',
    cellRendererFramework: AgCheckBoxRendererComponent
  };

  orderNoCol: ITypedColDef<IQcOrderProductsListItemDto, IDisplayLookupDto> = {
    colId: QcOrderProductsListColumns.orderNo,
    headerName: QcOrderProductsListColumnsLabels.orderNo,
    field: model('order'),
    valueFormatter: params => params.value?.displayName,
    filter: 'agNumberColumnFilter'
  };
  counterpartyCol: ITypedColDef<
    IQcOrderProductsListItemDto,
    IDisplayLookupDto
  > = {
    colId: QcOrderProductsListColumns.counterpartyName,
    headerName: QcOrderProductsListColumnsLabels.counterpartyName,
    field: model('counterparty'),
    valueFormatter: params => params.value?.displayName
  };
  productCol: ITypedColDef<IQcOrderProductsListItemDto, IDisplayLookupDto> = {
    colId: QcOrderProductsListColumns.productName,
    headerName: QcOrderProductsListColumnsLabels.productName,
    field: model('product'),
    valueFormatter: params => params.value?.displayName
  };
  confirmedQuantityCol: ITypedColDef<IQcOrderProductsListItemDto, number> = {
    colId: QcOrderProductsListColumns.confirmedQuantity,
    headerName: QcOrderProductsListColumnsLabels.confirmedQuantity,
    field: model('confirmedQty'),
    valueFormatter: params => this.format.quantity(params.value),
    filter: 'agNumberColumnFilter'
  };
  uomCol: ITypedColDef<IQcOrderProductsListItemDto, IDisplayLookupDto> = {
    colId: QcOrderProductsListColumns.uomName,
    headerName: QcOrderProductsListColumnsLabels.uomName,
    field: model('uom'),
    valueFormatter: params => params.value?.displayName
  };

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    private format: TenantFormattingService,
    private store: Store,
    private reportService: QcReportService
  ) {
    super(
      'qc-order-products-list',
      columnPreferences,
      changeDetector,
      loggerFactory.createLogger(QcOrderProductsListGridViewModel.name)
    );
    this.init(this.gridOptions);

    this.gridReady$
      .pipe(
        first(),
        tap(() => this.gridApi.showLoadingOverlay()),
        // Note: No need for pagination or server-side filtering, everything is loaded in memory.
        switchMap(() => this.reportService.getOrderProductsList$()),
        catchError(() => {
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
      )
      .subscribe();
  }

  getColumnsDefs(): (ITypedColDef | ITypedColGroupDef)[] {
    return [
      this.selectCol,
      this.orderNoCol,
      this.counterpartyCol,
      this.productCol,
      this.confirmedQuantityCol,
      this.uomCol
    ];
  }
}
