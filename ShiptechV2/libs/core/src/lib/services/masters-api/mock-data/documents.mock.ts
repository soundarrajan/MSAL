import {range} from "lodash";
import {IDocumentsItemDto} from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents.dto";
import {Chance} from 'chance';

const chance = new Chance();

export function getMockDocuments(n: number): IDocumentsItemDto[] {
  return range(1, n).map(id => getMockDocumentItem(id));
}

export function getMockDocumentItem(id: number): IDocumentsItemDto {

  return {
    id,
    name: chance.word(),
    size: chance.d100(),
    documentType: {
      id: chance.d100(),
      name: chance.word(),
      displayName: chance.word()
    },
    fileType: chance.word(),
    fileId: chance.d100(),
    transactionType: {
      id: chance.d100(),
      name: chance.word(),
      displayName: chance.word()
    },
    referenceNo: chance.d100(),
    uploadedBy: {
      id: chance.d100(),
      name: chance.name(),
      displayName: chance.name()
    },
    uploadedOn: chance.date().toISOString(),
    notes: chance.word(),
    isVerified: chance.bool(),
    verifiedOn: chance.date().toISOString(),
    verifiedBy: {
      id: chance.d100(),
      name: chance.name(),
      displayName: chance.name()
    },
    createdBy: {
      id: chance.d100(),
      name: chance.name(),
      displayName: chance.name()
    },
    createdOn: chance.date().toISOString(),
    lastModifiedOn: chance.date().toISOString(),
    lastModifiedByUser: {
      id: chance.d100(),
      name: chance.name(),
      displayName: chance.name()
    },
    isIncludedInMail: chance.word(),
    totalCount: chance.d100(),
    inclusionInMail: chance.word(),
    content: chance.paragraph(),
    modulePathUrl: chance.url(),
    clientIpAddress: chance.ipv6(),
    userAction: chance.word()
  };
}
