import { IBaseQuantityControlRequest, IBaseQuantityControlResponse } from './request-response.quantity-control.model';
import { IQcReportDetailsDto } from '../dto/qc-report-details.dto';

export interface IGetQcReportDetailsByIdRequest extends IBaseQuantityControlRequest {
  portCallId: string;
}

export interface IGetQcReportDetailsByIdResponse extends IBaseQuantityControlResponse {
  portCall: IQcReportDetailsDto
}
