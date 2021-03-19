import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';

export interface IOrderListDto extends IDisplayLookupDto {
  orderNumber: string;
  orderDate: IDisplayLookupDto;
  productName: IDisplayLookupDto;
  confirmedQuantity: number;
  vesselName: IDisplayLookupDto;
  locationName: IDisplayLookupDto;
  eta: string;
}

export interface IOrderListRequest extends IServerGridInfo {}

export interface IOrderListResponse {
  payload: IOrderListDto[];
  matchedCount: number;
}