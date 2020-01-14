import { range } from "lodash";
import { date, random } from "faker";
import { IDocumentsItemDto } from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-upload-list.dto";

export function getMockDocuments(n: number): IDocumentsItemDto[] {
  return range(1, n).map(id => getMockDocumentItem(id));
}

export function getMockDocumentItem(id: number): IDocumentsItemDto {

  return {
    id,
    name: random.word(),
    size: random.number(),
    documentType: {
      id: random.number(),
      name: random.word(),
      displayName: random.word()
    },
    fileType: random.word(),
    transactionType: {
      id: random.number(),
      name: random.word(),
      displayName: random.word()
    },
    referenceNo: random.number(),
    uploadedBy: {
      id: random.number(),
      name: random.word(),
      displayName: random.word()
    },
    uploadedOn: date.past().toISOString(),
    notes: random.word(),
    isVerified: random.boolean(),
    verifiedOn: date.past().toISOString(),
    verifiedBy: {
      id: random.number(),
        name: random.word(),
        displayName: random.word()
    }
  };
}
