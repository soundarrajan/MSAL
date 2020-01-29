import {IDisplayLookupDto} from "@shiptech/core/lookups/display-lookup-dto.interface";
import {IServerGridInfo} from "@shiptech/core/grid/server-grid/server-grid-request-response";

export interface IDocumentsMasterDto extends IDisplayLookupDto {
  id: number;
  name: string;
  displayName: string;
  createdBy: IDisplayLookupDto;
  createdOn: string;
  lastModifiedBy: IDisplayLookupDto;
  lastModifiedOn: string;
  isDeleted: boolean;
}

export interface IDocumentsMasterRequest extends IServerGridInfo {
}

export interface IDocumentsMasterResponse {
  payload: IDocumentsMasterDto[];
  matchedCount: number;
}
