import { IQcReportDetailsState, QcReportDetailsModel } from './details/qc-report-details.model';
import { IQcAuditLogState, QcAuditLogStateModel } from './audit-log/qc-audit-log-state.model';
import { IQcEmailLogState, QcEmailLogModel } from './email-log/qc-email-log.model';
import { IQcDocumentsState, QcDocumentsModel } from './documents/qc-documents.model';

export class QcReportStateModel {
  isNew: boolean;
  details: IQcReportDetailsState = new QcReportDetailsModel();
  auditLog: IQcAuditLogState = new QcAuditLogStateModel();
  emailLog: IQcEmailLogState = new QcEmailLogModel();
  documents: IQcDocumentsState = new QcDocumentsModel();
}

export interface IQcReportState extends QcReportStateModel {
}
