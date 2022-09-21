import { IVesselToWatchLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { IQcVesselPortCallDto } from '../../../../services/api/dto/qc-vessel-port-call.interface';

export class UpdateQcReportVessel {
  static readonly type = '[Qc.Report.Details] - Update report vessel';

  constructor(public vessel: IVesselToWatchLookupDto) {}

  public log(): any {
    return {
      vessel: this.vessel?.displayName
    };
  }
}

export class UpdateQcReportPortCall {
  static readonly type = '[Qc.Report.Details] - Update report port call';

  constructor(public portCall: IQcVesselPortCallDto) {}

  public log(): any {
    return {
      portCall: this.portCall?.portCallId
    };
  }
}
