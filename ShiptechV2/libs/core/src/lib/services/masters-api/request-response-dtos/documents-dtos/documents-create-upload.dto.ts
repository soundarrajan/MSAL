import { ILookupDto } from "@shiptech/core/lookups/lookup-dto.interface";

export interface IDocumentsCreateUploadDetails {
  name: string;
  documentType: ILookupDto;
  size: number;
  fileType: string;
  transactionType: ILookupDto;
  referenceNo: number;
}

export interface IDocumentsCreateUploadRequest {
  Payload: IDocumentsCreateUploadDetails
}

export interface IDocumentsCreateUploadResponse {
}
