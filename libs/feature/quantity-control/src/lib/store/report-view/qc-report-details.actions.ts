import { nullable } from '@shiptech/core/utils/nullable';
import { QcReportDetailsModel } from '../../services/models/qc-report-details.model';

export class LoadReportDetailsAction {
  static readonly type = '[Settings] Load Report Details';

  constructor(public reportId: string) {
  }

  public log(): any {
    return {
      reportId: this.reportId
    };
  }
}

export class LoadReportDetailsSuccessfulAction {
  static readonly type = '[Settings] Load Report Details Successful';

  constructor(public reportId: string, public dto: QcReportDetailsModel) {
  }

  public log(): any {
    return {
      reportId: this.reportId,
      vesselName: nullable(this.dto).vesselName,
      status: nullable(this.dto).status
    };
  }
}

export class LoadReportDetailsFailedAction {
  static readonly type = '[Settings] Load Report Details Failed';

  constructor(public reportId: string) {
  }

  public log(): any {
    return {
      reportId: this.reportId
    };
  }
}
