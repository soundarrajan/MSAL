const tokenKey = 'adal.idtoken';
const tenantIdKey = 'TenantId';
const userIdKey = 'UserId';

export class AuthenticationContext {
  public static instance = new AuthenticationContext();
  tenantId: string;
  userId: string;

  constructor() {}
}
//TODO: AuthenticationContext should be reachable even from non-angular places. Init this from the AuthenticationService
export const AuthContext = AuthenticationContext.instance;
