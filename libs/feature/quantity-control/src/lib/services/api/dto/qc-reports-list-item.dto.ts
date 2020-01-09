import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

export interface IQcReportsListItemDto {
  id: number;
  nbOfMatched: number;
  nbOfMatchedWithinLimit: number;
  nbOfNotMatched: number;
  portCallId: string;
  portName: string;
  vesselName: string;
  surveyDate: Date | string;
  surveyStatus: IDisplayLookupDto;
  qtyMatchedStatus: IDisplayLookupDto;
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
  totalCount: number;
  emailTransactionTypeId: number;
  reportId: number;
}
