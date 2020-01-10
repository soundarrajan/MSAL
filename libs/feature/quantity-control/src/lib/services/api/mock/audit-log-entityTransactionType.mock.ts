import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

export interface IEttLookupDto extends IDisplayLookupDto {

}

export const mockEttLookup: IDisplayLookupDto[] = [
  {
    id: 1,
    name: 'QuantityControlReport',
    displayName: ' '
  }
];
