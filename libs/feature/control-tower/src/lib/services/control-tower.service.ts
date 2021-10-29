import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseStoreService } from '@shiptech/core/services/base-store.service';
import { Store } from '@ngxs/store';
import { ObservableException } from '@shiptech/core/utils/decorators/observable-exception.decorator';
import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';
import { ModuleLoggerFactory } from '../core/logging/module-logger-factory';
import { CONTROL_TOWER_API_SERVICE } from './api/control-tower-api';
import { IControlTowerApiService } from './api/control-tower.api.service.interface';
import {
  IGetControlTowerQuantityClaimsListResponse,
  IGetControlTowerQuantityRobDifferenceListResponse,
  IGetControlTowerQuantitySupplyDifferenceListResponse
} from './api/dto/control-tower-list-item.dto';

import { ModuleError } from '../core/error-handling/module-error';
import {
  LoadControlTowerListAction,
  LoadControlTowerListFailedAction,
  LoadControlTowerListSuccessfulAction
} from '../store/control-tower-general-list/control-tower-general-list.actions';

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
  getControlTowerQuantityRobDifferenceList$(
    gridRequest: IServerGridInfo
  ): Observable<IGetControlTowerQuantityRobDifferenceListResponse> {
    return this.apiDispatch(
      () =>
        this.api.getControlTowerQuantityRobDifferenceList({ ...gridRequest }),
      new LoadControlTowerListAction(gridRequest),
      response =>
        new LoadControlTowerListSuccessfulAction(
          response.matchedCount,
          response.matchedCount,
          response.matchedCount,
          response.matchedCount
        ),
      LoadControlTowerListFailedAction,
      ModuleError.LoadControlTowerQuantityRobDifferenceFailed
    );
  }

  @ObservableException()
  getControlTowerQuantityRobDifferenceListExportUrl(): string {
    return this.api.getControlTowerQuantityRobDifferenceListExportUrl();
  }

  @ObservableException()
  getControlTowerQuantitySupplyDifferenceList$(
    gridRequest: IServerGridInfo
  ): Observable<IGetControlTowerQuantitySupplyDifferenceListResponse> {
    return this.apiDispatch(
      () =>
        this.api.getControlTowerQuantitySupplyDifferenceList({
          ...gridRequest
        }),
      new LoadControlTowerListAction(gridRequest),
      response =>
        new LoadControlTowerListSuccessfulAction(
          response.matchedCount,
          response.matchedCount,
          response.matchedCount,
          response.matchedCount
        ),
      LoadControlTowerListFailedAction,
      ModuleError.LoadControlTowerQuantitySupplyDifferenceFailed
    );
  }

  @ObservableException()
  getControlTowerQuantitySupplyDifferenceListExportUrl(): string {
    return this.api.getControlTowerQuantitySupplyDifferenceListExportUrl();
  }

  @ObservableException()
  getControlTowerQuantityClaimsList$(
    gridRequest: IServerGridInfo
  ): Observable<IGetControlTowerQuantityClaimsListResponse> {
    return this.apiDispatch(
      () =>
        this.api.getControlTowerQuantityClaimsList({
          ...gridRequest
        }),
      new LoadControlTowerListAction(gridRequest),
      response =>
        new LoadControlTowerListSuccessfulAction(
          response.payload.noOf15,
          response.payload.noOf714,
          response.payload.noOfNew,
          response.matchedCount
        ),
      LoadControlTowerListFailedAction,
      ModuleError.LoadControlTowerQuantityClaimsFailed
    );
  }

  @ObservableException()
  getControlTowerQuantityClaimsListExportUrl(): string {
    return this.api.getControlTowerQuantityClaimsListExportUrl();
  }

  ngOnDestroy(): void {
    super.onDestroy();
  }
}
