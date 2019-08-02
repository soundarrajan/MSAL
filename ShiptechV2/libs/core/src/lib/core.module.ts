import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppContextModule } from './modules/app-context.module';
import { ToastrModule } from 'ngx-toastr';
import { UIModule } from './ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { USER_SETTINGS_API_SERVICE, UserSettingsApiService } from './services/user-settings/user-settings-api.service';
import { environment } from '@shiptech/environment';
import { UserSettingsApiServiceMock } from './services/user-settings/user-settings-api.service.mock';
import { LocalPreferenceService } from './services/preference-storage/local-preference.service';
import { getDefaultStorage, PREFERENCE_STORAGE } from './services/preference-storage/preference-storage.interface';

// TODO: Define the purpose of Core Module. We should definitely remove UIModule from here and use it where necessary otherwise we risk not being able to lazy load modules
@NgModule({
  imports: [
    CommonModule,
    AppContextModule,
    ToastrModule.forRoot(),
    UIModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports: [
    AppContextModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: USER_SETTINGS_API_SERVICE,
      useClass:  UserSettingsApiService // TODO: refactor into proper service and serviceApi the mock will use localStorage // environment.production ? UserSettingsApiService : UserSettingsApiServiceMock
    },
    UserSettingsApiService,
    UserSettingsApiServiceMock,
    LocalPreferenceService
    ]
})
export class CoreModule {
}
