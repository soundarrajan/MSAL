import { Md5 } from 'ts-md5';
import { AuthenticationContext } from '../authentication/authentication-context';
import { InjectionToken } from '@angular/core';

export class AppContext {
  static instance = new AppContext();
  public sessionId: string;
  public isProd: boolean;

  constructor() {
    this.sessionId = Md5.hashStr(
      window.crypto.getRandomValues( new Uint8Array(1)).toString() + Date.now().toString()
    ).toString();
  }

  public get authContext(): AuthenticationContext {
    return AuthenticationContext.instance;
  }
}

export const instance = AppContext.instance;

export const SESSION_ID = new InjectionToken('SESSION_ID');
