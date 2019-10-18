import { ISharedTenantSettings } from './shared-tenant-settings.interface';
import { IQuantityControlTenantSettings } from './byModule/quantity-control-tenant-settings.interface';

// TBU: Update this on NX

export interface ITenantSettingsState {
  // Note: These settings are loaded when needed by their respective modules
  // Note: Each module may have the same settings as shared, but they may contains different values. So not everything that appears multiple times is a true shared settings.
  quantityControl?: IQuantityControlTenantSettings;
  // TODO: Shared will not be optional, it should be loaded immediately after login, same as with User Permissions
  shared?: ISharedTenantSettings;
}
