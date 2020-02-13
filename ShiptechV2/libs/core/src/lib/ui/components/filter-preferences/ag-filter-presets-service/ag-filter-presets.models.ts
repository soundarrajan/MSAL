import { FilterPreferenceViewModel } from '../../../../services/user-settings/filter-preference.interface';
import { GridApi } from '@ag-grid-community/core';

export type IFilterPresetsStore = Record<string, IPresetGroup>;

export type IGetGridApi = () => GridApi;

export interface IPresetGroup {
  items: FilterPreferenceViewModel[];
}

export class PresetGroupModel {
  items: FilterPreferenceViewModel[];

  constructor(content: Partial<IPresetGroup> = {}) {
    this.items = content.items;
  }
}
