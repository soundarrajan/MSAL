import {Action, State, StateContext} from '@ngxs/store';
import {EteReportState} from './report/ete-report-state.service';
import {IEteReportState} from './report/ete-report-state.model';
import {ResetEteModuleStateAction} from './report/ete-module.actions';
import {StateReset} from 'ngxs-reset-plugin';
import {Injectable} from '@angular/core';

@State<IEteState>({
  name: 'ete',
  children: [EteReportState]
})
@Injectable({
  providedIn: 'root'
})
export class EteState {
  @Action(ResetEteModuleStateAction)
  resetQcModuleStateAction(
    context: StateContext<IEteReportState>,
    action: ResetEteModuleStateAction
  ): void {
    context.dispatch(new StateReset(EteReportState));
  }
}

export interface IEteState {
  report: IEteReportState;
  reportsList: Record<number, unknown>;
}
