import {
  IBaseQuantityControlRequest,
  IBaseQuantityControlResponse
} from './request-response.quantity-control.model';
import { IQcReportDetailsDto } from '../dto/qc-report-details.dto';

export interface IQcReportDetailsRequest extends IBaseQuantityControlRequest {
  id: number;
}

export interface IQcReportDetailsResponse
  extends IBaseQuantityControlResponse,
    IQcReportDetailsDto {}
