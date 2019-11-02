import { IBaseQuantityControlRequest, IBaseQuantityControlResponse } from './request-response.quantity-control.model';
import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';

export interface IGetSoundingReportListItemDto {
  vesselName: string;
  vesselCode: string;
  imoNo: number;
  reportId: number;
  voyageReference: string;
  soundedOn: string;
  soundingReason: string;
  computedRobLsfo: number;
  measuredRobLsfo	: number;
  robLsfoDiff: number;
  computedRobDogo: number;
  measuredRobDogo: number;
  robDogoDiff: number;
}

export interface IGetSoundingReportListRequest extends IBaseQuantityControlRequest, IServerGridInfo {

}

export interface IGetSoundingReportListResponse extends IBaseQuantityControlResponse {
  items: IGetSoundingReportListItemDto[],
  totalItems: number;
}
