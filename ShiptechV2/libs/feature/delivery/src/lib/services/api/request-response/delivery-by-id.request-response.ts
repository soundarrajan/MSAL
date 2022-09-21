
import { IConversionInfoResponseDto, IDeliveryDetailsDto, IDeliveryInfoForOrderDto, IDeliveryOrderSummaryDto, IDeliveryQuantityParametersDto, IDeliverySpecParametersDto, IOrderDto,IDeliveryNotesDetailsDto } from '../dto/delivery-details.dto';
import { IQcReportDetailsDto } from '../dto/qc-report-details.dto';
import { IBaseDeliveryRequest, IBaseDeliveryResponse } from './request-response.delivery.model';

export interface IDeliveryDetailsRequest extends IBaseDeliveryRequest {
  id: number;
}

export interface IDeliveryDetailsResponse
  extends IBaseDeliveryResponse,
  IDeliveryDetailsDto {}

export interface IDeliveryInfoForOrderRequest extends IBaseDeliveryRequest {
  id: number;
}


export interface IDeliveryNotesDetailsResponse  extends IBaseDeliveryResponse, IDeliveryNotesDetailsDto {
   
  }
 

export interface IDeliveryInfoForOrderResponse
  extends IBaseDeliveryResponse,
  IDeliveryInfoForOrderDto {}


export interface IDeliveryOrderSummaryRequest extends IBaseDeliveryRequest {
  id: number;
}
  
  
export interface IDeliveryOrderSummaryResponse
  extends IBaseDeliveryResponse,
  IDeliveryOrderSummaryDto {}

export interface IOrderRequest extends IBaseDeliveryRequest {
  id: number;
}
  
  
export interface IOrderResponse
  extends IBaseDeliveryResponse,
  IOrderDto {}

export interface IDeliverySpecParametersResponse
  extends IBaseDeliveryResponse,
  IDeliverySpecParametersDto {}

export interface IDeliveryQuantityParametersResponse
  extends IBaseDeliveryResponse,
  IDeliveryQuantityParametersDto {}

export interface IDeliveryConversionInfoResponse
  extends IBaseDeliveryResponse,
  IConversionInfoResponseDto {}
