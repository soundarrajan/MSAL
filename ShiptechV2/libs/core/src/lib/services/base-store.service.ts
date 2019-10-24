import { Store } from '@ngxs/store';
import { IAppState } from '../store/states/app.state.interface';
import { catchError, concatMap, first, mapTo, switchMap } from 'rxjs/operators';
import { defer, Observable, Subject, throwError } from 'rxjs';
import { ObservableException } from '../utils/decorators/observable-exception.decorator';
import { safeCall } from '../error-handling/utils';
import { AppError } from '../error-handling/app-error';
import { Logger } from '../logging/logger';
import { ITenantSettingsState } from '../store/states/tenant/tenant-settings.state.interface';
import * as _ from 'lodash';
import { IModuleTenantSettings } from '../store/states/tenant/tenant.settings.interface';

type ActionFactory<TResponse = any, T = any> = (response: TResponse) => T;

export class BaseStoreService {
  protected destroy$ = new Subject<any>();

  constructor(protected store: Store, protected logger: Logger) {
  }

  protected get appState(): IAppState {
    // Note: Always get a fresh reference to the state.
    return <IAppState>this.store.snapshot();
  }

  public tenantState(moduleName: keyof ITenantSettingsState): IModuleTenantSettings {
    const tenantState = this.appState.tenantSettings;

    if (!tenantState[moduleName]) {
      this.logger.error('Nonexistent tenant settings for module name {@ModuleName}, available tenant settings keys {@AvailableKeys}', moduleName, _.keys(tenantState));
      return;
    }

    return tenantState[moduleName];
  }

  @ObservableException()
  protected apiDispatch<TResponse, TSuccessfulAction extends any | ActionFactory<TResponse, TSuccessfulAction>, TFailedAction extends any | ActionFactory<TResponse, TFailedAction>>(
    apiCall: () => Observable<TResponse>,
    startAction: any,
    successfulAction: TSuccessfulAction,
    failedAction: TFailedAction,
    unknownError: AppError
  ): Observable<TResponse> {
    return defer(() =>
      this.store.dispatch(startAction).pipe(
        first(),
        concatMap(() =>
          safeCall(apiCall).pipe(
            catchError(responseError => {
              // Note: failedAction(apiError) can either be an action constructor function or a ActionFactory or the actual action object.
              this.store.dispatch(typeof failedAction === 'function' ? failedAction(responseError) || failedAction : failedAction);

              // Note: If we get an AppError, it means that it was probably converted from an apiError to an appError somewhere else and we should use that.
              // Note: Otherwise just use whatever it was provided as params
              return throwError(responseError instanceof AppError ? responseError : unknownError);
            }),
            // Note: successfulAction(response) can either be an action constructor function or a ActionFactory or the actual action object.
            switchMap(response => this.store.dispatch(typeof successfulAction === 'function' ? successfulAction(response) || successfulAction : successfulAction).pipe(mapTo(response)))
          )
        )
      )
    );
  }

  protected onDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
