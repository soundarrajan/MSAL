import {
  IQcReportDetailsDto,
  IQcReportDetailsProductTypeDto
} from '../dto/qc-report-details.dto';
import { mockUomsLookup } from '@shiptech/core/services/masters-api/mock-data/uoms.mock';
import { MockProductsLookup } from '@shiptech/core/services/masters-api/mock-data/products.mock';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { MockVesselsLookup } from '@shiptech/core/services/masters-api/mock-data/vessels.mock';
import { roundDecimals } from '@shiptech/core/utils/math';
import {
  MockStatusLookupEnumMap,
  StatusLookupEnum
} from '@shiptech/core/lookups/known-lookups/status/status-lookup.enum';
import { last, sample, values, range } from 'lodash';
import { Chance } from 'chance';

const chance = new Chance();

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

export function getMockQcReportProductTypes(
  n: number,
  isNew: boolean = false
): IQcReportDetailsProductTypeDto[] {
  return range(1, n).map(id => {
    const product = MockProductsLookup.find(s => s.id === id) ?? {
      ...sample(MockProductsLookup),
      id: id
    };
    return {
      id: product.id, // Note: Only used for BE
      productType: product,
      deliveredQty: {
        bdnQuantity: !isNew
          ? roundDecimals(
              chance.integer({ max: 500 }) + Math.random(),
              mockDecimals
            )
          : undefined,
        measuredQty: !isNew
          ? roundDecimals(
              chance.integer({ max: 400 }) + Math.random(),
              mockDecimals
            )
          : undefined,
        difference: 0
      },
      robAfterDelivery: {
        logBookROB: !isNew
          ? roundDecimals(
              chance.integer({ max: 500 }) + Math.random(),
              mockDecimals
            )
          : undefined,
        measuredROB: !isNew
          ? roundDecimals(
              chance.integer({ max: 500 }) + Math.random(),
              mockDecimals
            )
          : undefined,
        difference: 0
      },
      robBeforeDelivery: {
        logBookROB: !isNew
          ? roundDecimals(
              chance.integer({ max: 500 }) + Math.random(),
              mockDecimals
            )
          : undefined,
        measuredROB: !isNew
          ? roundDecimals(
              chance.integer({ max: 500 }) + Math.random(),
              mockDecimals
            )
          : undefined,
        difference: 0
      }
    };
  });
}

export function getQcReportDetailsCall(id: number): IQcReportDetailsDto {
  const isNew = !id;

  const productTypeCategories = getMockQcReportProductTypes(
    chance.integer({ min: 5, max: 5 }),
    true
  );
  const sludgeProductType = last(productTypeCategories)?.productType;

  if (isNew) {
    return {
      id: 0,
      nbOfClaims: 0,
      nbOfDeliveries: 0,
      hasSentEmail: false,
      status: MockStatusLookupEnumMap[StatusLookupEnum.New],
      uoms: {
        options: mockUomsLookup
      },
      productTypeCategories: productTypeCategories,
      sludgeProductType: sludgeProductType,
      vesselResponses: {
        categories: mockCategoriesLookup
      },
      emailTransactionTypeId: chance.d10()
    };
  }

  return {
    id: id,
    vessel: sample(MockVesselsLookup),
    portCall: {
      portCallId: chance
        .string({ alpha: true, numeric: true, length: 5 })
        .toUpperCase(),
      voyageReference: chance
        .string({ alpha: true, numeric: true, length: 5 })
        .toUpperCase(),
      vesselVoyageDetailId: chance.d100()
    },
    nbOfClaims: chance.d100(),
    nbOfDeliveries: chance.d100(),
    status: sample(values(MockStatusLookupEnumMap)),
    uoms: {
      deliveredQtyUom: sample(mockUomsLookup),
      robAfterDeliveryUom: sample(mockUomsLookup),
      robBeforeDeliveryUom: sample(mockUomsLookup),
      options: mockUomsLookup
    },
    productTypeCategories: productTypeCategories,
    sludgeProductType: sludgeProductType,
    vesselResponses: {
      categories: mockCategoriesLookup,
      bunker: {
        activeCategory: sample(mockCategoriesLookup),
        description: chance.paragraph({ min: 1, max: 10 })
      },
      sludge: {
        activeCategory: sample(mockCategoriesLookup),
        description: chance.paragraph({ min: 1, max: 100000 }),
        sludge: chance.d100() + Math.random(),
        sludgeVerified: chance.bool()
      }
    },
    comments: chance.paragraph({ min: 10, max: 40 }),
    hasSentEmail: chance.bool(),
    emailTransactionTypeId: chance.d100()
  };
}
