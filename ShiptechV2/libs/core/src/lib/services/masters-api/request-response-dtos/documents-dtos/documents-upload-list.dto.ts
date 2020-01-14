import { IDisplayLookupDto } from "@shiptech/core/lookups/display-lookup-dto.interface";
import { IServerGridInfo } from "@shiptech/core/grid/server-grid/server-grid-request-response";

export interface IDocumentsItemDto {
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

export interface IDocumentsListRequest extends IServerGridInfo {
}

export interface IDocumentsListResponse {
  payload: IDocumentsItemDto[];
  matchedCount: number;
}
