import { Action, Selector, State, StateContext } from "@ngxs/store";
import { nameof } from "@shiptech/core/utils/type-definitions";
import { Injectable } from "@angular/core";
import { isAction } from "@shiptech/core/utils/ngxs-utils";
import { LoadEmailLogsAction, LoadEmailLogsFailedAction, LoadEmailLogsSuccessfulAction } from "./qc-email-log.actions";
import { IQcEmailLogState, QcEmailLogModel } from "./qc-email-log.model";
import { QcReportStateModel } from "../qc-report.state.model";
import { IQcReportsListState } from "../../reports-list/qc-reports-list.state.model";

@State<IQcEmailLogState>({
  name: nameof<QcReportStateModel>("emailLog"),
  defaults: QcEmailLogsState.default
})
@Injectable()
export class QcEmailLogsState {
  public static default: QcEmailLogModel = new QcEmailLogModel();

  @Selector([QcEmailLogsState])
  static matchedCount(state: IQcEmailLogState): number {
    return state.matchedCount;
  }

  @Action(LoadEmailLogsAction)
  loadReportListAction({ patchState }: StateContext<IQcEmailLogState>, { serverGridInfo }: LoadEmailLogsAction): void {
    patchState({
      _isLoading: true,
      _hasLoaded: false,
      gridInfo: serverGridInfo
    });
  }

  @Action([LoadEmailLogsSuccessfulAction, LoadEmailLogsFailedAction])
  loadEmailLogsActionFinished({ getState, patchState }: StateContext<IQcEmailLogState>, action: LoadEmailLogsSuccessfulAction | LoadEmailLogsFailedAction): void {
    if (isAction(action, LoadEmailLogsSuccessfulAction)) {
      const { matchedCount } = <LoadEmailLogsSuccessfulAction>action;
      patchState({
        _isLoading: false,
        _hasLoaded: true,
        matchedCount: matchedCount
      });
    } else if (isAction(action, LoadEmailLogsFailedAction)) {
      patchState({
        _isLoading: false,
        _hasLoaded: false
      });
    }
  }
}
