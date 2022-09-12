import { ILookupFilter } from './lookup-filter';
import { ILookupDto } from './lookup-dto.interface';

export interface ILookupRequest<TFilter extends ILookupFilter = ILookupFilter> {
  filter?: TFilter;
  byPassCache?: boolean;
}

export interface ILookupResponse<TResponseDto = ILookupDto> {
  items: TResponseDto[];
}
