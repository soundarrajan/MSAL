import { QcProductTypeListItemStateModel } from '../../../../../../store/report/details/qc-product-type-list-item-state.model';
import { Injectable } from '@angular/core';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { QcReportState } from '../../../../../../store/report/qc-report.state';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { IDeliveryTenantSettings } from '../../../../../../core/settings/delivery-tenant-settings';
import { TenantSettingsModuleName } from '@shiptech/core/store/states/tenant/tenant-settings.interface';
import { roundDecimals } from '@shiptech/core/utils/math';
import { ReconStatusLookup } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.service';
import { IReconStatusLookupDto } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.interface';

@Injectable()
export class ProductTypeListItemViewModelFactory {
  private deliverySettings: IDeliveryTenantSettings;
  private readonly quantityPrecision: number;

  constructor(
    private tenantSettingsService: TenantSettingsService,
    private reconStatusLookups: ReconStatusLookup
  ) {
    const generalTenantSettings = tenantSettingsService.getGeneralTenantSettings();

    this.quantityPrecision =
      generalTenantSettings.defaultValues.quantityPrecision;
    this.deliverySettings = tenantSettingsService.getModuleTenantSettings<
      IDeliveryTenantSettings
    >(TenantSettingsModuleName.Delivery);
  }

  build(
    itemState: QcProductTypeListItemStateModel
  ): ProductTypeListItemViewModel {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return new ProductTypeListItemViewModel(
      itemState,
      this.deliverySettings.robTolerance,
      this.deliverySettings.maxToleranceLimit,
      this.quantityPrecision,
      this.reconStatusLookups
    );
  }
}

export class ProductTypeListItemViewModel {
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

  robBeforeDiffStatus: IReconStatusLookupDto;
  deliveredDiffStatus: IReconStatusLookupDto;
  robAfterDiffStatus: IReconStatusLookupDto;

  isSludge: boolean;

  constructor(
    item: QcProductTypeListItemStateModel,
    robTolerance: number,
    bdnTolerance: number,
    private quantityPrecision: number,
    reconStatusLookups: ReconStatusLookup
  ) {
    this.productType = item.productType;
    this.productType = item.productType;
    this.isSludge = item.isSludge;

    this.robBeforeDeliveryLogBookROB = roundDecimals(
      item.robBeforeDeliveryLogBookROB,
      quantityPrecision
    );
    this.robBeforeDeliveryMeasuredROB = roundDecimals(
      item.robBeforeDeliveryMeasuredROB,
      quantityPrecision
    );
    this.deliveredQuantityBdnQty = roundDecimals(
      item.deliveredQuantityBdnQty,
      quantityPrecision
    );
    this.measuredDeliveredQty = roundDecimals(
      item.measuredDeliveredQty,
      quantityPrecision
    );
    this.robAfterDeliveryLogBookROB = roundDecimals(
      item.robAfterDeliveryLogBookROB,
      quantityPrecision
    );
    this.robAfterDeliveryMeasuredROB = roundDecimals(
      item.robAfterDeliveryMeasuredROB,
      quantityPrecision
    );

    this.robBeforeDiffStatus = reconStatusLookups.toReconStatus(
      QcReportState.getMatchStatusForRobBeforeDiffAndDeliveredDiff(
        this.robBeforeDeliveryLogBookROB,
        this.robBeforeDeliveryMeasuredROB,
        robTolerance
      )
    );
    this.deliveredDiffStatus = reconStatusLookups.toReconStatus(
      QcReportState.getMatchStatusForRobBeforeDiffAndDeliveredDiff(
        this.deliveredQuantityBdnQty,
        this.measuredDeliveredQty,
        bdnTolerance
      )
    );
    this.robAfterDiffStatus = reconStatusLookups.toReconStatus(
      !this.isSludge
        ? QcReportState.getMatchStatusForRobAfterDiff(
            this.robAfterDeliveryLogBookROB,
            this.robAfterDeliveryMeasuredROB,
            0
          )
        : undefined
    );

    this.robBeforeDiff = this.safeDiff(
      this.robBeforeDeliveryLogBookROB,
      this.robBeforeDeliveryMeasuredROB
    );
    this.deliveredDiff = this.safeDiff(
      this.deliveredQuantityBdnQty,
      this.measuredDeliveredQty
    );
    this.robAfterDiff = this.safeDiff(
      this.robAfterDeliveryLogBookROB,
      this.robAfterDeliveryMeasuredROB
    );
  }

  private safeDiff(left: number, right: number): number {
    if (
      left === null ||
      left === undefined ||
      right === null ||
      right === undefined
    )
      return undefined;

    return roundDecimals(
      roundDecimals(left ?? 0, this.quantityPrecision) - (right ?? 0),
      this.quantityPrecision
    );
  }
}
