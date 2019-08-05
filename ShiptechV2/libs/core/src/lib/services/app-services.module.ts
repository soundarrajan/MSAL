import { ModuleWithProviders, NgModule } from '@angular/core';
import { USER_SETTINGS_API_SERVICE, UserSettingsApiService } from './user-settings/user-settings-api.service';

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
        }
      ]
    };
  };
}
