import { QcReportsListItemDto } from '../dto/qc-reports-list-item.dto';
import * as faker from 'faker';
import * as _ from 'lodash';
import { SurveyStatusEnum } from '../../../core/enums/survey-status.enum';


export function getMockQcReportsList(n: number): QcReportsListItemDto[] {
  return _.range(1, n).map(id => getMockQcReportsListItem(id));
}

export function getMockQcReportsListItem(id: number): QcReportsListItemDto {
  const quantityBefore: number = faker.random.number(5000);
  const rob: number = faker.random.number(200);
  const sludge: number = faker.random.number(20);

  return {
    id,
    portCallId: faker.internet.mac(),
    port: faker.random.alphaNumeric(5),
    vesselName: faker.random.word(),
    surveyDate: faker.date.past().toString(),
    surveyStatus: <SurveyStatusEnum>faker.random.arrayElement(['New', 'Verified', 'Pending']),

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
