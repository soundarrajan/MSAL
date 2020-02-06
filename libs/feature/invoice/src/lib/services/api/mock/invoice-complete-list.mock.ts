import * as faker from 'faker';
import * as _ from 'lodash';
import { ICompleteListItemDto } from '../dto/invoice-complete-list-item.dto';
import { MockStatusLookupEnumMap } from '@shiptech/core/lookups/known-lookups/status/status-lookup.enum';
import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';

export function getMockInvoiceCompleteList(n: number): ICompleteListItemDto[] {
  return _.range(1, n).map(id => getMockInvoiceCompletesListItem(id));
}

export function getMockInvoiceCompletesListItem(id: number): ICompleteListItemDto {
  return {
    id,
    nbOfMatched: faker.random.number(100),
    nbOfMatchedWithinLimit: faker.random.number(100),
    nbOfNotMatched: faker.random.number(100),
    order: _.sample(_.values(MockStatusLookupEnumMap)),
    orderProductId: faker.random.number(100),
    delivery: _.sample(_.values(MockStatusLookupEnumMap)),
    invoice: _.sample(_.values(MockStatusLookupEnumMap)),
    sellerInvoiceNo: faker.random.number(100),
    documentNo: faker.random.number(100),
    customStatus: _.sample(_.values(MockStatusLookupEnumMap)),
    orderProductStatus: _.sample(_.values(MockStatusLookupEnumMap)),
    buyer: _.sample(_.values(MockStatusLookupEnumMap)),

    supplier: _.sample(_.values(MockStatusLookupEnumMap)),
    orderPhysicalSupplier: _.sample(_.values(MockStatusLookupEnumMap)),
    invoicePhysicalSupplier: _.sample(_.values(MockStatusLookupEnumMap)),
    vessel: _.sample(_.values(MockStatusLookupEnumMap)),
    carrierCompany: _.sample(_.values(MockStatusLookupEnumMap)),
    paymentCompany: _.sample(_.values(MockStatusLookupEnumMap)),
    port: _.sample(_.values(MockStatusLookupEnumMap)),
    eta: faker.date.past().toISOString(),
    deliveryDate: faker.date.past().toISOString(),
    line: _.sample(_.values(MockStatusLookupEnumMap)),
    agreementType: _.sample(_.values(MockStatusLookupEnumMap)),
    product: _.sample(_.values(MockStatusLookupEnumMap)),
    invoiceQuantity: faker.random.number(100),
    price: faker.random.number(100),
    sumOfCosts: faker.random.number(100),
    invoiceAmount: faker.random.number(100),
    invoiceProductAmount: faker.random.number(100),
    totalInvoiceProductAmount: faker.random.number(100),
    invoiceCurrency: _.sample(_.values(MockStatusLookupEnumMap)),
    orderProduct: _.sample(_.values(MockStatusLookupEnumMap)),
    confirmedQuantity: faker.random.number(100),
    finalQuantityAmount: faker.random.number(100),
    orderPrice: faker.random.number(100),
    orderPriceCurrency: _.sample(_.values(MockStatusLookupEnumMap)),
    convertedCurrency: _.sample(_.values(MockStatusLookupEnumMap)),
    invoiceProductAmountInOrderCurrency: faker.random.number(100),
    orderCost: faker.random.number(100),
    orderProductAmount: faker.random.number(100),
    totalOrderProductAmount: faker.random.number(100),
    orderAmount: faker.random.number(100),
    orderCurrency: _.sample(_.values(MockStatusLookupEnumMap)),
    dueDate: faker.date.past().toISOString(),
    workingDueDate: faker.date.past().toISOString(),
    approvedDate: faker.date.past().toISOString(),
    accountNumber: faker.random.number(100),
    paymentDate: faker.date.past().toISOString(),
    backOfficeComments: faker.random.word(),
    claimNo: faker.random.number(100),
    claimDate: faker.date.past().toISOString(),
    claimStatus: _.sample(_.values(MockStatusLookupEnumMap)),
    actualSettlementDate: faker.date.past().toISOString(),
    debunkerAmount: faker.random.number(100),
    resaleAmount: faker.random.number(100),
    invoiceType: _.sample(_.values(MockStatusLookupEnumMap)),
    receivedDate: faker.date.past().toISOString(),
    sellerDueDate: faker.date.past().toISOString(),
    orderStatus: _.sample(_.values(MockStatusLookupEnumMap)),
    contractId: faker.random.number(100),
    productType: _.sample(_.values(MockStatusLookupEnumMap)),
    fuelPriceItemDescription: faker.random.word(),
    invoiceApprovalStatus: _.sample(_.values(MockStatusLookupEnumMap))
  };
}
