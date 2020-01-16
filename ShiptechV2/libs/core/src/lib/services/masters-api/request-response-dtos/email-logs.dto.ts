import { IDisplayLookupDto } from "@shiptech/core/lookups/display-lookup-dto.interface";
import { IServerGridInfo } from "@shiptech/core/grid/server-grid/server-grid-request-response";
import { IReconStatusLookupDto } from "@shiptech/core/lookups/known-lookups/recon-status/recon-status-lookup.interface";

export interface IEmailLogsItemDto {
  id: number;
  from: string;
  status: IReconStatusLookupDto;
  transactionType: IDisplayLookupDto;
  emailTemplateId: number;
  to: string;
  cc: string;
  bcc: string;
  body: string;
  subject: string;
  sentAt: Date | string;
  totalCount: number;
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
