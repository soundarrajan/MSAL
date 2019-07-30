import { IProcurementRequestDto, IShiptechProcurementRequestsDto } from '../../models/procurement-requests.dto';
import { IBaseShiptechRequest, IBaseShiptechResponse } from './request-response.shiptech.model';

export interface IProcurementRequestsRequest extends IBaseShiptechRequest {
  payload: IShiptechProcurementRequestsDto;
}

export interface IProcurementRequestsResponse extends IBaseShiptechResponse<IProcurementRequestDto> {}
