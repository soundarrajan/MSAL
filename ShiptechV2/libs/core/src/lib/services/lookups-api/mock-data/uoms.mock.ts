import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';

export interface IUomLookupDto extends ILookupDto {
  isBaseUom: boolean;
  conversionRate: number;
}

export const mockUomsLookup: IUomLookupDto[] = [
  {
    id: 1,
    name: 'GAL',
    conversionRate: 1,
    isBaseUom: true
  },
  {
    id: 2,
    name: 'Liters',
    conversionRate: 4.55,
    isBaseUom: false
  },
  {
    id: 3,
    name: 'BBL',
    conversionRate: 42,
    isBaseUom: false
  },
  {
    id: 4,
    name: 'BBLS',
    conversionRate: 50,
    isBaseUom: false
  },
  {
    id: 5,
    name: 'MT',
    conversionRate: 264.17,
    isBaseUom: false
  }
];
