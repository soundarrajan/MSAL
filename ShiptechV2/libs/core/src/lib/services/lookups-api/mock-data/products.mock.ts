import { ILookupDto } from '../../../lookups/lookup-dto.interface';
import * as _ from 'lodash';

export const MockProductsLookup: ILookupDto[] = [
  { id: 1, name: 'Cadalene' },
  { id: 2, name: 'Castrol' },
  { id: 3, name: 'Common ethanol fuel mixtures' },
  { id: 4, name: 'Cosmoline' },
  { id: 5, name: 'Cutting fluid' },
  { id: 6, name: 'Kerosene' },
  { id: 7, name: 'Orimulsion' },
  { id: 8, name: 'Oxygenate' },
  { id: 9, name: 'Asphalt' },
  { id: 10, name: 'Sealcoat' },
  { id: 11, name: 'Shell Rotella T' },
  { id: 12, name: 'Techron' },
  { id: 13, name: 'Top Tier Detergent Gasoline' },
  { id: 14, name: 'Tractor vaporising oil' },
  { id: 15, name: 'Texas Low Emission Diesel standards' },
  { id: 16, name: 'Mazut' },
  { id: 17, name: 'Microcrystalline wax' },
  { id: 18, name: 'Mineral oil' },
  { id: 19, name: 'Morris J. Berman oil spill' },
  { id: 20, name: 'Template:Motor fuel' },
  { id: 21, name: 'Motul (company)' },
  ..._.range(100).map((__, index) => ({ id: index + 30, name: `Product ${index + 30}` }))
];
