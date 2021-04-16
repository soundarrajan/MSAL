import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { IReconStatusLookupDto } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.interface';

export interface IToleranceUomDto extends IDisplayLookupDto {
  minTolerance: number;
  maxTolerance: number;
}

export interface IQcReportsListItemDto {
  id: number;
  nbOfMatched: number;
  nbOfMatchedWithinLimit: number;
  nbOfNotMatched: number;
  portCallId: string;
  portName: string;
  vesselName: string;
  surveyDate: Date | string;
  surveyStatus: IReconStatusLookupDto;
  qtyMatchedStatus: IReconStatusLookupDto;
  logBookRobBeforeDelivery: number;
  measuredRobBeforeDelivery: number;
  diffRobBeforeDelivery: number;
  qtyBeforeDeliveryUom: IToleranceUomDto;
  bdnQuantity: number;
  measuredDeliveredQty: number;
  diffDeliveredQty: number;
  qtyDeliveredUom: IToleranceUomDto;
  logBookRobAfterDelivery: number;
  measuredRobAfterDelivery: number;
  diffRobAfterDelivery: number;
  qtyAfterDeliveryUom: IToleranceUomDto;
  logBookSludgeRobBeforeDischarge: number;
  measuredSludgeRobBeforeDischarge: number;
  diffSludgeRobBeforeDischarge: number;
  sludgeDischargedQty: number;
  qtySludgeDischargedUom: IToleranceUomDto;
  comment: string;
  isVerifiedSludgeQty: boolean;
  totalCount: number;
  emailTransactionTypeId: number;
  vesselToWatchFlag: boolean;
}
