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
  portCall: object;
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
  id: number;
  progress: number;
  bdnQuantity: number;
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

export interface IControlTowerResidueSludgeDifferenceItemDto {
  portCall: IDisplayLookupDto;
  order: IDisplayLookupDto;
  buyer:IDisplayLookupDto;
  port: IDisplayLookupDto;
  vessel: IDisplayLookupDto;
  eta: string;
  surveyorDate: string;
  emailToVessel: boolean;
  vesselToWatch: boolean;
  sludgePercentage: number;
  sumOfOrderQuantity: number;
  measuredDeliveredQuantity: number;
  differenceInSludgeQuantity: number;
  progress: IDisplayLookupDto;
  id: number;
  logBookRobQtyBeforeDelivery: number;
  measuredRobQtyBeforeDelivery: number;
  differenceInRobQuantity: number;
  totalCount: number;
  robUom: IDisplayLookupDto;
  status: IDisplayLookupDto;
}

export interface IControlTowerResidueEGCSDifferenceItemDto {
  portCall: IDisplayLookupDto;
  port: IDisplayLookupDto;
  vessel: IDisplayLookupDto;
  eta: string;
  surveyorDate: string;
  emailToVessel: boolean;
  vesselToWatch: boolean;
  sludgePercentage: number;
  progress: IDisplayLookupDto;
  id: number;
  logBookRobQtyBeforeDelivery: number;
  measuredRobQtyBeforeDelivery: number;
  differenceInRobQuantity: number;
  totalCount: number;
  robUom: IDisplayLookupDto;
  status: IDisplayLookupDto;
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
  claimSubtypes: string;
  estimatedSettlementAmount: number;
  createdDate: string;
  createdBy: IDisplayLookupDto;
  noResponse: number;
}

export interface IControlTowerQualityLabsItemDto {
  id: string;
  counterparty: IDisplayLookupDto;
  deliveryId: string;
  order: IDisplayLookupDto;
  vessel: IDisplayLookupDto;
  port: string;
  recentEta: string;
  product: IDisplayLookupDto;
  specGroupName: string;
  status: IDisplayLookupDto;
  densityDifference: boolean;
  claimsRaised: boolean;
  createdBy: IDisplayLookupDto;
  createdDate: string;
  progress: IDisplayLookupDto;
  // userAction: string;
}

export interface IGetControlTowerListRequest extends IServerGridInfo {}

export interface IGetControlTowerQuantityRobDifferenceListResponse {
  payload: IControlTowerQuantityRobDifferenceItemDto[];
  matchedCount: number;
}

export interface IGetControlTowerQuantitySupplyDifferenceListResponse {
  payload: IControlTowerQuantitySupplyDifferenceItemDto[];
}

export interface IGetControlTowerResidueSludgeDifferenceListResponse {
  payload: IControlTowerResidueSludgeDifferenceItemDto[];
  matchedCount: number;
}

export interface IGetControlTowerResidueEGCSDifferenceListResponse {
  payload: IControlTowerResidueSludgeDifferenceItemDto[];
  matchedCount: number;
}

export interface IGetControlTowerQuantityClaimsListResponse {
  payload: IControlTowerQuantityClaimsItemDto[];
  matchedCount: number;
}

export interface IGetControlTowerQualityClaimsListResponse {
  payload: IControlTowerQualityClaimsItemDto[];
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

export interface IGetControlTowerQualityLabsListResponse {
  payload: IControlTowerQualityLabsItemDto[];
  matchedCount: number;
}

export interface ILookupDto {
  id: number;
}

export interface IControlTowerSaveNotesItemDto {
  view: ILookupDto;
  id: number;
  title: string;
  message: string;
  isDeleted: boolean;
}

export interface IControlTowerGetMyNotesDto {
  view: ILookupDto;
  timeView: ILookupDto;
}

export interface IControlTowerGetByIdDto {
  view: ILookupDto;
  timeView: ILookupDto;
  startDate: string;
  endDate: string;
}

export interface IControlTowerGetFilteredNotesDto {
  view: ILookupDto;
  timeView: ILookupDto;
  startDate: string;
  endDate: string;
  searchText?: string;
}
