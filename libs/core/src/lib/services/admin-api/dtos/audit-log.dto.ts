import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import {IBaseQuantityControlRequest, IBaseQuantityControlResponse} from "../../../../../../feature/quantity-control/src/lib/services/api/request-response/request-response.quantity-control.model";
import {IServerGridInfo} from "@shiptech/core/grid/server-grid/server-grid-request-response";

export interface IQcReportDetailsAuditLogItemDto {
  businessId: number;
  date: Date | string;
  businessName: string;
  transactionType: string;
  fieldName: string;
  oldValue: string;
  newValue: string;
  oldNameValue: string;
  newNameValue: string;
  modifiedBy: IDisplayLookupDto;
  totalCount: number;
  id: number;
  isDeleted: boolean;
  modulePathUrl: string;
  clientIpAddress: string;
  userAction: string;
}

export interface IAuditLogAdminRequest extends IBaseQuantityControlRequest, IServerGridInfo {
}

export interface IAuditLogAdminResponse extends IBaseQuantityControlResponse {
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
