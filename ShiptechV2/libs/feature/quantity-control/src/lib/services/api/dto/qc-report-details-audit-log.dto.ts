import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

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
