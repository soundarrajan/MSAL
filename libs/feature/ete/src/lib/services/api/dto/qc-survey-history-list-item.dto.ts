import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { IStatusLookupDto } from '@shiptech/core/lookups/known-lookups/status/status-lookup.interface';
import { IReconStatusLookupDto } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.interface';

export interface IQcSurveyHistoryListItemDto {
  id: number;
  nbOfMatched: number;
  nbOfMatchedWithinLimit: number;
  nbOfNotMatched: number;
  portCallId: string;
  portName: string;
  vesselName: string;
  surveyDate: Date | string;
  surveyStatus: IStatusLookupDto;
  qtyMatchedStatus: IReconStatusLookupDto;
  logBookRobBeforeDelivery: number;
  measuredRobBeforeDelivery: number;
  diffRobBeforeDelivery: number;
  qtyBeforeDeliveryUom: IDisplayLookupDto;
  bdnQuantity: number;
  measuredDeliveredQty: number;
  diffDeliveredQty: number;
  qtyDeliveredUom: IDisplayLookupDto;
  logBookRobAfterDelivery: number;
  measuredRobAfterDelivery: number;
  diffRobAfterDelivery: number;
  qtyAfterDeliveryUom: IDisplayLookupDto;
  logBookSludgeRobBeforeDischarge: number;
  measuredSludgeRobBeforeDischarge: number;
  diffSludgeRobBeforeDischarge: number;
  sludgeDischargedQty: number;
  qtySludgeDischargedUom: IDisplayLookupDto;
  comment: string;
  isVerifiedSludgeQty: boolean;
}
