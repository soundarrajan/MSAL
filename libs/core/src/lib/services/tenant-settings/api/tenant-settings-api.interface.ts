import { Observable } from 'rxjs';
import { TenantSettingsModuleName } from '@shiptech/core/store/states/tenant/tenant.settings.interface';

export interface TenantSettingsDto {
}

export interface ITenantSettingsApiResponse {
  payload: TenantSettingsDto,
}

export interface ITenantSettingsApi {
  get(moduleName: TenantSettingsModuleName): Observable<ITenantSettingsApiResponse>;
}
