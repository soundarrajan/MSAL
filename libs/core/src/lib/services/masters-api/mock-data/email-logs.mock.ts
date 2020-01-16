import { IEmailLogsItemDto } from "@shiptech/core/services/masters-api/request-response-dtos/email-logs.dto";
import { range } from "lodash";
import { date, internet, random } from "faker";
import { MockStatusLookupEnumMap, StatusLookupEnum } from "@shiptech/core/lookups/known-lookups/status/status-lookup.enum";

export function getMockEmailLogs(n: number): IEmailLogsItemDto[] {
  return range(1, n).map(id => getMockEmailLogsItem(id));
}

export function getMockEmailLogsItem(id: number): IEmailLogsItemDto {
  return {
    id,
    from: internet.email(),
    status: MockStatusLookupEnumMap[StatusLookupEnum.Pending],
    transactionType: {
      id: random.number(),
      name: random.word(),
      displayName: random.word()
    },
    emailTemplateId: random.number(100),
    to: internet.email(),
    cc: internet.email(),
    bcc: internet.email(),
    body: random.word(),
    subject: random.word(),
    sentAt: date.past().toISOString(),
    totalCount: random.number(100),
    modulePathUrl: random.word(),
    clientIpAddress: random.word(),
    userAction: random.word()
  };
}
