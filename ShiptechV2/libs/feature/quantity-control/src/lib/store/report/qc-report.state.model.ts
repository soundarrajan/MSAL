import { IQcReportDetailsState, QcReportDetailsModel } from './details/qc-report-details.model';
import { IQcReportAuditLogState, QcReportAuditLogModel } from './audit-log/qc-report-audit-log.model';
import { IQcReportEmailLogState, QcReportEmailLogModel } from './email-log/qc-report-email-log.model';
import { IQcDocumentsState, QcDocumentsModel } from './documents/qc-documents.model';

export class QcReportStateModel {
  details: IQcReportDetailsState = new QcReportDetailsModel();
  auditLog: IQcReportAuditLogState = new QcReportAuditLogModel();
  emailLog: IQcReportEmailLogState = new QcReportEmailLogModel();
  documents: IQcDocumentsState = new QcDocumentsModel();
}

export interface IQcReportState extends QcReportStateModel {
}
