export interface IModuleTenantSettings {
  _isLoading?: boolean;
  _hasLoaded?: boolean;

  [key: string]: any;
}

export enum TenantSettingsModuleName {
  General = 'general',
  Delivery = 'delivery'
}
