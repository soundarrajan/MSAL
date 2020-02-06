import * as faker from 'faker';
import * as _ from 'lodash';
import { ICompleteListItemDto } from '../dto/invoice-complete-list-item.dto';

export function getMockInvoiceCompleteList(n: number): ICompleteListItemDto[] {
  return _.range(1, n).map(id => getMockInvoiceCompletesListItem(id));
}

export function getMockInvoiceCompletesListItem(id: number): ICompleteListItemDto {
  return {
    id,
    nbOfMatched: faker.random.number(100),
    nbOfMatchedWithinLimit: faker.random.number(100),
    nbOfNotMatched: faker.random.number(100),
    portCallId: faker.random.number({ min: Math.pow(10, 15), max: Math.pow(10, 16) - 1 }).toString(),
    portName: faker.name.lastName()
  };
}
