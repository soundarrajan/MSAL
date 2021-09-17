import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Injector,
  OnInit
} from '@angular/core';
import { environment } from '@shiptech/environment';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  ResolveEnd,
  ResolveStart,
  Router,
  RouterEvent
} from '@angular/router';
import { MyMonitoringService } from './service/logging.service';
import { LoaderService } from './service/loader.service';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AuthenticationService } from '@shiptech/core/authentication/authentication.service';
import { filter, takeUntil } from 'rxjs/operators';
import {
  InteractionStatus,
  PublicClientApplication
} from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { AppConfig, IAppConfig } from '@shiptech/core/config/app-config';
import { HttpClient } from '@angular/common/http';
import { LookupsCacheService } from '@shiptech/core/legacy-cache/legacy-cache.service';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import {
  ILoggerSettings,
  LoggerFactory,
  LOGGER_SETTINGS
} from '@shiptech/core/logging/logger-factory.service';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { UrlService } from '@shiptech/core/services/url/url.service';
import { AdalService } from 'adal-angular-wrapper';
import { forkJoin, Observable, of, ReplaySubject, throwError } from 'rxjs';
import { catchError, concatMap, map, tap } from 'rxjs/operators';
import { LicenseManager } from '@ag-grid-enterprise/all-modules';

import { UserProfileService } from '@shiptech/core/services/user-profile/user-profile.service';
import { StatusLookup } from '@shiptech/core/lookups/known-lookups/status/status-lookup.service';
import { ReconStatusLookup } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.service';
import { fromPromise } from 'rxjs/internal-compatibility';
import { EmailStatusLookup } from '@shiptech/core/lookups/known-lookups/email-status/email-status-lookup.service';
import { ILegacyAppConfig } from '@shiptech/core/config/legacy-app-config';
import { EMPTY$ } from '@shiptech/core/utils/rxjs-operators';
import { DeveloperToolbarService } from '@shiptech/core/developer-toolbar/developer-toolbar.service';
import { TenantSettingsModuleName } from '@shiptech/core/store/states/tenant/tenant-settings.interface';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { BootstrapService } from '@shiptech/core/bootstrap.service';
@Component({
  selector: 'shiptech-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  @HostBinding('@.disabled')
  public animationsDisabled = true;
  title = 'Shiptech';
  isProduction = environment.production;
  public isLoading = true;
  loading: boolean;
  loggedBootTime: any;
  firstApiCallStartTime: any;
  isIframe: boolean;
  loginDisplay: boolean;
  private readonly _destroying$ = new Subject<void>();
  count: number = 0;
  get initialized(): Observable<void> {
    return this._initialized;
  }

  private _initialized = new ReplaySubject<void>(1);
  constructor(
    private msalService: MsalService,
    public authService: AuthenticationService,
    private router: Router,
    changeDetector: ChangeDetectorRef,
    private myMonitoringService: MyMonitoringService,
    private loaderService: LoaderService,
    private elementRef: ElementRef,
    private broadcastService: MsalBroadcastService,
    private bootstrapService: BootstrapService,
    @Inject(LOGGER_SETTINGS) private loggerSettings: ILoggerSettings
  ) {
    router.events.subscribe((event: RouterEvent): void => {
      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.isLoading = false;
        setTimeout(() => {
          if (!this.loggedBootTime) {
            this.loggedBootTime = true;
            var loadTime = Date.now() - performance.timing.connectStart;
            this.myMonitoringService.logMetric(
              `Page Load : ${window.location.href}`,
              loadTime,
              window.location
            );
          }
        });
        changeDetector.markForCheck();
      }
      if (event instanceof NavigationStart) {
      }
    });
    this.loaderService.isLoading.subscribe(v => {
      if (v) {
        if (!isNaN((<any>window).lastCall - (<any>window).firstCall)) {
          this.myMonitoringService.logMetric(
            window.location.href,
            (<any>window).lastCall - (<any>window).firstCall,
            window.location
          );
        }
        delete (<any>window).firstCall;
        delete (<any>window).lastCall;
        delete (<any>window).visibleLoader;
        delete (<any>window).openedScreenLoaders;
      }
    });
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    let array = ['Documents', 'Audit Log', 'Email Log', 'Main Page'];
    let findElement = array.find(function(element) {
      return element == targetElement.innerText;
    });
    if (findElement) {
      delete (<any>window).openedScreenLoaders;
    }
  }

  ngOnInit() {
    // this.authService.instance = new PublicClientApplication({
    //   auth: {
    //     clientId: '8fdd5b37-c181-49d2-85e9-c2fc71334924',
    //     redirectUri: 'http://localhost:9016'
    //   },
    //   cache: {
    //     cacheLocation: 'localStorage'
    //   }
    // });
    this.broadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        if (this.count === 0) {
          // this.bootstrapService.Init();
          this.setLoginDisplay();
        }
        this.count += 1;
      });
    // this.authService1.setMsal();
    this.isIframe = window !== window.parent && !window.opener;
  }

  logOut() {
    this.msalService.logout();
  }

  login() {
    // this.authService1.logout();
    this.msalService.loginRedirect();
    // this.authService.loginPopup().subscribe({
    //   next: result => {
    //     console.log(result);
    //     this.setLoginDisplay();
    //   },
    //   error: error => console.log(error)
    // });
  }

  setLoginDisplay() {
    console.log('accounts', this.msalService.instance.getAllAccounts().length);
    console.log(this.authService.isAuthenticated);
    this.loginDisplay = this.msalService.instance.getAllAccounts().length > 0;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
