import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {
  CharactersNotAllowed,
  EmptyFilterName,
  FilterExists,
  ToastPosition
} from '../filter-preferences-messages';
import { FilterPreferenceViewModel } from '../../../../services/user-settings/filter-preference.interface';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-available-filters',
  templateUrl: './available-filters.component.html',
  styleUrls: ['./available-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvailableFiltersComponent implements OnInit, OnDestroy {
  _destroy$: Subject<any> = new Subject();

  @ViewChild('deleteFilter', { static: false })
  deleteFilterTemplate: TemplateRef<any>;

  isEditing: boolean = false;
  deleteFilterDialog: any;
  hasAvailableFilterItems: boolean;

  filterItems: FilterPreferenceViewModel[];
  systemFilters: any;
  maxPinnedItems: number;
  filterToBeDeleted: FilterPreferenceViewModel;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    public matDialog: MatDialog,
    public dialogRef: MatDialogRef<AvailableFiltersComponent>,
    private changeDetector: ChangeDetectorRef
  ) {}

  updateAllFilters(): void {
    if (this.validateFilterItems()) {
      return;
    }

    this.isEditing = false;
    this.filterItems = [...this.filterItems, ...this.systemFilters];
    this.dialogRef.close(this.filterItems);
  }

  // NOTE: Validation for filter items on editing
  validateFilterItems(): boolean {
    const regexp = new RegExp('^([?=_0-9a-zA-Z ]+)');

    if (this.filterItems.some(item => item.name.length <= 0)) {
      this.toastr.info(EmptyFilterName, '', ToastPosition);
      return true;
    }

    if (this.filterItems.some(item => !regexp.test(item.name))) {
      this.toastr.info(CharactersNotAllowed, '', ToastPosition);
      return true;
    }

    if (
      _.filter(
        _.map(_.keyBy(this.filterItems, 'id'), item => item.name.toLowerCase()),
        (val, i, iteratee) => _.includes(iteratee, val, i + 1)
      ).length
    ) {
      this.toastr.info(FilterExists, '', ToastPosition);
      return true;
    }

    return false;
  }

  enableEditing(): void {
    this.isEditing = true;
  }

  toggleEditing(): void {
    this.isEditing = !this.isEditing;
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.dialogRef.close();
  }

  setPinned(id: string): void {
    // NOTE: There can't be more than 3 pinned filters at a time so we have to remove one of them every time a new one is pinned
    const pinnedPresets = this.filterItems.filter(
      preset => preset.isPinned && !preset.isDefault && !preset.isClear
    );
    const presetToUpdate = this.filterItems.find(filter => filter.id === id);
    const selectedItemIsPinned = presetToUpdate.isPinned;

    if (!selectedItemIsPinned && pinnedPresets.length === this.maxPinnedItems) {
      pinnedPresets[pinnedPresets.length - 1].isPinned = false;
    }

    presetToUpdate.isPinned = !presetToUpdate.isPinned;

    this.changeDetector.markForCheck();
  }

  openDeleteFilterDialog(id: string): void {
    this.deleteFilterDialog = this.matDialog.open(this.deleteFilterTemplate, {
      width: '400px',
      disableClose: false,
      closeOnNavigation: true
    });
    this.filterToBeDeleted = this.filterItems.find(filter => filter.id === id);
  }

  removeFilter(id: string): void {
    this.filterToBeDeleted = this.filterItems.find(filter => filter.id === id);
    if (this.filterToBeDeleted.isActive) {
      this.filterItems.find(filter => filter.isClear).isActive = true;
    }
    this.filterItems = this.filterItems.filter(filter => filter.id !== id);
    this.hasAvailableFilterItems =
      !this.filterItems.some(item => !item.isDefault && !item.isClear) &&
      !this.systemFilters;

    this.changeDetector.markForCheck();
  }

  setActive(filter) : void {
    if(!this.isEditing) {
      this.systemFilters.forEach(element => {
        element.isActive = false; 
      });
      this.filterItems.forEach(element => {
        element.isActive = false; 
      });
      filter.isActive = true;
    }
  }

  ngOnInit(): void {
    if (this.data) {
      this.filterItems = _.cloneDeep(this.data.filterPresets); // .sort((x, y) => (x.isPinned !== y.isPinned) ? 0 : x ? -1 : 1);
      this.systemFilters = _.cloneDeep(this.data.systemFilters);
      if (!this.systemFilters) {
        this.systemFilters = [];
      }
      this.filterItems[0].label = this.filterItems[0].name;
      this.systemFilters.unshift(this.filterItems[0]);
      this.hasAvailableFilterItems =
        !this.filterItems.some(item => !item.isDefault && !item.isClear) &&
        !this.systemFilters;
      this.maxPinnedItems = this.data.maxPinnedItems;
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
