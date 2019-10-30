import { IQcReportDetailsState } from './details/qc-report-details.state.model';

export class QcReportStateModel {
  details: IQcReportDetailsState;
}

export interface IQcReportState extends QcReportStateModel {

}
