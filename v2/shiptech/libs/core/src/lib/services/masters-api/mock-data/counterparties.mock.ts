import * as _ from 'lodash';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

export interface ICounterpartyLookupDto extends IDisplayLookupDto {
  contactId: number;
  contact: string;
  phone: string;
  email: string;
}

export const MockCounterparties: ICounterpartyLookupDto[] = [
  {
    id: 1,
    name: 'Developer',
    displayName: 'Developer',
    contactId: 1,
    contact: 'John Doe 24S',
    phone: '+40 766 320 59',
    email: 'john.doe@inatech.com'
  },
  ..._.range(3000).map(i => ({
    id: i,
    name: `Person ${i}`,
    displayName: `Person ${i}`,
    contactId: Math.floor(window.crypto.getRandomValues( new Uint8Array(1)) * 100000000),
    contact: 'Contact Name' + i,
    phone: (10000000 + Math.floor(window.crypto.getRandomValues( new Uint8Array(1)) * 100000000)).toString(),
    email: Math.floor(window.crypto.getRandomValues( new Uint8Array(1)) * 100000000) + '@inatech.com'
  }))
];
