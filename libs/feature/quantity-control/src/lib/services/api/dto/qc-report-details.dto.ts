import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';
import { IQcVesselResponsesDto } from './qc-vessel-response.dto';

export interface IQcReportDetailsDto {
  id: number;
  portCallId: string;
  vesselName: string;
  nbOfCliams: number;
  nbOfDeliveries: number;
  status: ILookupDto;
  productTypes: IQcReportDetailsProductTypeDto[];
  uoms: IQcReportDetailsUoms;
  vesselResponses: IQcVesselResponsesDto;
  comment: string;
}

export interface IQcReportDetailsProductTypeDto {
  productTypeName: string;
  productTypeId: number;
  robBeforeDelivery: IQcReportDetailsRob;
  deliveredQty: IQcReportDetailsDeliveredQty;
  robAfterDelivery: IQcReportDetailsRob;
}

export interface IQcReportDetailsDeliveredQty {
  bdnQty: number;
  messuredDeliveredQty: number;
}

export interface IQcReportDetailsRob {
  logBookROB: number;
  measuredROB: number;
}

export interface IQcReportDetailsUoms {
  robBeforeDeliveryUom: ILookupDto,
  robAfterDeliveryUom: ILookupDto,
  deliveredQtyUom: ILookupDto
}
