import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppContextModule } from './app-context/app-context.module';
import { ToastrModule } from 'ngx-toastr';
import { UIModule } from './ui/ui.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppServicesModule } from './services/app-services.module';
import { NgxsModule } from '@ngxs/store';
import { TenantSettingsState } from '@shiptech/core/store/states/tenant/tenant-settings.state';
import { AppErrorHandlingModule } from '@shiptech/core/error-handling/app-error-handling.module';
import { UserProfileState } from '@shiptech/core/store/states/user-profile/user-profile.state';

// TODO: Define the purpose of Core Module. We should definitely remove UIModule from here and use it where necessary otherwise we risk not being able to lazy load modules
@NgModule({
  imports: [
    CommonModule,
    AppContextModule.forRoot(),
    AppServicesModule.forRoot(),
    ToastrModule.forRoot(),
    UIModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxsModule.forFeature([TenantSettingsState, UserProfileState]),
    AppErrorHandlingModule
  ],
  exports: [
    AppContextModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppErrorHandlingModule
  ],
  providers: []
})
export class CoreModule {
}
