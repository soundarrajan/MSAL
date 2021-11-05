import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { IScheduleDashboardLabelConfigurationDto } from '@shiptech/core/lookups/schedule-dashboard-label-configuration.dto.interface';

export interface IPortCallLookupDto {
  voyageReference: any;
  portCallId: string;
  vesselVoyageDetailId: number;
  modulePathUrl: string;
  clientIpAddress: string;
  userAction: string;
}

export interface IControlTowerQuantityRobDifferenceItemDto {
  portCall: IDisplayLookupDto;
  port: IDisplayLookupDto;
  vessel: IDisplayLookupDto;
  eta: string;
  surveyorDate: string;
  emailToVessel: boolean;
  vesselToWatch: boolean;
  productType: IDisplayLookupDto;
  progress: IDisplayLookupDto;
  id: number;
  logBookRobQtyBeforeDelivery: number;
  measuredRobQtyBeforeDelivery: number;
  differenceInRobQuantity: number;
  totalCount: number;
  robUom: IDisplayLookupDto;
  status: IDisplayLookupDto;
}

export interface IControlTowerQuantitySupplyDifferenceItemDto {
  portCall: object;
  port: IDisplayLookupDto;
  vessel: IDisplayLookupDto;
  eta: string;
  surveyorDate: string;
  emailToVessel: boolean;
  vesselToWatch: boolean;
  productType: IDisplayLookupDto;
  progress: number;
  id: number;
  measuredDeliveredQty: number;
  differenceInQty: number;
  totalCount: number;
  sumOfOrderQtyCol: string;
  qtyUom: IDisplayLookupDto;
  status: IDisplayLookupDto;
}

export interface IControlTowerQuantityClaimsItemDto {
  order: IDisplayLookupDto;
  lab: IDisplayLookupDto;
  id: number;
  port: string;
  vessel: string;
  eta: string;
  product: string;
  seller: string;
  quantityShortage: number;
  quantityUom: IDisplayLookupDto;
  estimatedSettlementAmount: number;
  createdDate: string;
  createdBy: IDisplayLookupDto;
  orderPrice: number;
  currency: IDisplayLookupDto;
  noResponse: number;
}

export interface IControlTowerQualityClaimsItemDto {
  order: IDisplayLookupDto;
  lab: IDisplayLookupDto;
  id: number;
  port: string;
  vessel: string;
  eta: string;
  product: string;
  seller: string;
  claimSubType: string;
  estimatedSettlementAmount: number;
  createdDate: string;
  createdBy: IDisplayLookupDto;
  noResponse: number;
}

export interface IGetControlTowerListRequest extends IServerGridInfo {}

export interface IGetControlTowerQuantityRobDifferenceListResponse {
  payload: {
    items: IControlTowerQuantityRobDifferenceItemDto[];
    noOfNew: number;
    noOfMarkedAsSeen: number;
    noOfResolved: number;
  };
  matchedCount: number;
}

export interface IGetControlTowerQuantitySupplyDifferenceListResponse {
  payload: {
    items: IControlTowerQuantitySupplyDifferenceItemDto[];
    noOfMarkedAsSeen: number;
    noOfNew: number;
    noOfResolved: number;
  };
}

export interface IGetControlTowerQuantityClaimsListResponse {
  payload: {
    items: IControlTowerQuantityClaimsItemDto[];
    noOf15: number;
    noOf714: number;
    noOfNew: number;
  };
  matchedCount: number;
}

export interface IGetControlTowerQualityClaimsListResponse {
  payload: {
    items: IControlTowerQualityClaimsItemDto[];
    noOf15: number;
    noOf714: number;
    noOfNew: number;
  };
  matchedCount: number;
}

export interface IgetControlTowerQualityClaimsListExportUrlResponse {
  payload: {
    items: IControlTowerQualityClaimsItemDto[];
    noOf15: number;
    noOf714: number;
    noOfNew: number;
  };
  matchedCount: number;
}
