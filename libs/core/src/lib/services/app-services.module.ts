import { ModuleWithProviders, NgModule } from '@angular/core';
import { USER_SETTINGS_API_SERVICE, UserSettingsApiService } from './user-settings/user-settings-api.service';
import { UserSettingsApiServiceMock } from './user-settings/user-settings-api.service.mock';
import { getDefaultStorage, PREFERENCE_STORAGE } from './preference-storage/preference-storage.interface';
import {
  TENANT_SETTINGS_SERVICE,
  TenantSettingsService
} from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { environment } from '@shiptech/environment';
import { TenantSettingsServiceMock } from '@shiptech/core/services/tenant-settings/tenant-settings.service.mock';

@NgModule({
  imports: [],
  declarations: [],
  exports: []
})
export class AppServicesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AppServicesModule,
      providers: [
        {
          provide: USER_SETTINGS_API_SERVICE,
          useClass: UserSettingsApiService // TODO: refactor into proper service and serviceApi the mock will use localStorage // environment.production ? UserSettingsApiService : UserSettingsApiServiceMock
        },
        UserSettingsApiService,
        UserSettingsApiServiceMock,
        {
          provide: PREFERENCE_STORAGE,
          useFactory: getDefaultStorage,
          deps: [USER_SETTINGS_API_SERVICE]
        },
        {
          provide: TENANT_SETTINGS_SERVICE,
          useClass: environment.production ? TenantSettingsService : TenantSettingsServiceMock
        }
      ]
    };
  };
}
