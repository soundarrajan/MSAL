import { range, sample, values } from 'lodash';
import { MockStatusLookupEnumMap } from '@shiptech/core/lookups/known-lookups/status/status-lookup.enum';
import { IInvoiceListItemDto } from '../dto/invoice-list-item.dto';
import { Chance } from 'chance';

const chance = new Chance();

export function getMockInvoiceListItem(id: number): IInvoiceListItemDto {
  return {
    id,
    order: sample(values(MockStatusLookupEnumMap)),
    orderProductId: chance.d100(),
    delivery: sample(values(MockStatusLookupEnumMap)),
    invoice: sample(values(MockStatusLookupEnumMap)),
    documentNo: chance.d100(),
    customStatus: sample(values(MockStatusLookupEnumMap)),
    buyer: sample(values(MockStatusLookupEnumMap)),
    supplier: sample(values(MockStatusLookupEnumMap)),
    vessel: sample(values(MockStatusLookupEnumMap)),
    carrierCompany: sample(values(MockStatusLookupEnumMap)),
    paymentCompany: sample(values(MockStatusLookupEnumMap)),
    agreementType: sample(values(MockStatusLookupEnumMap)),
    port: sample(values(MockStatusLookupEnumMap)),
    eta: chance.date().toISOString(),
    deliveryDate: chance.date().toISOString(),
    line: sample(values(MockStatusLookupEnumMap)),
    product: sample(values(MockStatusLookupEnumMap)),
    invoiceQuantity: chance.d100(),
    price: chance.d100(),
    sumOfCosts: chance.d100(),
    invoiceAmount: chance.d100(),
    confirmedQuantity: chance.d100(),
    orderPrice: chance.d100(),
    orderAmount: chance.d100(),
    invoiceStatus: {
      id: chance.d10(),
      transactionTypeId: chance.d10(),
      displayName: chance.name(),
      code: null,
      index: null,
      name: chance.name()
    },
    dueDate: chance.date().toISOString(),
    workingDueDate: chance.date().toISOString(),
    paymentDate: chance.date().toISOString(),
    receivedDate: chance.date().toISOString(),
    approvedDate: chance.date().toISOString(),
    backOfficeComments: chance.word(),
    orderStatus: {
      id: chance.d10(),
      transactionTypeId: chance.d10(),
      displayName: chance.name(),
      code: null,
      index: null,
      name: chance.name()
    },
    productType: sample(values(MockStatusLookupEnumMap)),
    invoiceApprovalStatus: {
      id: chance.d10(),
      transactionTypeId: chance.d10(),
      displayName: chance.name(),
      code: null,
      index: null,
      name: chance.name()
    }
  };
}

export function getMockInvoiceList(n: number): IInvoiceListItemDto[] {
  return range(1, n).map(id => getMockInvoiceListItem(id));
}
