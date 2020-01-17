import { ILookupDto } from "@shiptech/core/lookups/lookup-dto.interface";

export interface IDocumentsCreateUploadDetails {
  name: string;
  documentType: ILookupDto;
  size: number;
  fileType: string;
  transactionType: ILookupDto;
}

export interface IDocumentsCreateUploadRequest {
  file: string | Blob;
  request: IDocumentsCreateUploadDetails;
}

export interface IDocumentsCreateUploadResponse {
}
