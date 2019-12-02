import { IQcVesselResponsesDto } from './qc-vessel-response.dto';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

export interface IQcReportDetailsDto {
  id: number
  portCallId: string;
  vesselName: string;
  vesselId: number;
  voyageReference: string;
  vesselVoyageDetailId: number;
  nbOfClaims: number;
  nbOfDeliveries: number;
  productTypeCategories: IQcReportDetailsProductTypeDto[];
  status: IDisplayLookupDto;
  uoms: IQcReportDetailsUoms;
  vesselResponses: IQcVesselResponsesDto;
  comments: string;
}

export interface IQcReportDetailsProductTypeDto {
  id: number;
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
  robBeforeDeliveryUom: IDisplayLookupDto,
  robAfterDeliveryUom: IDisplayLookupDto,
  deliveredQtyUom: IDisplayLookupDto
  options: IDisplayLookupDto[]
}
