import { Injectable } from '@angular/core';
import { AdalService } from 'adal-angular-wrapper';
import { Observable } from 'rxjs';
import { AuthenticationContext } from '@shiptech/core/authentication/authentication-context';

@Injectable()
export class AuthenticationService {
  private _isInitialized = false;

  get isInitialized(): boolean {
    return this._isInitialized;
  }

  get config(): adal.Config {
    return (this.adalService || <AdalService>{}).config;
  }

  get userInfo(): adal.User {
    return (this.adalService || <AdalService>{}).userInfo;
  }

  get isAuthenticated(): boolean {
    return ((this.adalService || <AdalService>{}).userInfo || <adal.User>{})
      .authenticated;
  }

  constructor(
    private adalService: AdalService,
    public authenticationContext: AuthenticationContext
  ) {}

  public init(configOptions: adal.Config): void {
    this.adalService.init(configOptions);

    this._isInitialized = true;

    this.adalService.handleWindowCallback();

    if (this.isAuthenticated) {
      this.authenticationContext.userId = this.userInfo?.userName;
      this.authenticationContext.isAuthenticated = this.isAuthenticated;
    }
  }

  public login(): void {
    this.adalService.login();
  }

  public logout(): void {
    this.adalService.logOut();

    this.authenticationContext.userId = undefined;
    this.authenticationContext.isAuthenticated = false;
  }

  public acquireToken(resource: string): Observable<string | null> {
    return this.adalService.acquireToken(resource);
  }

  public getResourceForEndpoint(endpoint: string): string | null {
    return this.adalService.getResourceForEndpoint(endpoint);
  }
}
