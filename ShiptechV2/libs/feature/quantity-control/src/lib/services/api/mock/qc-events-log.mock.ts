import { range } from 'lodash';
import { IQcEventLogListItemDto } from '../dto/qc-event-log-list-item.dto';
import { Chance } from 'chance';

const chance = new Chance();

export function getMockQcEventsLogItem(id: number): IQcEventLogListItemDto {
  const name = chance.email();
  return {
    id: id,
    eventDetails: chance.word({ length: chance.d4() }),
    createdOn: chance.date().toISOString(),
    createdBy: { id: 1, name: name, displayName: name }
  };
}

export function getMockQcEventsLog(n: number): IQcEventLogListItemDto[] {
  return range(1, n).map(id => getMockQcEventsLogItem(id));
}
