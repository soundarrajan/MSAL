import { IQcReportDetailsDto } from '../../services/api/dto/qc-report-details.dto';

export class LoadReportDetailsAction {
  static readonly type = '[QC.Report.Details] Load Report Details';

  constructor(public reportId: number) {}

  public log(): any {
    return {
      reportId: this.reportId
    };
  }
}

export class LoadReportDetailsSuccessfulAction {
  static readonly type = '[QC.Report.Details] Load Report Details Successful';

  constructor(public reportId: number, public dto: IQcReportDetailsDto) {}

  public log(): any {
    return {
      reportId: this.reportId,
      vesselName: this.dto?.vessel?.displayName,
      status: this.dto?.status
    };
  }
}

export class LoadReportDetailsFailedAction {
  static readonly type = '[QC.Report.Details] Load Report Details Failed';

  constructor(public reportId: number) {}

  public log(): any {
    return {
      reportId: this.reportId
    };
  }
}

export class ResetQcReportDetailsStateAction {
  static readonly type = '[QC.Report.Details] Reset';

  constructor() {}
}
