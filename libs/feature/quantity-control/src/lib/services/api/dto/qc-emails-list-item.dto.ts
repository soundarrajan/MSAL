import { IDisplayLookupDto } from "@shiptech/core/lookups/display-lookup-dto.interface";

export interface IQcEmailLogsItemDto {
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
