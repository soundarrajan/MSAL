import { SurveyStatusEnumMap } from "../../../core/enums/survey-status.enum";
import { IQcEmailLogsItemDto } from "../dto/qc-emails-list-item.dto";
import { keys, range } from 'lodash';
import { internet, random, date } from 'faker';

export function getMockQcEmailLogs(n: number): IQcEmailLogsItemDto[] {
  return range(1, n).map(id => getMockQcEmailLogsItem(id));
}

export function getMockQcEmailLogsItem(id: number): IQcEmailLogsItemDto {
  const surveyStatuses = keys(SurveyStatusEnumMap);
  const surveyStatus = surveyStatuses[random.number({ min: 0, max: surveyStatuses.length - 1 })];

  return {
    id,
    from: internet.email(),
    status: {
      id: random.number(),
      name: SurveyStatusEnumMap[surveyStatus],
      displayName: SurveyStatusEnumMap[surveyStatus],
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
