import {Inject, Injectable, OnDestroy} from '@angular/core';
import {ETE_API_SERVICE} from './api/ete-api.service';
import {IEteApiService} from './api/ete.api.service.interface';
import {Observable} from 'rxjs';
import {ModuleError} from '../core/error-handling/module-error';
import {BaseStoreService} from '@shiptech/core/services/base-store.service';
import {ModuleLoggerFactory} from '../core/logging/module-logger-factory';
import {Store} from '@ngxs/store';
import {
  LoadReportDetailsAction,
  LoadReportDetailsFailedAction,
  LoadReportDetailsSuccessfulAction
} from '../store/report/ete-report-details.actions';
import {ObservableException} from '@shiptech/core/utils/decorators/observable-exception.decorator';
import {UrlService} from '@shiptech/core/services/url/url.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EteService extends BaseStoreService implements OnDestroy {
  constructor(
    protected store: Store,
    private urlService: UrlService,
    private router: Router,
    loggerFactory: ModuleLoggerFactory,
    @Inject(ETE_API_SERVICE)
    private api: IEteApiService
  ) {
    super(store, loggerFactory.createLogger(EteService.name));
  }

  /**
   * Load report details for e specific or new report
   * @param reportId reportId in case of editing or falsy in case of new
   */
  @ObservableException()
  loadReportDetails$(reportId: number): Observable<unknown> {
    // Note: apiDispatch is deferred, but the above validation is not, state might change until the caller subscribes
    return this.apiDispatch(
      () => this.api.getReportDetails({id: reportId}),
      new LoadReportDetailsAction(reportId),
      response => new LoadReportDetailsSuccessfulAction(reportId, response),
      new LoadReportDetailsFailedAction(reportId),
      ModuleError.LoadReportDetailsFailed(reportId)
    );
  }

  ngOnDestroy(): void {
    super.onDestroy();
  }
}
