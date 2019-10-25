import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { AppBusyService } from '@shiptech/core/services/app-busy/app-busy.service';
import { AppError } from '@shiptech/core/error-handling/app-error';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { TenantSettingsModuleName } from '@shiptech/core/store/states/tenant/tenant.settings.interface';

@Injectable()
export class MainQuantityControlComponentResolver implements Resolve<any> {
  constructor(
    private tenantService: TenantSettingsService,
    private appBusy: AppBusyService
  ) {
  }

  resolve(): Observable<any> {
    return this.appBusy
      .while(this.tenantService.loadModule(TenantSettingsModuleName.Delivery))
      .pipe(catchError(() => of(AppError.LoadTenantSettingsFailed(TenantSettingsModuleName.Delivery))));
  }
}
