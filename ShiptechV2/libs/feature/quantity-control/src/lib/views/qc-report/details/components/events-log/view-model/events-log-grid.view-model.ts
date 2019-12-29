import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { ChangeDetectorRef, Injectable, OnDestroy } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
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
import { TypedColDef } from '@shiptech/core/ui/components/ag-grid/type.definition';
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
export class EventsLogGridViewModel extends BaseGridViewModel implements OnDestroy {

  private readonly dateFormat: string;

  private defaultColFilterParams = {
    clearButton: true,
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

    multiSortKey: 'ctrl',
    getRowNodeId: (data: IQcEventsLogItemState) => data.id.toString(),

    frameworkComponents: {
      [nameof(AgCellTemplateComponent)]: AgCellTemplateComponent
    },
    defaultColDef: {
      resizable: true,
      sortable: true,
      filter: 'agTextColumnFilter',
      filterParams: this.defaultColFilterParams
    }
  };

  actionsColumn: TypedColDef<IQcEventsLogItemState> = {
    colId: EventsLogColumns.Actions,
    width: 50,
    hide: false,
    resizable: false,
    sortable: false,
    suppressColumnsToolPanel: true,
    suppressFiltersToolPanel: true,
    headerComponentFramework: AgColumnHeaderComponent,
    cellRendererSelector: params => params.data?.isNew || params.data?.createdBy?.name?.toLowerCase() === this.store.selectSnapshot(UserProfileState.username)?.toLowerCase()
      ? { component: nameof(AgCellTemplateComponent) }
      : null
  };

  eventDetailsCol: TypedColDef<IQcEventsLogItemState, string> = {
    headerName: EventsLogColumnsLabels.EventDetails,
    colId: EventsLogColumns.EventDetails,
    field: model('eventDetails'),
    width: 800,
    autoHeight: true,
    cellRendererSelector: params => params.data?.isNew ? { component: nameof(AgCellTemplateComponent) } : null
  };

  createdByCol: TypedColDef<IQcEventsLogItemState, IDisplayLookupDto> = {
    headerName: EventsLogColumnsLabels.CreatedBy,
    colId: EventsLogColumns.CreatedBy,
    field: model('createdBy'),
    valueFormatter: params => params.value?.displayName ?? params.value?.name,
    width: 400,
    filterParams: {
      valueGetter: rowModel => rowModel.data?.createdBy?.displayName ?? rowModel.data?.createdBy?.name
    }
  };

  createdCol: TypedColDef<IQcEventsLogItemState, string> = {
    headerName: EventsLogColumnsLabels.Created,
    colId: EventsLogColumns.Created,
    field: model('createdOn'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    width: 400
  };

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    tenantSettings: TenantSettingsService,
    actions$: Actions,
    private store: Store,
    private format: TenantFormattingService,
    private detailsService: QcReportService
  ) {
    super('quantity-control-events-log-grid', columnPreferences, changeDetector, loggerFactory.createLogger(EventsLogGridViewModel.name));
    this.init(this.gridOptions);

    const generalTenantSettings = tenantSettings.getGeneralTenantSettings();
    this.dateFormat = generalTenantSettings.tenantFormats.dateFormat.name;

    merge(
      this.gridReady$.pipe(first()),
      // Note: After save we want to reload event notes, because we don't have saved ids, so we can't actually delete them.
      actions$.pipe(ofActionSuccessful(QcSaveReportDetailsSuccessfulAction))
    ).pipe(
      tap(() => this.gridApi.showLoadingOverlay()),
      switchMap(() => this.detailsService.loadEventsLog$()),
      // Note: No need for pagination or server-side filtering, everything is loaded in memory.
      switchMap(() => store.select(QcReportState.eventLogsItems)),
      catchError(() => {
        this.gridApi.hideOverlay();
        return EMPTY$;
      }),
      tap(items => {
        if (!items || !items.length) {
          this.gridApi.showNoRowsOverlay();
        } else {
          this.gridApi.setRowData(items);
          this.gridApi.hideOverlay();
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  getColumnsDefs(): TypedColDef[] {
    return [this.actionsColumn, this.eventDetailsCol, this.createdByCol, this.createdCol];
  }
}
