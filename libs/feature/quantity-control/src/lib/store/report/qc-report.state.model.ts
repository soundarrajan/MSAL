import { IQcReportDetailsState, QcReportDetailsModel } from "./details/qc-report-details.model";
import { IQcDocumentsState, QcDocumentsModel } from "./documents/qc-documents.model";

export class QcReportStateModel {
  details: IQcReportDetailsState = new QcReportDetailsModel();
  documents: IQcDocumentsState = new QcDocumentsModel();
}

export interface IQcReportState extends QcReportStateModel {
}
