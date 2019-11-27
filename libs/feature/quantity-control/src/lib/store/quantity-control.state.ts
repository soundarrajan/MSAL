import { Action, State, StateContext } from '@ngxs/store';
import { QcReportsListState } from './reports-list/qc-reports-list.state';
import { QcReportState } from './report/qc-report.state';
import { IQcReportState } from './report/qc-report.state.model';
import { ResetQcModuleStateAction } from './report/qc-module.actions';
import { StateReset } from 'ngxs-reset-plugin';

@State<IQuantityControlState>({
  name: 'quantityControl',
  children: [QcReportsListState, QcReportState]
})
export class QuantityControlState {

  @Action(ResetQcModuleStateAction)
  resetQcModuleStateAction(context: StateContext<IQcReportState>, action: ResetQcModuleStateAction): void {
    context.dispatch(new StateReset(QcReportsListState, QcReportState));
  }
}

export interface IQuantityControlState {
  report: IQcReportState;
  reportsList: Record<number, unknown>;
}

