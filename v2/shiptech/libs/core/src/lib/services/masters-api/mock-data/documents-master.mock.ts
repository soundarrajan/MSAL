import { range } from 'lodash';
import { IDocumentsMasterDto } from '@shiptech/core/services/masters-api/request-response-dtos/documents-dtos/documents-master.dto';
import { Chance } from 'chance';

const chance = new Chance();

export function getMockDocumentMasterItem(id: number): IDocumentsMasterDto {
  return {
    id,
    name: chance.name(),
    displayName: chance.name(),
    createdBy: {
      id: chance.d100(),
      name: chance.name(),
      displayName: chance.name()
    },
    createdOn: chance.date().toISOString(),
    lastModifiedBy: {
      id: chance.d100(),
      name: chance.name(),
      displayName: chance.name()
    },
    lastModifiedOn: chance.date().toISOString(),
    isDeleted: chance.bool()
  };
}

export function getMockDocumentsMaster(n: number): IDocumentsMasterDto[] {
  return range(1, n).map(id => getMockDocumentMasterItem(id));
}
