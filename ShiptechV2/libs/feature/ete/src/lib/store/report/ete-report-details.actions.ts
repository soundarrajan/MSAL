import { IEteReportDetailsDto } from '../../services/api/dto/qc-report-details.dto';

export class LoadReportDetailsAction {
  static readonly type = '[Ete.Report.Details] Load Report Details';

  constructor(public reportId: number) {}

  public log(): any {
    return {
      reportId: this.reportId
    };
  }
}

export class LoadReportDetailsSuccessfulAction {
  static readonly type = '[Ete.Report.Details] Load Report Details Successful';

  constructor(public reportId: number, public dto: IEteReportDetailsDto) {}

  public log(): any {
    return {
      reportId: this.reportId,
      vesselName: this.dto?.vessel?.displayName,
      status: this.dto?.status
    };
  }
}

export class LoadReportDetailsFailedAction {
  static readonly type = '[Ete.Report.Details] Load Report Details Failed';

  constructor(public reportId: number) {}

  public log(): any {
    return {
      reportId: this.reportId
    };
  }
}

export class ResetEteReportDetailsStateAction {
  static readonly type = '[Ete.Report.Details] Reset';

  constructor() {}
}
