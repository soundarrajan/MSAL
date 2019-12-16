import { IQcReportDetailsDto, IQcReportDetailsProductTypeDto } from '../dto/qc-report-details.dto';
import * as faker from 'faker';
import { QcReportStatusEnum, QcReportStatusLabelEnum } from '../../../core/enums/qc-report-status.enum';
import * as _ from 'lodash';
import { mockUomsLookup } from '@shiptech/core/services/masters-api/mock-data/uoms.mock';
import { MockProductsLookup } from '@shiptech/core/services/masters-api/mock-data/products.mock';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { MockVesselsLookup } from '@shiptech/core/services/masters-api/mock-data/vessels.mock';
import { roundDecimals } from '@shiptech/core/utils/math';

const mockDecimals = 3;

export const mockCategoriesLookup: IDisplayLookupDto[] = [
  {
    id: 1,
    name: 'GeneralEmail',
    displayName: 'General Email'
  },
  {
    id: 2,
    name: 'Complaint',
    displayName: 'Complaint'
  }
];

export function getQcReportDetailsCall(id: number): IQcReportDetailsDto {
  const isNew = !id;

  if (isNew) {
    return {
      id: 0,
      nbOfClaims: 0,
      nbOfDeliveries: 0,
      status: {
        id: 1,
        name: QcReportStatusEnum.New,
        displayName: QcReportStatusLabelEnum.New
      },
      uoms: {
        options: mockUomsLookup
      },
      productTypeCategories: getMockQcReportProductTypes(faker.random.number({ min: 5, max: 5 }), true),
      vesselResponses: {
        categories: mockCategoriesLookup
      },
      emailTransactionTypeId: faker.random.number()
    };
  }

  return {
    id: id,
    vessel: _.sample(MockVesselsLookup),
    portCall: {
      portCallId: faker.random.alphaNumeric(5).toUpperCase(),
      voyageReference: faker.random.alphaNumeric(9).toUpperCase(),
      vesselVoyageDetailId: faker.random.number()
    },
    nbOfClaims: faker.random.number(),
    nbOfDeliveries: faker.random.number(),
    status: _.sample(PortCallStatuses),
    uoms: {
      deliveredQtyUom: _.sample(mockUomsLookup),
      robAfterDeliveryUom: _.sample(mockUomsLookup),
      robBeforeDeliveryUom: _.sample(mockUomsLookup),
      options: mockUomsLookup
    },
    productTypeCategories: getMockQcReportProductTypes(faker.random.number({ min: 5, max: 10 })),
    vesselResponses: {
      categories: mockCategoriesLookup,
      bunker: {
        activeCategory: _.sample(mockCategoriesLookup),
        description: faker.lorem.paragraph(faker.random.number({ min: 1, max: 10 }))
      },
      sludge: {
        activeCategory: _.sample(mockCategoriesLookup),
        description: faker.lorem.paragraph(faker.random.number({ min: 1, max: 10 })),
        sludge: faker.random.number({ min: 1, max: 10 }) + Math.random(),
        sludgeVerified: faker.random.boolean()
      }
    },
    comments: faker.random.words(faker.random.number({ min: 10, max: 40 })),
    hasEmailSent: faker.random.boolean(),
    emailTransactionTypeId: faker.random.number()
  };
}

export const PortCallStatuses: IDisplayLookupDto<number, QcReportStatusEnum>[] = [
  {
    id: 1,
    name: QcReportStatusEnum.New,
    displayName: QcReportStatusLabelEnum.New
  },
  {
    id: 2,
    name: QcReportStatusEnum.Pending,
    displayName: QcReportStatusLabelEnum.Pending
  },
  {
    id: 3,
    name: QcReportStatusEnum.Verify,
    displayName: QcReportStatusLabelEnum.Verify
  }
];

export function getMockQcReportProductTypes(n: number, isNew: boolean = false): IQcReportDetailsProductTypeDto[] {
  return _.range(1, n).map(id => {
    const product = _.sample(MockProductsLookup);
    return {
      id,
      productType: product,
      deliveredQty: {
        bdnQuantity: !isNew ? roundDecimals(faker.random.number(500) + Math.random(), mockDecimals) : undefined,
        measuredQty: !isNew ? roundDecimals(faker.random.number(400) + Math.random(), mockDecimals) : undefined,
        difference: 0
      },
      robAfterDelivery: {
        logBookROB: !isNew ? roundDecimals(faker.random.number(500) + Math.random(), mockDecimals) : undefined,
        measuredROB: !isNew ? roundDecimals(faker.random.number(500) + Math.random(), mockDecimals) : undefined,
        difference: 0
      },
      robBeforeDelivery: {
        logBookROB: !isNew ? roundDecimals(faker.random.number(500) + Math.random(), mockDecimals) : undefined,
        measuredROB: !isNew ? roundDecimals(faker.random.number(500) + Math.random(), mockDecimals) : undefined,
        difference: 0
      }
    };
  });
}
