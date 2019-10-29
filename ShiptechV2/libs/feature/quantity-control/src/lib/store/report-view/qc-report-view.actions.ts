import { nullable } from '@shiptech/core/utils/nullable';
import { ReportItemViewModel } from '../../services/models/port-call-details.model';

export class LoadReportViewAction {
  static readonly type = '[Settings] Load Report View Details';

  constructor(public reportId: string) {
  }

  public log(): any {
    return {
      reportId: this.reportId
    };
  }
}

export class LoadReportViewSuccessfulAction {
  static readonly type = '[Settings] Load Report View Successful';

  constructor(public reportId: string, public dto: ReportItemViewModel) {
  }

  public log(): any {
    return {
      reportId: this.reportId,
      vesselName: nullable(this.dto).vesselName,
      status: nullable(this.dto).status
    };
  }
}

export class LoadReportViewFailedAction {
  static readonly type = '[Settings] Load Report View Details Failed';

  constructor(public reportId: string) {
  }

  public log(): any {
    return {
      reportId: this.reportId
    };
  }
}
