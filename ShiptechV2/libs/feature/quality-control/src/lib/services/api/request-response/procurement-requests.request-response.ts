import { IProcurementRequestDto, IProcurementOrdersRequest } from '../../models/procurement-requests.dto';
import { IBaseShiptechRequest, IBaseShiptechResponse } from './request-response.shiptech.model';

export interface IProcurementRequestsRequest extends IBaseShiptechRequest {
  payload: IProcurementOrdersRequest;
}

export interface IProcurementRequestsResponse extends IBaseShiptechResponse<IProcurementRequestDto> {}
