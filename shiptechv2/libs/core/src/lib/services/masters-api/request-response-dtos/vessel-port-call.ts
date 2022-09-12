import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';

export interface IVesselPortCallMasterDto extends IDisplayLookupDto {
  voyageId: number;
  voyageReference: string;
  location: IDisplayLookupDto;
  eta: string;
  etb: string;
  etd: string;
  portCallId: string;
  service: IDisplayLookupDto;
  totalCount: number;
}

export interface IVesselPortCallMasterRequest extends IServerGridInfo {
  id: number;
}

export interface IVesselPortCallMasterResponse {
  items: IVesselPortCallMasterDto[];
  totalCount: number;
}
