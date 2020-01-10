import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {IQcAuditLogState, QcAuditLogModel} from "./qc-audit-log.model";
import {IQuantityControlState} from "../../quantity-control.state";
import {LoadAuditLogAction, LoadAuditLogFailedAction, LoadAuditLogSuccessfulAction} from "./qc-audit-log.actions";
import {nameof} from "@shiptech/core/utils/type-definitions";
import {isAction} from "@shiptech/core/utils/ngxs-utils";

@State<IQcAuditLogState>({
  name: nameof<IQuantityControlState>("auditLogList"),
  defaults: QcAuditLogState.default
})
@Injectable()
export class QcAuditLogState {
  public static default: QcAuditLogModel = new QcAuditLogModel();

  @Selector([QcAuditLogState])
  static matchedCount(state: IQcAuditLogState): number {
    return state.matchedCount;
  }

  @Action(LoadAuditLogAction)
  loadReportListAction({patchState}: StateContext<IQcAuditLogState>, {serverGridInfo}: LoadAuditLogAction): void {
    patchState({
      _isLoading: true,
      _hasLoaded: false,
      gridInfo: serverGridInfo
    });
  }

  @Action([LoadAuditLogSuccessfulAction, LoadAuditLogFailedAction])
  loadAuditLogActionFinished({getState, patchState}: StateContext<IQcAuditLogState>, action: LoadAuditLogSuccessfulAction | LoadAuditLogFailedAction): void {
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
