import * as _ from 'lodash';
import { ILookupDto } from '../../../lookups/lookup-dto.interface';

export const MockLocationsLookup: ILookupDto[] = [
  { id: 1, name: 'Carson' },
  { id: 2, name: 'Colton' },
  { id: 3, name: 'Bucharest' },
  { id: 4, name: 'Los Angeles' },
  { id: 5, name: 'San Diego' },
  { id: 6, name: 'Long Beach' },
  { id: 7, name: 'Riverside' },
  { id: 8, name: 'Anaheim' },
  ..._.range(100).map((__, index) => ({ id: index + 10, name: `Some location ${index + 10}` }))
];
