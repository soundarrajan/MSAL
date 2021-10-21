import { IQcReportProductTypeDto } from '../../../../services/api/dto/qc-report-details.dto';

export class QcSaveReportDetailsAction {
  static readonly type = '[Qc.Report.Details] - Save';

  constructor() {}

  public log(): any {
    return {};
  }
}

export class QcSaveReportDetailsSuccessfulAction {
  static readonly type = '[Qc.Report.Details] - Save Successful';

  constructor(
    public reportId: number,
    public emailTransactionTypeId: number,
    public productTypes: IQcReportProductTypeDto[]
  ) {}

  public log(): any {
    return {
      reportId: this.reportId,
      emailTransactionTypeId: this.emailTransactionTypeId,
      productTypes: this.productTypes?.length
    };
  }
}

export class QcSaveReportDetailsFailedAction {
  static readonly type = '[Qc.Report.Details] - Save Failed';

  constructor() {}

  public log(): any {
    return {};
  }
}
