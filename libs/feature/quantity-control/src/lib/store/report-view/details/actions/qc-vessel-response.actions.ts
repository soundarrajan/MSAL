import { QcVesselResponseBaseStateItem, QcVesselResponseSludgeStateItem } from '../qc-vessel-responses.state';

export class UpdateActiveSludgeVesselResponseAction {
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

export class SwitchActiveSludgeResponseAction {
  static readonly type = '[Qc.Report.Details] - Switch active sludge vessel response';

  constructor(public categoryId: number) {
  }

  public log(): any {
    return {
      categoryId: this.categoryId
    };
  }
}

export class UpdateActiveBunkerVesselResponseAction {
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


export class SwitchActiveBunkerResponseAction {
  static readonly type = '[Qc.Report.Details] - Switch active bunker vessel response';

  constructor(public categoryId: number) {
  }
  public log(): any {
    return {
      categoryId: this.categoryId
    };
  }
}
