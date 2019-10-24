import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';

export interface IPortCallDto {
  portCallId: number;
  vesselName: string;
  nbOfCliams: number;
  nbOfDeliveries: number;
  status: ILookupDto;
  productTypes: IPortCallProductDto[];
  uoms: IPortCallUoms;
}

export interface IPortCallProductDto {
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

export interface IPortCallUoms {
  robBeforeDeliveryUom: ILookupDto,
  robAfterDeliveryUom: ILookupDto,
  deliveredQtyUom: ILookupDto
}
