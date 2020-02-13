import {IVesselPortCallMasterDto} from '@shiptech/core/services/masters-api/request-response-dtos/vessel-port-call';
import {range, sample} from 'lodash';
import {MockLocationsLookup} from '@shiptech/core/services/masters-api/mock-data/locations.mock';
import {MockServicesLookup} from '@shiptech/core/services/masters-api/mock-data/services.mock';
import {Chance} from 'chance';

const chance = new Chance();

export function getMockVesselPortCallsEventsLog(n: number): IVesselPortCallMasterDto[] {
  return range(1, n).map(id => getMockVesselPortCallsItem(id, n));
}

export function getMockVesselPortCallsItem(id: number, total: number): IVesselPortCallMasterDto {
  const firstName = chance.first();
  return {
    id: id,
    name: firstName,
    displayName: firstName,
    eta: chance.date().toISOString(),
    etb: chance.date().toISOString(),
    etd: chance.date().toISOString(),
    location: sample(MockLocationsLookup),
    portCallId: chance.integer({min: Math.pow(10, 15), max: Math.pow(10, 16) - 1}).toString(),
    service: sample(MockServicesLookup),
    voyageId: chance.integer({min: Math.pow(10, 15), max: Math.pow(10, 16) - 1}),
    voyageReference: chance.string({alpha: true}).toUpperCase(),
    totalCount: total,
  };
}

