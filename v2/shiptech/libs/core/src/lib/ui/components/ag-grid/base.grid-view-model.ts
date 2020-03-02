import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import {
  ColDef,
  ColumnApi,
  GridApi,
  GridOptions,
  IServerSideGetRowsParams
} from '@ag-grid-community/core';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { observe } from 'rxjs-observe';
import {
  catchError,
  filter,
  finalize,
  first,
  takeUntil,
  tap
} from 'rxjs/operators';
import { AgColumnPreferencesService } from './ag-column-preferences/ag-column-preferences.service';
import { Logger } from '../../../logging/logger';
import { defaultComparer } from './ag-grid.comparators';
import { AgGridEventsEnum } from './ag-grid.events';
import { AppError } from '../../../error-handling/app-error';
import { nameof } from '@shiptech/core/utils/type-definitions';
import {
  ITypedColDef,
  ITypedColGroupDef
} from '@shiptech/core/ui/components/ag-grid/type.definition';
import { EMPTY$ } from '@shiptech/core/utils/rxjs-operators';

export const PageSizeOptions = [25, 50, 75, 100];
export const DefaultPageSize = 25;
export const colGroupMarginClass = 'col-group-border';

export abstract class BaseGridViewModel implements OnDestroy {
  get page(): number {
    return this.gridApi
      ? this.gridApi.paginationGetCurrentPage() + 1
      : this._page || 1;
  }

  set page(value: number) {
    this._page = value;
    this.syncPagination();
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  // Note: Currently only working for serverSide. For client set, you have to manually set the IsLoading.
  set isLoading(value: boolean) {
    this._isLoading = value;
    this.isLoading$.next(value);
  }

  get pageSize(): number {
    return this.gridApi
      ? this.gridApi.paginationGetPageSize()
      : this._pageSize || DefaultPageSize;
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

  get destroy$(): Subject<any> {
    return this._destroy$;
  }

  get gridReady$(): ReplaySubject<any> {
    return this._gridReady$;
  }

  get totalItems(): number {
    return this.gridApi ? this.gridApi.paginationGetRowCount() : undefined;
  }
  saveColumnPreferences = true;
  pageSizeOptions = PageSizeOptions;
  public isLoading$ = new Subject<boolean>();

  /**
   * Note: ReplaySubject piped before setting the ag-grid server side data source. This is used to do other operations that might trigger data source multiple times.
   * Note: For example, setting filters, sort or column preferences, will trigger the data source each time. Depending on case this behavior might not be desired,
   * Note: especially if the server side operation is heavy.
   * Note: We might at some point want to create a queue like behavior, if the grid needs to wait for multiple operations before it starts loading data.
   *
   * Note: Set {@link enablePreServerSideDataSourcePipe} property first to use this feature.
   */
  public preServerSideDataSourcePipe$: ReplaySubject<unknown>;

  /**
   * See docs for {@link preServerSideDataSourcePipe$}
   */
  public enablePreServerSideDataSourcePipe: boolean = false;
  public paramsServerSide: IServerSideGetRowsParams;
  public searchText: string;
  public exportUrl: string;
  public gridApi: GridApi;
  public gridColumnApi: ColumnApi;
  public gridOptions: GridOptions;

  private _page: number = 1;

  // Note: Currently only working for serverSide. For client set, you have to manually set the IsLoading.
  private _isLoading: boolean;
  private _isReady: boolean;

  private _pageSize: number =
    this.pageSizeOptions && this.pageSizeOptions.length > 0
      ? this.pageSizeOptions[0]
      : DefaultPageSize;

  private _destroy$ = new Subject();

  private _gridReady$ = new ReplaySubject(1);

  protected constructor(
    protected gridId: string,
    protected columnPreferences: AgColumnPreferencesService,
    protected changeDetector: ChangeDetectorRef,
    protected logger: Logger
  ) {}

  public syncPagination(): void {
    if (!this.gridOptions.pagination) {
      return;
    }
    this.gridOptions.cacheBlockSize = this._pageSize;
    this.gridOptions.paginationPageSize = this._pageSize;

    // Note: We need to wait for the grid to be ready (base view model ready) so we don't load from source multiple times (filter. column preferences etc)
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

  public init(
    gridOptions: GridOptions,
    enablePreServerSideDataSourcePipe: boolean = false
  ): void {
    const { observables, proxy } = observe(gridOptions);
    this.gridOptions = proxy;
    this.gridOptions.defaultColDef = this.gridOptions.defaultColDef || {};
    this.enablePreServerSideDataSourcePipe = enablePreServerSideDataSourcePipe;

    if (enablePreServerSideDataSourcePipe) {
      this.preServerSideDataSourcePipe$ = new ReplaySubject<unknown>(1);
    }

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
    if (
      !this.gridOptions.defaultColDef ||
      !this.gridOptions.defaultColDef.comparator
    ) {
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

  public getColumnsDefs(): (ITypedColDef | ITypedColGroupDef)[] {
    // Note: To be overridden in derived class
    throw Error(
      `${nameof<BaseGridViewModel>(
        'getColumnsDefs'
      )} was not overridden in derived class`
    );
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    // Note: To be overridden in derived class
    throw Error(
      `${nameof<BaseGridViewModel>(
        'serverSideGetRows'
      )} was not overridden in derived class`
    );
  }

  ngOnDestroy(): void {
    if (this.saveColumnPreferences) {
      this.columnPreferences.unregisterWatch(this.gridId);
    }

    if (this.gridApi) {
      this.gridApi.removeEventListener(
        AgGridEventsEnum.columnVisible,
        this.onGridColumnVisible
      );
    }

    this._gridReady$.complete();
    this.isLoading$.complete();
    this._destroy$.next();
    this._destroy$.complete();
  }

  /**
   * See docs for {@link preServerSideDataSourcePipe$}
   */
  markServerSideDataSourceReady(): void {
    if (!this.enablePreServerSideDataSourcePipe) {
      console.warn(
        `${nameof<BaseGridViewModel>(
          'markServerSideDataSourceReady'
        )} was called while ${nameof<BaseGridViewModel>(
          'enablePreServerSideDataSourcePipe'
        )} is false. Did you forget to enable it?`
      );
      return;
    }

    this.preServerSideDataSourcePipe$.next();
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

  private onGridColumnVisible(): void {
    const displayedColumns = this.gridColumnApi.getAllDisplayedColumns();

    // Note: If the user deselected all columns, he won't be able to made them visible again (no column menu) without a page refresh (losing all unsaved data).
    // Note: In this case we're going to make the first column visible
    if (displayedColumns.length === 0) {
      this.gridColumnApi.setColumnVisible(
        this.gridColumnApi.getAllColumns()[0],
        true
      );
    }
  }

  private setupGrid(): void {
    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;

    this.gridApi.setColumnDefs(<ColDef[]>this.getColumnsDefs());

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
    this.gridApi.addEventListener(
      AgGridEventsEnum.columnVisible,
      this.onGridColumnVisible.bind(this)
    );

    this._isReady = true;
    this._gridReady$.next();
    this.onGridReady();
  }

  private setupServerSideDatasource(): void {
    if (!this.isServerSide) {
      return;
    }

    this.gridApi.showLoadingOverlay();
    this._isLoading = true;

    (this.preServerSideDataSourcePipe$ ?? EMPTY$)
      .pipe(
        first(),
        tap(() => {
          this.gridApi.setServerSideDatasource({
            getRows: params => {
              const paramsProxy = { ...params };

              paramsProxy.successCallback = (
                rowsThisPage: any[],
                lastRow: number
              ) => {
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
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
