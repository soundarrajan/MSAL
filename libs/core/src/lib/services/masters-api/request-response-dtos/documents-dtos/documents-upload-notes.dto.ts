import {IServerGridInfo} from "@shiptech/core/grid/server-grid/server-grid-request-response";

export interface IDocumentsNotesItemDto {
}

export interface IDocumentsNotesRequest {
  Id: number;
  Notes: string;
}

export interface IDocumentsNotesResponse {
  payload: number;
  matchedCount: number;
}
