import { IStatusLookupDto } from '@shiptech/core/lookups/known-lookups/status/status-lookup.interface';

export enum EmailStatusLookupEnum {
  Failed = 'Failed',
  Pending = 'Pending',
  Sent = 'Sent'
}

export const MockEmailStatusLookupEnumMap: Record<
  EmailStatusLookupEnum,
  IStatusLookupDto
> = {
  [EmailStatusLookupEnum.Failed]: {
    id: 3,
    name: 'Failed',
    displayName: 'Failed',
    code: '#ee4535'
  },
  [EmailStatusLookupEnum.Pending]: {
    id: 2,
    name: 'Pending',
    displayName: 'Pending',
    code: '#ff6978'
  },
  [EmailStatusLookupEnum.Sent]: {
    id: 1,
    name: 'Sent',
    displayName: 'Sent',
    code: '#a9d372'
  }
};
