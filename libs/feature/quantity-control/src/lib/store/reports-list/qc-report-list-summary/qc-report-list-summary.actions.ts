import { IQcReportListSummaryState } from './qc-report-list-summary.state';

export class UpdateQcReportsListSummaryAction {
  static readonly type = '[Qc.Report.List] - Update reports list summary comment';

  constructor(public summary: IQcReportListSummaryState) {
  }

  public log(): any {
    return {
      summary: this.summary
    };
  }
}
