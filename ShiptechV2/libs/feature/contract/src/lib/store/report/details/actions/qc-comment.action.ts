export class UpdateQcReportComment {
  static readonly type = '[Qc.Report.Details] - Update report comment';

  constructor(public comment: string) {}

  public log(): any {
    return {
      comment: this.comment
    };
  }
}
