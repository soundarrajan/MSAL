import { Injectable } from "@angular/core";
import { Store } from "@ngxs/store";
import { TenantSettingsService } from "@shiptech/core/services/tenant-settings/tenant-settings.service";
import { QcEmailLogsGridViewModel } from "./qc-email-logs-grid-view-model.service";
import { QcReportService } from "../../../../services/qc-report.service";

@Injectable()
export class QcEmailLogsViewModel {
  public readonly quantityPrecision: number = 3;

  constructor(
    public gridViewModel: QcEmailLogsGridViewModel,
    private store: Store,
    private detailsService: QcReportService,
    private viewModelBuilder: QcEmailLogsGridViewModel,
    private tenantSettings: TenantSettingsService
  ) {

    const generalTenantSettings = tenantSettings.getGeneralTenantSettings();
    this.quantityPrecision = generalTenantSettings.defaultValues.quantityPrecision;

  }
}
