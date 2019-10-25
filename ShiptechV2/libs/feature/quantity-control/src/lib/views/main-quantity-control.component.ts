import { Component } from '@angular/core';
import { QuantityControlMockApiService } from '../services/api/quantity-control.api.service.mock';
import { QuantityControlApiService } from '../services/api/quantity-control.api.service';
import { DeveloperToolbarService } from '@shiptech/core/developer-toolbar/developer-toolbar.service';
import { AppConfig } from '@shiptech/core';
import { ReplaySubject } from 'rxjs';
import { TenantSettingsModuleName } from '@shiptech/core/store/states/tenant/tenant.settings.interface';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { multicast, tap } from 'rxjs/operators';

@Component({
  selector: 'shiptech-main-quantity-control',
  templateUrl: './main-quantity-control.component.html',
  styleUrls: ['./main-quantity-control.component.scss']
})
export class MainQuantityControlComponent {

  loaded = new ReplaySubject(1);

  // TODO: Workaround to jump start creation of the Mock Service in order for it to register it with the developer toolbar.
  constructor(mockApi: QuantityControlMockApiService, appConfig: AppConfig, devService: DeveloperToolbarService, tenantService: TenantSettingsService) {
    // Note: It's important to register this only once, and in the root module. We currently don't support multiple services in child providers
    devService.registerApi({
      id: QuantityControlApiService.name,
      displayName: 'Quantity Control Api',
      instance: mockApi,
      isRealService: false,
      localApiUrl: 'http://localhost:44398',
      devApiUrl: appConfig.quantityControlApi,
      qaApiUrl: appConfig.v1.API.BASE_URL_DATA_INFRASTRUCTURE
    });

    tenantService.loadModule(TenantSettingsModuleName.Delivery).pipe(tap(() => this.loaded.next())).subscribe();
  }
}

