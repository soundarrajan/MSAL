import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ColDef, ColumnApi, GridApi, GridOptions, IServerSideGetRowsParams } from 'ag-grid-community';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { observe } from 'rxjs-observe';
import { catchError, filter, finalize, first, takeUntil, tap } from 'rxjs/operators';
import { AgColumnPreferencesService } from './ag-column-preferences/ag-column-preferences.service';
import { Logger } from '../../../logging/logger';
import { defaultComparer } from './ag-grid.comparators';
import { AgGridEventsEnum } from './ag-grid.events';
import { AppError } from '../../../error-handling/app-error';
import { nameof } from '@shiptech/core/utils/type-definitions';
import { TypedColDef, TypedColGroupDef } from '@shiptech/core/ui/components/ag-grid/type.definition';

export const PageSizeOptions = [25, 50, 75, 100];
export const DefaultPageSize = 25;
export const colGroupMarginClass = 'col-group-border';

export abstract class BaseGridViewModel implements OnDestroy {
  saveColumnPreferences = true;
  pageSizeOptions = PageSizeOptions;

  protected constructor(protected gridId: string, protected columnPreferences: AgColumnPreferencesService, protected changeDetector: ChangeDetectorRef, protected logger: Logger) {
  }

  private _page: number = 1;

  get page(): number {
    return this.gridApi ? this.gridApi.paginationGetCurrentPage() + 1 : this._page || 1;
  }

  set page(value: number) {
    this._page = value;
    this.syncPagination();
  }

  protected gridApi: GridApi;
  protected gridColumnApi: ColumnApi;
  protected gridOptions: GridOptions;
  public isLoading$ = new Subject<boolean>();

  // Note: Currently only working for serverSide. For client set, you have to manually set the IsLoading.
  private _isLoading: boolean;
  private _isReady: boolean;

  private _pageSize: number = this.pageSizeOptions && this.pageSizeOptions.length > 0 ? this.pageSizeOptions[0] : DefaultPageSize;

  get isLoading(): boolean {
    return this._isLoading;
  }

  // Note: Currently only working for serverSide. For client set, you have to manually set the IsLoading.
  set isLoading(value: boolean) {
    this._isLoading = value;
    this.isLoading$.next(value);
  }

  get pageSize(): number {
    return this.gridApi ? this.gridApi.paginationGetPageSize() : this._pageSize || DefaultPageSize;
  }

  get isReady(): boolean {
    return this._isReady;
  }

  get isServerSide(): boolean {
    return this.gridOptions.rowModelType === 'serverSide';
  }

  get totalPages(): number {
    return this.gridApi ? this.gridApi.paginationGetTotalPages() : undefined;
  }

  set pageSize(value: number) {
    this._pageSize = value;
    this.syncPagination();
  }

  private _destroy$ = new Subject();

  get destroy$(): Subject<any> {
    return this._destroy$;
  }

  private _gridReady$ = new ReplaySubject(1);

  get gridReady$(): ReplaySubject<any> {
    return this._gridReady$;
  }

  get totalItems(): number {
    return this.gridApi ? this.pageSize * this.totalPages : undefined;
  }

  public syncPagination(): void {
    if (!this.gridOptions.pagination) {
      return;
    }
    this.gridOptions.cacheBlockSize = this._pageSize;
    this.gridOptions.paginationPageSize = this._pageSize;

    if (!this.isReady) {
      return;
    }

    if (this._page !== this.gridApi.paginationGetCurrentPage() + 1) {
      // Note: In order for ag-Grid to start at a specified page, it has to load the first page first.. yeah...
      // Note: This is coupled with setupServerSideDatasource successful callback
      this.gridApi.paginationGoToPage(this._page - 1);
    }

    if (this._pageSize !== this.gridApi.paginationGetPageSize()) {
      // Note: workaround to force ag-Grid to use new pageSize
      if (this.isServerSide) {
        this.gridApi.setServerSideDatasource(undefined);
      }

      this.gridOptions.cacheBlockSize = this._pageSize;
      this.gridOptions.paginationPageSize = this._pageSize;
      this._page = 1;

      this.setupServerSideDatasource();
    }
  }

  public initOptions(gridOptions: GridOptions): void {
    const { observables, proxy } = observe(gridOptions);
    this.gridOptions = proxy;
    this.gridOptions.defaultColDef = this.gridOptions.defaultColDef || {};

    if (this.gridOptions.pagination && this.isServerSide) {
      this.gridOptions.suppressPaginationPanel = true;

      // Note: For server side paging we do not want to load more blocks beyond the current page.
      this.gridOptions.cacheOverflowSize = 0;
      // Note: Ideally this should be set to 1, but there is a bug which triggers an infinite loop on second page. See https://github.com/ag-grid/ag-grid/issues/2745
      // Note: This means that 2 pages will be cached in memory, so you won't see fresh results when switching between pages
      this.gridOptions.maxBlocksInCache = 1;
    }

    // Note: Preventing styling issues from ag-grid cell select border
    this.gridOptions.suppressCellSelection = true;

    // Note: Very confusing for users
    this.gridOptions.suppressDragLeaveHidesColumns = true;

    // Note: Prevent the user to shrink the column to 0 px
    this.gridOptions.defaultColDef.minWidth = 50;

    // Note: Disable export by default on all grids
    this.gridOptions.suppressCsvExport = true;

    // NOTE: We reactivated the excel export
    // this.gridOptions.suppressExcelExport = true;

    // Note: Currently ag-grid does a lexicographically compare of strings which is not natural
    // Note: We took the default comparer from ag-grid source and updated it to comapre with localCompare
    this.gridOptions.defaultColDef = this.gridOptions.defaultColDef || {};
    if (!this.gridOptions.defaultColDef || !this.gridOptions.defaultColDef.comparator) {
      this.gridOptions.defaultColDef.comparator = defaultComparer.bind(this);
    }

    // Note: Although ag-Grid says it's ready, it may not be. There is a race condition when gridReady is raised
    // Note: but the gridOptions.api is still null. In case the api is null we wait for it.
    this.gridOptions.onGridReady = () => {
      if (this.gridOptions.api) {
        this.setupGrid();
      } else {
        observables.api
          .pipe(
            filter(api => !!api),
            first(),
            takeUntil(this._destroy$)
          )
          .subscribe(() => this.setupGrid());
      }
    };
  }

  public getColumnsDefs(): (TypedColDef | TypedColGroupDef)[] {
    // Note: To be overridden in derived class
    throw Error(`${nameof<BaseGridViewModel>('getColumnsDefs')} was not overridden in derived class`);
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    // Note: To be overridden in derived class
    throw Error(`${nameof<BaseGridViewModel>('serverSideGetRows')} was not overridden in derived class`);
  }

  protected serverSideDatasourceDestroy(): void {
    // Note: To be overridden in derived class if necessary
  }

  protected onGridReady(): void {
    // Note: To be overridden in derived class
  }

  protected whenReady(action: () => void): Observable<any> {
    return this._gridReady$.pipe(
      first(),
      tap(() => action()),
      takeUntil(this._destroy$)
    );
  }

  ngOnDestroy(): void {
    if (this.saveColumnPreferences) {
      this.columnPreferences.unregisterWatch(this.gridId);
    }

    this.gridApi.removeEventListener(AgGridEventsEnum.columnVisible, this.onGridColumnVisible);

    this._gridReady$.complete();
    this.isLoading$.complete();
    this._destroy$.next();
    this._destroy$.complete();
  }

  private onGridColumnVisible(): void {
    const displayedColumns = this.gridColumnApi.getAllDisplayedColumns();

    // Note: If the user deselected all columns, he won't be able to made them visible again (no column menu) without a page refresh (losing all unsaved data).
    // Note: In this case we're going to make the first column visible
    if (displayedColumns.length === 0) {
      this.gridColumnApi.setColumnVisible(this.gridColumnApi.getAllColumns()[0], true);
    }
  }

  private setupGrid(): void {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;

    this.gridApi.setColumnDefs(<ColDef[]>this.getColumnsDefs());
    this._isReady = true;

    // Note: It's important to set pagination before setting the datasource otherwise multiple call to the dataSource will be made
    this.syncPagination();

    if (this.saveColumnPreferences) {
      this.columnPreferences.registerWatch(this.gridId, this.gridOptions);

      this.columnPreferences
        .restore(this.gridId)
        .pipe(
          catchError(() => of(AppError.GridPreferenceRestore(this.gridId))),
          finalize(() => {
            // Note: Set the source as the final operation otherwise with each column state update or pagination, will call server side source multiple times
            this.setupServerSideDatasource();
          })
        )
        .subscribe();
    } else {
      this.setupServerSideDatasource();
    }
    this.gridApi.addEventListener(AgGridEventsEnum.columnVisible, this.onGridColumnVisible.bind(this));

    this._gridReady$.next();
    this.onGridReady();
  }

  private setupServerSideDatasource(): void {
    if (!this.isServerSide) {
      return;
    }

    this.gridApi.setServerSideDatasource({
      getRows: params => {
        const paramsProxy = { ...params };

        this._isLoading = true;

        paramsProxy.successCallback = (rowsThisPage: any[], lastRow: number) => {
          try {
            params.successCallback(rowsThisPage, lastRow);
            this.gridApi.hideOverlay();

            // Note: In order for ag-Grid to start at a specified page, it has to load the first page first.. yeah...
            this.syncPagination();
          } finally {
            this._isLoading = false;

            if (!rowsThisPage.length) {
              this.gridApi.showNoRowsOverlay();
            }

            this.changeDetector.markForCheck();
          }
        };

        paramsProxy.failCallback = () => {
          try {
            params.failCallback();
          } finally {
            this._isLoading = false;
            this.changeDetector.markForCheck();
          }
        };

        try {
          this.serverSideGetRows(paramsProxy);
        } catch (e) {
          this._isLoading = false;
        }

        this.changeDetector.markForCheck();
      },
      destroy: () => this.serverSideDatasourceDestroy()
    });
  }
}
