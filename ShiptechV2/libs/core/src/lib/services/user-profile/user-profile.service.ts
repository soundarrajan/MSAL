import { Inject, Injectable } from '@angular/core';
import { defer, Observable } from 'rxjs';
import { ObservableException } from '../../utils/decorators/observable-exception.decorator';
import { Store } from '@ngxs/store';
import { AppError } from '../../error-handling/app-error';
import { SKIP$ } from '../../utils/rxjs-operators';
import { LoggerFactory } from '../../logging/logger-factory.service';
import { BaseStoreService } from '../base-store.service';
import { map } from 'rxjs/operators';
import { nullable } from '@shiptech/core/utils/nullable';
import { USER_PROFILE_API } from '@shiptech/core/services/user-profile/api/user-profile-api.service';
import { IUserProfileApi } from '@shiptech/core/services/user-profile/api/user-profile-api.interface';
import {
  LoadUserProfileAction,
  LoadUserProfileFailedAction,
  LoadUserProfileSuccessfulAction
} from '@shiptech/core/store/states/user-profile/load-user-profile.actions';
import { UserProfileModel } from '@shiptech/core/store/states/user-profile/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService extends BaseStoreService {
  constructor(
    protected store: Store,
    loggerFactory: LoggerFactory,
    @Inject(USER_PROFILE_API) private userProfileApi: IUserProfileApi
  ) {
    super(store, loggerFactory.createLogger(UserProfileService.name));
  }

  @ObservableException()
  load(): Observable<void> {
    return defer(() => {
      const appState = this.appState;

      const userProfile = nullable(appState).userProfile;

      const shouldLoadUserProfile = !(userProfile && userProfile.hasLoaded);

      const apiDispatch$ = this.apiDispatch(
        () => this.userProfileApi.get().pipe(map(response => response.payload)),
        LoadUserProfileAction,
        response =>
          new LoadUserProfileSuccessfulAction(new UserProfileModel(response)),
        new LoadUserProfileFailedAction(),
        AppError.LoadUserProfileFailed
      );

      return shouldLoadUserProfile ? apiDispatch$ : SKIP$;
    });
  }
}
