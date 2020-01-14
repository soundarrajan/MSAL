import {IDocumentsItemDto} from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-upload-list.dto";
import {range} from "lodash";
import {random} from "faker";
import {IDocumentsSearchItemDto} from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-search-input-list.dto";

export function getMockDocumentsSearchInput(n: number): IDocumentsSearchItemDto[] {
  return range(1, n).map(id => getMockDocumentSearchInputItem(id));
}

export function getMockDocumentSearchInputItem(id: number): IDocumentsSearchItemDto {
  return {
    id,
    name: random.word(),
    displayName: random.word(),
    createdBy: {
      id: random.number(),
      name: random.word(),
      displayName: random.word()
    },
    createdOn: new Date().toString(),
    lastModifiedBy: {
      id: random.number(),
      name: random.word(),
      displayName: random.word()
    },
    lastModifiedOn: new Date().toString(),
    isDeleted: random.boolean()
  }
}
