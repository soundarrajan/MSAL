import { QcVesselResponseBaseStateItem, QcVesselResponseSludgeStateItem } from '../qc-vessel-responses.state';

export class UpdateActiveSludgeVesselResponse {
  static readonly type = '[Qc.Report.Details] - Update sludge vessel response';

  constructor(public prop: keyof QcVesselResponseSludgeStateItem, public value: unknown) {
  }

  public log(): any {
    return {
      prop: this.prop,
      value: this.value
    };
  }
}

export class SwitchActiveSludgeResponse {
  static readonly type = '[Qc.Report.Details] - Switch active sludge vessel response';

  constructor(public categoryId: number) {
  }

  public log(): any {
    return {
      categoryId: this.categoryId
    };
  }
}

export class UpdateActiveBunkerVesselResponse {
  static readonly type = '[Qc.Report.Details] - Update bunker vessel response';

  constructor(public prop: keyof QcVesselResponseBaseStateItem, public value: unknown) {
  }

  public log(): any {
    return {
      prop: this.prop,
      value: this.value
    };
  }
}


export class SwitchActiveBunkerResponse {
  static readonly type = '[Qc.Report.Details] - Switch active bunker vessel response';

  constructor(public categoryId: number) {
  }
  public log(): any {
    return {
      categoryId: this.categoryId
    };
  }
}
