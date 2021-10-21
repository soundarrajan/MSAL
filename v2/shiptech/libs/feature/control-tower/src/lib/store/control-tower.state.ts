import { Action, State, StateContext } from '@ngxs/store';
import { ResetQcModuleStateAction } from './report/qc-module.actions';
import { StateReset } from 'ngxs-reset-plugin';
import { Injectable } from '@angular/core';
import { ControlTowerQuantityRobDifferenceListState } from './control-tower-quantity-rob-difference-list/control-tower-quantity-rob-difference-list.state';
import { IQcReportState } from './report/qc-report.state.model';

@State<IControlTowerState>({
  name: 'controlTower',
  children: [ControlTowerQuantityRobDifferenceListState]
})
@Injectable()
export class ControlTowerState {
  @Action(ResetQcModuleStateAction)
  resetQcModuleStateAction(
    context: StateContext<IQcReportState>,
    action: ResetQcModuleStateAction
  ): void {
    context.dispatch(
      new StateReset(ControlTowerQuantityRobDifferenceListState)
    );
  }
}

export interface IControlTowerState {
  controlTowerQuantityRobDifferenceList: Record<number, unknown>;
}
