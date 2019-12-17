import { IBaseQuantityControlRequest, IBaseQuantityControlResponse } from './request-response.quantity-control.model';
import { IQcEventLogAddedListItemDto, IQcEventLogDeletedListItemDto } from '../dto/qc-event-log-list-item.dto';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { IQcVesselPortCall } from '../../../guards/qc-vessel-port-call.interface';

export interface IQcReportSaveProductDetailsDto {
  productTypeId: number;
  logBookRobQtyBeforeDelivery: number;
  measuredRobQtyBeforeDelivery: number;
  beforeDeliveryQtyUomId: number;
  measuredRobDeliveredQty: number;
  deliveredQtyUomId: number;
  logBookRobQtyAfterDelivery: number;
  measuredRobQtyAfterDelivery: number;
  afterDeliveryQtyUomId: number;
}

export interface ISaveReportDetailsRequest extends IBaseQuantityControlRequest {
  id: number;
  portCall: IQcVesselPortCall,
  isVerifiedSludgeQty: boolean;
  sludgePercentage: number;
  comments: string;
  sludgeVesselResponseDescription: string;
  bunkerVesselResponseDescription: string;
  bunkerVesselResponseCategory: IDisplayLookupDto;
  sludgeVesselResponseCategory: IDisplayLookupDto;
  details: IQcReportSaveProductDetailsDto[];
  notes: (IQcEventLogAddedListItemDto | IQcEventLogDeletedListItemDto)[];
}

export interface ISaveReportDetailsResponse extends IBaseQuantityControlResponse {
  reportId: number;
}
