import { IEmailLogsItemDto } from '@shiptech/core/services/masters-api/request-response-dtos/email-logs.dto';
import { range } from 'lodash';
import {
  MockStatusLookupEnumMap,
  StatusLookupEnum
} from '@shiptech/core/lookups/known-lookups/status/status-lookup.enum';
import { Chance } from 'chance';

const chance = new Chance();

export function getMockEmailLogsItem(id: number): IEmailLogsItemDto {
  return {
    id,
    from: chance.name(),
    status: MockStatusLookupEnumMap[StatusLookupEnum.Pending],
    transactionType: {
      id: chance.d100(),
      name: chance.name(),
      displayName: chance.name()
    },
    emailTemplateId: chance.d100(),
    to: chance.email(),
    cc: chance.email(),
    bcc: chance.email(),
    body: chance.word(),
    subject: chance.word(),
    sentAt: chance.date().toISOString()
  };
}

export function getMockEmailLogs(n: number): IEmailLogsItemDto[] {
  return range(1, n).map(id => getMockEmailLogsItem(id));
}
