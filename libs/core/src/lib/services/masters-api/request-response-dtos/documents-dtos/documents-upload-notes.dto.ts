import {IServerGridInfo} from "@shiptech/core/grid/server-grid/server-grid-request-response";

export interface IDocumentsNotesItemDto {
}

export interface IDocumentsNotesRequest extends IServerGridInfo {
}

export interface IDocumentsNotesResponse {
  payload: number;
  matchedCount: number;
}
