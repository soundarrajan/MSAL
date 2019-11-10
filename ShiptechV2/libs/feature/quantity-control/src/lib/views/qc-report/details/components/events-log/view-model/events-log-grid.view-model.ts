import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { ColDef, GridOptions } from 'ag-grid-community';
import { ModuleLoggerFactory } from '../../../../../../core/logging/module-logger-factory';
import { AgCellTemplateComponent } from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';
import { Select, Store } from '@ngxs/store';
import { EventsLogColumns, EventsLogColumnsLabels } from './events-log.columns';
import { Observable } from 'rxjs';
import { IQcEventsLogItemState } from '../../../../../../store/report-view/details/qc-events-log-state.model';
import { IAppState } from '@shiptech/core/store/states/app.state.interface';
import { QcReportState } from '../../../../../../store/report-view/qc-report.state';
import { AgColumnHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-column-header/ag-column-header.component';

function model(prop: keyof IQcEventsLogItemState): string {
  return prop;
}

@Injectable()
export class EventsLogGridViewModel extends BaseGridViewModel {

  gridOptions: GridOptions = {
    groupHeaderHeight: 40,
    headerHeight: 40,
    rowHeight: 35,

    domLayout: 'autoHeight',
    pagination: false,
    animateRows: true,

    deltaRowDataMode: true,
    suppressPaginationPanel: true,

    multiSortKey: 'ctrl',
    getRowNodeId: (data: IQcEventsLogItemState) => data.id.toString(),

    defaultColDef: {
      sortable: true,
      filter: 'agTextColumnFilter',
    }
  };

  actionsColumn: ColDef = {
    colId: EventsLogColumns.Actions,
    width: 300,
    hide: false,
    resizable: false,
    sortable: false,
    suppressToolPanel: true,
    cellRendererFramework: AgCellTemplateComponent,
    headerComponentFramework: AgColumnHeaderComponent
  };

  eventDetailsCol: ColDef = {
    headerName: EventsLogColumnsLabels.EventDetails,
    colId: EventsLogColumns.EventDetails,
    field: model('eventDetails'),
    autoHeight: true,
    cellRendererFramework: AgCellTemplateComponent
  };

  createdByCol: ColDef = {
    headerName: EventsLogColumnsLabels.CreatedBy,
    colId: EventsLogColumns.CreatedBy,
    field: model('createdBy')
  };

  createdCol: ColDef = {
    headerName: EventsLogColumnsLabels.Created,
    colId: EventsLogColumns.Created,
    field: model('created')
  };

  @Select(QcReportState.eventLogsItems)
  eventLogs$: Observable<IQcEventsLogItemState[]>;

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory
  ) {
    super('quantity-control-events-log-grid', columnPreferences, changeDetector, loggerFactory.createLogger(EventsLogGridViewModel.name));
    this.initOptions(this.gridOptions);
  }

  getColumnsDefs(): ColDef[] {
    return [this.actionsColumn, this.eventDetailsCol, this.createdByCol, this.createdCol];
  }
}
