import { IQcReportDetailsState, QcReportDetailsModel } from './details/qc-report-details.model';
import { IQcAuditLogState, QcAuditLogModel } from './audit-log/qc-audit-log.model';
import { IQcEmailLogState, QcEmailLogModel } from './email-log/qc-email-log.model';
import { IQcDocumentsState, QcDocumentsModel } from './documents/qc-documents.model';

export class QcReportStateModel {
  details: IQcReportDetailsState = new QcReportDetailsModel();
  auditLog: IQcAuditLogState = new QcAuditLogModel();
  emailLog: IQcEmailLogState = new QcEmailLogModel();
  documents: IQcDocumentsState = new QcDocumentsModel();
}

export interface IQcReportState extends QcReportStateModel {
}
