import { Injectable } from '@angular/core';
import { AdalService } from 'adal-angular-wrapper';
import { Observable } from 'rxjs';
import { AuthenticationContext } from '@shiptech/core/authentication/authentication-context';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import {
  AuthenticationResult,
  EventMessage,
  EventType,
  PublicClientApplication
} from '@azure/msal-browser';
import { InteractionStatus } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Injectable()
export class AuthenticationService {
  private _isInitialized = false;
  // private isAuthenticated = true;

  private readonly _destroying$ = new Subject<void>();

  get isInitialized(): boolean {
    return this._isInitialized;
  }

  get config(): adal.Config {
    return (<AdalService>{}).config;
  }

  get userInfo(): adal.User {
    return (<AdalService>{}).userInfo;
  }

  get isAuthenticated(): boolean {
    return this.msalService.instance.getAllAccounts().length > 0;
  }

  constructor(
    private msalService: MsalService,
    public authenticationContext: AuthenticationContext,
    private broadcastService: MsalBroadcastService
  ) {}

  public init(configOptions: adal.Config): void {
    console.log(this.msalService);
    configOptions.redirectUri = 'http://localhost:9016';
    // this.msalService.instance = new PublicClientApplication({
    //   auth: configOptions,
    //   cache: {
    //     cacheLocation: 'localStorage'
    //   }
    // });

    console.log(this.msalService.instance);
    // this.adalService.init(configOptions);

    // this._isInitialized = true;

    // this.adalService.handleWindowCallback();

    // if (this.isAuthenticated) {
    //   this.authenticationContext.userId = this.userInfo?.userName;
    //   this.authenticationContext.isAuthenticated = this.isAuthenticated;
    // }
  }

  public login(): void {
    this.msalService.loginRedirect();
  }

  public logout(): void {
    this.msalService.logoutRedirect();
  }

  public acquireToken(resource: string): Observable<string | null> {
    return null;
    // return this.adalService.acquireToken(resource);
  }

  public getResourceForEndpoint(endpoint: string): string | null {
    return null;
    // return this.adalService.getResourceForEndpoint(endpoint);
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
