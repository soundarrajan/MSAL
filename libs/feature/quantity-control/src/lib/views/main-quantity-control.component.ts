import { Component, OnDestroy } from '@angular/core';
import { QuantityControlApiMock } from '../services/api/quantity-control-api.mock';
import { QuantityControlApi } from '../services/api/quantity-control-api';
import { DeveloperToolbarService } from '@shiptech/core/developer-toolbar/developer-toolbar.service';
import { Subject } from 'rxjs';
import { AppConfig } from '@shiptech/core/config/app-config';

@Component({
  selector: 'shiptech-main-quantity-control',
  templateUrl: './main-quantity-control.component.html',
  styleUrls: ['./main-quantity-control.component.scss']
})
export class MainQuantityControlComponent implements OnDestroy {
  private _destroy$ = new Subject();

  // TODO: Workaround to jump start creation of the Mock Service in order for it to register it with the developer toolbar.
  constructor(mockApi: QuantityControlApiMock, appConfig: AppConfig, devService: DeveloperToolbarService) {
    // Note: It's important to register this only once, and in the root module. We currently don't support multiple services in child providers
    devService.registerApi({
      id: QuantityControlApi.name,
      displayName: 'Quantity Control Api',
      instance: mockApi,
      isRealService: false,
      localApiUrl: 'http://localhost:44398',
      devApiUrl: appConfig.quantityControlApi,
      qaApiUrl: appConfig.v1.API.BASE_URL_DATA_INFRASTRUCTURE
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}

