import { SurveyStatusEnum } from '../../../core/enums/survey-status.enum';

export interface PortCallListItemDto {
  id: number;
  port: string;
  vesselName: string;
  surveyDate: string;
  surveyStatus: SurveyStatusEnum;
  matchedQuantity: number;
  logBookRobBeforeDelivery: number;
  measuredRobBeforeDelivery: number;
  robBeforeDelivery: number;
  bdnQuantity: number;
  measuredDeliveredQuantity: number;
  deliveredQuantity: number;
  logBookRobAfterDelivery: number;
  measuredRobAfterDelivery: number;
  robAfterDelivery: number;
  logBookSludgeBeforeDischarge: number;
  measuredSludgeRobBeforeDischarge: number;
  sludgeDischargedQuantity: number;
  comment: number;
}
