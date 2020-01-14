import {IDocumentsCreateUploadItemDto} from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-create-upload.dto";
import {IDocumentsInterfaceExtended} from "@shiptech/core/services/masters-api/request-response-dtos/documents-request-response.interface";

export interface IDocumentsUpdateItemDto {
}

export interface IDocumentsUpdateRequest extends IDocumentsInterfaceExtended {
}

export interface IDocumentsUpdateResponse {
  matchedCount: number;
}
