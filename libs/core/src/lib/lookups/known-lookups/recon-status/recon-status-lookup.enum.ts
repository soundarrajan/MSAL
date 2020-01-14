import { IStatusLookupDto } from '@shiptech/core/lookups/known-lookups/status/status-lookup.interface';

export enum ReconStatusLookupEnum {
  Matched = 'Matched',
  WithinLimit = 'WithinLimit',
  NotMatched = 'Unmatched'
}

export const MockReconStatusLookupEnumMap: Record<ReconStatusLookupEnum, IStatusLookupDto> = {
  [ReconStatusLookupEnum.Matched]: { id: 1, name: ReconStatusLookupEnum.Matched, displayName: 'Matched', code: '#a9d372' },
  [ReconStatusLookupEnum.WithinLimit]: { id: 1, name: ReconStatusLookupEnum.WithinLimit, displayName: 'Within Limit', code: '#1AB01E' },
  [ReconStatusLookupEnum.NotMatched]: { id: 1, name: ReconStatusLookupEnum.NotMatched, displayName: 'Not Matched', code: '#ee4535' }
};
