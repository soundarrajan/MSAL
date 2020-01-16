import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import getVesselsResponseMock from './get-vessels-response.mock.json';
import { IVesselMasterDto } from '@shiptech/core/services/masters-api/request-response-dtos/vessel';

export const MockVesselsLookup: IDisplayLookupDto[] = (<IVesselMasterDto[]>getVesselsResponseMock).map(v => ({
  id: v.id,
  name: v.name,
  displayName: v.displayName
}));
