import { IQcReportDetailsState, QcReportDetailsModel } from './details/qc-report-details.model';
import { IQcAuditLogState, QcAuditLogModel } from './audit-log/qc-audit-log.model';
import { IQcReportEmailLogState, QcReportEmailLogModel } from './email-log/qc-report-email-log.model';
import { IQcDocumentsState, QcDocumentsModel } from './documents/qc-documents.model';

export class QcReportStateModel {
  details: IQcReportDetailsState = new QcReportDetailsModel();
  auditLog: IQcAuditLogState = new QcAuditLogModel();
  emailLog: IQcReportEmailLogState = new QcReportEmailLogModel();
  documents: IQcDocumentsState = new QcDocumentsModel();
}

export interface IQcReportState extends QcReportStateModel {
}
