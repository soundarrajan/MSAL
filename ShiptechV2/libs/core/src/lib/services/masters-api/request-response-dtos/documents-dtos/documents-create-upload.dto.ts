import {IServerGridInfo} from "@shiptech/core/grid/server-grid/server-grid-request-response";
import {IDocumentsInterface} from "@shiptech/core/services/masters-api/request-response-dtos/documents-request-response.interface";

export interface IDocumentsCreateUploadItemDto {
}

export interface IDocumentsCreateUploadRequest extends IDocumentsInterface {
}

export interface IDocumentsCreateUploadResponse {
  matchedCount: number;
}
