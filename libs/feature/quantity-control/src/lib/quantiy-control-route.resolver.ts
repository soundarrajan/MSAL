import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { AppError } from '@shiptech/core/error-handling/app-error';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { TenantSettingsModuleName } from '@shiptech/core/store/states/tenant/tenant.settings.interface';

@Injectable()
export class QuantityControlRouteResolver implements Resolve<any> {
  constructor(
    private tenantService: TenantSettingsService
  ) {
  }

  resolve(): Observable<any> {
    return this.tenantService.loadModule(TenantSettingsModuleName.Delivery)
      .pipe(catchError(() => of(AppError.LoadTenantSettingsFailed(TenantSettingsModuleName.Delivery))));
  }
}
