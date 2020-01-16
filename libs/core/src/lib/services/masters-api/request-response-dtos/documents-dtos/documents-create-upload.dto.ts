import { IDocumentsItemDto } from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents.dto";

export interface IDocumentsCreateUploadRequest {
  file: string | Blob;
  request: IDocumentsItemDto;
}

export interface IDocumentsCreateUploadResponse {
  matchedCount: number;
}
