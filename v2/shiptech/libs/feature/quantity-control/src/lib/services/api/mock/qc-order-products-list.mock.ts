import * as faker from 'faker';
import * as _ from 'lodash';
import { mockUomsLookup } from '@shiptech/core/services/masters-api/mock-data/uoms.mock';
import { MockProductsLookup } from '@shiptech/core/services/masters-api/mock-data/products.mock';
import { IQcOrderProductsListItemDto } from '../dto/qc-order-products-list-item.dto';
import { MockOrdersLookup } from '@shiptech/core/services/masters-api/mock-data/orders.mock';
import { MockCounterparties } from '@shiptech/core/services/masters-api/mock-data/counterparties.mock';

export function getQcOrderProductsList(n: number): IQcOrderProductsListItemDto[] {
  return _.range(n).map(id => {
    const product = _.sample(MockProductsLookup);
    const order = _.sample(MockOrdersLookup);
    const uom = _.sample(mockUomsLookup);
    const counterparty = _.sample(MockCounterparties);
    return {
      id: id + 1,
      order: order,
      product: product,
      counterparty: counterparty,
      uom: uom,
      confirmedQty: faker.random.number(),
    };
  });
}
