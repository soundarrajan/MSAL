import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { combineLatest, Observable, throwError } from 'rxjs';
import { TenantSettingsModuleName } from '@shiptech/core/store/states/tenant/tenant-settings.interface';
import { QuantityControlApiMock } from './services/api/quantity-control-api.mock';
import { AppConfig } from '@shiptech/core/config/app-config';
import { DeveloperToolbarService } from '@shiptech/core/developer-toolbar/developer-toolbar.service';
import { KnownPrimaryRoutes } from '@shiptech/core/enums/known-modules-routes.enum';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { QuantityControlApi } from './services/api/quantity-control-api';
import { SurveyStatusLookups } from './services/survey-status-lookups';
import { fromPromise } from 'rxjs/internal-compatibility';
import { QuantityControlEmailLogsApi } from "./services/api/quantity-control-email-logs-api";
import { QuantityControlEmailLogsApiMock } from "./services/api/quantity-control-email-logs-api.mock";

@Injectable()
export class QuantityControlRouteResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private appErrorHandler: AppErrorHandler,
    private tenantService: TenantSettingsService,
    private surveyStatusLookups: SurveyStatusLookups,
    mockApi: QuantityControlApiMock,
    mockEmailApi: QuantityControlEmailLogsApiMock,
    appConfig: AppConfig,
    devService: DeveloperToolbarService
  ) {
    // TODO: Workaround to jump start creation of the Mock Service in order for it to register it with the developer toolbar.
    // Note: It's important to register this only once, and in the root module. We currently don't support multiple services in child providers
    devService.registerApi({
      id: QuantityControlApi.name,
      displayName: 'Quantity Control Api',
      instance: mockApi,
      isRealService: false,
      localApiUrl: 'http://localhost:44398',
      devApiUrl: appConfig.robApi,
      qaApiUrl: appConfig.robApi
    });

    // TODO: To move this a proper place
    devService.registerApi({
      id: QuantityControlEmailLogsApi.name,
      displayName: 'Quantity Control Email Log Api',
      instance: mockEmailApi,
      isRealService: false,
      localApiUrl: 'http://localhost:44398',
      devApiUrl: appConfig.robApi,
      qaApiUrl: appConfig.robApi
    });
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    // Note: Before this module can be used/opened, we need to load module settings and cached lookups first.
    return combineLatest(
      this.tenantService.loadModule(TenantSettingsModuleName.Delivery),
      fromPromise(this.surveyStatusLookups.load())
    ).pipe(
      catchError(error => {
        // Note: If the user navigated directly to this route, we need to redirect to root and show and error
        if (!state.root.component) {
          this.appErrorHandler.handleError(error);
          return this.router.navigate([KnownPrimaryRoutes.Root]);
        } else {
          // Note: if the application is already loaded (something visible on the screen) and we navigate to a bad route we need to "cancel" the navigation and show an error
          return throwError(error);
        }
      })
    );
  }
}
