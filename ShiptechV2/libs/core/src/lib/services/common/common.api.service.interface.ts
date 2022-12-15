import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { Observable } from 'rxjs';

export interface ICommonApiService {}

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
  isDeleted: boolean;
}

export interface IProductListRequest extends IServerGridInfo {}

export interface IProductListResponse {
  payload: IProductListDto[];
  matchedCount: number;
}

export interface ILocationListDto extends IDisplayLookupDto {
  locationId: number;
  name: string;
  locationCode: string;
  voyageId: string;
  eta: string;
  etb: string;
  etd: string;
  portCallId: string;
  isBunkerablePort: boolean;
  isDeleted: boolean;
}

export interface ILocationListResponse {
  payload: ILocationListDto[];
  matchedCount: number;
}