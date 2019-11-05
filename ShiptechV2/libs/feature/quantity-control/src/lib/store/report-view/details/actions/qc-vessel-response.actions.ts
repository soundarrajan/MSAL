import { QcVesselResponseBaseStateModel, QcVesselResponseSludgeStateModel } from '../qc-vessel-response.state';

export class UpdateSludgeVesselResponse {
  static readonly type = '[Qc.Report.Details] - Update sludge vessel response';

  constructor(public prop: keyof QcVesselResponseSludgeStateModel, public value: unknown) {
  }

  public log(): any {
    return {
      prop: this.prop,
      value: this.value
    };
  }
}

export class UpdateBunkerVesselResponse {
  static readonly type = '[Qc.Report.Details] - Update bunker vessel response';

  constructor(public prop: keyof QcVesselResponseBaseStateModel, public value: unknown) {
  }

  public log(): any {
    return {
      prop: this.prop,
      value: this.value
    };
  }
}
