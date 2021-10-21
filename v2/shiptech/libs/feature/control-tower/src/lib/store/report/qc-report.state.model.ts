import {
  IQcReportDetailsState,
  QcReportDetailsModel
} from './details/qc-report-details.model';

export class QcReportStateModel {
  details: IQcReportDetailsState = new QcReportDetailsModel();
}

export interface IQcReportState extends QcReportStateModel {}
