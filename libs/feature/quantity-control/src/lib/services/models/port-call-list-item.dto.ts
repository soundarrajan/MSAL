export interface PortCallListItemDto {
  id: number;
  port: string;
  vesselName: string;
  surveyDate: string;
  surveyStatus: number;
  matchedQuantity: number;
  logBookRob: number;
  measuredRob: number;
  // TODO: Can we compute these prop?
  // robBeforeDelivery: number;
  // uomId: number;
  bdnQuantity: number;


}
