import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { GridOptions, IServerSideGetRowsParams } from 'ag-grid-community';
import {
  ITypedColDef,
  RowModelType,
  RowSelection,
  TypedRowNode
} from '@shiptech/core/ui/components/ag-grid/type.definition';
import { AgCellTemplateComponent } from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';
import {
  CompleteListColumnServerKeys,
  CompleteListColumnsLabels,
  InvoiceCompleteListColumns
} from './invoice-complete-list.columns';
import { StatusLookupEnum } from '@shiptech/core/lookups/known-lookups/status/status-lookup.enum';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { transformLocalToServeGridInfo } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { AppError } from '@shiptech/core/error-handling/app-error';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { ReconStatusLookup } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.service';
import { takeUntil } from 'rxjs/operators';
import { AgCheckBoxRendererComponent } from '@shiptech/core/ui/components/ag-grid/ag-check-box-renderer/ag-check-box-renderer.component';
import { AgCheckBoxHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-check-box-header/ag-check-box-header.component';
import { StatusLookup } from '@shiptech/core/lookups/known-lookups/status/status-lookup.service';
import { ICompleteListItemDto } from '../../../services/api/dto/invoice-complete-list-item.dto';
import { InvoiceCompleteService } from '../../../services/invoice-complete.service';
import { ModuleLoggerFactory } from 'libs/feature/quantity-control/src/lib/core/logging/module-logger-factory';

function model(prop: keyof ICompleteListItemDto): keyof ICompleteListItemDto {
  return prop;
}

@Injectable()
export class CompleteListGridViewModel extends BaseGridViewModel {

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
    suppressContextMenu: true,

    multiSortKey: 'ctrl',

    enableBrowserTooltips: true,
    singleClickEdit: true,
    getRowNodeId: (data: ICompleteListItemDto) => data?.id?.toString() ?? Math.random().toString(),
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      filterParams: this.defaultColFilterParams
    }
  };

  selectCol: ITypedColDef<ICompleteListItemDto> = {
    colId: InvoiceCompleteListColumns.selection,
    width: 50,
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

  portCallId: ITypedColDef<ICompleteListItemDto, string> = {
    headerName: CompleteListColumnsLabels.portCallId,
    colId: InvoiceCompleteListColumns.portCallId,
    field: model('portCallId'),
    cellRendererFramework: AgCellTemplateComponent,
    width: 200
  };

  portNameCol: ITypedColDef<ICompleteListItemDto, string> = {
    headerName: CompleteListColumnsLabels.portName,
    colId: InvoiceCompleteListColumns.portName,
    field: model('portName'),
    width: 106
  };


  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    private format: TenantFormattingService,
    private reconStatusLookups: ReconStatusLookup,
    private reportService: InvoiceCompleteService,
    private appErrorHandler: AppErrorHandler,
    private statusLookup: StatusLookup
  ) {
    super('quantity-control-grid', columnPreferences, changeDetector, loggerFactory.createLogger(CompleteListGridViewModel.name));
    this.init(this.gridOptions, true);
  }

  getColumnsDefs(): ITypedColDef[] {
    return [
      this.selectCol,
      this.portCallId,
      this.portNameCol
    ];
  }

  public onSearch(value: string): void {
    this.searchText = value;
    this.gridApi.purgeServerSideCache();
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    this.reportService.getReportsList$(transformLocalToServeGridInfo(this.gridApi, params, CompleteListColumnServerKeys, this.searchText))
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        response => params.successCallback(response.items, response.totalCount),
        () => {
          this.appErrorHandler.handleError(AppError.FailedToLoadMastersData('completed'));
          params.failCallback();
        });
  }

}
