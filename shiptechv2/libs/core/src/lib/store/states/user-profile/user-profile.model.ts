export class UserProfileModel {
  public displayName: string;
  public id: number;
  public username: string;
  public hasLoaded = false;
  public isLoading = false;

  constructor(model: Partial<IUserProfileState> = {}) {
    Object.assign(this, model);
  }
}

export interface IUserProfileState extends UserProfileModel {}
