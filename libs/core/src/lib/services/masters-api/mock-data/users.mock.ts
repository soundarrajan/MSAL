import * as _ from 'lodash';
import { ILookupDto } from '../../../lookups/lookup-dto.interface';

export const MockUsersLookup: ILookupDto[] = [
  { id: 1, name: 'Jeffrey Ward' },
  { id: 2, name: 'Alexander Simmons' },
  { id: 3, name: 'Grace Daniels' },
  { id: 4, name: 'Ashley Gonzales' },
  { id: 5, name: 'Kelly Mendez' },
  { id: 6, name: 'Eugene Diaz' },
  { id: 7, name: 'Thomas Collins' },
  { id: 8, name: 'Melissa Long' },
  { id: 9, name: 'Kelly Fox' },
  { id: 10, name: 'Olivia Wong' },
  ..._.range(100).map((__, index) => ({ id: index + 11, name: `JohnDoe ${index + 11}` }))
];
