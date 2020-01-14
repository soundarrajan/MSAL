import { IEmailLogsItemDto } from "@shiptech/core/services/masters-api/request-response-dtos/email-logs.dto";
import { range, keys } from "lodash";
import { date, internet, random } from "faker";
import { MockStatusLookupEnumMap, StatusLookupEnum } from "@shiptech/core/lookups/known-lookups/status/status-lookup.enum";

export function getMockEmailLogs(n: number): IEmailLogsItemDto[] {
  return range(1, n).map(id => getMockEmailLogsItem(id));
}

export function getMockEmailLogsItem(id: number): IEmailLogsItemDto {
  const surveyStatuses = keys(StatusLookupEnum);
  const surveyStatus = surveyStatuses[random.number({ min: 0, max: surveyStatuses.length - 1 })];

  return {
    id,
    from: internet.email(),
    status: MockStatusLookupEnumMap[surveyStatus],
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
    isDeleted: random.boolean(),
    modulePathUrl: random.word(),
    clientIpAddress: random.word(),
    userAction: random.word()
  };
}
