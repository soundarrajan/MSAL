import { IDisplayLookupDto } from "@shiptech/core/lookups/display-lookup-dto.interface";
import { IServerGridInfo } from "@shiptech/core/grid/server-grid/server-grid-request-response";

export interface IEmailLogsItemDto {
  id: number;
  from: string;
  status: IDisplayLookupDto;
  transactionType: IDisplayLookupDto;
  emailTemplateId: number;
  to: string;
  cc: string;
  bcc: string;
  body: string;
  subject: string;
  sentAt: Date | string;
  totalCount: number;
  isDeleted: boolean;
  modulePathUrl: string;
  clientIpAddress: string;
  userAction: string;
}

export interface IEmailLogsRequest extends IServerGridInfo {
}

export interface IEmailLogsResponse {
  payload: IEmailLogsItemDto[];
  matchedCount: number;
}
