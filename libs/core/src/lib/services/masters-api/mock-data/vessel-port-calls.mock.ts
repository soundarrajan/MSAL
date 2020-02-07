import { IVesselPortCallMasterDto } from '@shiptech/core/services/masters-api/request-response-dtos/vessel-port-call';
import { sample, range } from 'lodash';
import { name, date, random } from 'faker';
import { MockLocationsLookup } from '@shiptech/core/services/masters-api/mock-data/locations.mock';
import { MockServicesLookup } from '@shiptech/core/services/masters-api/mock-data/services.mock';

export function getMockVesselPortCallsEventsLog(n: number): IVesselPortCallMasterDto[] {
  return range(1, n).map(id => getMockVesselPortCallsItem(id, n));
}

export function getMockVesselPortCallsItem(id: number, total: number): IVesselPortCallMasterDto {
  const firstName = name.firstName();
  return {
    id: id,
    name: firstName,
    displayName: firstName,
    eta: date.recent().toISOString(),
    etb: date.recent().toISOString(),
    etd: date.recent().toISOString(),
    location: sample(MockLocationsLookup),
    portCallId: random.number({ min: Math.pow(10, 15), max: Math.pow(10, 16) - 1 }).toString(),
    service: sample(MockServicesLookup),
    voyageId: random.number({ min: Math.pow(10, 15), max: Math.pow(10, 16) - 1 }),
    voyageReference: random.alphaNumeric(5).toUpperCase(),
    totalCount: total,
  };
}

