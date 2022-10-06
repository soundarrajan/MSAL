import { toQueryString } from '../utils/QueryString';
import { IPageInfo } from '../grid/page-info.interface';

export const LookupsDefaultPageSize = 10;

export interface ILookupFilter extends IPageInfo {
  contains?: string;
  startsWith?: string;
  includeInactive?: boolean;
  page?: number;
  pageSize?: number;
  sorts?: any[];
}

export class LookupFilter implements ILookupFilter {
  contains?: string;
  startsWith?: string;
  includeInactive?: boolean;
  page?: number;
  pageSize?: number;
  sorts?: any[];

  constructor({
    startsWith,
    contains,
    page,
    pageSize,
    includeInactive,
    sorts
  }: Partial<LookupFilter> = {}) {
    // Note: Keys with it's value undefined will be omitted from the query string.
    // Note: We do not want to include default values, backend will handle default values,
    // Note: this way we keep clean request  urls.
    this.startsWith = startsWith !== '' ? startsWith : undefined;
    this.contains = contains !== '' ? contains : undefined;
    this.pageSize = pageSize;
    this.page = page >= 0 ? page : undefined;
    this.includeInactive = includeInactive;
    this.sorts = (sorts || []).length > 0 ? sorts : undefined;
  }

  toQueryString(): string {
    return toQueryString(this);
  }
}
