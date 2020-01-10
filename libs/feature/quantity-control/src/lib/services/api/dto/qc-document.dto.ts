import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

export interface IQcDocumentsItemDto {
  id: number;
  name: string;
  size: number;
  documentType: IDisplayLookupDto;
  fileType: string;
  transactionType: IDisplayLookupDto;
  referenceNo: number;
  uploadedBy: IDisplayLookupDto;
  uploadedOn: Date | string;
  notes: string;
  isVerified: boolean;
  verifiedOn: Date | string;
  verifiedBy: IDisplayLookupDto;
}
