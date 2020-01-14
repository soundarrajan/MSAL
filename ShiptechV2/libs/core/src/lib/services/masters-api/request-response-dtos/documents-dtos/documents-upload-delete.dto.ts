import {IServerGridInfo} from "@shiptech/core/grid/server-grid/server-grid-request-response";

export interface IDocumentsDeleteItemDto {
}

export interface IDocumentsDeleteRequest extends IServerGridInfo {
}

export interface IDocumentsDeleteResponse {
  matchedCount: number;
}
