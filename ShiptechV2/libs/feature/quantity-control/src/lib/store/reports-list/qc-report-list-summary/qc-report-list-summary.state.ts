export class QcReportListSummaryStateModel {
  nbOfMatched: number;
  nbOfNotMatched: number;
  nbOfMatchedWithinLimit: number;

  constructor(value: Partial<QcReportListSummaryStateModel> = {}) {
    this.nbOfMatched = value.nbOfMatched;
    this.nbOfNotMatched = value.nbOfNotMatched;
    this.nbOfMatchedWithinLimit = value.nbOfMatchedWithinLimit;
  }
}

export interface IQcReportListSummaryState extends QcReportListSummaryStateModel {
}
