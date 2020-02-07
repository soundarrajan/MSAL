import { date, internet, lorem, random } from 'faker';
import { range } from 'lodash';
import { IQcEventLogListItemDto } from '../dto/qc-event-log-list-item.dto';

export function getMockQcEventsLog(n: number): IQcEventLogListItemDto[] {
  return range(1, n).map(id => getMockQcEventsLogItem(id));
}

export function getMockQcEventsLogItem(id: number): IQcEventLogListItemDto {
  const name = internet.email();
  return {
    id: random.number(),
    eventDetails: lorem.lines(random.number({ min: 1, max: 3 })),
    createdOn: date.recent().toISOString(),
    createdBy: { id: 1, name: name, displayName: name }
  };
}
