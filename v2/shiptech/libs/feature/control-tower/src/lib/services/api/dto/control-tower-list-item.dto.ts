import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { IScheduleDashboardLabelConfigurationDto } from '@shiptech/core/lookups/schedule-dashboard-label-configuration.dto.interface';

export interface IControlTowerQuantityRobDifferenceItemDto {
  order: IDisplayLookupDto;
  port: IDisplayLookupDto;
  vessel: IDisplayLookupDto;
  deliveryDate: string;
  createdOn: string;
  claimsRaised: boolean;
  isDeleted: boolean;
  productType: IDisplayLookupDto;
  id: number;
  deliveryProductId: number;
  totalCount: number;
  buyer: IDisplayLookupDto;
  status: IDisplayLookupDto;
}

export interface IControlTowerQuantitySupplyDifferenceItemDto {
  order: IDisplayLookupDto;
  port: IDisplayLookupDto;
  vessel: IDisplayLookupDto;
  deliveryDate: string;
  createdOn: string;
  claimsRaised: boolean;
  isDeleted: boolean;
  productType: IDisplayLookupDto;
  id: number;
  deliveryProductId: number;
  totalCount: number;
  buyer: IDisplayLookupDto;
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
}

export interface IGetControlTowerListRequest extends IServerGridInfo {}

export interface IGetControlTowerQuantityRobDifferenceListResponse {
  payload: IControlTowerQuantityRobDifferenceItemDto[];
  matchedCount: number;
}

export interface IGetControlTowerQuantitySupplyDifferenceListResponse {
  payload: IControlTowerQuantitySupplyDifferenceItemDto[];
  matchedCount: number;
}

export interface IGetControlTowerQuantityClaimsListResponse {
  payload: IControlTowerQuantityClaimsItemDto[];
  matchedCount: number;
}
