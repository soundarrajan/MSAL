import {IDocumentsExtendedInterface} from "@shiptech/core/services/masters-api/request-response-dtos/documents-request-response.interface";

export interface IDocumentsDeleteItemDto {
}

export interface IDocumentsDeleteRequest extends IDocumentsExtendedInterface {
}

export interface IDocumentsDeleteResponse {
  matchedCount: number;
}
