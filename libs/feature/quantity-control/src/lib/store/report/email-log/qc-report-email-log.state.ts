import { Action, Selector, State, StateContext } from "@ngxs/store";
import { nameof } from "@shiptech/core/utils/type-definitions";
import { Injectable } from "@angular/core";
import { isAction } from "@shiptech/core/utils/ngxs-utils";
import { LoadEmailLogsAction, LoadEmailLogsFailedAction, LoadEmailLogsSuccessfulAction } from "./qc-report-email-log.actions";
import { IQcReportEmailLogState, QcReportEmailLogModel } from "./qc-report-email-log.model";
import { QcReportStateModel } from "../qc-report.state.model";
import { IQcReportsListState } from "../../reports-list/qc-reports-list.state.model";

@State<IQcReportEmailLogState>({
  name: nameof<QcReportStateModel>("emailLog"),
  defaults: QcReportEmailLogsState.default
})
@Injectable()
export class QcReportEmailLogsState {
  public static default: QcReportEmailLogModel = new QcReportEmailLogModel();

}
