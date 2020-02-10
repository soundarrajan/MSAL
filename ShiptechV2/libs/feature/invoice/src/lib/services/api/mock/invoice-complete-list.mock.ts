import { random, date } from 'faker';
import { range, sample, values } from 'lodash';
import { ICompleteListItemDto } from '../dto/invoice-complete-list-item.dto';
import { MockStatusLookupEnumMap } from '@shiptech/core/lookups/known-lookups/status/status-lookup.enum';

export function getMockInvoiceCompleteList(n: number): ICompleteListItemDto[] {
  return range(1, n).map(id => getMockInvoiceCompletesListItem(id));
}

export function getMockInvoiceCompletesListItem(id: number): ICompleteListItemDto {
  return {
    id,
    nbOfMatched: random.number(100),
    nbOfMatchedWithinLimit: random.number(100),
    nbOfNotMatched: random.number(100),
    order: sample(values(MockStatusLookupEnumMap)),
    orderProductId: random.number(100),
    delivery: sample(values(MockStatusLookupEnumMap)),
    invoice: sample(values(MockStatusLookupEnumMap)),
    sellerInvoiceNo: random.number(100),
    documentNo: random.number(100),
    customStatus: sample(values(MockStatusLookupEnumMap)),
    orderProductStatus:  {
      id: random.number(10),
      transactionTypeId: random.number(10),
      displayName: random.word(),
      code: null,
      index: null,
      name: random.word()
    },
    buyer: sample(values(MockStatusLookupEnumMap)),
    supplier: sample(values(MockStatusLookupEnumMap)),
    orderPhysicalSupplier: sample(values(MockStatusLookupEnumMap)),
    invoicePhysicalSupplier: sample(values(MockStatusLookupEnumMap)),
    vessel: sample(values(MockStatusLookupEnumMap)),
    carrierCompany: sample(values(MockStatusLookupEnumMap)),
    paymentCompany: sample(values(MockStatusLookupEnumMap)),
    port: sample(values(MockStatusLookupEnumMap)),
    eta: date.past().toISOString(),
    deliveryDate: date.past().toISOString(),
    line: sample(values(MockStatusLookupEnumMap)),
    agreementType: sample(values(MockStatusLookupEnumMap)),
    product: sample(values(MockStatusLookupEnumMap)),
    invoiceQuantity: random.number(100),
    price: random.number(100),
    sumOfCosts: random.number(100),
    invoiceAmount: random.number(100),
    invoiceProductAmount: random.number(100),
    totalInvoiceProductAmount: random.number(100),
    invoiceCurrency: sample(values(MockStatusLookupEnumMap)),
    orderProduct: sample(values(MockStatusLookupEnumMap)),
    confirmedQuantity: random.number(100),
    finalQuantityAmount: random.number(100),
    orderPrice: random.number(100),
    orderPriceCurrency: sample(values(MockStatusLookupEnumMap)),
    convertedCurrency: sample(values(MockStatusLookupEnumMap)),
    invoiceProductAmountInOrderCurrency: random.number(100),
    orderCost: random.number(100),
    orderProductAmount: random.number(100),
    totalOrderProductAmount: random.number(100),
    orderAmount: random.number(100),
    orderCurrency: sample(values(MockStatusLookupEnumMap)),
    dueDate: date.past().toISOString(),
    workingDueDate: date.past().toISOString(),
    approvedDate: date.past().toISOString(),
    accountNumber: random.number(100),
    paymentDate: date.past().toISOString(),
    backOfficeComments: random.word(),
    claimNo: random.number(100),
    claimDate: date.past().toISOString(),
    claimStatus: sample(values(MockStatusLookupEnumMap)),
    actualSettlementDate: date.past().toISOString(),
    debunkerAmount: random.number(100),
    resaleAmount: random.number(100),
    invoiceType: sample(values(MockStatusLookupEnumMap)),
    receivedDate: date.past().toISOString(),
    sellerDueDate: date.past().toISOString(),
    orderStatus: {
      id: random.number(10),
      transactionTypeId: random.number(10),
      displayName: random.word(),
      code: null,
      index: null,
      name: random.word()
    },
    invoiceStatus: {
      id: random.number(10),
      transactionTypeId: random.number(10),
      displayName: random.word(),
      code: null,
      index: null,
      name: random.word()
    },
    contractId: random.number(100),
    productType: sample(values(MockStatusLookupEnumMap)),
    fuelPriceItemDescription: random.word(),
    invoiceApprovalStatus: {
      id: random.number(10),
      transactionTypeId: random.number(10),
      displayName: random.word(),
      code: null,
      index: null,
      name: random.word()
    }
  };
}
