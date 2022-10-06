import { range, sample, values } from 'lodash';
import { ICompleteListItemDto } from '../dto/invoice-complete-list-item.dto';
import { MockStatusLookupEnumMap } from '@shiptech/core/lookups/known-lookups/status/status-lookup.enum';
import { Chance } from 'chance';

const chance = new Chance();

export function getMockInvoiceCompletesListItem(
  id: number
): ICompleteListItemDto {
  return {
    id,
    nbOfMatched: chance.d100(),
    nbOfMatchedWithinLimit: chance.d100(),
    nbOfNotMatched: chance.d100(),
    order: sample(values(MockStatusLookupEnumMap)),
    orderProductId: chance.d100(),
    delivery: sample(values(MockStatusLookupEnumMap)),
    invoice: sample(values(MockStatusLookupEnumMap)),
    sellerInvoiceNo: chance.d100(),
    documentNo: chance.d100(),
    customStatus: sample(values(MockStatusLookupEnumMap)),
    orderProductStatus: {
      id: chance.d10(),
      transactionTypeId: chance.d10(),
      displayName: chance.name(),
      code: null,
      index: null,
      name: chance.name()
    },
    buyer: sample(values(MockStatusLookupEnumMap)),
    supplier: sample(values(MockStatusLookupEnumMap)),
    orderPhysicalSupplier: sample(values(MockStatusLookupEnumMap)),
    invoicePhysicalSupplier: sample(values(MockStatusLookupEnumMap)),
    vessel: sample(values(MockStatusLookupEnumMap)),
    carrierCompany: sample(values(MockStatusLookupEnumMap)),
    paymentCompany: sample(values(MockStatusLookupEnumMap)),
    port: sample(values(MockStatusLookupEnumMap)),
    eta: chance.date().toISOString(),
    deliveryDate: chance.date().toISOString(),
    line: sample(values(MockStatusLookupEnumMap)),
    agreementType: sample(values(MockStatusLookupEnumMap)),
    product: sample(values(MockStatusLookupEnumMap)),
    invoiceQuantity: chance.d100(),
    price: chance.d100(),
    sumOfCosts: chance.d100(),
    invoiceAmount: chance.d100(),
    invoiceProductAmount: chance.d100(),
    totalInvoiceProductAmount: chance.d100(),
    invoiceCurrency: sample(values(MockStatusLookupEnumMap)),
    orderProduct: sample(values(MockStatusLookupEnumMap)),
    confirmedQuantity: chance.d100(),
    finalQuantityAmount: chance.d100(),
    orderPrice: chance.d100(),
    orderPriceCurrency: sample(values(MockStatusLookupEnumMap)),
    convertedCurrency: sample(values(MockStatusLookupEnumMap)),
    invoiceProductAmountInOrderCurrency: chance.d100(),
    orderCost: chance.d100(),
    orderProductAmount: chance.d100(),
    totalOrderProductAmount: chance.d100(),
    orderAmount: chance.d100(),
    orderCurrency: sample(values(MockStatusLookupEnumMap)),
    dueDate: chance.date().toISOString(),
    workingDueDate: chance.date().toISOString(),
    approvedDate: chance.date().toISOString(),
    accountNumber: chance.d100(),
    paymentDate: chance.date().toISOString(),
    backOfficeComments: chance.word(),
    claimNo: chance.d100(),
    claimDate: chance.date().toISOString(),
    claimStatus: sample(values(MockStatusLookupEnumMap)),
    actualSettlementDate: chance.date().toISOString(),
    debunkerAmount: chance.d100(),
    resaleAmount: chance.d100(),
    invoiceType: sample(values(MockStatusLookupEnumMap)),
    receivedDate: chance.date().toISOString(),
    sellerDueDate: chance.date().toISOString(),
    orderStatus: {
      id: chance.d10(),
      transactionTypeId: chance.d10(),
      displayName: chance.name(),
      code: null,
      index: null,
      name: chance.name()
    },
    invoiceStatus: {
      id: chance.d10(),
      transactionTypeId: chance.d10(),
      displayName: chance.name(),
      code: null,
      index: null,
      name: chance.name()
    },
    contractId: chance.d100(),
    productType: sample(values(MockStatusLookupEnumMap)),
    fuelPriceItemDescription: chance.word(),
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

export function getMockInvoiceCompleteList(n: number): ICompleteListItemDto[] {
  return range(1, n).map(id => getMockInvoiceCompletesListItem(id));
}
