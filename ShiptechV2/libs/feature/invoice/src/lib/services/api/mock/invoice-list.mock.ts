import * as faker from 'faker';
import * as _ from 'lodash';
import {MockStatusLookupEnumMap} from '@shiptech/core/lookups/known-lookups/status/status-lookup.enum';
import {IInvoiceListItemDto} from "../dto/invoice-list-item.dto";

export function getMockInvoiceList(n: number): IInvoiceListItemDto[] {
  return _.range(1, n).map(id => getMockInvoiceListItem(id));
}

export function getMockInvoiceListItem(id: number): IInvoiceListItemDto {
  return {
    id,
    order: _.sample(_.values(MockStatusLookupEnumMap)),
    orderProductId: faker.random.number(100),
    delivery: _.sample(_.values(MockStatusLookupEnumMap)),
    invoice: _.sample(_.values(MockStatusLookupEnumMap)),
    documentNo: faker.random.number(100),
    customStatus: _.sample(_.values(MockStatusLookupEnumMap)),
    buyer: _.sample(_.values(MockStatusLookupEnumMap)),
    supplier: _.sample(_.values(MockStatusLookupEnumMap)),
    vessel: _.sample(_.values(MockStatusLookupEnumMap)),
    carrierCompany: _.sample(_.values(MockStatusLookupEnumMap)),
    paymentCompany: _.sample(_.values(MockStatusLookupEnumMap)),
    agreementType: _.sample(_.values(MockStatusLookupEnumMap)),
    port: _.sample(_.values(MockStatusLookupEnumMap)),
    eta: faker.date.past().toISOString(),
    deliveryDate: faker.date.past().toISOString(),
    line: _.sample(_.values(MockStatusLookupEnumMap)),
    product: _.sample(_.values(MockStatusLookupEnumMap)),
    invoiceQuantity: faker.random.number(100),
    price: faker.random.number(100),
    sumOfCosts: faker.random.number(100),
    invoiceAmount: faker.random.number(100),
    confirmedQuantity: faker.random.number(100),
    orderPrice: faker.random.number(100),
    orderAmount: faker.random.number(100),
    invoiceStatus: _.sample(_.values(MockStatusLookupEnumMap)),
    dueDate: faker.date.past().toISOString(),
    workingDueDate: faker.date.past().toISOString(),
    paymentDate: faker.date.past().toISOString(),
    receivedDate: faker.date.past().toISOString(),
    approvedDate: faker.date.past().toISOString(),
    backOfficeComments: faker.random.word(),
    orderStatus: _.sample(_.values(MockStatusLookupEnumMap)),
    productType: _.sample(_.values(MockStatusLookupEnumMap)),
    invoiceApprovalStatus: _.sample(_.values(MockStatusLookupEnumMap))
  };
}
