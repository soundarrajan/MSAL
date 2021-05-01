import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { ChangeDetectorRef, Injectable, OnDestroy } from '@angular/core';
import { GridOptions } from '@ag-grid-community/core';
import { ModuleLoggerFactory } from '../../../../../../core/logging/module-logger-factory';
import { AgCellTemplateComponent } from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';
import { Actions, ofActionSuccessful, Store } from '@ngxs/store';
import { EventsLogColumns, EventsLogColumnsLabels } from './events-log.columns';
import { IQcEventsLogItemState } from '../../../../../../store/report/details/qc-events-log-state.model';
import { QcReportState } from '../../../../../../store/report/qc-report.state';
import { AgColumnHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-column-header/ag-column-header.component';
import { nameof } from '@shiptech/core/utils/type-definitions';
import { catchError, first, switchMap, takeUntil, tap } from 'rxjs/operators';
import { QcReportService } from '../../../../../../services/qc-report.service';
import { ITypedColDef } from '@shiptech/core/ui/components/ag-grid/type.definition';
import { EMPTY$ } from '@shiptech/core/utils/rxjs-operators';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { UserProfileState } from '@shiptech/core/store/states/user-profile/user-profile.state';
import { QcSaveReportDetailsSuccessfulAction } from '../../../../../../store/report/details/actions/save-report.actions';
import { merge } from 'rxjs';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';

function model(prop: keyof IQcEventsLogItemState): keyof IQcEventsLogItemState {
  return prop;
}

@Injectable()
export class EventsLogGridViewModel extends BaseGridViewModel
  implements OnDestroy {
  public defaultColFilterParams = {
    resetButton: true,
    applyButton: true,
    precision: () => this.format.quantityPrecision
  };
  gridOptions: GridOptions = {
    groupHeaderHeight: 40,
    headerHeight: 25,
    rowHeight: 35,

    domLayout: 'autoHeight',
    pagination: false,
    animateRows: true,

    deltaRowDataMode: true,
    suppressPaginationPanel: true,
    suppressContextMenu: true,
    enableBrowserTooltips: true,

    multiSortKey: 'ctrl',
    getRowNodeId: (data: IQcEventsLogItemState) => data.id.toString(),

    frameworkComponents: {
      [nameof(AgCellTemplateComponent)]: AgCellTemplateComponent
    },
    defaultColDef: {
      resizable: true,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: this.defaultColFilterParams,
      flex: 1
    }
  };

  actionsColumn: ITypedColDef<IQcEventsLogItemState> = {
    colId: EventsLogColumns.Actions,
    width: 57,
    hide: false,
    resizable: false,
    sortable: false,
    suppressColumnsToolPanel: true,
    suppressFiltersToolPanel: true,
    headerComponentFramework: AgColumnHeaderComponent,
    flex: undefined,
    editable: false,
    filter: false,
    suppressMenu: true,
    suppressAutoSize: true,
    suppressSizeToFit: true,
    suppressMovable: true,
    suppressNavigable: true,
    suppressCellFlash: false,
    suppressPaste: true,
    lockPosition: true,
    lockVisible: true,
    cellRendererSelector: params =>
      params.data?.createdBy?.id ===
      this.store.selectSnapshot(UserProfileState.userId)
        ? { component: nameof(AgCellTemplateComponent) }
        : null
  };

  eventDetailsCol: ITypedColDef<IQcEventsLogItemState, string> = {
    headerName: EventsLogColumnsLabels.EventDetails,
    colId: EventsLogColumns.EventDetails,
    field: model('eventDetails'),
    width: 904,
    autoHeight: true,
    cellRendererSelector: params =>
      params.data?.createdBy?.id ===
      this.store.selectSnapshot(UserProfileState.userId)
        ? { component: nameof(AgCellTemplateComponent) }
        : null,
    tooltipValueGetter: params => params.valueFormatted ?? params.value,
    flex: 2,
    minWidth: 200,
    suppressColumnsToolPanel: true,
    lockVisible: true
  };

  createdByCol: ITypedColDef<IQcEventsLogItemState, IDisplayLookupDto> = {
    headerName: EventsLogColumnsLabels.CreatedBy,
    colId: EventsLogColumns.CreatedBy,
    field: model('createdBy'),
    width: 377,
    valueFormatter: params => params.value?.name,
    filterParams: {
      valueGetter: rowModel => rowModel.data?.createdBy?.name,
      applyButton: true,
      resetButton: true
    },
   
  };

  createdCol: ITypedColDef<IQcEventsLogItemState, string> = {
    headerName: EventsLogColumnsLabels.Created,
    colId: EventsLogColumns.Created,
    field: model('createdOn'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    filterParams: {
      comparator: function(
        filterLocalDateAtMidnight: Date,
        cellValue: string
      ): number {
        const dateAsString = cellValue;
        if (dateAsString == null) return -1;
        const cellDate = new Date(dateAsString.substr(0, 11) + '00:00:00');
        if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
          return 0;
        }
        if (cellDate < filterLocalDateAtMidnight) {
          return -1;
        }
        if (cellDate > filterLocalDateAtMidnight) {
          return 1;
        }
      },
      applyButton: true,
      resetButton: true,
      inRangeInclusive: true
    },
    width: 507
  };
  private readonly dateFormat: string;

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    tenantSettings: TenantSettingsService,
    private actions$: Actions,
    private store: Store,
    private format: TenantFormattingService,
    private detailsService: QcReportService
  ) {
    super(
      'quantity-control-events-log-grid',
      columnPreferences,
      changeDetector,
      loggerFactory.createLogger(EventsLogGridViewModel.name)
    );
    this.init(this.gridOptions);

    const generalTenantSettings = tenantSettings.getGeneralTenantSettings();
    this.dateFormat = generalTenantSettings.tenantFormats.dateFormat.name;
    this.updatingGrid();
  }

  updatingGrid(): void {
    merge(
      this.gridReady$.pipe(first()),
      // Note: After save we want to reload event notes, because we don't have saved ids, so we can't actually delete them.
      this.actions$.pipe(
        ofActionSuccessful(QcSaveReportDetailsSuccessfulAction)
      )
    )
      .pipe(
        tap(() => this.gridApi.showLoadingOverlay()),
        switchMap(() => this.detailsService.loadEventsLog$()),
        // Note: No need for pagination or server-side filtering, everything is loaded in memory.
        switchMap(() => this.store.select(QcReportState.eventLogsItems)),
        catchError(() => {
          this.gridApi.hideOverlay();
          return EMPTY$;
        }),
        tap(items => {
          this.gridApi.setRowData(items);
          if (!items || !items.length) {
            this.gridApi.showNoRowsOverlay();
          } else {
            this.gridApi.hideOverlay();
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  getColumnsDefs(): ITypedColDef[] {
    return [
      this.actionsColumn,
      this.eventDetailsCol,
      this.createdByCol,
      this.createdCol
    ];
  }
}
