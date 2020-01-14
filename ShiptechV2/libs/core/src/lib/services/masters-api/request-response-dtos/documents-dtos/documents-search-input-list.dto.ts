import {IDisplayLookupDto} from "@shiptech/core/lookups/display-lookup-dto.interface";
import {IServerGridInfo} from "@shiptech/core/grid/server-grid/server-grid-request-response";

export interface IDocumentsSearchItemDto extends IDisplayLookupDto {
  createdBy: IDisplayLookupDto;
  createdOn: string;
  lastModifiedBy: IDisplayLookupDto;
  lastModifiedOn: string;
  isDeleted: boolean;
}

export interface IDocumentsSearchRequest extends IServerGridInfo {
}

export interface IDocumentsSearchResponse {
  payload: IDocumentsSearchItemDto[];
  matchedCount: number;
}
