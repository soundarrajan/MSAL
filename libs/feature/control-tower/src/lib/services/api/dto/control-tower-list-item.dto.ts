import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { IScheduleDashboardLabelConfigurationDto } from '@shiptech/core/lookups/schedule-dashboard-label-configuration.dto.interface';

export interface IControlTowerQuantityRobDifferenceItemDto {
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
  invoiceStatus: IScheduleDashboardLabelConfigurationDto;
  dueDate: string;
  workingDueDate: string;
  paymentDate: string;
  receivedDate: string;
  approvedDate: string;
  backOfficeComments: string;
  orderStatus: IScheduleDashboardLabelConfigurationDto;
  productType: IDisplayLookupDto;
  invoiceApprovalStatus: IScheduleDashboardLabelConfigurationDto;
}

export interface IGetControlTowerQuantityRobDifferenceListRequest extends IServerGridInfo {}

export interface IGetControlTowerQuantityRobDifferenceListResponse {
  payload: IControlTowerQuantityRobDifferenceItemDto[];
  matchedCount: number;
}
