import { Action, Selector, State, StateContext } from '@ngxs/store';

import { nameof } from '@shiptech/core/utils/type-definitions';
import { isAction } from '@shiptech/core/utils/ngxs-utils';

import { Injectable } from '@angular/core';
import {
  ControlTowerQuantityRobDifferenceListStateModel,
  IControlTowerQuantityRobDifferenceListState
} from './control-tower-quantity-rob-difference-list.state.model';
import {
  LoadControlTowerQuantityRobDifferenceListAction,
  LoadControlTowerQuantityRobDifferenceListFailedAction,
  LoadControlTowerQuantityRobDifferenceListSuccessfulAction
} from './control-tower-quantity-rob-difference-list.actions';
import { IControlTowerState } from '../control-tower.state';

@State<IControlTowerQuantityRobDifferenceListState>({
  name: nameof<IControlTowerState>('controlTowerQuantityRobDifferenceList'),
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  defaults: ControlTowerQuantityRobDifferenceListState.default
})
@Injectable()
export class ControlTowerQuantityRobDifferenceListState {
  public static default: ControlTowerQuantityRobDifferenceListStateModel = new ControlTowerQuantityRobDifferenceListStateModel();
  @Selector([ControlTowerQuantityRobDifferenceListState])
  static totalCount(
    state: IControlTowerQuantityRobDifferenceListState
  ): number {
    return state.totalCount;
  }

  @Selector([ControlTowerQuantityRobDifferenceListState])
  static newCount(state: IControlTowerQuantityRobDifferenceListState): number {
    return state.nbOfNewStatuses;
  }

  @Selector([ControlTowerQuantityRobDifferenceListState])
  static masCount(state: IControlTowerQuantityRobDifferenceListState): number {
    return state.nbOfMarkedAsSeenStatuses;
  }

  @Selector([ControlTowerQuantityRobDifferenceListState])
  static resolvedCount(
    state: IControlTowerQuantityRobDifferenceListState
  ): number {
    return state.nbOfResolvedStatuses;
  }

  @Action(LoadControlTowerQuantityRobDifferenceListAction)
  loadControlTowerQuantityRobDifferenceListAction(
    { patchState }: StateContext<IControlTowerQuantityRobDifferenceListState>,
    { serverGridInfo }: LoadControlTowerQuantityRobDifferenceListAction
  ): void {
    patchState({
      _isLoading: true,
      _hasLoaded: false,
      gridInfo: serverGridInfo
    });
  }

  @Action([
    LoadControlTowerQuantityRobDifferenceListSuccessfulAction,
    LoadControlTowerQuantityRobDifferenceListFailedAction
  ])
  loadControlTowerQuantityRobDifferenceListActionFinished(
    {
      getState,
      patchState
    }: StateContext<IControlTowerQuantityRobDifferenceListState>,
    action:
      | LoadControlTowerQuantityRobDifferenceListSuccessfulAction
      | LoadControlTowerQuantityRobDifferenceListFailedAction
  ): void {
    if (
      isAction(
        action,
        LoadControlTowerQuantityRobDifferenceListSuccessfulAction
      )
    ) {
      const {
        nbOfNewStatuses,
        nbOfMarkedAsSeenStatuses,
        nbOfResolvedStatuses,
        totalCount
      } = <LoadControlTowerQuantityRobDifferenceListSuccessfulAction>action;
      patchState({
        _isLoading: false,
        _hasLoaded: true,
        nbOfNewStatuses,
        nbOfMarkedAsSeenStatuses,
        nbOfResolvedStatuses,
        totalCount: totalCount
      });
    } else if (
      isAction(action, LoadControlTowerQuantityRobDifferenceListFailedAction)
    ) {
      patchState({
        _isLoading: false,
        _hasLoaded: false
      });
    }
  }
}
