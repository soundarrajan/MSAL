import { sample, range, values } from "lodash";
import { date, internet, name, random } from "faker";
import { IDocumentsItemDto } from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents.dto";

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
    fileId: random.number(),
    transactionType: {
      id: random.number(),
      name: random.word(),
      displayName: random.word()
    },
    referenceNo: random.number(),
    uploadedBy: {
      id: random.number(),
      name: name.firstName() + name.lastName(),
      displayName: name.firstName() + name.lastName()
    },
    uploadedOn: date.past().toISOString(),
    notes: random.word(),
    isVerified: random.boolean(),
    verifiedOn: date.past().toISOString(),
    verifiedBy: {
      id: random.number(),
      name: name.firstName() + name.lastName(),
      displayName: name.firstName() + name.lastName()
    },
    createdBy: {
      id: random.number(),
      name: name.firstName() + name.lastName(),
      displayName: name.firstName() + name.lastName()
    },
    createdOn: date.past().toISOString(),
    lastModifiedOn: date.past().toISOString(),
    lastModifiedByUser: {
      id: random.number(),
      name: name.firstName() + name.lastName(),
      displayName: name.firstName() + name.lastName()
    },
    isIncludedInMail: random.word(),
    totalCount: random.number(),
    inclusionInMail: random.word(),
    content: random.words(),
    modulePathUrl: random.word(),
    clientIpAddress: internet.ip(),
    userAction: random.word()
  };
}
