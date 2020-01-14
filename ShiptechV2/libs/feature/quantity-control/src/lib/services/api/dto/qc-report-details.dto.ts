import { IQcVesselResponsesDto } from './qc-vessel-response.dto';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { IQcVesselPortCall } from '../../../guards/qc-vessel-port-call.interface';
import { IStatusLookupDto } from '@shiptech/core/lookups/known-lookups/status/status-lookup.interface';

export interface IQcReportDetailsDto {
  id: number
  portCall?: IQcVesselPortCall;
  vessel?: IDisplayLookupDto,
  nbOfClaims: number;
  nbOfDeliveries: number;
  productTypeCategories: IQcReportDetailsProductTypeDto[];
  sludgeProductType: IDisplayLookupDto;
  status: IStatusLookupDto;
  uoms: IQcReportDetailsUoms;
  vesselResponses: IQcVesselResponsesDto;
  comments?: string;
  hasEmailSent?: boolean;
  emailTransactionTypeId: number;
  entityTransactionType: IDisplayLookupDto;
}

export interface IQcReportProductTypeDto {
  id: number;
  productType: IDisplayLookupDto;
}

export interface IQcReportDetailsProductTypeDto {
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
  robBeforeDeliveryUom?: IDisplayLookupDto,
  robAfterDeliveryUom?: IDisplayLookupDto,
  deliveredQtyUom?: IDisplayLookupDto
  options: IDisplayLookupDto[]
}
