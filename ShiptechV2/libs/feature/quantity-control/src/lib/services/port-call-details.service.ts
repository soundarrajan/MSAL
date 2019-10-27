import { Inject, Injectable } from '@angular/core';
import { QUANTITY_CONTROL_API_SERVICE } from './api/quantity-control-api';
import { IQuantityControlApiService } from './api/quantity-control.api.service.interface';
import { Observable } from 'rxjs';
import { PortCallListItemModel } from './models/port-call-list-item.model';
import { ModuleError } from '../core/error-handling/module-error';
import { BaseStoreService } from '@shiptech/core/services/base-store.service';
import { ModuleLoggerFactory } from '../core/logging/module-logger-factory';
import { Store } from '@ngxs/store';
import {
  LoadPortCallDetailsAction,
  LoadPortCallDetailsFailedAction,
  LoadPortCallDetailsSuccessfulAction
} from '../store/port-call-details/port-call-details.actions';
import { ObservableException } from '@shiptech/core';

@Injectable()
export class PortCallDetailsService extends BaseStoreService {

  constructor(
    protected store: Store,
    loggerFactory: ModuleLoggerFactory,
    @Inject(QUANTITY_CONTROL_API_SERVICE) private api: IQuantityControlApiService) {
    super(store, loggerFactory.createLogger(PortCallDetailsService.name));
  }

  getPortCalls(filter: unknown): Observable<{ items: PortCallListItemModel[], totalItems: number }> {
    return this.api.getPortCalls({ pageSize: 100 });
  }

  @ObservableException(ModuleError.LoadPortCallDetailsFailed)
  loadPortCallDetails(portCallId: string): Observable<unknown> {
    // Note: apiDispatch is deferred, but the above validation is not, state might change until the caller subscribes
    return this.apiDispatch(
      () => this.api.getPortCallById({ portCallId }),
      new LoadPortCallDetailsAction(portCallId),
      (response) => new LoadPortCallDetailsSuccessfulAction(portCallId, response.portCall),
      new LoadPortCallDetailsFailedAction(portCallId),
      ModuleError.LoadPortCallDetailsFailed(portCallId)
    );
  }
}
