const tokenKey = 'adal.idtoken';
const tenantIdKey = 'TenantId';
const userIdKey = 'UserId';

export class AuthenticationContext {
  public static instance = new AuthenticationContext();

  constructor() {}

  // TODO: Set Toke, Tenant, User after authentication. Right now they are taken from localstorage
  // Note: Where to set them?
  public get token(): string {
    return localStorage.getItem(tokenKey);
  }

  public set token(token: string) {
    localStorage.setItem(tokenKey, token);
  }

  get userId(): string {
    return localStorage.getItem(userIdKey);
  }

  set userId(value: string) {
    localStorage.setItem(userIdKey, value);
  }
  get tenantId(): string {
    return localStorage.getItem(tenantIdKey);
  }

  set tenantId(value: string) {
    localStorage.setItem(tenantIdKey, value);
  }
}

export const AuthContext = AuthenticationContext.instance;
