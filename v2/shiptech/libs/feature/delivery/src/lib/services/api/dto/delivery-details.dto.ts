import { IQcVesselResponsesDto } from './qc-vessel-response.dto';
import {
  IDisplayLookupDto,
  IVesselToWatchLookupDto
} from '@shiptech/core/lookups/display-lookup-dto.interface';
import { IQcVesselPortCallDto } from './qc-vessel-port-call.interface';
import { IStatusLookupDto } from '@shiptech/core/lookups/known-lookups/status/status-lookup.interface';

export interface IDeliveryDetailsDto {
  id: number;
  portCall?: IQcVesselPortCallDto;
  vessel?: IVesselToWatchLookupDto;
  nbOfClaims: number;
  nbOfDeliveries: number;
  productTypeCategories: IQcReportDetailsProductTypeDto[];
  sludgeProductType: IDisplayLookupDto;
  status: IStatusLookupDto;
  uoms: IQcReportDetailsUoms;
  vesselResponses: IQcVesselResponsesDto;
  comments?: string;
  hasSentEmail?: boolean;
  emailTransactionTypeId: number;
}
export interface IDeliveryNotesDetailsDto {
  createdOn: Date | string;
  createdBy: IDisplayLookupDto;
  note: string;
  id: number;
  orderId: number;
  isDeleted: boolean;
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
  robBeforeDeliveryUom?: IDisplayLookupDto;
  robAfterDeliveryUom?: IDisplayLookupDto;
  deliveredQtyUom?: IDisplayLookupDto;
  options: IDisplayLookupDto[];
}

export interface IDeliveryInfoForOrderDto {
  bdnNumber: string;
  id: number;
}

export class DeliveryInfoForOrder {
  bdnNumber: string;
  id: number;
  deliveryId: number;
}


export interface IDeliveryOrderSummaryDto {
  buyer: string;
  counterparty:  IDisplayLookupDto;
  id: number;
  physicalSupplier: IDisplayLookupDto;
  products: IDeliveryOrderSummaryProductDto[];
}

export interface IDeliveryOrderSummaryProductDto {
  ccai: string;
  ccaiUom: IDisplayLookupDto;
  contractProductId: number;
  convFactorMassUom: IDisplayLookupDto;
  convFactorOptions: IDisplayLookupDto;
  convFactorValue: number;
  convFactorVolumeUom: IDisplayLookupDto;
  product: IDisplayLookupDto;
}

export interface IOrderDto {
  createdAt: string;
  createdByUser:  IDisplayLookupDto;
  id: number;
  eta: IDisplayLookupDto;
  etb: IDisplayLookupDto;
}

export interface OrderInfoDetails {
  vesselName: string;
  locationName: string;
  eta: string;
  etb: string;
  request: IDisplayLookupDto
}

export interface IDeliverySpecParametersDto {
  bdnValue: number;
  claimTypes: IDisplayLookupDto;
  displayShortageTooltip: boolean;
  id: number;
  isDeleted: boolean;
  max: number;
  qualityMatch: number;
  quantityShortage: number;
  quantityShortageUomName: IDisplayLookupDto;
  uom: string;
  specParameter: IDisplayLookupDto;
}

export interface IDeliveryQuantityParametersDto {
  bdn: number;
  id: number;
  isDeleted: boolean;
  lab: string;
  parameter: IDisplayLookupDto;
  uom: string;
}

export interface DeliveryProductDto {
  qualityParameters: IDeliverySpecParametersDto[];
  quantityParameters: IDeliveryQuantityParametersDto[];
}

export class DeliveryProduct  {
  qualityParameters: any;
  quantityParameters: any;
  confirmedQuantityAmount: number;
  confirmedQuantityUom: IDisplayLookupDto;
  surveyorQuantityUom: IDisplayLookupDto;
  vesselQuantityUom: IDisplayLookupDto;
  agreedQuantityUom: IDisplayLookupDto;
  bdnQuantityUom: IDisplayLookupDto;
  vesselFlowMeterQuantityUom: IDisplayLookupDto;
  finalQuantityUom: IDisplayLookupDto;
  product: IDisplayLookupDto;
  orderedProduct: IDisplayLookupDto;
  sellerQuantityType: any;
  buyerQuantityType: any;
  physicalSupplier: IDisplayLookupDto;
  productTypeId: number;
  orderProductId: number;
  manualPricingDateOverride: boolean;
  convFactorOptions: IDisplayLookupDto;
  convFactorMassUom: IDisplayLookupDto;
  convFactorValue: number;
  convFactorVolumeUom: IDisplayLookupDto;
  pricingDate: string;

}

export class ToleranceLimits  {
  minToleranceLimit: number;
  maxToleranceLimit: number;
}

export interface IConversionInfoResponseDto {
  id: number;
  isDeleted: boolean;
  maxToleranceLimit: number;
  minToleranceLimit: number;
  orderedQtyTolerance: number;
  orderedQtyUom: IDisplayLookupDto;
  qcMaxToleranceLimit: number;
  qcMinToleranceLimit: number;
  qcToleranceLimitUom: IDisplayLookupDto;
  quantityReconciliation: IDisplayLookupDto;
  toleranceQuantityUom: IDisplayLookupDto;
  uomConversionFactors: IConversionFactorDto[];
}


export interface IConversionFactorDto {
  conversionFactor: number;
  id: number;
  isDeleted: boolean;
  sourceUom: IDisplayLookupDto;
}
