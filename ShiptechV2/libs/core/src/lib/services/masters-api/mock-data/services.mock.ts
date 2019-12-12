import * as _ from 'lodash';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

export const MockServicesLookup: IDisplayLookupDto[] = [
  { id: 1, name: 'WPACANL Westpac Srv-New Zealand-Solomon Islands', displayName: 'WPACANL Westpac Srv-New Zealand-Solomon Islands' },
  ..._.range(100).map((__, index) => ({
    id: index + 10,
    name: `Some Service ${index + 10}`,
    displayName: `Some Service ${index + 10}`
  }))
];
