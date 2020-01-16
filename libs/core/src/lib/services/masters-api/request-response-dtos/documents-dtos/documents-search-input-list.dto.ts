import {IDisplayLookupDto} from "@shiptech/core/lookups/display-lookup-dto.interface";
import {IServerGridInfo} from "@shiptech/core/grid/server-grid/server-grid-request-response";

export interface IDocumentsSearchItemDto {
  createdBy: IDisplayLookupDto;
  createdOn: string;
  lastModifiedBy: IDisplayLookupDto;
  lastModifiedOn: string;
}

export interface IDocumentsSearchRequest extends IServerGridInfo {
}

export interface IDocumentsSearchResponse {
  payload: IDocumentsSearchItemDto[];
  matchedCount: number;
}
