import { QcProductTypeListItemStateModel } from '../../../../../../store/report/details/qc-product-type-list-item-state.model';
import { Injectable } from '@angular/core';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { QcReportState } from '../../../../../../store/report/qc-report.state';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { IDeliveryTenantSettings } from '../../../../../../core/settings/delivery-tenant-settings';
import { TenantSettingsModuleName } from '@shiptech/core/store/states/tenant/tenant-settings.interface';

@Injectable()
export class ProductTypeListItemViewModelFactory {
  private deliverySettings: IDeliveryTenantSettings;

  constructor(private tenantSettingsService: TenantSettingsService) {

    this.deliverySettings = tenantSettingsService.getModuleTenantSettings<IDeliveryTenantSettings>(TenantSettingsModuleName.Delivery);
  }

  build(itemState: QcProductTypeListItemStateModel): ProductTypeListItemViewModel {
    return new ProductTypeListItemViewModel(itemState, this.deliverySettings.minToleranceLimit, this.deliverySettings.maxToleranceLimit);
  }
}

export class ProductTypeListItemViewModel {
  id: number;
  productType: IDisplayLookupDto;
  robBeforeDeliveryLogBookROB: number;
  robBeforeDeliveryMeasuredROB: number;
  deliveredQuantityBdnQty: number;
  measuredDeliveredQty: number;
  robAfterDeliveryLogBookROB: number;
  robAfterDeliveryMeasuredROB: number;

  robBeforeDiff: number;
  deliveredDiff: number;
  robAfterDiff: number;

  robBeforeDiffStatus: IDisplayLookupDto;
  deliveredDiffStatus: IDisplayLookupDto;
  robAfterDiffStatus: IDisplayLookupDto;


  constructor(item: QcProductTypeListItemStateModel, minToleranceLimit: number, maxToleranceLimit: number) {
    this.id = item.id;
    this.productType = item.productType;

    this.robBeforeDeliveryLogBookROB = item.robBeforeDeliveryLogBookROB;
    this.robBeforeDeliveryMeasuredROB = item.robBeforeDeliveryMeasuredROB;
    this.deliveredQuantityBdnQty = item.deliveredQuantityBdnQty;
    this.measuredDeliveredQty = item.measuredDeliveredQty;
    this.robAfterDeliveryLogBookROB = item.robAfterDeliveryLogBookROB;
    this.robAfterDeliveryMeasuredROB = item.robAfterDeliveryMeasuredROB;

    this.robBeforeDiffStatus = QcReportState.getMatchStatus(this.robBeforeDeliveryLogBookROB, this.robBeforeDeliveryMeasuredROB, minToleranceLimit, maxToleranceLimit);
    this.deliveredDiffStatus = QcReportState.getMatchStatus(this.deliveredQuantityBdnQty, this.measuredDeliveredQty, minToleranceLimit, maxToleranceLimit);
    this.robAfterDiffStatus = QcReportState.getMatchStatus(this.robAfterDeliveryLogBookROB, this.robAfterDeliveryMeasuredROB, minToleranceLimit, maxToleranceLimit);

    this.robBeforeDiff = this.safeDiff(this.robBeforeDeliveryLogBookROB, this.robBeforeDeliveryMeasuredROB);
    this.deliveredDiff= this.safeDiff(this.deliveredQuantityBdnQty, this.measuredDeliveredQty);
    this.robAfterDiff= this.safeDiff(this.robAfterDeliveryLogBookROB, this.robAfterDeliveryMeasuredROB);
  }

  private safeDiff(left: number, right: number): number {
    if (left === null || left === undefined || right === null || right === undefined)
      return undefined;

    return left - right;
  }
}
