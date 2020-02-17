import { BaseModel } from '../models/base.sub-state';
import { IQcEventLogListItemDto } from '../../../services/api/dto/qc-event-log-list-item.dto';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

export class QcEventsLogItemStateModel implements IQcEventLogListItemDto {
  createdOn: string;
  createdBy: IDisplayLookupDto;
  eventDetails: string;
  id: number;
  isNew = false;

  constructor(dto: Partial<QcEventsLogItemStateModel> = {}) {
    Object.assign(this, dto);
  }
}

export interface IQcEventsLogItemState extends QcEventsLogItemStateModel {}

export class QcEventsLogStateModel extends BaseModel {
  items: number[] = [];
  deletedItemIds: number[] = [];
  itemsById: Record<number, IQcEventsLogItemState>;
}

export interface IQcEventsLogState extends QcEventsLogStateModel {}
