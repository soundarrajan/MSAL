import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import {
  FilterPreferenceModel,
  FilterPreferenceViewModel
} from '../../../../services/user-settings/filter-preference.interface';
import { map, tap } from 'rxjs/operators';
import { IGridFilterChanged } from './grid-filter-changed.interface';
import {
  IFilterPresetsStore,
  IGetGridApi,
  PresetGroupModel
} from './ag-filter-presets.models';
import { defaultFilterItems } from './default-filters';
import * as _ from 'lodash';
import {
  IPreferenceStorage,
  PREFERENCE_STORAGE
} from '../../../../services/preference-storage/preference-storage.interface';

// Note: Provided in shared module
@Injectable()
export class AgGridFilterPresetsService implements OnDestroy {
  public filterPresets: IFilterPresetsStore = {};
  public filterPresets$ = new ReplaySubject<IFilterPresetsStore>(1);

  public gridApis: Record<string, Record<string, IGetGridApi>> = {};

  private _filtersChanged$ = new ReplaySubject<IGridFilterChanged>(1);
  public activeFilter: boolean = false;

  get filtersChanged$(): Observable<IGridFilterChanged> {
    return this._filtersChanged$.asObservable();
  }

  private _openSaveAsDialog$ = new Subject<any>();

  get openSaveAsDialog$(): Observable<any> {
    return this._openSaveAsDialog$.asObservable();
  }

  private _saveFilterPreset$ = new Subject<any>();

  get saveFilterPreset$(): Observable<any> {
    return this._saveFilterPreset$.asObservable();
  }

  private _updateFilterPreset$ = new Subject<any>();

  get updateFilterPreset$(): Observable<any> {
    return this._updateFilterPreset$.asObservable();
  }

  constructor(
    @Inject(PREFERENCE_STORAGE) private _storage: IPreferenceStorage
  ) {}

  // NOTE: This is used to load the current preferences and set the currently active preset to the grid
  public loadPresets(
    presetGroupKey: string
  ): Observable<FilterPreferenceViewModel[]> {
    if (this.filterPresets && this.filterPresets[presetGroupKey]) {
      return of(this.filterPresets[presetGroupKey].items);
    }

    // NOTE: Here we are loading the saved presets for the according preset group key
    // NOTE: Also if there's no active filter preset we are setting the default preset as active
    return this._storage.get<FilterPreferenceViewModel[]>(presetGroupKey).pipe(
      map(response =>
        (response || []).map(item => new FilterPreferenceViewModel(item))
      ),
      tap(preferences => {
        // NOTE: Here we are providing the default filter items to the component as a clone of the default object
        // NOTE:  Otherwise the same reference will be shared between all the instances of the filter component
        this.filterPresets[presetGroupKey] = new PresetGroupModel({
          items: _.cloneDeep(defaultFilterItems)
        });
        this.filterPresets[presetGroupKey].items = [
          ...this.filterPresets[presetGroupKey].items,
          ...preferences
        ];
        if (
          !this.filterPresets[presetGroupKey].items.some(item => item.isActive)
        ) {
          this.filterPresets[presetGroupKey].items.find(
            item => item.isClear
          ).isActive = true;
        }

        this.filterPresets$.next(this.filterPresets);
      }),
      map(() => this.filterPresets[presetGroupKey].items)
    );
  }

  // NOTE: This function is used to add presets to the existing presets before or after
  public addFilterPresetsToExistingGroup(
    presetGroupKey: string,
    presets: FilterPreferenceViewModel[],
    unshift: boolean = false
  ): void {
    if (!this.filterPresets || !this.filterPresets[presetGroupKey]) {
      return;
    }

    if (
      _.difference(presets, this.filterPresets[presetGroupKey].items).length !==
      0
    ) {
      this.filterPresets[presetGroupKey].items = unshift
        ? [...presets, ...this.filterPresets[presetGroupKey].items]
        : [...this.filterPresets[presetGroupKey].items, ...presets];
    }
  }

  // NOTE: Here we have the function used to save the presets to Mongo
  public saveFilterPreset(presetGroupKey: string): void {
    // NOTE: Here we are getting the preference what was updated to update it's filter model
    const updatedFilter: FilterPreferenceViewModel = this.filterPresets[
      presetGroupKey
    ].items.find(filter => filter.isActive);

    // NOTE: We are updating the corresponding presets with their updated filter models
    _.keys(this.gridApis[presetGroupKey]).forEach(key => {
      updatedFilter.filterModels[key] = this.gridApis[presetGroupKey][
        key
      ]().getFilterModel();
    });

    // NOTE: Setting the updated preset status as of now it doesn't have any unsaved changes
    updatedFilter.hasChanges = false;

    this._storage
      .set(
        presetGroupKey,
        this.filterPresets[presetGroupKey].items
          .filter(item => !item.isDefault && !item.isClear)
          .map(item => new FilterPreferenceModel(item))
      )
      .subscribe();
  }

  // NOTE: When a change occurs on the presets this is called to update the service presets store value
  public setGridFilterPresets(
    presetGroupKey: string,
    items: FilterPreferenceViewModel[]
  ): void {
    this.filterPresets[presetGroupKey].items = items;
    this.filterPresets$.next(this.filterPresets);
  }

  // NOTE: Updating the service presets store value
  // NOTE: Setting the presets to the corresponding grid
  public setFilterModel(
    presetGroupKey: string,
    presets: FilterPreferenceViewModel[]
  ): void {
    this.setGridFilterPresets(presetGroupKey, presets);
    this.setGridFilterModel(presetGroupKey);
  }

  // NOTE: This is used to set the presets to the grids on a preset change and on loading the saved presets when a preset is active
  public setGridFilterModel(presetGroupKey: string): void {
    if (!this.filterPresets[presetGroupKey]) {
      return;
    }
    const activeFilter = this.filterPresets[presetGroupKey].items[
      this.filterPresets[presetGroupKey].items.findIndex(val => val.isActive)
    ];

    if (activeFilter) {
      _.keys(this.gridApis[presetGroupKey]).forEach(key => {
        if (this.gridApis[presetGroupKey][key]) {
          this.gridApis[presetGroupKey][key]().setFilterModel(
            activeFilter.filterModels[key]
          );
        }
        this.activeFilter = true;
      });
    }
  }

  public emitFiltersChanged(value: IGridFilterChanged): void {
    this._filtersChanged$.next(value);
  }

  public emitUpdateFilterPreset(): void {
    this._updateFilterPreset$.next();
  }

  public emitSaveFilterPreset(): void {
    this._saveFilterPreset$.next();
  }

  public openSaveAsDialog(): void {
    this._openSaveAsDialog$.next();
  }

  public setAllInactive(presetGroupKey: string): void {
    this.filterPresets[presetGroupKey].items.forEach(
      item => (item.isActive = false)
    );
  }

  public setActivePreset(presetGroupKey: string, presetId: string): void {
    const activePreset = this.filterPresets[presetGroupKey].items.find(
      preset => preset.id === presetId
    );

    if (activePreset) {
      this.setAllInactive(presetGroupKey);
      activePreset.isActive = true;
    }
    this.filterPresets$.next(this.filterPresets);
  }

  // NOTE: This is used to register the grid api's to be accessible from the service
  registerGrid(presetGroupKey: string, gridId: string, api: IGetGridApi): void {
    if (!this.gridApis[presetGroupKey]) {
      this.gridApis[presetGroupKey] = {};
    }
    this.gridApis[presetGroupKey][gridId] = api;
  }

  public getActiveFilter(): boolean {
    return this.activeFilter;
  }

  public setActiveFilter(value: boolean): void {
    this.activeFilter = value;
  }

  ngOnDestroy(): void {
    this._openSaveAsDialog$.complete();
    this._saveFilterPreset$.complete();
  }
}
