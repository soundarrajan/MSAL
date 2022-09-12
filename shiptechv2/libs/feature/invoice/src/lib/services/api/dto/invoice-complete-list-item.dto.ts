import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';
import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';
import { IScheduleDashboardLabelConfigurationDto } from '@shiptech/core/lookups/schedule-dashboard-label-configuration.dto.interface';

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
  orderProductStatus: IScheduleDashboardLabelConfigurationDto;
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
  invoiceStatus: IScheduleDashboardLabelConfigurationDto;
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
  orderStatus: IScheduleDashboardLabelConfigurationDto;
  contractId: number;
  productType: ILookupDto;
  fuelPriceItemDescription: string;
  invoiceApprovalStatus: IScheduleDashboardLabelConfigurationDto;
}

export interface IGetInvoiceCompletesListRequest extends IServerGridInfo {}

export interface IGetInvoiceCompletesListResponse {
  payload: ICompleteListItemDto[];
  matchedCount: number;
}
