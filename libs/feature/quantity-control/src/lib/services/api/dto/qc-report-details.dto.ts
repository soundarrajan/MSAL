import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';

export interface IQcReportDetailsDto {
  id: number;
  portCallId: string;
  vesselName: string;
  nbOfCliams: number;
  nbOfDeliveries: number;
  status: ILookupDto;
  productTypes: IQcReportDetailsProductDto[];
  uoms: IQcReportDetailsUoms;
}

export interface IQcReportDetailsProductDto {
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
