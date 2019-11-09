import * as _ from 'lodash';
import { ILookupDto } from '../../../lookups/lookup-dto.interface';

export interface ICounterpartyLookupDto extends ILookupDto {
  contactId: number;
  contact: string;
  phone: string;
  email: string;
}

export const MockCounterparties: ICounterpartyLookupDto[] = [
  {
    id: 1,
    name: 'Dumitru',
    contactId: 1,
    contact: 'John Doe 24S',
    phone: '+40 766 320 59',
    email: 'john.doe@inatech.com'
  },
  ..._.range(3000).map(i => ({
    id: i,
    name: 'Name' + i,
    contactId: Math.floor(Math.random() * 100000000),
    contact: 'Contact Name' + i,
    phone: (10000000 + Math.floor(Math.random() * 100000000)).toString(),
    email: Math.floor(Math.random() * 100000000) + '@inatech.com'
  }))
];
