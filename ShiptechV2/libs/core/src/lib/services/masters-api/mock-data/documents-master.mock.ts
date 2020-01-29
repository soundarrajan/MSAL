import {range} from "lodash";
import {date, random} from "faker";
import {IDocumentsMasterDto} from "@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-master.dto";

export function getMockDocumentsMaster(n: number): IDocumentsMasterDto[] {
  return range(1, n).map(id => getMockDocumentMasterItem(id));
}

export function getMockDocumentMasterItem(id: number): IDocumentsMasterDto {

  return {
    id,
    name: random.word(),
    displayName: random.word(),
    createdBy: {
      id: random.number(),
      name: random.word(),
      displayName: random.word()
    },
    createdOn: date.past().toISOString(),
    lastModifiedBy: {
      id: random.number(),
      name: random.word(),
      displayName: random.word()
    },
    lastModifiedOn: date.past().toISOString(),
    isDeleted: random.boolean()
  };
}
