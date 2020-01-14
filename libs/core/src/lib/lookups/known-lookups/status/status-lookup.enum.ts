import { IStatusLookupDto } from '@shiptech/core/lookups/known-lookups/status/status-lookup.interface';

export enum StatusLookupEnum {
  Verified = 'Verified',
  Pending = 'Pending',
  New = 'New'
}

export const MockStatusLookupEnumMap: Record<StatusLookupEnum, IStatusLookupDto> = {
  [StatusLookupEnum.Verified]:{ id: 1, name: 'Verified', displayName: 'Verified', code: ''},
  [StatusLookupEnum.Pending]:{ id: 1, name: 'Pending', displayName: 'Pending', code: ''},
  [StatusLookupEnum.New]:{ id: 1, name: 'New', displayName: 'New', code: ''},
};
