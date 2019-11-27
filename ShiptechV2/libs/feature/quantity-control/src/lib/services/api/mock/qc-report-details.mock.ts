import { IQcReportDetailsDto, IQcReportDetailsProductTypeDto } from '../dto/qc-report-details.dto';
import * as faker from 'faker';
import { QcReportStatusEnum, QcReportStatusLabelEnum } from '../../../core/enums/qc-report-status.enum';
import * as _ from 'lodash';
import { mockUomsLookup } from '@shiptech/core/services/lookups-api/mock-data/uoms.mock';
import { MockProductsLookup } from '@shiptech/core/services/lookups-api/mock-data/products.mock';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

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
  return {
    id: id,
    vesselId: faker.random.number(),
    voyageReference: faker.random.alphaNumeric(9).toUpperCase(),
    portCallId: faker.finance.bitcoinAddress(),
    vesselName: faker.commerce.color(),
    nbOfClaims: faker.random.number(),
    nbOfDeliveries: faker.random.number(),
    status: _.sample(PortCallStatuses),
    uoms: {
      deliveredQtyUom: _.sample(mockUomsLookup),
      robAfterDeliveryUom: _.sample(mockUomsLookup),
      robBeforeDeliveryUom: _.sample(mockUomsLookup),
      options: mockUomsLookup
    },
    productTypeCategories: getMockQcReportProductTypes(faker.random.number({ min: 5, max: 30 })),
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
    comment: faker.random.words(faker.random.number({ min: 10, max: 40 }))
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

export function getMockQcReportProductTypes(n: number): IQcReportDetailsProductTypeDto[] {
  return _.range(1, n).map(id => {
    const product = _.sample(MockProductsLookup);
    return {
      id,
      productType: product,
      deliveredQty: {
        bdnQuantity: faker.random.number(500) + Math.random(),
        measuredQty: faker.random.number(400) + Math.random(),
        difference: 0
      },
      robAfterDelivery: {
        logBookROB: faker.random.number(500) + Math.random(),
        measuredROB: faker.random.number(500) + Math.random(),
        difference: 0
      },
      robBeforeDelivery: {
        logBookROB: faker.random.number(500) + Math.random(),
        measuredROB: faker.random.number(500) + Math.random(),
        difference: 0
      }
    };
  });
}
