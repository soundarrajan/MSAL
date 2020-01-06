import { UserProfileModel } from '@shiptech/core/store/states/user-profile/user-profile.model';
import { nullable } from '@shiptech/core/utils/nullable';

export class LoadUserProfileAction {
  static readonly type = '[User-Profile] Load User Profile';

  constructor() {
  }
}

export class LoadUserProfileSuccessfulAction {
  static readonly type = '[User-Profile] Load User Profile Successful';

  constructor(public userProfile: UserProfileModel) {
  }

  public log(): any {
    return {
      userName: this.userProfile?.username,
      id: this.userProfile?.id
    };
  }
}

export class LoadUserProfileFailedAction {
  static readonly type = '[User-Profile] Load User Profile Failed';

  constructor() {
  }
}
