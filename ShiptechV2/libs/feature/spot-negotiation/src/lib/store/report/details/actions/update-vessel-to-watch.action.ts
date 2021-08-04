import { IQcVesselPortCallDto } from '../../../../services/api/dto/qc-vessel-port-call.interface';
import { IVesselToWatchLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

export class UpdateVesselToWatchAction {
  static readonly type = '[Qc.Report.Details] - Update Vessel to Watch';

  constructor() {}

  public log(): any {
    return {};
  }
}

export class UpdateVesselToWatchSuccessfulAction {
  static readonly type =
    '[Qc.Report.Details] - Update Vessel to Watch Successful';

  constructor(public newVessel: IVesselToWatchLookupDto) {}

  public log(): any {
    return {
      vessel: this.newVessel
    };
  }
}

export class UpdateVesselToWatchFailedAction {
  static readonly type = '[Qc.Report.Details] - Update Vessel to Watch Failed';

  constructor() {}

  public log(): any {
    return {};
  }
}
