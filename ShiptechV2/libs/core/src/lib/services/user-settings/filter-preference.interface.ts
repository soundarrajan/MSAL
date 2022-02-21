export interface IFilterPreferenceDto {
  id: string;
  name: string;
  filterModels: Record<string, unknown>;
  isPinned: boolean;
  canPin: boolean;
  isActive: boolean;
}

export class FilterPreferenceViewModel {
  hasChanges: boolean;
  isDefault: boolean;
  isClear: boolean;
  canPin: boolean;
  id: string;
  isActive: boolean;
  isPinned: boolean;
  filterModels: Record<string, unknown>;
  name: string;
  label?: string;

  constructor(preference: Partial<IFilterPreferenceDto> = {}) {
    Object.assign(this, preference);
    this.hasChanges = false;
    this.isDefault = false;
    this.isClear = false;
    this.filterModels = preference.filterModels;
  }
}

export class FilterPreferenceModel implements IFilterPreferenceDto {
  id: string;
  name: string;
  filterModels: Record<string, unknown>;
  isPinned: boolean;
  canPin: boolean;
  isActive: boolean;

  constructor(preference: FilterPreferenceViewModel) {
    this.id = preference.id;
    this.name = preference.name;
    this.filterModels = preference.filterModels;
    this.isPinned = preference.isPinned;
    this.canPin = preference.canPin;
    this.isActive = preference.isActive;
  }
}
