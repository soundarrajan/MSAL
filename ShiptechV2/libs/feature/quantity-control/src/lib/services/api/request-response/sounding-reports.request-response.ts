import { IBaseQuantityControlRequest, IBaseQuantityControlResponse } from './request-response.quantity-control.model';
import { IApiGridRequestDto } from '@shiptech/core/grid/api-grid-request-response.dto';

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

export interface IGetSoundingReportListRequest extends IBaseQuantityControlRequest, IApiGridRequestDto {

}

export interface IGetSoundingReportListResponse extends IBaseQuantityControlResponse {
  items: IGetSoundingReportListItemDto[],
  totalItems: number;
}
