import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ITenantSettingsService } from './tenant-settings.service.interface';
import { TenantSettingsService } from './tenant-settings.service';
import { getMockTenantSettings } from './tenant-settings.mock.data';
import { ApiCall, ApiCallForwardTo } from '../../utils/decorators/api-call.decorator';
import { ObservableException } from '../../utils/decorators/observable-exception.decorator';
import { ITenantSettings } from '../../store/states/tenant/tenant.settings.interface';
import { Store } from '@ngxs/store';
import { LoadTenantSettingsSuccessfulAction } from '../../store/states/tenant/load-tenant.actions';

@Injectable()
export class TenantSettingsServiceMock implements ITenantSettingsService {
  @ApiCallForwardTo() realService: TenantSettingsService;

  constructor(private store: Store, realService: TenantSettingsService) {
    this.realService = realService;
  }

  @ObservableException()
  @ApiCall()
  loadModule(moduleName: string): Observable<ITenantSettings> {
    const moduleNameFormatted = moduleName.charAt(0).toLocaleLowerCase() + moduleName.slice(1);
    const settings = getMockTenantSettings();

    this.store.dispatch(new LoadTenantSettingsSuccessfulAction(moduleNameFormatted, settings));
    return of(settings);
  }
}
