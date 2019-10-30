import { IQcReportDetailsDto, IQcReportDetailsProductDto } from '../dto/qc-report-details.dto';
import * as faker from 'faker';
import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';
import { QcReportStatusEnum } from '../../../core/enums/qc-report-status.enum';
import * as _ from 'lodash';
import { MockProductsLookup } from './products.mock';
import { mockUoms } from './uoms.mock';

export function getQcReportDetailsCall(id: number): IQcReportDetailsDto {
  return {
    id,
    portCallId: faker.internet.mac(),
    vesselName: faker.commerce.color(),
    nbOfCliams: faker.random.number(),
    nbOfDeliveries: faker.random.number(),
    status: _.sample(PortCallStatuses),
    uoms: {
      deliveredQtyUom: _.sample(mockUoms),
      robAfterDeliveryUom: _.sample(mockUoms),
      robBeforeDeliveryUom: _.sample(mockUoms)
    },
    productTypes: getMockQcReportProductTypes(faker.random.number(10))
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

export function getMockQcReportProductTypes(n: number): IQcReportDetailsProductDto[] {
  const product = _.sample(MockProductsLookup);

  return _.range(1, n).map(() => ({
    productTypeName: product.name,
    productTypeId: product.id,
    deliveredQty: {
      bdnQty: faker.random.number(500),
      messuredDeliveredQty: faker.random.number(400)
    },
    robAfterDelivery: {
      logBookROB: faker.random.number(500),
      measuredROB: faker.random.number(500)
    },
    robBeforeDelivery: {
      logBookROB: faker.random.number(500),
      measuredROB: faker.random.number(500)
    }
  }));
}
