import { Injectable } from '@angular/core';
import { AdalService } from 'adal-angular-wrapper';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private _isInitialized = false;

  get isInitialized(): boolean {
    return this._isInitialized;
  }

  // TODO: Do not expose adal, create custom object model
  get config(): adal.Config {
    return (this.adalService || <AdalService>{}).config;
  }

  get userInfo(): adal.User {
    return (this.adalService || <AdalService>{}).userInfo;
  }

  get isAuthenticated(): boolean {
    return ((this.adalService || <AdalService>{}).userInfo || <adal.User>{}).authenticated;
  }

  constructor(private adalService: AdalService) {
    //TODO: setup AuthenticationContext
  }

  public init(configOptions: adal.Config): void {
    this.adalService.init(configOptions);

    this._isInitialized = true;

    this.adalService.handleWindowCallback();
  }

  public login(): void {
    this.adalService.login();
  }

  public logout(): void {
    this.adalService.logOut();
  }

  public acquireToken(resource: string): Observable<string | null> {
    return this.adalService.acquireToken(resource);
  }

  public getResourceForEndpoint(endpoint: string): string | null {
    return this.adalService.getResourceForEndpoint(endpoint);
  };
}
