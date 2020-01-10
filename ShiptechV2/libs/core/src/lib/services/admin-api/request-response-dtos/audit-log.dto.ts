import {IDisplayLookupDto} from '@shiptech/core/lookups/display-lookup-dto.interface';
import {IBaseQuantityControlResponse} from "../../../../../../feature/quantity-control/src/lib/services/api/request-response/request-response.quantity-control.model";
import {IServerGridInfo} from "@shiptech/core/grid/server-grid/server-grid-request-response";

export interface IAuditLogItemDto {
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

export interface IAuditLogRequest extends IServerGridInfo {
}

export interface IAuditLogResponse extends IBaseQuantityControlResponse {
  payload: IAuditLogItemDto[];
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
