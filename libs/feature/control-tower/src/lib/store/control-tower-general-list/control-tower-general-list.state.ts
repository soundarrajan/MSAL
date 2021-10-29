import { Action, Selector, State, StateContext } from '@ngxs/store';

import { nameof } from '@shiptech/core/utils/type-definitions';
import { isAction } from '@shiptech/core/utils/ngxs-utils';

import { Injectable } from '@angular/core';

import { IControlTowerState } from '../control-tower.state';
import {
  ControlTowerListStateModel,
  IControlTowerListState
} from './control-tower-general-list.state.model';
import {
  LoadControlTowerListAction,
  LoadControlTowerListFailedAction,
  LoadControlTowerListSuccessfulAction
} from './control-tower-general-list.actions';

@State<IControlTowerListState>({
  name: nameof<IControlTowerState>('controlTowerList'),
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  defaults: ControlTowerListState.default
})
@Injectable()
export class ControlTowerListState {
  public static default: ControlTowerListStateModel = new ControlTowerListStateModel();
  @Selector([ControlTowerListState])
  static totalCount(state: IControlTowerListState): number {
    return state.totalCount;
  }

  @Selector([ControlTowerListState])
  static firstStatusCount(state: IControlTowerListState): number {
    return state.firstStatusCount;
  }

  @Selector([ControlTowerListState])
  static secondStatusCount(state: IControlTowerListState): number {
    return state.secondStatusCount;
  }

  @Selector([ControlTowerListState])
  static thirdStatusCount(state: IControlTowerListState): number {
    return state.thirdStatusCount;
  }

  @Action(LoadControlTowerListAction)
  loadControlTowerListAction(
    { patchState }: StateContext<IControlTowerListState>,
    { serverGridInfo }: LoadControlTowerListAction
  ): void {
    patchState({
      _isLoading: true,
      _hasLoaded: false,
      gridInfo: serverGridInfo
    });
  }

  @Action([
    LoadControlTowerListSuccessfulAction,
    LoadControlTowerListFailedAction
  ])
  loadControlTowerListActionFinished(
    { getState, patchState }: StateContext<IControlTowerListState>,
    action:
      | LoadControlTowerListSuccessfulAction
      | LoadControlTowerListFailedAction
  ): void {
    if (isAction(action, LoadControlTowerListSuccessfulAction)) {
      const {
        firstStatusCount,
        secondStatusCount,
        thirdStatusCount,
        totalCount
      } = <LoadControlTowerListSuccessfulAction>action;
      patchState({
        _isLoading: false,
        _hasLoaded: true,
        firstStatusCount,
        secondStatusCount,
        thirdStatusCount,
        totalCount: totalCount
      });
    } else if (isAction(action, LoadControlTowerListFailedAction)) {
      patchState({
        _isLoading: false,
        _hasLoaded: false
      });
    }
  }
}
