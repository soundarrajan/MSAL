
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';

export interface IProductListDto extends IDisplayLookupDto {
  id: number;
  name: string;
  code: string;
  displayName: string;
  parent: IDisplayLookupDto;
  productType: IDisplayLookupDto;
  specGroup: IDisplayLookupDto;
  uomMass: IDisplayLookupDto;
  conversionFactorValue: number;
  uomVolume: IDisplayLookupDto;
  createdBy: IDisplayLookupDto;
  createdOn: string;
  lastModifiedBy: IDisplayLookupDto;
  lastModifiedOn: string;
  customNonMandatoryAttribute1: string;
}

export interface IProductListRequest extends IServerGridInfo {}

export interface IProductListResponse {
  payload: IProductListDto[];
  matchedCount: number;
}


export interface IPhysicalSupplierListDto extends IDisplayLookupDto {
  id: number;
  name: string;
  displayName: string;
  defaultPaymentTerm: IDisplayLookupDto;
  parent: IDisplayLookupDto;
  isDeleted: boolean;
  reason: string;
  status: IDisplayLookupDto;
  comments: string;
  defaultIncoterm: IDisplayLookupDto;
  supplier: boolean;
  seller: boolean;
  broker: boolean;
  customer: boolean;
  agent: boolean;
  surveyor: boolean;
  barge: boolean;
  lab: boolean;
  planner: boolean;
  internal: boolean;
  sludge: boolean;
  country: string;
  createdBy: IDisplayLookupDto;
  createdOn: string;
  lastModifiedBy: IDisplayLookupDto;
  lastModifiedOn: string;
  hasNoMoreChildren: boolean;
}

export interface IPhysicalSupplierListRequest extends IServerGridInfo {}

export interface IPhysicalSupplierListResponse {
  payload: IPhysicalSupplierListDto[];
  matchedCount: number;
}