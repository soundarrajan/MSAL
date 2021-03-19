import { IDeliveryDetailsDto } from '../../services/api/dto/delivery-details.dto';
import { IQcReportDetailsDto } from '../../services/api/dto/qc-report-details.dto';

export class LoadDeliveryDetailsAction {
  static readonly type = '[QC.Report.Details] Load Report Details';

  constructor(public deliveryId: number) {}

  public log(): any {
    return {
      deliveryId: this.deliveryId
    };
  }
}

export class LoadDeliveryDetailsSuccessfulAction {
  static readonly type = '[QC.Report.Details] Load Report Details Successful';

  constructor(public deliveryId: number, public dto: IDeliveryDetailsDto) {}

  public log(): any {
    return {
      deliveryId: this.deliveryId,
      vesselName: this.dto?.vessel?.displayName,
      status: this.dto?.status
    };
  }
}

export class LoadDeliveryDetailsFailedAction {
  static readonly type = '[QC.Report.Details] Load Report Details Failed';

  constructor(public deliveryId: number) {}

  public log(): any {
    return {
      deliveryId: this.deliveryId
    };
  }
}

export class ResetQcReportDetailsStateAction {
  static readonly type = '[QC.Report.Details] Reset';

  constructor() {}
}
