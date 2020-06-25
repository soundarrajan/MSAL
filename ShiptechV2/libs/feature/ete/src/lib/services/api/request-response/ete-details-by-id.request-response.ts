import {
  IBaseEteRequest,
  IBaseEteResponse
} from './request-response.ete.model';
import { IEteReportDetailsDto } from '../dto/qc-report-details.dto';

export interface IEteReportDetailsRequest extends IBaseEteRequest {
  id: number;
}

export interface IEteReportDetailsResponse
  extends IBaseEteResponse,
    IEteReportDetailsDto {}
