import { IQcReportsListItemDto } from '../dto/qc-reports-list-item.dto';
import * as faker from 'faker';
import * as _ from 'lodash';
import { MockStatusLookupEnumMap } from '@shiptech/core/lookups/known-lookups/status/status-lookup.enum';
import { MockReconStatusLookupEnumMap } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.enum';

export function getMockQcReportsList(n: number): IQcReportsListItemDto[] {
  return _.range(1, n).map(id => getMockQcReportsListItem(id));
}

export function getMockQcReportsListItem(id: number): IQcReportsListItemDto {
  const quantityBefore: number = faker.random.number(5000);
  const rob: number = faker.random.number(200);
  const sludge: number = faker.random.number(20);

  return {
    id,
    nbOfMatched: faker.random.number(100),
    nbOfMatchedWithinLimit: faker.random.number(100),
    nbOfNotMatched: faker.random.number(100),
    portCallId: faker.random.number({ min: Math.pow(10, 15), max: Math.pow(10, 16) - 1 }).toString(),
    portName: faker.name.lastName(),
    vesselName: faker.random.word(),
    surveyDate: faker.date.past().toISOString(),
    surveyStatus: _.sample(_.values(MockStatusLookupEnumMap)),
    qtyMatchedStatus: _.sample(_.values(MockReconStatusLookupEnumMap)),
    logBookRobBeforeDelivery: rob * 0.95,
    measuredRobBeforeDelivery: rob * 0.90,
    diffRobBeforeDelivery: rob * 0.7,
    qtyBeforeDeliveryUom: { id: 1, name: 'MT', displayName: 'MT', minTolerance: 2, maxTolerance: 10 },
    bdnQuantity: faker.random.number(500),
    measuredDeliveredQty: quantityBefore - rob - sludge,
    diffDeliveredQty: faker.random.number(5),
    qtyDeliveredUom: { id: 1, name: 'MT', displayName: 'MT', minTolerance: 2, maxTolerance: 10  },
    logBookRobAfterDelivery: rob * 1.3,
    measuredRobAfterDelivery: rob * 1.1,
    diffRobAfterDelivery: faker.random.number(100),
    qtyAfterDeliveryUom: { id: 1, name: 'MT', displayName: 'MT', minTolerance: 2, maxTolerance: 10  },
    logBookSludgeRobBeforeDischarge: rob * 1.1,
    measuredSludgeRobBeforeDischarge: sludge * 0.96,
    diffSludgeRobBeforeDischarge: faker.random.number(500),
    sludgeDischargedQty: faker.random.number(500),
    qtySludgeDischargedUom: { id: 1, name: 'MT', displayName: 'MT', minTolerance: 2, maxTolerance: 10  },
    comment: faker.lorem.sentence(),
    isVerifiedSludgeQty: faker.random.boolean(),
    totalCount: faker.random.number(20),
    emailTransactionTypeId: faker.random.number(500)
  };
}
