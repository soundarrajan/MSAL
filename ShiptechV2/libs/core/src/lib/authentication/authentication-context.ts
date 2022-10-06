export class AuthenticationContext {
  public static instance = new AuthenticationContext();
  isAuthenticated: boolean;
  userId: string;

  constructor() {}
}
//Note: AuthenticationContext should be reachable even from non-angular places.
export const AuthContext = AuthenticationContext.instance;
