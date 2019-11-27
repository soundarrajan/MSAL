import { BaseModel } from '../models/base.sub-state';
import { QcEventLogListItemDto } from '../../../services/api/dto/qc-event-log-list-item.dto';

export class QcEventsLogItemStateModel implements QcEventLogListItemDto {
  created: string;
  createdBy: string;
  eventDetails: string;
  id: number;
  isNew = false;

  constructor(dto: Partial<QcEventsLogItemStateModel> = {}) {
    Object.assign(this, dto);
  }
}

export interface IQcEventsLogItemState extends QcEventsLogItemStateModel {
}

export class QcEventsLogStateModel extends BaseModel {
  items: number[];
  itemsById: Record<number, IQcEventsLogItemState>;
}

export interface IQcEventsLogState extends QcEventsLogStateModel {
}
