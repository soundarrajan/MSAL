import { PortCallListItemDto } from '../api/dto/port-call-list-item.dto';

export class PortCallListItemModel {
  id: number;
  port: string;
  vesselName: string;
  surveyDate: string;
  surveyStatus: string;
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

  constructor(dto: PortCallListItemDto) {
    Object.assign(this, dto);
  }
}
