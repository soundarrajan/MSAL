import { Inject, Injectable, OnDestroy, Optional } from '@angular/core';
import { GridOptions } from '@ag-grid-community/core';
import { EMPTY, Observable, of, Subject } from 'rxjs';
import {
  debounceTime,
  filter,
  groupBy,
  mergeMap,
  switchMap,
  tap,
  throttleTime
} from 'rxjs/operators';
import * as _ from 'lodash';
import { LocalPreferenceService } from '../../../../services/preference-storage/local-preference.service';
import {
  IPreferenceStorage,
  PREFERENCE_STORAGE
} from '../../../../services/preference-storage/preference-storage.interface';
import { ITypedColumnState } from '@shiptech/core/ui/components/ag-grid/type.definition';

interface IGridRegistration {
  name: string;
  options: GridOptions;
  columnsStateChanged$: Subject<any>;
  eventListener: Function;
}

interface IAgGridSortModel {
  colId: string;
  sort: string;
}

interface IGridPreferences {
  gridName: string;
  columnState: ITypedColumnState[];
  sortState: IAgGridSortModel[];
}

const GridMonitorEvents = [
  'gridColumnsChanged',
  'displayedColumnsChanged',
  'columnResized',
  'columnEverythingChanged',
  'sortChanged'
];

@Injectable({
  providedIn: 'root'
})
export class AgColumnPreferencesService implements OnDestroy {
  private _savePreferences = new Subject<any>();
  private _watches: IGridRegistration[] = [];
  private _storage: IPreferenceStorage;

  constructor(
    @Inject(PREFERENCE_STORAGE) @Optional() private storage: IPreferenceStorage,
    defaultStorage: LocalPreferenceService
  ) {
    this._storage = storage || defaultStorage;

    // Note: Aligned grids will each try to save it's preferences when a column state changes.
    // Note: We only want to save one of them.
    // if ((<any>window).savePreferenceCall) {
    this._savePreferences
      .pipe(
        groupBy(request => request.gridName),
        mergeMap(group =>
          group.pipe(
            throttleTime(1000),
            switchMap(request =>
              this._storage.set(this._storageKey(request.gridName), request)
            )
          )
        )
      )
      .subscribe();
    // } else {
    //   (<any>window).savePreferenceCall = true;
    // }
  }

  registerWatch(gridName: string, gridOptions: GridOptions): void {
    if (!gridOptions.api) {
      throw Error(`Grid ${gridName} is not ready yet.`);
    }

    const columnsStateChanged$ = new Subject();

    const listener = () => columnsStateChanged$.next();

    GridMonitorEvents.forEach(event =>
      gridOptions.api.addEventListener(event, listener)
    );

    columnsStateChanged$
      .pipe(
        // Note: In case multiple columns change at the same time.
        debounceTime(100),
        // Note: gridOptions may already by uninitializing
        filter(() => !!gridOptions.columnApi),
        tap(() => {
          if (gridName == 'control-tower-quantity-claims-list-grid-7') {
            this._savePreferences.next({
              gridName,
              columnState: gridOptions.columnApi.getColumnState(),
              sortState: gridOptions.api.getSortModel().length
                ? gridOptions.api.getSortModel()
                : gridOptions.api.setSortModel([
                    {
                      colId: 'createdDate',
                      sort: 'desc'
                    }
                  ])
            });
          } else {
            this._savePreferences.next({
              gridName,
              columnState: gridOptions.columnApi.getColumnState(),
              sortState: gridOptions.api.getSortModel()
            });
          }
        })
      )
      .subscribe();

    this._watches.push({
      name: gridName,
      options: gridOptions,
      columnsStateChanged$,
      eventListener: listener
    });
  }

  unregisterWatch(gridName: string): void {
    const reg = this._watches.find(s => s.name === gridName);

    if (!reg) {
      return;
    }

    reg.columnsStateChanged$.complete();

    GridMonitorEvents.forEach(event => {
      // Note: When ag-Grid unloads the api props are set to null.
      if (reg.options.api) {
        reg.options.api.removeEventListener(event, reg.eventListener);
      }
    });

    _.remove(this._watches, reg);
  }

  restoreToGrid(gridName: string, options: GridOptions): Observable<any> {
    return this._storage.get<IGridPreferences>(this._storageKey(gridName)).pipe(
      // filter(p => !!p),
      tap(preferences => {
        if (!preferences) {
          if (gridName == 'control-tower-quantity-claims-list-grid-7') {
            options.api.setSortModel([
              {
                colId: 'createdDate',
                sort: 'desc'
              }
            ]);
          }
        } else {
          const columnsState = preferences.columnState;
          const sortState = preferences.sortState;

          if (!Array.isArray(columnsState) || columnsState.length === 0) {
            this._storage.remove(this._storageKey(gridName));

            throw Error('Invalid grid state json.');
          }

          const allColumnsSet = new Set<string>(
            options.columnApi.getAllColumns().map(column => column.getColId())
          );

          // Note: Restore only existing columns.
          const columns = columnsState.filter(columnState =>
            allColumnsSet.has(columnState.colId)
          );

          if (columns.length === 0) {
            throw Error('Preferences contains no valid columns.');
          }

          if (columns && columns.length > 0 && columns.some(c => !c.hide)) {
            options.columnApi.setColumnState(columns);
          }

          // Note: Restore Sort
          // Note: Restore sort only existing columns.
          const sortModels = sortState.filter(sortModel =>
            allColumnsSet.has(sortModel.colId)
          );

          // Note: This will trigger a new data-source update, meaning your grid will load multiple times.
          options.api.setSortModel(sortModels);
        }
      })
    );
  }

  restore(gridName: string): Observable<any> {
    const watch = this._watches.find(s => s.name === gridName);

    if (!watch || !watch.options.api) {
      return EMPTY;
    }
    return this.restoreToGrid(gridName, watch.options);
  }

  ngOnDestroy(): void {
    this._savePreferences.complete();
  }
  private _storageKey = (gridName: string) => `${gridName}_ColumnPreference`;
}
