import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

export interface IDocumentsItemDto {
  name: string;
  documentType: IDisplayLookupDto;
  size: number;
  fileType: string;
  transactionType: IDisplayLookupDto;
  fileId: number;
  uploadedBy: IDisplayLookupDto;
  uploadedOn: string;
  notes: string;
  isVerified: boolean;
  referenceNo: number;
  createdBy: IDisplayLookupDto;
  createdOn: string;
  lastModifiedByUser: IDisplayLookupDto;
  lastModifiedOn: string;
  id: number;
  verifiedBy: IDisplayLookupDto;
  verifiedOn: string;
  inclusionInMail: string;
  totalCount: number;
  isIncludedInMail: string;
  content: string;
  modulePathUrl: string;
  clientIpAddress: string;
  userAction: string;
}

export interface IDocumentsListRequest extends IServerGridInfo {}

export interface IDocumentsListResponse {
  payload: IDocumentsItemDto[];
  matchedCount: number;
}
