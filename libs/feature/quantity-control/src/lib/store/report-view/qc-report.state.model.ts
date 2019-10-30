import { IQcReportDetailsState } from './details/qc-report-details.state.model';
import { IQcAuditLogState } from './audit-log/qc-audit-log.state';

export class QcReportStateModel {
  details: IQcReportDetailsState;
  auditLog: IQcAuditLogState;
}

export interface IQcReportState extends QcReportStateModel {

}
