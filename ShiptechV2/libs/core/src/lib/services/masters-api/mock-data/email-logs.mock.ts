import { SurveyStatusEnumMap } from "../../../../../../feature/quantity-control/src/lib/core/enums/survey-status.enum";
import { IEmailLogsMastersDto } from "@shiptech/core/services/masters-api/dtos/email-logs.dto";
import { keys, range } from "lodash";
import { date, internet, random } from "faker";

export function getMockEmailLogs(n: number): IEmailLogsMastersDto[] {
  return range(1, n).map(id => getMockEmailLogsItem(id));
}

export function getMockEmailLogsItem(id: number): IEmailLogsMastersDto {
  const surveyStatuses = keys(SurveyStatusEnumMap);
  const surveyStatus = surveyStatuses[random.number({ min: 0, max: surveyStatuses.length - 1 })];

  return {
    id,
    from: internet.email(),
    status: {
      id: random.number(),
      name: SurveyStatusEnumMap[surveyStatus],
      displayName: SurveyStatusEnumMap[surveyStatus]
    },
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
