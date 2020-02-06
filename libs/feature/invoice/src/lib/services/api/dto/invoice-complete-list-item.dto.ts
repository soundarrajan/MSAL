import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';
import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';
import { IDocumentsMasterDto } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-master.dto';

export interface ICompleteListItemDto {
  id: number;
  nbOfMatched: number;
  nbOfMatchedWithinLimit: number;
  nbOfNotMatched: number;

  order: ILookupDto;
  orderProductId: number;
  delivery: ILookupDto;
  invoice: ILookupDto;
  sellerInvoiceNo: number;
  documentNo: number;
  customStatus: ILookupDto;
  orderProductStatus: ILookupDto;
  buyer: ILookupDto;

  supplier: ILookupDto;
  orderPhysicalSupplier: ILookupDto;
  invoicePhysicalSupplier: ILookupDto;
  vessel: ILookupDto;
  carrierCompany: ILookupDto;
  paymentCompany: ILookupDto;
  port: ILookupDto;
  eta: Date | string;
  deliveryDate: Date | string;
  line: ILookupDto;
  agreementType: ILookupDto;
  product: ILookupDto;
  invoiceQuantity: number;
  price: number;
  sumOfCosts: number;
  invoiceAmount: number;
  invoiceProductAmount: number;
  totalInvoiceProductAmount: number;
  invoiceCurrency: ILookupDto;
  orderProduct: ILookupDto;
  confirmedQuantity: number;
  finalQuantityAmount: number;
  orderPrice: number;
  orderPriceCurrency: ILookupDto;
  convertedCurrency: ILookupDto;
  invoiceProductAmountInOrderCurrency: number;
  orderCost: number;
  orderProductAmount: number;
  totalOrderProductAmount: number;
  orderAmount: number;
  orderCurrency: ILookupDto;
  dueDate: Date | string;
  workingDueDate: Date | string;
  approvedDate: Date | string;
  accountNumber: number;
  paymentDate: Date | string;
  backOfficeComments: string;
  claimNo: number;
  claimDate: Date | string;
  claimStatus: ILookupDto;
  actualSettlementDate: Date | string;
  debunkerAmount: number;
  resaleAmount: number;
  invoiceType: ILookupDto;
  receivedDate: Date | string;
  sellerDueDate: Date | string;
  orderStatus: ILookupDto;
  contractId: number;
  productType: ILookupDto;
  fuelPriceItemDescription: string;
  invoiceApprovalStatus: ILookupDto;

}

export interface IGetInvoiceCompletesListRequest extends IServerGridInfo {
}

export interface IGetInvoiceCompletesListResponse {
  payload: ICompleteListItemDto[];
  matchedCount: number;
}
