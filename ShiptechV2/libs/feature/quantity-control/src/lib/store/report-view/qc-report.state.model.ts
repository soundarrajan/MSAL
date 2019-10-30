import { IQcReportDetailsState, QcReportDetailsState } from './details/qc-report-details.state';
import { IQcAuditLogState, QcAuditLogState } from './audit-log/qc-audit-log.state';
import { IQcEmailLogState, QcEmailLogState } from './email-log/qc-email-log.state';
import { IQcDocumentsState, QcDocumentsState } from './documents/qc-documents.state';

export class QcReportStateModel {
  details: IQcReportDetailsState = new QcReportDetailsState();
  auditLog: IQcAuditLogState = new QcAuditLogState();
  emailLog: IQcEmailLogState = new QcEmailLogState();
  documents: IQcDocumentsState = new QcDocumentsState();
}

export interface IQcReportState extends QcReportStateModel {
}
