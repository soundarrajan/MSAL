export interface IModuleTenantSettings {
  [key: string]: any;
  _isLoading?: boolean;
  _hasLoaded?: boolean;
}

export enum TenantSettingsModuleName {
  General = 'general',
  Delivery = 'delivery'
}
