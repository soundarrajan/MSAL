import * as faker from 'faker';
import * as _ from 'lodash';
import { mockUomsLookup } from '@shiptech/core/services/lookups-api/mock-data/uoms.mock';
import { MockProductsLookup } from '@shiptech/core/services/lookups-api/mock-data/products.mock';
import { IQcOrderProductsListItemDto } from '../dto/qc-order-products-list-item.dto';

export function getQcOrderProductsList(n: number): IQcOrderProductsListItemDto[] {
  return _.range(n).map((id) => {
    const product = _.sample(MockProductsLookup);
    return {
      orderId: id + 1,
      orderNo: 'No' + (id + 1),
      counterpartyId: faker.random.number(),
      counterpartyName: faker.company.companyName(),
      productId: product.id,
      productName: product.name,
      confirmedQuantity: faker.random.number(),
      uomName: _.sample(mockUomsLookup).name
    };
  });
}
