import {
  IBaseQuantityControlRequest,
  IBaseQuantityControlResponse
} from './request-response.quantity-control.model';
import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';
import {
  IQcSoundingReportDetailsItemDto,
  IQcSoundingReportItemDto
} from '../dto/qc-report-sounding.dto';

export interface IGetSoundingReportListRequest
  extends IBaseQuantityControlRequest,
    IServerGridInfo {
  id: number;
  reference: string;
}

export interface IGetSoundingReportListResponse
  extends IBaseQuantityControlResponse {
  items: IQcSoundingReportItemDto[];
  totalCount: number;
}

export interface IGetSoundingReportDetailsRequest
  extends IBaseQuantityControlRequest,
    IServerGridInfo {
  id: number;
}

export interface IGetSoundingReportDetailsResponse
  extends IBaseQuantityControlResponse {
  items: IQcSoundingReportDetailsItemDto[];
  totalCount: number;
}
