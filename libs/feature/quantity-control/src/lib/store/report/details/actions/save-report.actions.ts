export class QcSaveReportDetailsAction {
  static readonly type = '[Qc.Report.Details] - Save';

  constructor() {
  }

  public log(): any {
    return {};
  }
}

export class QcSaveReportDetailsSuccessfulAction {
  static readonly type = '[Qc.Report.Details] - Save Successful';

  constructor(public reportId: number) {
  }

  public log(): any {
    return {
      reportId: this.reportId
    };
  }
}

export class QcSaveReportDetailsFailedAction {
  static readonly type = '[Qc.Report.Details] - Save Failed';

  constructor() {
  }

  public log(): any {
    return {};
  }
}
