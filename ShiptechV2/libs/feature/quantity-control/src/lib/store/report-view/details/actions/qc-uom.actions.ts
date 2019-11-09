import { QcUomStateModel } from '../../models/uom.state';

export class SwitchUomForRobBeforeDeliveryAction {
  static readonly type = '[Qc.Report.Details] - Switch UOM Before Delivery';

  constructor(public uom: QcUomStateModel) {
  }

  public log(): any {
    return {
      uom: this.uom
    };
  }
}

export class SwitchUomForDeliveredQuantityAction {
  static readonly type = '[Qc.Report.Details] - Switch UOM for Delivered Quantity';

  constructor(public uom: QcUomStateModel) {
  }

  public log(): any {
    return {
      uom: this.uom
    };
  }
}

export class SwitchUomForRobAfterDelivery {
  static readonly type = '[Qc.Report.Details] - Switch UOM After Delivery';

  constructor(public uom: QcUomStateModel) {
  }

  public log(): any {
    return {
      uom: this.uom
    };
  }
}
