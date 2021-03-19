import { BaseModel } from '../models/base.sub-state';
import { IQcEventLogListItemDto } from '../../../services/api/dto/qc-event-log-list-item.dto';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import _ from 'lodash';

export class QcEventsLogItemStateModel implements IQcEventLogListItemDto {
  createdOn: Date | string;
  createdBy: IDisplayLookupDto;
  eventDetails: string;
  id: number;
  isNew = false;

  constructor(dto: Partial<QcEventsLogItemStateModel> = {}) {
    const  decodeHtmlEntity = function(str) {
      return str.replace(/&#(\d+);/g, function(match, dec) {
          return String.fromCharCode(dec);
      });
    };
    if (dto.eventDetails) {
      dto.eventDetails = decodeHtmlEntity(_.unescape(dto.eventDetails));
    }
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
