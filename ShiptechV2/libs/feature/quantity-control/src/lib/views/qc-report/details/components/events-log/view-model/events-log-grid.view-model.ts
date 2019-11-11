import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { ColDef, GridOptions } from 'ag-grid-community';
import { ModuleLoggerFactory } from '../../../../../../core/logging/module-logger-factory';
import { AgCellTemplateComponent } from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';
import { Select } from '@ngxs/store';
import { EventsLogColumns, EventsLogColumnsLabels } from './events-log.columns';
import { Observable } from 'rxjs';
import { IQcEventsLogItemState } from '../../../../../../store/report-view/details/qc-events-log-state.model';
import { QcReportState } from '../../../../../../store/report-view/qc-report.state';
import { AgColumnHeaderComponent } from '@shiptech/core/ui/components/ag-grid/ag-column-header/ag-column-header.component';
import { nameof } from '@shiptech/core/utils/type-definitions';

function model(prop: keyof IQcEventsLogItemState): string {
  return prop;
}
const a = AgCellTemplateComponent.name.toString();

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

    frameworkComponents:{
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
    suppressToolPanel: true,
    headerComponentFramework: AgColumnHeaderComponent,
    cellRendererSelector: params => (<IQcEventsLogItemState>params.data).isNew ? { component: nameof(AgCellTemplateComponent)} : null
  };

  eventDetailsCol: ColDef = {
    headerName: EventsLogColumnsLabels.EventDetails,
    colId: EventsLogColumns.EventDetails,
    field: model('eventDetails'),
    autoHeight: true,
    cellRendererSelector: params => (<IQcEventsLogItemState>params.data).isNew ? { component: nameof(AgCellTemplateComponent)} : null
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
