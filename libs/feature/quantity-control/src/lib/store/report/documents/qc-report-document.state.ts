import { State } from "@ngxs/store";
import { nameof } from "@shiptech/core/utils/type-definitions";
import { QcReportStateModel } from "../qc-report.state.model";
import { Injectable } from "@angular/core";
import { IQcReportDocumentState, QcReportDocumentModel } from "./qc-report-document.model";

@State<IQcReportDocumentState>({
  name: nameof<QcReportStateModel>("documents"),
  defaults: QcReportDocumentsState.default
})
@Injectable()
export class QcReportDocumentsState {
  public static default: QcReportDocumentModel = new QcReportDocumentModel();

}
