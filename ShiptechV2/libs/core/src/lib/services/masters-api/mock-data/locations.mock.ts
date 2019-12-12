import * as _ from 'lodash';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

export const MockLocationsLookup: IDisplayLookupDto[] = [
  { id: 1, name: 'Carson', displayName: 'Carson' },
  { id: 2, name: 'Colton', displayName: 'Colton' },
  { id: 3, name: 'Bucharest', displayName: 'Bucharest' },
  { id: 4, name: 'Los Angeles', displayName: 'Los Angeles' },
  { id: 5, name: 'San Diego', displayName: 'San Diego' },
  { id: 6, name: 'Long Beach', displayName: 'Long Beach' },
  { id: 7, name: 'Riverside', displayName: 'Riverside' },
  { id: 8, name: 'Anaheim', displayName: 'Anaheim' },
  ..._.range(100).map((__, index) => ({
    id: index + 10,
    name: `Some location ${index + 10}`,
    displayName: `Some location ${index + 10}`
  }))
];
