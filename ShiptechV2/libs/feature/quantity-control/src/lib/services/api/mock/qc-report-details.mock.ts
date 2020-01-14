import { IQcReportDetailsDto, IQcReportDetailsProductTypeDto } from '../dto/qc-report-details.dto';
import * as _ from 'lodash';
import { mockUomsLookup } from '@shiptech/core/services/masters-api/mock-data/uoms.mock';
import { MockProductsLookup } from '@shiptech/core/services/masters-api/mock-data/products.mock';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { MockVesselsLookup } from '@shiptech/core/services/masters-api/mock-data/vessels.mock';
import { roundDecimals } from '@shiptech/core/utils/math';
import { MockStatusLookupEnumMap, StatusLookupEnum } from '@shiptech/core/lookups/known-lookups/status/status-lookup.enum';
import {random} from "faker";

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

  const productTypeCategories = getMockQcReportProductTypes(faker.random.number({ min: 5, max: 5 }), true);
  const sludgeProductType = _.last(productTypeCategories)?.productType;

  if (isNew) {
    return {
      id: 0,
      nbOfClaims: 0,
      nbOfDeliveries: 0,
      status: MockStatusLookupEnumMap[StatusLookupEnum.New],
      uoms: {
        options: mockUomsLookup
      },
      productTypeCategories: productTypeCategories,
      sludgeProductType: sludgeProductType,
      vesselResponses: {
        categories: mockCategoriesLookup
      },
      emailTransactionTypeId: faker.random.number(),
      entityTransactionType: {
        id: random.number(),
        name: faker.random.word(),
        displayName: faker.random.word()
      }
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
    status: _.sample(_.values(MockStatusLookupEnumMap)),
    uoms: {
      deliveredQtyUom: _.sample(mockUomsLookup),
      robAfterDeliveryUom: _.sample(mockUomsLookup),
      robBeforeDeliveryUom: _.sample(mockUomsLookup),
      options: mockUomsLookup
    },
    productTypeCategories: productTypeCategories,
    sludgeProductType: sludgeProductType,
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
    emailTransactionTypeId: faker.random.number(),
    entityTransactionType: {
      id: random.number(),
      name: faker.random.word(),
      displayName: faker.random.word()
    }
  };
}

export function getMockQcReportProductTypes(n: number, isNew: boolean = false): IQcReportDetailsProductTypeDto[] {
  return _.range(1, n).map(id => {
    const product = MockProductsLookup.find(s => s.id === id) ?? { ..._.sample(MockProductsLookup), id: id };
    return {
      id: product.id, // Note: Only used for BE
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
