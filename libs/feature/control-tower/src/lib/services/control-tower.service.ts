import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable, of } from 'rxjs';
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
  IGetControlTowerQuantitySupplyDifferenceListResponse,
  IGetControlTowerQualityClaimsListResponse,
  IGetControlTowerResidueSludgeDifferenceListResponse
} from './api/dto/control-tower-list-item.dto';

import { ModuleError } from '../core/error-handling/module-error';
import {
  LoadControlTowerListAction,
  LoadControlTowerListFailedAction,
  LoadControlTowerListSuccessfulAction
} from '../store/control-tower-general-list/control-tower-general-list.actions';
import { catchError, map } from 'rxjs/operators';

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
          response.payload.noOfNew,
          response.payload.noOfMarkedAsSeen,
          response.payload.noOfResolved
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
  getControlTowerQualityClaimsList$(
    gridRequest: IServerGridInfo
  ): Observable<IGetControlTowerQualityClaimsListResponse> {
    return this.apiDispatch(
      () =>
        this.api.getControlTowerQualityClaimsList({
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
      ModuleError.LoadControlTowerQualityClaimsFailed
    );
    //   gridRequest: IServerGridInfo
    // ): Observable<IGetControlTowerQualityClaimsListResponse> {
    //   return this.apiDispatch(
    //     () =>
    //       this.api.getControlTowerQuantityClaimsList({
    //         ...gridRequest
    //       }),
    //     new LoadControlTowerListAction(gridRequest),
    //     response =>
    //       new LoadControlTowerListSuccessfulAction(
    //         response.matchedCount,
    //         response.matchedCount,
    //         response.matchedCount,
    //         response.matchedCount
    //       ),
    //     LoadControlTowerListFailedAction,
    //     ModuleError.LoadControlTowerQuantityClaimsFailed
    //   );
  }

  @ObservableException()
  getControlTowerQuantityClaimsListExportUrl(): string {
    return this.api.getControlTowerQuantityClaimsListExportUrl();
  }

  @ObservableException()
  getQuantityResiduePopUp(data, response) {
    return this.api.getQuantityResiduePopUp(data).pipe(
      map((body: any) => body.payload),
      catchError((body: any) =>
        of(
          body.error.ErrorMessage && body.error.Reference
            ? body.error.ErrorMessage + ' ' + body.error.Reference
            : body.error.errorMessage + ' ' + body.error.reference
        )
      )
    );
  }

  @ObservableException()
  saveQuantityResiduePopUp(data, response) {
    return this.api.saveQuantityResiduePopUp(data).pipe(
      map((body: any) => body.payload),
      catchError((body: any) =>
        of(
          body.error.ErrorMessage && body.error.Reference
            ? body.error.ErrorMessage + ' ' + body.error.Reference
            : body.error.errorMessage + ' ' + body.error.reference
        )
      )
    );
  }

  @ObservableException()
  getControlTowerResidueSludgeDifferenceList$(
    gridRequest: IServerGridInfo
  ): Observable<IGetControlTowerResidueSludgeDifferenceListResponse> {
    return this.apiDispatch(
      () =>
        this.api.getControlTowerResidueSludgeDifferenceList({ ...gridRequest }),
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
  getControlTowerResidueSludgeDifferenceListExportUrl(): string {
    return this.api.getControlTowerResidueSludgeDifferenceListExportUrl();
  }

  @ObservableException()
  getResiduePopUp(data, response) {
    return this.api.getResiduePopUp(data).pipe(
      map((body: any) => body.payload),
      catchError((body: any) =>
        of(
          body.error.ErrorMessage && body.error.Reference
            ? body.error.ErrorMessage + ' ' + body.error.Reference
            : body.error.errorMessage + ' ' + body.error.reference
        )
      )
    );
  }

  @ObservableException()
  saveResiduePopUp(data, response) {
    return this.api.saveResiduePopUp(data).pipe(
      map((body: any) => body.payload),
      catchError((body: any) =>
        of(
          body.error.ErrorMessage && body.error.Reference
            ? body.error.ErrorMessage + ' ' + body.error.Reference
            : body.error.errorMessage + ' ' + body.error.reference
        )
      )
    );
  }

  ngOnDestroy(): void {
    super.onDestroy();
  }
}
