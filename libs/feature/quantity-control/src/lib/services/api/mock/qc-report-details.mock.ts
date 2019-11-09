import { IQcReportDetailsDto, IQcReportDetailsProductTypeDto } from '../dto/qc-report-details.dto';
import * as faker from 'faker';
import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';
import { QcReportStatusEnum } from '../../../core/enums/qc-report-status.enum';
import * as _ from 'lodash';
import { IQcVesselResponseDto } from '../dto/qc-vessel-response.dto';
import { mockUomsLookup } from '@shiptech/core/services/lookups-api/mock-data/uoms.mock';
import { MockProductsLookup } from '@shiptech/core/services/lookups-api/mock-data/products.mock';

export function getQcReportDetailsCall(id: number): IQcReportDetailsDto {
  return {
    id,
    portCallId: faker.finance.bitcoinAddress(),
    vesselName: faker.commerce.color(),
    nbOfCliams: faker.random.number(),
    nbOfDeliveries: faker.random.number(),
    status: _.sample(PortCallStatuses),
    uoms: {
      deliveredQtyUom: _.sample(mockUomsLookup),
      robAfterDeliveryUom: _.sample(mockUomsLookup),
      robBeforeDeliveryUom: _.sample(mockUomsLookup)
    },
    productTypes: getMockQcReportProductTypes(faker.random.number({ min: 5, max: 30 })),
    vesselResponses: {
      bunker: _.range(faker.random.number({ min: 1, max: 10 })).map(categoryId => getMockVesselResponse(categoryId)),
      sludge: _.range(faker.random.number({ min: 1, max: 10 })).map(categoryId => ({
        ...getMockVesselResponse(categoryId),
        sludge: faker.random.number({ min: 1, max: 10 }) + Math.random(),
        sludgeVerified: faker.random.boolean()
      }))
    },
    comment: faker.random.words(faker.random.number({ min: 10, max: 40 }))
  };
}

export const PortCallStatuses: ILookupDto<number, QcReportStatusEnum>[] = [
  {
    id: 1,
    name: QcReportStatusEnum.New
  },
  {
    id: 2,
    name: QcReportStatusEnum.Pending
  },
  {
    id: 3,
    name: QcReportStatusEnum.Verify
  }
];

export function getMockQcReportProductTypes(n: number): IQcReportDetailsProductTypeDto[] {
  return _.range(1, n).map(() => {
    const product = _.sample(MockProductsLookup);
    return {
      productTypeName: product.name,
      productTypeId: product.id,
      deliveredQty: {
        bdnQty: faker.random.number(500) + Math.random(),
        messuredDeliveredQty: faker.random.number(400) + Math.random()
      },
      robAfterDelivery: {
        logBookROB: faker.random.number(500) + Math.random(),
        measuredROB: faker.random.number(500) + Math.random()
      },
      robBeforeDelivery: {
        logBookROB: faker.random.number(500) + Math.random(),
        measuredROB: faker.random.number(500) + Math.random()
      }
    };
  });
}

export function getMockVesselResponse(id: number): IQcVesselResponseDto {
  return {
    category: {
      id,
      name: faker.random.words(3)
    },
    description: faker.lorem.paragraph(faker.random.number({ min: 1, max: 10 }))
  };
}
