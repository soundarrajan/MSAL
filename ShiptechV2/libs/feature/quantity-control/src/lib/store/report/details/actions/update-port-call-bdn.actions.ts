import { IQcPortCallProductTypeBdnDto } from '../../../../services/api/dto/qc-port-call-product-type-bdn.dto';

export class QcUpdatePortCallBdnAction {
  static readonly type = '[Qc.Report.Details] - Update Port Call BDN';

  constructor() {
  }

  public log(): any {
    return {};
  }
}

export class QcUpdatePortCallBdnSuccessfulAction {
  static readonly type = '[Qc.Report.Details] - Update Port Call BDN Successful';

  constructor(public portCallId: string, public productTypes: IQcPortCallProductTypeBdnDto[]) {
  }

  public log(): any {
    return {
      portCallId: this.portCallId,
      productTypesCount: this.productTypes?.length
    };
  }
}

export class QcClearPortCallBdnAction {
  static readonly type = '[Qc.Report.Details] - Clear Port Call BDN';

  constructor() {
  }

  public log(): any {
    return {
    };
  }
}

export class QcUpdatePortCallBdnFailedAction {
  static readonly type = '[Qc.Report.Details] - Update Port Call BDN Failed';

  constructor() {
  }

  public log(): any {
    return {};
  }
}
