import { Injectable } from '@angular/core';
import { AdalService } from 'adal-angular-wrapper';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  get config(): adal.Config {
      return (this.adalService || <AdalService>{}).config
  }

  get userInfo(): adal.User {
    return (this.adalService || <AdalService>{}).userInfo;
  }

  get isInitialized(): boolean {
    try {
      return !!this.config
    } catch(e) {
      return false;
    }
  }

  get isAuthenticated(): boolean {
    return this.adalService.userInfo.authenticated;
  }

  constructor(private adalService: AdalService) {
  }

  public init(configOptions: adal.Config): void {
    this.adalService.init(configOptions);
  }

  public login(): void {
    this.adalService.login()
  }

  public logout(): void {
    this.adalService.logOut()
  }

  public acquireToken(resource: string): Observable<string | null> {
    return this.adalService.acquireToken(resource);
  }

  public getResourceForEndpoint(url: string): string | null {
    return this.adalService.getResourceForEndpoint(url);
  }

  public handleWindowCallback(removeHash?: boolean): void {
    this.adalService.handleWindowCallback();
  }
}
