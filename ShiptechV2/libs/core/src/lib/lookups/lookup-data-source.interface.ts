import { Observable } from 'rxjs';
import { ILookupFilter } from './lookup-filter';
import { ILookupDto } from './lookup-dto.interface';

export type LookupDataSource<TResponse = ILookupDto, TFilter extends ILookupFilter = ILookupFilter> = (filter: TFilter) => Observable<TResponse[]>;

export type LookupGridDataSource<TResponse = ILookupDto, TFilter extends ILookupFilter = ILookupFilter> = (filter: TFilter) => Observable<LookupGridResponse<TResponse>>;

export interface LookupGridResponse<TResponse = ILookupDto> {
  items: TResponse[];
  totalCount: number;
}
