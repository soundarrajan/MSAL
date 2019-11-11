import { IBaseQuantityControlRequest, IBaseQuantityControlResponse } from './request-response.quantity-control.model';
import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';
import { IQcSoundingReportDetailsItemDto, IQcSoundingReportItemDto } from '../dto/qc-report-sounding.dto';


export interface IGetSoundingReportListRequest extends IBaseQuantityControlRequest, IServerGridInfo {
  portCallId: number;
}

export interface IGetSoundingReportListResponse extends IBaseQuantityControlResponse {
  items: IQcSoundingReportItemDto[],
  totalItems: number;
}

export interface IGetSoundingReportDetailsRequest extends IBaseQuantityControlRequest, IServerGridInfo {
  soundingReportId: number;
}

export interface IGetSoundingReportDetailsResponse extends IBaseQuantityControlResponse {
  items: IQcSoundingReportDetailsItemDto[],
  totalItems: number;
}
