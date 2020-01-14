import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

export interface IStatusLookupDto extends IDisplayLookupDto{
  code: string;
}
