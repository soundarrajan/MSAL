import { IDisplayLookupDto } from "@shiptech/core/lookups/display-lookup-dto.interface";
import { IServerGridInfo } from "@shiptech/core/grid/server-grid/server-grid-request-response";

export interface IAuditLogItemDto {
  id: number;
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
  isDeleted: boolean;
  modulePathUrl: string;
  clientIpAddress: string;
  userAction: string;
}

export interface IAuditLogRequest extends IServerGridInfo {
}

export interface IAuditLogResponse {
  payload: IAuditLogItemDto[];
  matchedCount: number;
}
