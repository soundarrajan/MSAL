import { QcSurveyHistoryListItemDto } from '../api/dto/qc-survey-history-list-item.dto';
import { SurveyStatusLabelEnum } from '../../core/enums/survey-status.enum';

export class QcSurveyHistoryListItemModel implements QcSurveyHistoryListItemDto{
  id: number;
  portCallId: string;
  port: string;
  vesselName: string;
  surveyDate: string;
  surveyStatus: SurveyStatusLabelEnum;
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

  constructor(dto: QcSurveyHistoryListItemDto) {
    Object.assign(this, dto);
  }
}
