import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';

export interface IQcReportViewDto {
  portCallId: string;
  vesselName: string;
  nbOfCliams: number;
  nbOfDeliveries: number;
  status: ILookupDto;
  productTypes: IQcReportViewProductDto[];
  uoms: IQcReportViewUoms;
}

export interface IQcReportViewProductDto {
  productTypeName: string;
  productTypeId: number;
  robBeforeDelivery: IPortCallRob;
  deliveredQty: IPortCallDeliveredQty;
  robAfterDelivery: IPortCallRob;
}

export interface IPortCallDeliveredQty {
  bdnQty: number;
  messuredDeliveredQty: number;
}

export interface IPortCallRob {
  logBookROB: number;
  measuredROB: number;
}

export interface IQcReportViewUoms {
  robBeforeDeliveryUom: ILookupDto,
  robAfterDeliveryUom: ILookupDto,
  deliveredQtyUom: ILookupDto
}
