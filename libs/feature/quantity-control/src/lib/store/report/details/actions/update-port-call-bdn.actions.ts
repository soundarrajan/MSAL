import { IQcPortCallProductTypeBdnDto } from '../../../../services/api/dto/qc-port-call-product-type-bdn.dto';

export class QcUpdatePortCallAction {
  static readonly type = '[Qc.Report.Details] - Update Port Call';

  constructor() {}

  public log(): any {
    return {};
  }
}

export class QcUpdatePortCallSuccessfulAction {
  static readonly type = '[Qc.Report.Details] - Update Port Call Successful';

  constructor(
    public portCallId: string,
    public productTypes: IQcPortCallProductTypeBdnDto[],
    public nbOfClaims: number,
    public nbOfDeliveries: number
  ) {}

  public log(): any {
    return {
      portCallId: this.portCallId,
      productTypesCount: this.productTypes?.length,
      nbOfClaims: this.nbOfClaims,
      nbOfDeliveries: this.nbOfDeliveries
    };
  }
}

export class QcClearPortCallBdnAction {
  static readonly type = '[Qc.Report.Details] - Clear Port Call';

  constructor() {}

  public log(): any {
    return {};
  }
}

export class QcUpdatePortCallFailedAction {
  static readonly type = '[Qc.Report.Details] - Update Port Call Failed';

  constructor() {}

  public log(): any {
    return {};
  }
}
