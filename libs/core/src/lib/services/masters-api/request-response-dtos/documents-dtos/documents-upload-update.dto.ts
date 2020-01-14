import {IServerGridInfo} from "@shiptech/core/grid/server-grid/server-grid-request-response";

export interface IDocumentsUploadItemDto {
}

export interface IDocumentsUploadRequest extends IServerGridInfo {
}

export interface IDocumentsUploadResponse {
  matchedCount: number;
}
