import { range, sample } from 'lodash';
import { mockUomsLookup } from '@shiptech/core/services/masters-api/mock-data/uoms.mock';
import { MockProductsLookup } from '@shiptech/core/services/masters-api/mock-data/products.mock';
import { IQcOrderProductsListItemDto } from '../dto/qc-order-products-list-item.dto';
import { MockOrdersLookup } from '@shiptech/core/services/masters-api/mock-data/orders.mock';
import { MockCounterparties } from '@shiptech/core/services/masters-api/mock-data/counterparties.mock';
import { Chance } from 'chance';

const chance = new Chance();

export function getQcOrderProductsList(
  n: number
): IQcOrderProductsListItemDto[] {
  return range(n).map(id => {
    const product = sample(MockProductsLookup);
    const order = sample(MockOrdersLookup);
    const uom = sample(mockUomsLookup);
    const counterparty = sample(MockCounterparties);
    return {
      id: id + 1,
      order: order,
      product: product,
      counterparty: counterparty,
      uom: uom,
      confirmedQty: chance.integer()
    };
  });
}
