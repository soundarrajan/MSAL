import * as faker from 'faker';
import * as _ from 'lodash';
import { IQcEventLogListItemDto } from '../dto/qc-event-log-list-item.dto';

export function getMockQcEventsLog(n: number): IQcEventLogListItemDto[] {
  return _.range(1, n).map(id => getMockQcEventsLogItem(id));
}

export function getMockQcEventsLogItem(id: number): IQcEventLogListItemDto {
  const name = faker.internet.email();
  return {
    id: faker.random.number(),
    eventDetails: faker.lorem.lines(faker.random.number({ min: 1, max: 3 })),
    createdOn: faker.date.recent().toISOString(),
    createdBy: { id:1, name: name, displayName: name }
  };
}
