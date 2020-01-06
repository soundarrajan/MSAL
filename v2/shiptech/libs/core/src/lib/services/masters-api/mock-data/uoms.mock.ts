import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

export interface IUomLookupDto extends IDisplayLookupDto {

}

export const mockUomsLookup: IDisplayLookupDto[] = [
  {
    id: 1,
    name: 'GAL',
    displayName: 'GAL'
  },
  {
    id: 2,
    name: 'Liters',
    displayName: 'Liters'
  },
  {
    id: 3,
    name: 'BBL',
    displayName: 'BBL'
  },
  {
    id: 4,
    name: 'BBLS',
    displayName: 'BBLS'
  },
  {
    id: 5,
    name: 'MT',
    displayName: 'MT'
  }
];
