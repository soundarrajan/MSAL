import {IDocumentsUploadFileInterface} from "@shiptech/core/services/masters-api/request-response-dtos/documents-request-response.interface";

export interface IDocumentsCreateUploadItemDto {
}

export interface IDocumentsCreateUploadRequest extends IDocumentsUploadFileInterface {
}

export interface IDocumentsCreateUploadResponse {
  matchedCount: number;
}
