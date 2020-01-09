import {IBaseQuantityControlRequest, IBaseQuantityControlResponse} from "./request-response.quantity-control.model";
import {IServerGridInfo} from "@shiptech/core/grid/server-grid/server-grid-request-response";
import {IQcReportDetailsAuditLogItemDto} from "../dto/qc-report-details-audit-log.dto";

export interface IGetQcReportDetailsAuditLogRequest extends IBaseQuantityControlRequest, IServerGridInfo {
}

export interface IGetQcReportDetailsAuditLogResponse extends IBaseQuantityControlResponse {
  payload: IQcReportDetailsAuditLogItemDto[];
  deletedCount: number;
  modifiedCount: number;
  matchedCount: number;
  isAcknowledged: boolean;
  isModifiedCountAvailable: boolean;
  upsertedId: number;
  status: number;
  isSuccess: boolean;
  message: string;
  error: string;
  errorMessage: string;
}
