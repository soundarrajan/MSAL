import { IQcReportsListItemDto } from '../dto/qc-reports-list-item.dto';
import { date, lorem, name, random } from 'faker';
import { range, sample, values } from 'lodash';
import { MockStatusLookupEnumMap } from '@shiptech/core/lookups/known-lookups/status/status-lookup.enum';
import { MockReconStatusLookupEnumMap } from '@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.enum';

export function getMockQcReportsList(n: number): IQcReportsListItemDto[] {
  return range(1, n).map(id => getMockQcReportsListItem(id));
}

export function getMockQcReportsListItem(id: number): IQcReportsListItemDto {
  const quantityBefore: number = random.number(5000);
  const rob: number = random.number(200);
  const sludge: number = random.number(20);

  return {
    id,
    nbOfMatched: random.number(100),
    nbOfMatchedWithinLimit: random.number(100),
    nbOfNotMatched: random.number(100),
    portCallId: random.number({ min: Math.pow(10, 15), max: Math.pow(10, 16) - 1 }).toString(),
    portName: name.lastName(),
    vesselName: random.word(),
    surveyDate: date.past().toISOString(),
    surveyStatus: sample(values(MockStatusLookupEnumMap)),
    qtyMatchedStatus: sample(values(MockReconStatusLookupEnumMap)),
    logBookRobBeforeDelivery: rob * 0.95,
    measuredRobBeforeDelivery: rob * 0.90,
    diffRobBeforeDelivery: rob * 0.7,
    qtyBeforeDeliveryUom: { id: 1, name: 'MT', displayName: 'MT', minTolerance: 2, maxTolerance: 10 },
    bdnQuantity: random.number(500),
    measuredDeliveredQty: quantityBefore - rob - sludge,
    diffDeliveredQty: random.number(5),
    qtyDeliveredUom: { id: 1, name: 'MT', displayName: 'MT', minTolerance: 2, maxTolerance: 10 },
    logBookRobAfterDelivery: rob * 1.3,
    measuredRobAfterDelivery: rob * 1.1,
    diffRobAfterDelivery: random.number(100),
    qtyAfterDeliveryUom: { id: 1, name: 'MT', displayName: 'MT', minTolerance: 2, maxTolerance: 10 },
    logBookSludgeRobBeforeDischarge: rob * 1.1,
    measuredSludgeRobBeforeDischarge: sludge * 0.96,
    diffSludgeRobBeforeDischarge: random.number(500),
    sludgeDischargedQty: random.number(500),
    qtySludgeDischargedUom: { id: 1, name: 'MT', displayName: 'MT', minTolerance: 2, maxTolerance: 10 },
    comment: lorem.sentence(),
    isVerifiedSludgeQty: random.boolean(),
    totalCount: random.number(20),
    emailTransactionTypeId: random.number(500)
  };
}
