import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { AppConfig } from '@shiptech/core/config/app-config';
import { DeveloperToolbarService } from '@shiptech/core/developer-toolbar/developer-toolbar.service';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';

@Injectable()
export class ContractModuleResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private appErrorHandler: AppErrorHandler,
    private tenantService: TenantSettingsService,
    appConfig: AppConfig,
    devService: DeveloperToolbarService
  ) {
    // Note: Workaround to jump start creation of the Mock Service in order for it to register it with the developer toolbar.
    // Note: It's important to register this only once, and in the root module. We currently don't support multiple services in child providers
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    // Note: Before this module can be used/opened, we need to load module settings and cached lookups first.
    // return this.tenantService
    //   .loadModule(TenantSettingsModuleName.Delivery)
    //   .pipe(
    //     catchError(error => {
    //       // Note: If the user navigated directly to this route, we need to redirect to root and show and error
    //       if (!state.root.component) {
    //         this.appErrorHandler.handleError(error);
    //         return this.router.navigate([KnownPrimaryRoutes.Root]);
    //       } else {
    //         // Note: if the application is already loaded (something visible on the screen) and we navigate to a bad route we need to "cancel" the navigation and show an error
    //         return throwError(error);
    //       }
    //     })
    //   );
  }
}
