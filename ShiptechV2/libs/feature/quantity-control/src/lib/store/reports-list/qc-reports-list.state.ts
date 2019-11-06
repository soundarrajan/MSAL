import { Action, Selector, State, StateContext } from '@ngxs/store';
import { IQuantityControlState } from '../quantity-control.state';
import { IQcReportsListState, QcReportsListStateModel } from './qc-reports-list.state.model';
import { nameof } from '@shiptech/core/utils/type-definitions';
import { IQcReportListSummaryState } from './qc-report-list-summary/qc-report-list-summary.state';
import { UpdateQcReportsListSummaryAction } from './qc-report-list-summary/qc-report-list-summary.actions';

@State<IQcReportsListState>({
  name: nameof<IQuantityControlState>('reportsList'),
  defaults: QcReportsListState.default
})
export class QcReportsListState {
  public static default: QcReportsListStateModel = new QcReportsListStateModel();

  @Selector()
  static getReportsListSummary(state: IQcReportsListState): IQcReportListSummaryState {
    return state.summary;
  }


  @Action(UpdateQcReportsListSummaryAction)
  updateReportsListSummary({ getState, patchState }: StateContext<IQcReportsListState>, { summary }: UpdateQcReportsListSummaryAction): void {
    const state = getState();
    patchState({
      summary: {
        ...state.summary,
        ...summary
      }
    });
  }
}
