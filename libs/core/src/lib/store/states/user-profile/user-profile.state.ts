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
import { patch } from '@ngxs/store/operators';

// @dynamic
@State<IUserProfileState>({
  name: nameof<IAppState>('userProfile'),
  defaults: UserProfileState.default
})
export class UserProfileState {
  // noinspection TsLint
  static default = new UserProfileModel();
  private logger: ILogger;

  constructor(logger: LoggerFactory) {
    this.logger = logger.createLogger(UserProfileState.name);
  }

  @Selector()
  static displayName(state: IUserProfileState): string {
    return state.displayName;
  }

  @Selector()
  static username(state: IUserProfileState): string {
    return state.username;
  }

  @Action(LoadUserProfileAction)
  loadTenantState({ getState, patchState }: StateContext<IUserProfileState>, action: LoadUserProfileAction): void {
    patchState({
      isLoading: true,
      hasLoaded: false
    });
  }

  @Action([LoadUserProfileSuccessfulAction, LoadUserProfileFailedAction])
  loadTenantStateFinished({ getState, patchState }: StateContext<IUserProfileState>, action: LoadUserProfileSuccessfulAction | LoadUserProfileFailedAction): void {
    if (isAction(action, LoadUserProfileSuccessfulAction)) {
      const { userProfile } = <LoadUserProfileSuccessfulAction>action;

      patchState({
        ...userProfile,
        isLoading: false,
        hasLoaded: true,
      });
    } else if (isAction(action, LoadUserProfileFailedAction)) {
      patchState({
        hasLoaded: false,
        isLoading: false
      });
    }
  }
}
