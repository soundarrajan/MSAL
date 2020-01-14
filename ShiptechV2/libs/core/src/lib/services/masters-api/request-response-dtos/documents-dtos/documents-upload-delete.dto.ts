import {IDocumentsInterfaceExtended} from "@shiptech/core/services/masters-api/request-response-dtos/documents-request-response.interface";

export interface IDocumentsDeleteItemDto {
}

export interface IDocumentsDeleteRequest extends IDocumentsInterfaceExtended {
}

export interface IDocumentsDeleteResponse {
  matchedCount: number;
}
