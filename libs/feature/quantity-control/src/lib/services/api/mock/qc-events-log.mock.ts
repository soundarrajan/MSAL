import * as faker from 'faker';
import * as _ from 'lodash';
import { QcEventLogListItemDto } from '../dto/qc-event-log-list-item.dto';

export function getMockQcEventsLog(n: number): QcEventLogListItemDto[] {
  return _.range(1, n).map(id => getMockQcEventsLogItem(id));
}

export function getMockQcEventsLogItem(id: number): QcEventLogListItemDto {
  return {
    id: faker.random.number(),
    eventDetails: faker.lorem.lines(faker.random.number({ min: 1, max: 3 })),
    created: faker.date.recent().toISOString(),
    createdBy: faker.internet.email()
  };
}
