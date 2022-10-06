import { Action, Selector, State, StateContext } from '@ngxs/store';
import { nameof } from '../../../utils/type-definitions';
import { IUserProfileState, UserProfileModel } from './user-profile.model';
import { IAppState } from '../app.state.interface';
import {
  LoadUserProfileAction,
  LoadUserProfileFailedAction,
  LoadUserProfileSuccessfulAction
} from './load-user-profile.actions';
import { LoggerFactory } from '../../../logging/logger-factory.service';
import { ILogger } from '../../../logging/logger';
import { isAction } from '../../../utils/ngxs-utils';
import { Injectable } from '@angular/core';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

// @dynamic
@State<IUserProfileState>({
  name: nameof<IAppState>('userProfile'),
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  defaults: UserProfileState.default
})
@Injectable()
export class UserProfileState {
  // noinspection TsLint
  static default = new UserProfileModel();
  private logger: ILogger;

  constructor(logger: LoggerFactory) {
    this.logger = logger.createLogger(UserProfileState.name);
  }

  @Selector([UserProfileState])
  static displayName(state: IUserProfileState): string {
    return state.displayName;
  }

  @Selector([UserProfileState])
  static userId(state: IUserProfileState): number {
    return state.id;
  }

  @Selector([UserProfileState])
  static username(state: IUserProfileState): string {
    return state.username;
  }

  @Selector([
    UserProfileState.userId,
    UserProfileState.username,
    UserProfileState.displayName
  ])
  static user(
    userId: number,
    username: string,
    displayName: string
  ): IDisplayLookupDto {
    return { id: userId, name: username, displayName: displayName };
  }

  @Action(LoadUserProfileAction)
  loadTenantState(
    { getState, patchState }: StateContext<IUserProfileState>,
    action: LoadUserProfileAction
  ): void {
    patchState({
      isLoading: true,
      hasLoaded: false
    });
  }

  @Action([LoadUserProfileSuccessfulAction, LoadUserProfileFailedAction])
  loadTenantStateFinished(
    { getState, patchState }: StateContext<IUserProfileState>,
    action: LoadUserProfileSuccessfulAction | LoadUserProfileFailedAction
  ): void {
    if (isAction(action, LoadUserProfileSuccessfulAction)) {
      const { userProfile } = <LoadUserProfileSuccessfulAction>action;

      patchState({
        ...userProfile,
        isLoading: false,
        hasLoaded: true
      });
    } else if (isAction(action, LoadUserProfileFailedAction)) {
      patchState({
        hasLoaded: false,
        isLoading: false
      });
    }
  }
}
