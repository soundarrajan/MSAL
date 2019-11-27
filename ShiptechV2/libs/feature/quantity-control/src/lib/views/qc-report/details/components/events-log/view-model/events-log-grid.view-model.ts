import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { ChangeDetectorRef, Injectable, OnDestroy } from '@angular/core';
import { ColDef, GridOptions } from 'ag-grid-community';
import { ModuleLoggerFactory } from '../../../../../../core/logging/module-logger-factory';
import { AgCellTemplateComponent } from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';
import { Store } from '@ngxs/store';
import { EventsLogColumns, EventsLogColumnsLabels } from './events-log.columns';
import { IQcEventsLogItemState } from '../../../../../../store/report/details/qc-events-log-state.model';
import { QcReportState } from '../../../../../../store/report/qc-report.state';
import { AgColumnHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-column-header/ag-column-header.component';
import { nameof } from '@shiptech/core/utils/type-definitions';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { QcReportService } from '../../../../../../services/qc-report.service';

function model(prop: keyof IQcEventsLogItemState): string {
  return prop;
}

const a = AgCellTemplateComponent.name.toString();

@Injectable()
export class EventsLogGridViewModel extends BaseGridViewModel implements OnDestroy {

  gridOptions: GridOptions = {
    groupHeaderHeight: 40,
    headerHeight: 40,

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
      filter: 'agTextColumnFilter'
    }
  };

  actionsColumn: ColDef = {
    colId: EventsLogColumns.Actions,
    width: 50,
    hide: false,
    resizable: false,
    sortable: false,
    suppressColumnsToolPanel: true,
    suppressFiltersToolPanel: true,
    headerComponentFramework: AgColumnHeaderComponent,
    cellRendererSelector: params => (<IQcEventsLogItemState>params.data).isNew ? { component: nameof(AgCellTemplateComponent) } : null
  };

  eventDetailsCol: ColDef = {
    headerName: EventsLogColumnsLabels.EventDetails,
    colId: EventsLogColumns.EventDetails,
    field: model('eventDetails'),
    width: 800,
    autoHeight: true,
    cellRendererSelector: params => (<IQcEventsLogItemState>params.data).isNew ? { component: nameof(AgCellTemplateComponent) } : null
  };

  createdByCol: ColDef = {
    headerName: EventsLogColumnsLabels.CreatedBy,
    colId: EventsLogColumns.CreatedBy,
    field: model('createdBy'),
    width: 400
  };

  createdCol: ColDef = {
    headerName: EventsLogColumnsLabels.Created,
    colId: EventsLogColumns.Created,
    field: model('created'),
    width: 400
  };

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    store: Store,
    private detailsService: QcReportService
  ) {
    super('quantity-control-events-log-grid', columnPreferences, changeDetector, loggerFactory.createLogger(EventsLogGridViewModel.name));
    this.initOptions(this.gridOptions);

    this.gridReady$.pipe(
      switchMap(() => this.detailsService.loadEventsLog()),
      switchMap(() => store.select(QcReportState.eventLogsItems)),
      tap(eventLogsItems => this.gridApi.setRowData(eventLogsItems)),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  getColumnsDefs(): ColDef[] {
    return [this.actionsColumn, this.eventDetailsCol, this.createdByCol, this.createdCol];
  }
}
