import {IDisplayLookupDto} from "@shiptech/core/lookups/display-lookup-dto.interface";
import {IServerGridInfo} from "@shiptech/core/grid/server-grid/server-grid-request-response";

export interface IDocumentsCreateUploadItemDto {
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
  referenceNo: string;
  createdBy: IDisplayLookupDto;
  createdOn: string;
  lastModifiedByUser: string;
  lastModifiedOn: string;
  id: number;
  isDeleted: boolean;
}

export interface IDocumentsCreateUploadRequest extends IServerGridInfo {
}

export interface IDocumentsCreateUploadResponse {
  payload: IDocumentsCreateUploadItemDto[];
  matchedCount: number;
}
