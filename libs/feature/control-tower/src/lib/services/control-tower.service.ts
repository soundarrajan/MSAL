import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseStoreService } from '@shiptech/core/services/base-store.service';
import { Store } from '@ngxs/store';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';
import { ModuleLoggerFactory } from '../core/logging/module-logger-factory';
import { CONTROL_TOWER_API_SERVICE } from './api/control-tower-api';
import { IControlTowerApiService } from './api/control-tower.api.service.interface';
import { IGetControlTowerQuantityRobDifferenceListResponse } from './api/dto/control-tower-list-item.dto';

@Injectable()
export class ControlTowerService extends BaseStoreService implements OnDestroy {
  constructor(
    protected store: Store,
    loggerFactory: ModuleLoggerFactory,
    @Inject(CONTROL_TOWER_API_SERVICE)
    private api: IControlTowerApiService
  ) {
    super(store, loggerFactory.createLogger(ControlTowerService.name));
  }

  @ObservableException()
  getInvoiceList$(
    gridRequest: IServerGridInfo
  ): Observable<IGetControlTowerQuantityRobDifferenceListResponse> {
    return this.api.getInvoiceList({ ...gridRequest });
  }

  @ObservableException()
  getInvoiceListExportUrl(): string {
    return this.api.getInvoiceListExportUrl();
  }

  ngOnDestroy(): void {
    super.onDestroy();
  }
}
