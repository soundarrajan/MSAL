import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { IStatusLookupDto } from '@shiptech/core/lookups/known-lookups/status/status-lookup.interface';

export interface IInvoiceListItemDto {
  id: number;
  order: IDisplayLookupDto;
  orderProductId: number;
  delivery: IDisplayLookupDto;
  invoice: IDisplayLookupDto;
  documentNo: number;
  customStatus: IDisplayLookupDto;
  buyer: IDisplayLookupDto;
  supplier: IDisplayLookupDto;
  vessel: IDisplayLookupDto;
  carrierCompany: IDisplayLookupDto;
  paymentCompany: IDisplayLookupDto;
  agreementType: IDisplayLookupDto;
  port: IDisplayLookupDto;
  eta: string;
  deliveryDate: string;
  line: IDisplayLookupDto;
  product: IDisplayLookupDto;
  invoiceQuantity: number;
  price: number;
  sumOfCosts: number;
  invoiceAmount: number;
  confirmedQuantity: number;
  orderPrice: number;
  orderAmount: number;
  invoiceStatus: IDisplayLookupDto;
  dueDate: string;
  workingDueDate: string;
  paymentDate: string;
  receivedDate: string;
  approvedDate: string;
  backOfficeComments: string;
  orderStatus: IDisplayLookupDto;
  productType: IDisplayLookupDto;
  invoiceApprovalStatus: IStatusLookupDto;
}

export interface IGetInvoiceListRequest extends IServerGridInfo {
}

export interface IGetInvoiceListResponse {
  payload: IInvoiceListItemDto[];
  matchedCount: number;
}
