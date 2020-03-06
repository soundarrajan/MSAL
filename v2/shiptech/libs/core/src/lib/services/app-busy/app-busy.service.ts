import { Injectable } from '@angular/core';
import { BehaviorSubject, defer, Observable, of, throwError } from 'rxjs';
import {
  catchError,
  concatMap,
  distinctUntilChanged,
  map,
  mapTo,
  tap
} from 'rxjs/operators';
import { ILogger } from '../../logging/logger';
import { LoggerFactory } from '../../logging/logger-factory.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ObservableException } from '../../utils/decorators/observable-exception.decorator';
import { RETURN$ } from '../../utils/rxjs-operators';

@Injectable({
  providedIn: 'root'
})
// noinspection JSUnusedGlobalSymbols
export class AppBusyService {
  public busy$: Observable<boolean>;

  private _inProgressActions$ = new BehaviorSubject<string[]>([]);
  private logger: ILogger;

  constructor(
    private loadingBar: LoadingBarService,
    loggerFactory: LoggerFactory
  ) {
    this.logger = loggerFactory.createLogger(AppBusyService.name);

    const inProgress$ = this._inProgressActions$.pipe(
      map(actions => actions.length > 0),
      distinctUntilChanged(),
      tap(isBusy => {
        if (isBusy) {
          this.loadingBar.start();
        } else {
          // Note: loadingBar.stop(),
          this.loadingBar.complete();
        }
      })
    );
    inProgress$.subscribe();

    this.busy$ = inProgress$;
  }

  @ObservableException()
  public showFor(actionId: string): Observable<any> {
    return defer(() => {
      if (this._inProgressActions$.getValue().find(s => s === actionId)) {
        this.logger.warn(
          `AppBusy already contains an in-progress action named: ${actionId}`
        );
        return RETURN$;
      }

      this._inProgressActions$.next([
        ...this._inProgressActions$.getValue(),
        actionId
      ]);

      return of(actionId);
    });
  }

  @ObservableException()
  public hideFor(actionId: string): Observable<any> {
    return defer(() => {
      this._inProgressActions$.next([
        ...this._inProgressActions$.getValue().filter(s => s !== actionId)
      ]);

      return of(actionId);
    });
  }

  @ObservableException()
  public while<T>(observable: Observable<T>): Observable<T> {
    const id = (window.crypto.getRandomValues( new Uint8Array(1)) + Date.now()).toString();
    return this.showFor(id).pipe(
      concatMap(() => observable),
      catchError(err =>
        this.hideFor(id).pipe(concatMap(() => throwError(err)))
      ),
      concatMap(response => this.hideFor(id).pipe(mapTo(response)))
    );
  }
}
