import { IQcReportsListItemDto } from '../dto/qc-reports-list-item.dto';
import * as faker from 'faker';
import * as _ from 'lodash';
import { SurveyStatusEnumMap } from '../../../core/enums/survey-status.enum';
import { QuantityMatchStatusEnumMap } from '../../../core/enums/quantity-match-status';

export function getMockQcReportsList(n: number): IQcReportsListItemDto[] {
  return _.range(1, n).map(id => getMockQcReportsListItem(id));
}

export function getMockQcReportsListItem(id: number): IQcReportsListItemDto {
  const quantityBefore: number = faker.random.number(5000);
  const rob: number = faker.random.number(200);
  const sludge: number = faker.random.number(20);
  const surveyStatuses = _.keys(SurveyStatusEnumMap);
  const surveyStatus = surveyStatuses[faker.random.number({ min: 0, max: surveyStatuses.length-1 })];
  const qtyMatchValues = _.keys(QuantityMatchStatusEnumMap);
  const qtyMatch = qtyMatchValues[faker.random.number({ min: 0, max: qtyMatchValues.length-1 })];

  return {
    id,
    nbOfMatched: faker.random.number(100),
    nbOfMatchedWithinLimit: faker.random.number(100),
    nbOfNotMatched: faker.random.number(100),
    portCallId: faker.random.number({ min: Math.pow(10, 15), max: Math.pow(10, 16)-1}).toString(),
    portName: faker.name.lastName(),
    vesselName: faker.random.word(),
    surveyDate: faker.date.past().toISOString(),
    surveyStatus: {
      id: faker.random.number(),
      name: SurveyStatusEnumMap[surveyStatus],
      displayName: SurveyStatusEnumMap[surveyStatus],
    },
    qtyMatchedStatus: {
      id: faker.random.number(),
      name: QuantityMatchStatusEnumMap[qtyMatch],
      displayName: QuantityMatchStatusEnumMap[qtyMatch]
    },
    logBookRobBeforeDelivery: rob * 0.95,
    measuredRobBeforeDelivery: rob * 0.90,
    diffRobBeforeDelivery: rob * 0.7,
    qtyBeforeDeliveryUom: { id: 1, name: 'MT', displayName: 'MT' },
    bdnQuantity: faker.random.number(500),
    measuredDeliveredQty: quantityBefore - rob - sludge,
    diffDeliveredQty: faker.random.number(5),
    qtyDeliveredUom: { id: 1, name: 'MT', displayName: 'MT' },
    logBookRobAfterDelivery: rob * 1.3,
    measuredRobAfterDelivery: rob * 1.1,
    diffRobAfterDelivery: faker.random.number(100),
    qtyAfterDeliveryUom: { id: 1, name: 'MT', displayName: 'MT' },
    logBookSludgeRobBeforeDischarge: rob * 1.1,
    measuredSludgeRobBeforeDischarge: sludge * 0.96,
    diffSludgeRobBeforeDischarge: faker.random.number(500),
    sludgeDischargedQty: faker.random.number(500),
    qtySludgeDischargedUom: { id: 1, name: 'MT', displayName: 'MT' },
    comment: faker.lorem.sentence(),
    isVerifiedSludgeQty: faker.random.boolean(),
    totalCount: faker.random.number(20),
    emailTransactionTypeId: faker.random.number(500)
  };
}
