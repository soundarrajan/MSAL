import {Action, Selector, State, StateContext} from '@ngxs/store';
import {nameof} from '@shiptech/core/utils/type-definitions';
import {isAction} from '@shiptech/core/utils/ngxs-utils';
import {Injectable} from '@angular/core';
import {IQcAuditLogState, QcAuditLogStateModel} from "./qc-audit-log.state.model";
import {IQuantityControlState} from "../../quantity-control.state";
import {LoadAuditLogAction, LoadAuditLogFailedAction, LoadAuditLogSuccessfulAction} from "./qc-audit-log.actions";

@State<IQcAuditLogState>({
  name: nameof<IQuantityControlState>('auditLogList'),
  defaults: QcAuditLogState.default
})
@Injectable()
export class QcAuditLogState {
  public static default: QcAuditLogStateModel = new QcAuditLogStateModel();

  @Action(LoadAuditLogAction)
  loadReportListAction({ patchState }: StateContext<IQcAuditLogState>, { serverGridInfo}: LoadAuditLogAction): void {
    patchState({
      _isLoading: true,
      _hasLoaded: false,
      gridInfo: serverGridInfo
    });
  }

  @Action([LoadAuditLogSuccessfulAction, LoadAuditLogFailedAction])
  loadAuditLogActionFinished({ getState, patchState }: StateContext<IQcAuditLogState>, action: LoadAuditLogSuccessfulAction | LoadAuditLogFailedAction): void {
    if (isAction(action, LoadAuditLogSuccessfulAction)) {
      patchState({
        _isLoading: false,
        _hasLoaded: true
      });
    } else if (isAction(action, LoadAuditLogFailedAction)) {
      patchState({
        _isLoading: false,
        _hasLoaded: false
      });
    }
  }
}
