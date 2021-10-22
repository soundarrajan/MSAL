import { Action, State, StateContext } from '@ngxs/store';
import { ResetQcModuleStateAction } from './report/qc-module.actions';
import { StateReset } from 'ngxs-reset-plugin';
import { Injectable } from '@angular/core';
import { IQcReportState } from './report/qc-report.state.model';
import { ControlTowerListState } from './control-tower-general-list/control-tower-general-list.state';

@State<IControlTowerState>({
  name: 'controlTower',
  children: [ControlTowerListState]
})
@Injectable()
export class ControlTowerState {
  @Action(ResetQcModuleStateAction)
  resetQcModuleStateAction(
    context: StateContext<IQcReportState>,
    action: ResetQcModuleStateAction
  ): void {
    context.dispatch(new StateReset(ControlTowerListState));
  }
}

export interface IControlTowerState {
  controlTowerList: Record<number, unknown>;
}
