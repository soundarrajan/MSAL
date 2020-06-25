import { IQcVesselResponsesDto } from './qc-vessel-response.dto';
import {
  IDisplayLookupDto,
  IVesselToWatchLookupDto
} from '@shiptech/core/lookups/display-lookup-dto.interface';
import { IQcVesselPortCallDto } from './qc-vessel-port-call.interface';
import { IStatusLookupDto } from '@shiptech/core/lookups/known-lookups/status/status-lookup.interface';

export interface IEteReportDetailsDto {
  id: number;
  portCall?: IQcVesselPortCallDto;
  vessel?: IVesselToWatchLookupDto;
  nbOfClaims: number;
  nbOfDeliveries: number;
  productTypeCategories: IEteReportDetailsProductTypeDto[];
  sludgeProductType: IDisplayLookupDto;
  status: IStatusLookupDto;
  uoms: IQcReportDetailsUoms;
  vesselResponses: IQcVesselResponsesDto;
  comments?: string;
  hasSentEmail?: boolean;
  emailTransactionTypeId: number;
}

export interface IEteReportProductTypeDto {
  id: number;
  productType: IDisplayLookupDto;
}

export interface IEteReportDetailsProductTypeDto {
  id: number; // Note: Only used for BE
  productType: IDisplayLookupDto;
  robBeforeDelivery: IQcReportDetailsRob;
  robAfterDelivery: IQcReportDetailsRob;
  deliveredQty: IQcReportDetailsDeliveredQty;
}

export interface IQcReportDetailsDeliveredQty {
  bdnQuantity: number;
  measuredQty: number;
}

export interface IQcReportDetailsRob {
  logBookROB: number;
  measuredROB: number;
  difference: number;
}

export interface IQcReportDetailsUoms {
  robBeforeDeliveryUom?: IDisplayLookupDto;
  robAfterDeliveryUom?: IDisplayLookupDto;
  deliveredQtyUom?: IDisplayLookupDto;
  options: IDisplayLookupDto[];
}
