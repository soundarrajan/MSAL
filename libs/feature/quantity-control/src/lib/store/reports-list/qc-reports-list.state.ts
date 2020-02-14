import { Action, Selector, State, StateContext } from '@ngxs/store';
import { IQuantityControlState } from '../quantity-control.state';
import {
  IQcReportsListState,
  QcReportsListStateModel
} from './qc-reports-list.state.model';
import { nameof } from '@shiptech/core/utils/type-definitions';
import { isAction } from '@shiptech/core/utils/ngxs-utils';
import {
  LoadReportListAction,
  LoadReportListFailedAction,
  LoadReportListSuccessfulAction
} from './qc-report-list.actions';
import { Injectable } from '@angular/core';

@State<IQcReportsListState>({
  name: nameof<IQuantityControlState>('reportsList'),
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  defaults: QcReportsListState.default
})
@Injectable()
export class QcReportsListState {
  public static default: QcReportsListStateModel = new QcReportsListStateModel();

  @Selector([QcReportsListState])
  static nbOfMatched(state: IQcReportsListState): number {
    return state.nbOfMatched;
  }

  @Selector([QcReportsListState])
  static nbOfMatchedWithinLimit(state: IQcReportsListState): number {
    return state.nbOfMatchedWithinLimit;
  }

  @Selector([QcReportsListState])
  static nbOfNotMatched(state: IQcReportsListState): number {
    return state.nbOfNotMatched;
  }

  @Action(LoadReportListAction)
  loadReportListAction(
    { patchState }: StateContext<IQcReportsListState>,
    { serverGridInfo }: LoadReportListAction
  ): void {
    patchState({
      _isLoading: true,
      _hasLoaded: false,
      gridInfo: serverGridInfo
    });
  }

  @Action([LoadReportListSuccessfulAction, LoadReportListFailedAction])
  loadReportListActionFinished(
    { getState, patchState }: StateContext<IQcReportsListState>,
    action: LoadReportListSuccessfulAction | LoadReportListFailedAction
  ): void {
    if (isAction(action, LoadReportListSuccessfulAction)) {
      const {
        nbOfMatched,
        nbOfMatchedWithinLimit,
        nbOfNotMatched,
        totalCount
      } = <LoadReportListSuccessfulAction>action;
      patchState({
        _isLoading: false,
        _hasLoaded: true,
        nbOfMatched,
        nbOfMatchedWithinLimit,
        nbOfNotMatched,
        totalCount: totalCount
      });
    } else if (isAction(action, LoadReportListFailedAction)) {
      patchState({
        _isLoading: false,
        _hasLoaded: false
      });
    }
  }
}
