import { Action, Selector, State, StateContext } from '@ngxs/store';
import { IQuantityControlState } from '../quantity-control.state';
import { IQcReportsListState, QcReportsListStateModel } from './qc-reports-list.state.model';
import { nameof } from '@shiptech/core/utils/type-definitions';
import { isAction } from '@shiptech/core/utils/ngxs-utils';
import {
  LoadReportListAction,
  LoadReportListFailedAction,
  LoadReportListSuccessfulAction
} from './qc-report-list.actions';

@State<IQcReportsListState>({
  name: nameof<IQuantityControlState>('reportsList'),
  defaults: QcReportsListState.default
})
export class QcReportsListState {
  public static default: QcReportsListStateModel = new QcReportsListStateModel();

  @Selector()
  static nbOfMatched(state: IQcReportsListState): number {
    return state.nbOfMatched;
  }

  @Selector()
  static nbOfMatchedWithinLimit(state: IQcReportsListState): number {
    return state.nbOfMatchedWithinLimit;
  }

  @Selector()
  static nbOfNotMatched(state: IQcReportsListState): number {
    return state.nbOfNotMatched;
  }

  @Action(LoadReportListAction)
  loadReportListAction({ patchState }: StateContext<IQcReportsListState>, action: LoadReportListAction): void {
    patchState({
      _isLoading: true,
      _hasLoaded: false
    });
  }

  @Action([LoadReportListSuccessfulAction, LoadReportListFailedAction])
  loadReportListActionFinished({ getState, patchState }: StateContext<IQcReportsListState>, action: LoadReportListSuccessfulAction | LoadReportListFailedAction): void {
    if (isAction(action, LoadReportListSuccessfulAction)) {
      const { nbOfMatched, nbOfMatchedWithinLimit, nbOfNotMatched, totalItems } = <LoadReportListSuccessfulAction>action;
      patchState({
        _isLoading: false,
        _hasLoaded: true,
        nbOfMatched,
        nbOfMatchedWithinLimit,
        nbOfNotMatched,
        totalItems
      });
    } else if (isAction(action, LoadReportListFailedAction)) {
      patchState({
        _isLoading: false,
        _hasLoaded: false
      });
    }
  }
}
