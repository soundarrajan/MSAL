import { IQcReportDetailsDto, IQcReportDetailsProductTypeDto } from "../dto/qc-report-details.dto";
import { mockUomsLookup } from "@shiptech/core/services/masters-api/mock-data/uoms.mock";
import { MockProductsLookup } from "@shiptech/core/services/masters-api/mock-data/products.mock";
import { IDisplayLookupDto } from "@shiptech/core/lookups/display-lookup-dto.interface";
import { MockVesselsLookup } from "@shiptech/core/services/masters-api/mock-data/vessels.mock";
import { roundDecimals } from "@shiptech/core/utils/math";
import { MockStatusLookupEnumMap, StatusLookupEnum } from "@shiptech/core/lookups/known-lookups/status/status-lookup.enum";
import { random, lorem } from "faker";
import { last, sample, values, range } from 'lodash';

const mockDecimals = 3;

export const mockCategoriesLookup: IDisplayLookupDto[] = [
  {
    id: 1,
    name: "GeneralEmail",
    displayName: "General Email"
  },
  {
    id: 2,
    name: "Complaint",
    displayName: "Complaint"
  }
];

export function getQcReportDetailsCall(id: number): IQcReportDetailsDto {
  const isNew = !id;

  const productTypeCategories = getMockQcReportProductTypes(random.number({ min: 5, max: 5 }), true);
  const sludgeProductType = last(productTypeCategories)?.productType;

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
      emailTransactionTypeId: random.number()
    };
  }

  return {
    id: id,
    vessel: sample(MockVesselsLookup),
    portCall: {
      portCallId: random.alphaNumeric(5).toUpperCase(),
      voyageReference: random.alphaNumeric(9).toUpperCase(),
      vesselVoyageDetailId: random.number()
    },
    nbOfClaims: random.number(),
    nbOfDeliveries: random.number(),
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
        description: lorem.paragraph(random.number({ min: 1, max: 10 }))
      },
      sludge: {
        activeCategory: sample(mockCategoriesLookup),
        description: lorem.paragraph(random.number({ min: 1, max: 10 })),
        sludge: random.number({ min: 1, max: 10 }) + Math.random(),
        sludgeVerified: random.boolean()
      }
    },
    comments: random.words(random.number({ min: 10, max: 40 })),
    hasEmailSent: random.boolean(),
    emailTransactionTypeId: random.number()
  };
}

export function getMockQcReportProductTypes(n: number, isNew: boolean = false): IQcReportDetailsProductTypeDto[] {
  return range(1, n).map(id => {
    const product = MockProductsLookup.find(s => s.id === id) ?? { ...sample(MockProductsLookup), id: id };
    return {
      id: product.id, // Note: Only used for BE
      productType: product,
      deliveredQty: {
        bdnQuantity: !isNew ? roundDecimals(random.number(500) + Math.random(), mockDecimals) : undefined,
        measuredQty: !isNew ? roundDecimals(random.number(400) + Math.random(), mockDecimals) : undefined,
        difference: 0
      },
      robAfterDelivery: {
        logBookROB: !isNew ? roundDecimals(random.number(500) + Math.random(), mockDecimals) : undefined,
        measuredROB: !isNew ? roundDecimals(random.number(500) + Math.random(), mockDecimals) : undefined,
        difference: 0
      },
      robBeforeDelivery: {
        logBookROB: !isNew ? roundDecimals(random.number(500) + Math.random(), mockDecimals) : undefined,
        measuredROB: !isNew ? roundDecimals(random.number(500) + Math.random(), mockDecimals) : undefined,
        difference: 0
      }
    };
  });
}
