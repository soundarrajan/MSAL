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
  IGetControlTowerResidueSludgeDifferenceListResponse,
  IGetControlTowerQualityLabsListResponse,
  IControlTowerSaveNotesItemDto,
  IControlTowerGetMyNotesDto,
  IControlTowerGetFilteredNotesDto
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
  getControlTowerQualityLabsList$(
    gridRequest: IServerGridInfo
  ): Observable<IGetControlTowerQualityLabsListResponse> {
    return this.apiDispatch(
      () =>
        this.api.getControlTowerQualityLabsList({
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
      ModuleError.LoadControlTowerQualityLabsFailed
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
  getControlTowerQualityClaimsListExportUrl(): string {
    return this.api.getControlTowerQualityClaimsListExportUrl();
  }

  @ObservableException()
  getControlTowerQualityLabsListExportUrl(): string {
    return this.api.getControlTowerQualityLabsListExportUrl();
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
          body.error?.ErrorMessage && body.error?.Reference
            ? body.error.ErrorMessage + ' ' + body.error.Reference
            : body.status == 401
            ? { message: 'Unauthorized' }
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
          body.error?.ErrorMessage && body.error?.Reference
            ? body.error.ErrorMessage + ' ' + body.error.Reference
            : body.status == 401
            ? { message: 'Unauthorized' }
            : body.error.errorMessage + ' ' + body.error.reference
        )
      )
    );
  }

  @ObservableException()
  getQualityLabsPopUp(data, response) {
    return this.api.getQualityLabsPopUp(data).pipe(
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
  getNotes(data: IControlTowerGetMyNotesDto, view: any) {
    return this.api.getNotes(data, view).pipe(
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
  saveControlTowerNote(data: IControlTowerSaveNotesItemDto, view: any) {
    return this.api.saveControlTowerNote(data, view).pipe(
      map((body: any) => body.payload),
      map((body: any) => body.payload),
      catchError((body: any) =>
        of(
          body.error?.ErrorMessage && body.error?.Reference
            ? body.error.ErrorMessage + ' ' + body.error.Reference
            : body.status == 401
            ? { message: 'Unauthorized' }
            : body.error.errorMessage + ' ' + body.error.reference
        )
      )
    );
  }

  @ObservableException()
  getFilteredNotes(data: any, view: any) {
    return this.api.getFilteredNotes(data, view).pipe(
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
  saveQualityLabsPopUp(data, response) {
    return this.api.saveQualityLabsPopUp(data).pipe(
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
  getRobDifferenceFiltersCount(data: any) {
    return this.api.getRobDifferenceFiltersCount(data).pipe(
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
  getSupplyDifferenceFiltersCount(data: any) {
    return this.api.getSupplyDifferenceFiltersCount(data).pipe(
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
  getSludgeDifferenceFiltersCount(data: any) {
    return this.api.getSludgeDifferenceFiltersCount(data).pipe(
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
  getQuantityClaimCounts(data: any) {
    return this.api.getQuantityClaimCounts(data).pipe(
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
  getQualityClaimCounts(data: any) {
    return this.api.getQualityClaimCounts(data).pipe(
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
