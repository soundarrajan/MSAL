import {
  Attribute,
  Directive,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output
} from '@angular/core';
import { merge, of, Subject, throwError } from 'rxjs';
import {
  concatMap,
  debounceTime,
  delay,
  filter,
  finalize,
  map,
  mergeMap,
  retry,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import { FilterChangedEvent } from '@ag-grid-community/core';
import * as _ from 'lodash';
import { first } from 'rxjs/internal/operators/first';
import { FilterPreferencesComponent } from './filter-preference.component';
import { AgGridFilterPresetsService } from './ag-filter-presets-service/ag-filter-presets.service';
import { RowModelType } from '@shiptech/core/ui/components/ag-grid/type.definition';
import { SKIP$ } from '@shiptech/core/utils/rxjs-operators';
import { AgGridAngular } from '@ag-grid-community/angular';
import { FilterPreferenceViewModel } from '@shiptech/core/services/user-settings/filter-preference.interface';
import moment from 'moment';
import { ControlTowerQuantityRobDifferenceListColumns } from '../../../../../../feature/control-tower/src/lib/views/control-tower/view/components/control-tower-general-view-list//list-columns/control-tower-quantity-rob-difference-list.columns';
import { ControlTowerQuantityClaimsListColumns } from '../../../../../../feature/control-tower/src/lib/views/control-tower/view/components/control-tower-general-view-list//list-columns/control-tower-quantity-claims-list.columns';

// import { timeEnd } from 'console';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector:
    // tslint:disable-next-line:directive-selector
    'app-filter-preferences[appAgGridFilterPresets], ag-grid-angular[appAgGridFilterPresets]'
})
export class AgGridFilterPresetsDirective implements OnInit, OnDestroy {
  @Output() public eventName = new EventEmitter();
  @Output() presetsLoaded = new EventEmitter();
  private _destroy$: Subject<any> = new Subject();
  activeFilter: boolean;
  autoSaveInterval: any;
  @Input() groupId: string;
  @Input() gridId: string;
  @Input() id: string;
  constructor(
    private filterPresetsService: AgGridFilterPresetsService,
    @Optional() private agGrid: AgGridAngular,
    @Optional() private filterComponent: FilterPreferencesComponent
  ) {}

  ngOnInit(): void {
    if (this.filterComponent) {
      this.processFilterComponentEvents(this.groupId);
    }
    if (this.agGrid) {
      this.processAgGridEvents();
    }
  }

  addedFilterByFromAndToByDefault() {
    let gridIds = {
      'control-tower-quantity-rob-list-grid-2': {
        timeDeltaValue: 7,
        timeDeltaUnit: 'days',
        mappedKey: ControlTowerQuantityRobDifferenceListColumns.createdOn
      },
      'control-tower-quantity-supply-list-grid-1': {
        timeDeltaValue: 7,
        timeDeltaUnit: 'month',
        mappedKey: ControlTowerQuantityRobDifferenceListColumns.createdOn
      },
      'control-tower-quantity-claims-list-grid-8': {
        timeDeltaValue: 6,
        timeDeltaUnit: 'month',
        mappedKey: ControlTowerQuantityClaimsListColumns.createdDate
      }
    };
    // let last6MonthsOfDataGridIds = [
    //   'control-tower-quantity-claims-list-grid-8'
    // ];

    if (gridIds[this.id]) {
      this.setRangeUntilNow(
        gridIds[this.id].timeDeltaValue,
        gridIds[this.id].timeDeltaUnit,
        gridIds[this.id].mappedKey
      );
    }
  }

  setRangeUntilNow(timeDeltaValue: number, timeDeltaUnit, mappingKey: string) {
    for (let i = 0; i < this.filterComponent.filterPresets.length; i++) {
      if (this.filterComponent.filterPresets[i].filterModels) {
        let filters = this.filterComponent.filterPresets[i].filterModels[
          this.id
        ];

        if (filters) {
          for (let [key, value] of Object.entries(filters)) {
            if (key == mappingKey) {
              return;
            }
          }
          this.filterComponent.filterPresets[i].filterModels[this.id][
            mappingKey
          ] = {
            dateFrom: moment()
              .subtract(timeDeltaValue, timeDeltaUnit)
              .format('YYYY-MM-DD'),
            dateTo: moment().format('YYYY-MM-DD'),
            type: 'inRange',
            filterType: 'date'
          };
        } else {
          this.filterComponent.filterPresets[i].filterModels[this.id] = {
            [mappingKey]: {
              dateFrom: moment()
                .subtract(timeDeltaValue, timeDeltaUnit)
                .format('YYYY-MM-DD'),
              dateTo: moment().format('YYYY-MM-DD'),
              type: 'inRange',
              filterType: 'date'
            }
          };
        }
      }
    }
  }

  last7MonthsOfData() {
    for (let i = 0; i < this.filterComponent.filterPresets.length; i++) {
      if (this.filterComponent.filterPresets[i].filterModels) {
        let filters = this.filterComponent.filterPresets[i].filterModels[
          this.id
        ];
        if (filters) {
          for (let [key, value] of Object.entries(filters)) {
            if (key == 'createdOn') {
              return;
            }
          }
          this.filterComponent.filterPresets[i].filterModels[this.id][
            'createdOn'
          ] = {
            dateFrom: moment()
              .subtract(7, 'months')
              .format('YYYY-MM-DD'),
            dateTo: moment().format('YYYY-MM-DD'),
            type: 'inRange',
            filterType: 'date'
          };
        } else {
          this.filterComponent.filterPresets[i].filterModels[this.id] = {
            createdOn: {
              dateFrom: moment()
                .subtract(7, 'months')
                .format('YYYY-MM-DD'),
              dateTo: moment().format('YYYY-MM-DD'),
              type: 'inRange',
              filterType: 'date'
            }
          };
        }
      }
    }
  }

  last6MonthsOfData() {
    for (let i = 0; i < this.filterComponent.filterPresets.length; i++) {
      if (this.filterComponent.filterPresets[i].filterModels) {
        let filters = this.filterComponent.filterPresets[i].filterModels[
          this.id
        ];
        if (filters) {
          for (let [key, value] of Object.entries(filters)) {
            if (key == 'createdDate') {
              return;
            }
          }
          this.filterComponent.filterPresets[i].filterModels[this.id][
            'createdDate'
          ] = {
            dateFrom: moment()
              .subtract(6, 'months')
              .format('YYYY-MM-DD'),
            dateTo: moment().format('YYYY-MM-DD'),
            type: 'inRange',
            filterType: 'date'
          };
        } else {
          this.filterComponent.filterPresets[i].filterModels[this.id] = {
            createdDate: {
              dateFrom: moment()
                .subtract(6, 'months')
                .format('YYYY-MM-DD'),
              dateTo: moment().format('YYYY-MM-DD'),
              type: 'inRange',
              filterType: 'date'
            }
          };
        }
      }
    }
  }

  processFilterComponentEvents(groupId: string): void {
    this.filterPresetsService.setActiveFilter(false);
    this.filterComponent.isLoading = true;
    this.filterComponent.refresh();
    // NOTE: Loading the saved filter presets and setting the value to the filter component
    // NOTE: Also updating the hasActiveFilterPresets variable so we can decide if we display the chip for available filters pop-up
    this.filterPresetsService
      .loadPresets(groupId)
      .pipe(
        tap(filterPresets => {
          this.filterComponent.filterPresets = [...filterPresets];
          this.filterComponent.hasActiveFilterPresets = filterPresets.some(
            item => !item.isDefault && !item.isClear
          );
          this.addedFilterByFromAndToByDefault();
        }),
        finalize(() => {
          this.filterComponent.isLoading = false;
          this.filterComponent.refresh();
          this.autoSaveInterval = setInterval(
            function() {
              if (this.filterPresetsService.getActiveFilter()) {
                this.filterPresetsService.setActiveFilter(false);
                clearInterval(this.autoSaveInterval);
                this.presetsLoaded.next();
              }
            }.bind(this),
            100
          );
        }),
        takeUntil(this._destroy$)
      )
      .subscribe();

    // NOTE: When the service is notified by the component that contains the grid and directive to open the create new filter dialog
    // the service notifies the filter component to open it
    this.filterPresetsService.openSaveAsDialog$
      .pipe(
        tap(() => this.filterComponent.openSaveAsPresetDialog()),
        takeUntil(this._destroy$)
      )
      .subscribe();

    // NOTE: When a change occurs on the grid filters the grid notifies the service
    // The presets service then notifies the filter preferences component that a change has occurred on the active preset
    // A '*' will appear on the active preset until it a new preset will be saved or the current preset will be saved
    this.filterPresetsService.filtersChanged$
      .pipe(
        filter(
          event => event.groupId === groupId && !this.filterComponent.isLoading
        ),
        tap(() => this.filterComponent.isDirty(true)),
        takeUntil(this._destroy$)
      )
      .subscribe();

    // NOTE: This occurs when the service gets to save the presets
    this.filterPresetsService.saveFilterPreset$
      .pipe(
        tap(() => this.filterPresetsService.saveFilterPreset(groupId)),
        takeUntil(this._destroy$)
      )
      .subscribe();

    // NOTE: When the service is notified by the component that contains the grid and directive to open the update the current preset by saving the changes
    // NOTE: If there is no active preset the create new preset dialog will be opened
    this.filterPresetsService.updateFilterPreset$
      .pipe(
        tap(() => {
          if (!this.filterComponent.filterPresets) {
            this.filterComponent.openSaveAsPresetDialog();
            return;
          }
          const anyActiveFilter = this.filterComponent.filterPresets.some(
            preset => !preset.isClear && !preset.isDefault && preset.isActive
          );
          if (!anyActiveFilter) {
            this.filterComponent.openSaveAsPresetDialog();
          } else {
            this.filterPresetsService.emitSaveFilterPreset();
          }
        }),
        takeUntil(this._destroy$)
      )
      .subscribe();

    // NOTE: When a change occurs on the preset from the filter component
    // the service has to update it's store so it will not remain behind the values from the component
    this.filterComponent.filterPresetsUpdate$
      .pipe(
        filter(val => !!val),
        tap(presets =>
          this.filterPresetsService.setGridFilterPresets(groupId, presets)
        ),
        takeUntil(this._destroy$)
      )
      .subscribe();

    // NOTE: When the active preset changes the presets service will be notified to:
    // - set the current preset filter models to the grid
    // - save the presets to keep the selected one as active on refresh
    this.filterComponent.activePresetChange$
      .pipe(
        filter(val => !!val),
        mergeMap(presets => {
          if (
            !this.filterPresetsService.gridApis[groupId] &&
            !this.filterPresetsService.gridApis[groupId][this.id]
          ) {
            return throwError('The gridApi is not loaded yet');
          }
          return of(presets);
        }),
        // NOTE: Consider using retry when
        retry(2),
        tap(presets => {
          this.filterPresetsService.setFilterModel(groupId, presets);
        }),
        debounceTime(1000),
        tap(() => this.filterPresetsService.emitSaveFilterPreset()),
        takeUntil(this._destroy$)
      )
      .subscribe();

    // NOTE: When the filter component notifies the directive that the service has to save the presets
    this.filterComponent.savePresets$
      .pipe(
        tap(() => this.filterPresetsService.emitSaveFilterPreset()),
        takeUntil(this._destroy$)
      )
      .subscribe();
  }

  processAgGridEvents(): void {
    const setSavedPreset$ = this.filterPresetsService.filterPresets$.pipe(
      // TODO: MAJOR hack/workaround, filters arrive before grid is ready and columns are set, which will fail when trying to apply the filter on an empty set of columns
      // TODO: These filter presets need no love, but hell fire. If they have not already laid eggs, should definitely be re-written completely.
      switchMap(presets => of(presets).pipe(delay(200))),
      map(presets => !!presets[this.groupId]),
      // Note: If the user has already changed the grid filters while presets are loading
      // Note: Do not set the default or last active filter, so we don't override the user's currently set filters.
      filter(settingsLoaded => settingsLoaded),
      first(),
      tap(() => {
        if (this.agGrid.gridOptions.api.isColumnFilterPresent()) {
          this.filterPresetsService.setAllInactive(this.groupId);
          return;
        }
        this.filterPresetsService.setGridFilterModel(this.groupId);
      })
    );

    const processFilterChange$ = this.agGrid.filterChanged.pipe(
      filter(
        (val, index) =>
          index >=
          _.values(this.filterPresetsService.gridApis[this.groupId]).length
      ),
      tap(filterChangedEvent =>
        this.onGridFilterChanged(<FilterChangedEvent>filterChangedEvent)
      ),
      takeUntil(this._destroy$)
    );

    // Note: To start processing grid filter events we have to wait for the grid to be ready and initial data to be rendered
    // Note: If you don't wait for firstDataRendered, the filter won't take effect.. this was ag-grid's support team recommendation (this is for client-side row-model)
    this.agGrid.gridReady
      .pipe(
        concatMap(() =>
          this.agGrid.gridOptions.rowModelType === RowModelType.ClientSide
            ? this.agGrid.firstDataRendered.pipe(first())
            : SKIP$
        ),
        // Note: We are registering the the grid apis so we can use them in the service to get the filter model or set the filter model
        tap(() => {
          this.filterPresetsService.registerGrid(
            this.groupId,
            this.id,
            () => this.agGrid.api
          );
        }),
        // Note: Using common stream to process initial filter set events and filter change events a
        mergeMap(() => merge(setSavedPreset$, processFilterChange$)),
        takeUntil(this._destroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  // NOTE: This gets called when FilterChangedEvent gets fired by the grid and updates tells the service that the current preset has changes
  private onGridFilterChanged(event: FilterChangedEvent): void {
    this.filterPresetsService.emitFiltersChanged({
      groupId: this.groupId,
      gridId: this.id,
      filterPreset: <FilterPreferenceViewModel>event.api.getFilterModel()
    });
  }
}
