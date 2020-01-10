import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {IQcReportAuditLogState, QcReportAuditLogModel} from "./qc-report-audit-log.model";
import {LoadAuditLogAction, LoadAuditLogFailedAction, LoadAuditLogSuccessfulAction} from "./qc-report-audit-log.actions";
import {nameof} from "@shiptech/core/utils/type-definitions";
import {isAction} from "@shiptech/core/utils/ngxs-utils";
import {QcReportStateModel} from '../qc-report.state.model';

@State<IQcReportAuditLogState>({
  name: nameof<QcReportStateModel>("auditLog"),
  defaults: QcReportAuditLogState.default
})
@Injectable()
export class QcReportAuditLogState {
  public static default: QcReportAuditLogModel = new QcReportAuditLogModel();

  @Selector([QcReportAuditLogState])
  static matchedCount(state: IQcReportAuditLogState): number {
    return state.matchedCount;
  }

  @Action(LoadAuditLogAction)
  loadReportListAction({patchState}: StateContext<IQcReportAuditLogState>, {serverGridInfo}: LoadAuditLogAction): void {
    patchState({
      _isLoading: true,
      _hasLoaded: false,
      gridInfo: serverGridInfo
    });
  }

  @Action([LoadAuditLogSuccessfulAction, LoadAuditLogFailedAction])
  loadAuditLogActionFinished({getState, patchState}: StateContext<IQcReportAuditLogState>, action: LoadAuditLogSuccessfulAction | LoadAuditLogFailedAction): void {
    const {matchedCount} = <LoadAuditLogSuccessfulAction>action;
    if (isAction(action, LoadAuditLogSuccessfulAction)) {
      patchState({
        _isLoading: false,
        _hasLoaded: true,
        matchedCount: matchedCount
      });
    } else if (isAction(action, LoadAuditLogFailedAction)) {
      patchState({
        _isLoading: false,
        _hasLoaded: false
      });
    }
  }
}
