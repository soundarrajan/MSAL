import { FilterPreferenceViewModel } from '../../../../services/user-settings/filter-preference.interface';

export interface IGridFilterChanged {
  groupId: string;
  gridId: string;
  filterPreset: FilterPreferenceViewModel;
}
