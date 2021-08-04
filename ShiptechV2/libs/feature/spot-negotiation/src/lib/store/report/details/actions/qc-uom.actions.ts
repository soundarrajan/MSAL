import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

export class SwitchUomForRobBeforeDeliveryAction {
  static readonly type = '[Qc.Report.Details] - Switch UOM Before Delivery';

  constructor(public uom: IDisplayLookupDto) {}

  public log(): any {
    return {
      uom: this.uom
    };
  }
}

export class SwitchUomForDeliveredQuantityAction {
  static readonly type =
    '[Qc.Report.Details] - Switch UOM for Delivered Quantity';

  constructor(public uom: IDisplayLookupDto) {}

  public log(): any {
    return {
      uom: this.uom
    };
  }
}

export class SwitchUomForRobAfterDelivery {
  static readonly type = '[Qc.Report.Details] - Switch UOM After Delivery';

  constructor(public uom: IDisplayLookupDto) {}

  public log(): any {
    return {
      uom: this.uom
    };
  }
}
