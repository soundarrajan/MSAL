import { ITenantSettingsState } from './tenant/tenant-settings.state.interface';
import { IQuantityControlState } from '../../../../../feature/quantity-control/src/lib/store/quantity-control.state';
import { IUserProfileState } from '@shiptech/core/store/states/user-profile/user-profile.model';

export interface IAppState {
  userProfile: IUserProfileState;
  tenantSettings: ITenantSettingsState;
  quantityControl: IQuantityControlState;
}
