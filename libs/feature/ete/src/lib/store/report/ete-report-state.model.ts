import {
  IEteReportDetailsState,
  EteReportDetailsModel
} from './details/ete-report-details.model';

export class EteReportStateModel {
  details: IEteReportDetailsState = new EteReportDetailsModel();
}

export interface IEteReportState extends EteReportStateModel {}
