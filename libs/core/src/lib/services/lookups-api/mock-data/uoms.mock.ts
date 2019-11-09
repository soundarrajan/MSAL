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
    name: 'BBL',
    conversionRate: 42,
    isBaseUom: false
  }
];
