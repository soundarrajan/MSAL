import { date, random } from 'faker';
import { range, sample, values } from 'lodash';
import { MockStatusLookupEnumMap } from '@shiptech/core/lookups/known-lookups/status/status-lookup.enum';
import { IInvoiceListItemDto } from '../dto/invoice-list-item.dto';

export function getMockInvoiceList(n: number): IInvoiceListItemDto[] {
  return range(1, n).map(id => getMockInvoiceListItem(id));
}

export function getMockInvoiceListItem(id: number): IInvoiceListItemDto {
  return {
    id,
    order: sample(values(MockStatusLookupEnumMap)),
    orderProductId: random.number(100),
    delivery: sample(values(MockStatusLookupEnumMap)),
    invoice: sample(values(MockStatusLookupEnumMap)),
    documentNo: random.number(100),
    customStatus: sample(values(MockStatusLookupEnumMap)),
    buyer: sample(values(MockStatusLookupEnumMap)),
    supplier: sample(values(MockStatusLookupEnumMap)),
    vessel: sample(values(MockStatusLookupEnumMap)),
    carrierCompany: sample(values(MockStatusLookupEnumMap)),
    paymentCompany: sample(values(MockStatusLookupEnumMap)),
    agreementType: sample(values(MockStatusLookupEnumMap)),
    port: sample(values(MockStatusLookupEnumMap)),
    eta: date.past().toISOString(),
    deliveryDate: date.past().toISOString(),
    line: sample(values(MockStatusLookupEnumMap)),
    product: sample(values(MockStatusLookupEnumMap)),
    invoiceQuantity: random.number(100),
    price: random.number(100),
    sumOfCosts: random.number(100),
    invoiceAmount: random.number(100),
    confirmedQuantity: random.number(100),
    orderPrice: random.number(100),
    orderAmount: random.number(100),
    invoiceStatus: sample(values(MockStatusLookupEnumMap)),
    dueDate: date.past().toISOString(),
    workingDueDate: date.past().toISOString(),
    paymentDate: date.past().toISOString(),
    receivedDate: date.past().toISOString(),
    approvedDate: date.past().toISOString(),
    backOfficeComments: random.word(),
    orderStatus: sample(values(MockStatusLookupEnumMap)),
    productType: sample(values(MockStatusLookupEnumMap)),
    invoiceApprovalStatus: sample(values(MockStatusLookupEnumMap))
  };
}
