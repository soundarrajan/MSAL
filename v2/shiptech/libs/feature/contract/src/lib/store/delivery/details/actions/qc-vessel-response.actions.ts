import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import {
  QcVesselResponseBunkerStateModel,
  QcVesselResponseSludgeStateModel
} from '../qc-vessel-responses.state';

export class UpdateActiveSludgeVesselResponseAction {
  static readonly type = '[Qc.Report.Details] - Update sludge vessel response';

  constructor(
    public prop: keyof QcVesselResponseSludgeStateModel,
    public value: unknown
  ) {}

  public log(): any {
    return {
      prop: this.prop,
      value: this.value
    };
  }
}

export class SwitchActiveSludgeResponseAction {
  static readonly type =
    '[Qc.Report.Details] - Switch active sludge vessel response';

  constructor(public category: IDisplayLookupDto) {}

  public log(): any {
    return {
      category: this.category
    };
  }
}

export class UpdateActiveBunkerVesselResponseAction {
  static readonly type = '[Qc.Report.Details] - Update bunker vessel response';

  constructor(
    public prop: keyof QcVesselResponseBunkerStateModel,
    public value: unknown
  ) {}

  public log(): any {
    return {
      prop: this.prop,
      value: this.value
    };
  }
}

export class SwitchActiveBunkerResponseAction {
  static readonly type =
    '[Qc.Report.Details] - Switch active bunker vessel response';

  constructor(public category: IDisplayLookupDto) {}
  public log(): any {
    return {
      category: this.category
    };
  }
}
