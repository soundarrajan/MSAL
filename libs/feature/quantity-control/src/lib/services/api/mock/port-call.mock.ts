import { IPortCallDto, IPortCallProductDto } from '../dto/port-call.dto';
import * as faker from 'faker';
import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';
import { PortCallStatusEnum } from '../../../core/enums/port-call-status.enum';
import * as _ from 'lodash';
import { MockProductsLookup } from './products.mock';
import { mockUoms } from './uoms.mock';

export function getMockPortCall(id: string): IPortCallDto {
  return {
    portCallId: id,
    vesselName: faker.commerce.color(),
    nbOfCliams: faker.random.number(),
    nbOfDeliveries: faker.random.number(),
    status: _.sample(PortCallStatuses),
    uoms: {
      deliveredQtyUom: _.sample(mockUoms),
      robAfterDeliveryUom: _.sample(mockUoms),
      robBeforeDeliveryUom: _.sample(mockUoms)
    },
    productTypes: getMockPortCallProductTypes(faker.random.number(10))
  };
}

export const PortCallStatuses: ILookupDto<number, PortCallStatusEnum>[] = [
  {
    id: 1,
    name: PortCallStatusEnum.New
  },
  {
    id: 2,
    name: PortCallStatusEnum.Pending
  },
  {
    id: 3,
    name: PortCallStatusEnum.Verify
  }
];

export function getMockPortCallProductTypes(n: number): IPortCallProductDto[] {
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
