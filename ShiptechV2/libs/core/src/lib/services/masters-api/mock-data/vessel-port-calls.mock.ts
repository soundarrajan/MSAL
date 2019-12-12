import { IVesselPortCallMasterDto } from '@shiptech/core/services/masters-api/dtos/vessel-port-call';
import * as _ from 'lodash';
import * as faker from 'faker';
import { MockLocationsLookup } from '@shiptech/core/services/masters-api/mock-data/locations.mock';
import { MockServicesLookup } from '@shiptech/core/services/masters-api/mock-data/services.mock';

export function getMockVesselPortCallsEventsLog(n: number): IVesselPortCallMasterDto[] {
  return _.range(1, n).map(id => getMockVesselPortCallsItem(id));
}

export function getMockVesselPortCallsItem(id: number): IVesselPortCallMasterDto {
  const name = faker.name.firstName();
  return {
    id: id,
    name: name,
    displayName: name,
    eta: faker.date.recent().toISOString(),
    etb: faker.date.recent().toISOString(),
    etd: faker.date.recent().toISOString(),
    location: _.sample(MockLocationsLookup),
    portCallId: faker.random.number({ min: Math.pow(10, 15), max: Math.pow(10, 16) - 1 }).toString(),
    service: _.sample(MockServicesLookup),
    voyageId: faker.random.number({ min: Math.pow(10, 15), max: Math.pow(10, 16) - 1 }),
    voyageReference: faker.random.alphaNumeric(5).toUpperCase(),
  };
}

