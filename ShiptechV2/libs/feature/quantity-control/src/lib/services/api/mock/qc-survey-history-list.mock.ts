import * as faker from 'faker';
import * as _ from 'lodash';
import { SurveyStatusLabelEnum } from '../../../core/enums/survey-status.enum';
import { QcSurveyHistoryListItemDto } from '../dto/qc-survey-history-list-item.dto';


export function getMockQcSurveyHistoryList(n: number): QcSurveyHistoryListItemDto[] {
  return _.range(1, n).map(id => getMockQcSurveyHistoryListItem(id));
}

export function getMockQcSurveyHistoryListItem(id: number): QcSurveyHistoryListItemDto {
  const quantityBefore: number = faker.random.number(5000);
  const rob: number = faker.random.number(200);
  const sludge: number = faker.random.number(20);

  return {
    id,
    portCallId: faker.finance.bitcoinAddress(),
    port: faker.random.alphaNumeric(5),
    vesselName: faker.random.word(),
    surveyDate: faker.date.past().toString(),
    surveyStatus: <SurveyStatusLabelEnum>faker.random.arrayElement(['New', 'Verified', 'Pending']),

    matchedQuantity: quantityBefore,
    measuredDeliveredQuantity: quantityBefore - rob - sludge,
    deliveredQuantity: quantityBefore - sludge,

    logBookRobBeforeDelivery: rob * 0.95,
    measuredRobBeforeDelivery: rob * 0.90,
    robBeforeDelivery: rob,

    bdnQuantity: faker.random.number(500),

    logBookRobAfterDelivery: rob * 0.8,
    measuredRobAfterDelivery: rob * 0.85,
    robAfterDelivery: rob * 0.8,

    logBookSludgeBeforeDischarge: sludge,
    measuredSludgeRobBeforeDischarge: sludge * 1.1,
    sludgeDischargedQuantity: sludge * 1.2,

    comment: faker.random.number(100)
  };
}
