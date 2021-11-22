import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FilterPreferenceViewModel } from '../../../services/user-settings/filter-preference.interface';
import { distinctUntilChanged, filter, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { AvailableFiltersComponent } from './available-filters/available-filters.component';
import { ToastrService } from 'ngx-toastr';
import {
  DefaultPreferenceLoaded,
  FiltersArNotLoaded,
  PreferenceAlreadyExists,
  PreferenceCleared,
  PreferenceLoaded,
  ToastPosition
} from './filter-preferences-messages';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-filter-preferences',
  templateUrl: './filter-preferences.component.html',
  styleUrls: ['./filter-preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterPreferencesComponent implements OnDestroy {
  public preferenceNameFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(1),
    Validators.pattern('^([?=_0-9a-zA-Z ]+)')
  ]);
  public presetsDialog: MatDialogRef<any>;
  // NOTE: These are the presets that the component displays and works with and are set by the directive after they are loaded by the service
  @Input() filterPresets: FilterPreferenceViewModel[];
  @Input() hasActiveFilterPresets: boolean;
  @Input() systemDefaultFilters: any;
  @Input() gridId: string;
  @Input() gridIds: {};
  @Input() groupedCountValues: any;
  // NOTE: This is the current active preset and is set when a filter preset is clicked from the list
  @Input() activePreset: FilterPreferenceViewModel;
  
  @Input() isLoading: boolean = false;
  
  @Input() maxPinnedItems: number = 3;
  // NOTE: Emits when a change occurs on the presets
  @Output() filterPresetsUpdate$ = new EventEmitter<
    FilterPreferenceViewModel[]
    >();
    // NOTE: This event occurs when any modification occurs on the filters
    @Output() savePresets$ = new EventEmitter<any>();
    // NOTE: This event occurs when the active filter is changed by selecting a different preset
  @Output() activePresetChange$ = new EventEmitter<
  FilterPreferenceViewModel[]
  >();
  @Output() systemFilterUpdate$ = new EventEmitter<any>();
  // NOTE: This is used to get the template for creating a new preset
  @ViewChild('createPreset', { static: false })
  createFilterTemplate: TemplateRef<any>;
  private _destroy$: Subject<any> = new Subject();
  public currentSystemFilters : [
    {
      id: string,
      label : string,
      countId : string,
      count: number,
      isActive: boolean
    }
  ]
  
  constructor(
    public matDialog: MatDialog,
    private toastr: ToastrService,
    private changeDetector: ChangeDetectorRef
    ) {}
    
  // NOTE: This occurs when a modification occurs on a filter item to set the has changes property true
  isDirty(isDirty: boolean): void {
    const currentFilter = this.filterPresets.find(preset => preset.isActive);
    if (currentFilter) {
      currentFilter.hasChanges = isDirty;
      this.changeDetector.markForCheck();
    }
  }

  ngOnInit() {
    if (this.gridIds[this.gridId]?.systemDefaultFilters) {
      this.currentSystemFilters = this.gridIds[this.gridId].systemDefaultFilters;
    }  
  }
  // NOTE: Setting a preset as pinned when it's pin icon is pressed
  
  // NOTE: Setting a preset as pinned displays it on the list above the grid
  public setPinned(id: string): void {
    this.filterPresets.find(
      preset => preset.id === id
    ).isPinned = !this.filterPresets.find(preset => preset.id === id).isPinned;
  }
  
  public updateSystemPreferencesCount(values) {
    for (const countId in values) {
      let countValue = values[countId];
      this.currentSystemFilters.forEach(systemFilter => {
        if(systemFilter.countId == countId) {
          systemFilter.count = countValue
        }        
      });
    }
  }

  // NOTE: This is used to set a preference as active when it's clicked from the list above the grid
  public applyFilter(id: string): void {
    // NOTE: Finding the active preset index
    const filterIndex: number = this.filterPresets.findIndex(
      val => val.isActive
    );
    if (this.filterPresets[filterIndex]) {
      // Note: Setting previously active preset to inactive and has changes false
      this.filterPresets[filterIndex].hasChanges = false;
      this.filterPresets[filterIndex].isActive = false;
    }
    // Note: Getting current preset index
    const currentFilterId = this.filterPresets.findIndex(
      preset => preset.id === id
    );

    // Note: Setting current preset active
    this.filterPresets[currentFilterId].isActive = true;
    this.activePreset = this.filterPresets[currentFilterId];

    // NOTE: Display the according toast message when changing the current preset
    if (this.activePreset.isDefault) {
      this.toastr.info(DefaultPreferenceLoaded, '', ToastPosition);
    } else if (this.activePreset.isClear) {
      this.toastr.info(PreferenceCleared, '', ToastPosition);
    } else {
      this.toastr.info(PreferenceLoaded, '', ToastPosition);
    }

    // NOTE: We are telling the presets directive the active preset was changed
    // NOTE: The presets directive will tell the service to update the presets store and set the selected preset to the grid
    this.activePresetChange$.next(this.filterPresets);

    // reset SystemFilters
    this.currentSystemFilters.map( o => o.isActive = false);
    
    this.changeDetector.markForCheck();
  }
  
  public systemFilterUpdate(filter):void {
    this.currentSystemFilters.map( o => o.isActive = false);
    this.filterPresets.map( o => o.isActive = false);
    filter.isActive = true;
    this.systemFilterUpdate$.next(this.currentSystemFilters);
  }

  public createNewFilter(): void {
    // NOTE: Validation for filter items on creating
    if (!this.preferenceNameFormControl.valid) {
      return;
    }

    if (this.isLoading) {
      this.toastr.info(FiltersArNotLoaded, '', ToastPosition);
      return;
    }

    if (
      this.filterPresets.some(
        item =>
          item.name.toLowerCase() ===
          this.preferenceNameFormControl.value.toLowerCase()
      )
    ) {
      this.toastr.info(PreferenceAlreadyExists, '', ToastPosition);
      return;
    }

    // NOTE: We are setting the current filter inactive as the newly created filter will be the active one
    const currentFilter = this.filterPresets.find(preset => preset.isActive);

    if (currentFilter) {
      currentFilter.isActive = false;
      currentFilter.hasChanges = false;
    }
    // NOTE: We are creating a new filter preset
    const newFilter = new FilterPreferenceViewModel({
      id: this.preferenceNameFormControl.value + Math.random(), // NOTE: to discuss how to generate ID
      name: this.preferenceNameFormControl.value,
      filterModels: {}, // NOTE: Filter models will be set for the current preference when it will be saved by getting the filter model from the grid
      isPinned: true,
      isActive: true
    });

    // NOTE: There can't be more than 3 pinned filters at a time so we have to remove one of them every time a new one is pinned
    const pinnedPresets = this.filterPresets.filter(
      preset => preset.isPinned && !preset.isDefault && !preset.isClear
    );
    if (pinnedPresets.length === 3) {
      pinnedPresets[0].isPinned = false;
    }

    // NOTE: Adds the created preset to the presets list which will be sent to the directive
    this.filterPresets.push(newFilter);

    // NOTE: Displaying the toast message when creating a new preset
    this.toastr.info(
      `Grid Preference - ${newFilter.name} Has Been Saved Successfully`,
      '',
      ToastPosition
    );

    // NOTE: Notifying the directive that the presets have changed
    this.filterPresetsUpdate$.next(this.filterPresets);

    // NOTE: Updating the hasActiveFilterPresets variable so we can decide if we display the chip for available filters pop-up
    this.hasActiveFilterPresets = this.filterPresets.some(
      item => !item.isDefault && !item.isClear
    );

    // NOTE: After creating a new filter preset we are notifying the directive that we want to save the presets
    this.savePresets$.next();

    // NOTE: Clearing the form control value after the new preset was saved
    this.preferenceNameFormControl.reset();

    // NOTE: Closing the create new preset dialog
    this.presetsDialog.close();

    this.changeDetector.markForCheck();
  }

  // NOTE: Opening the create new filter dialog
  public openSaveAsPresetDialog(): void {
    this.presetsDialog = this.matDialog.open(this.createFilterTemplate, {
      width: '400px',
      disableClose: false,
      closeOnNavigation: true
    });
  }

  // NOTE: Opening the Available filters dialog
  public openAvailablePresetsDialog(): void {
    const dialog = this.matDialog.open(AvailableFiltersComponent, {
      maxHeight: '400px',
      width: '700px',
      data: {
        filterPresets: this.filterPresets,
        maxPinnedItems: this.maxPinnedItems
      }
    });

    // NOTE: When the available filters dialog is closed if there were any changes on the filters we are notifying the directive that we want to save the presets
    // NOTE: Also updating the hasActiveFilterPresets variable so we can decide if we display the chip for available filters pop-up
    dialog
      .afterClosed()
      .pipe(
        filter(updatedPresetsList => !!updatedPresetsList),
        distinctUntilChanged(),
        tap(updatedPresetsList => {
          this.filterPresets = updatedPresetsList;
          this.hasActiveFilterPresets = updatedPresetsList.some(
            item => !item.isDefault && !item.isClear
          );
          this.filterPresetsUpdate$.next(this.filterPresets);

          this.changeDetector.markForCheck();
        }),
        tap(() => this.savePresets$.next()),
        takeUntil(this._destroy$)
      )
      .subscribe();
  }

  public refresh(): void {
    // Note: The whole filter component is a mess, this component is "managed" by the directive, so we need to trigger somehow the change detection.
    this.changeDetector.markForCheck();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
