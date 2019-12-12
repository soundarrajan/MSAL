import { IServerGridPagination } from '@shiptech/core/grid/server-grid/server-grid-pagination';
import { IServerGridSorts } from '@shiptech/core/grid/server-grid/server-grid-sorts';
import { ServerGridFilter } from '@shiptech/core/grid/server-grid/server-grid.filter';

export interface IServerGridInfo {
  pageFilters?: IServerGridPageFilters;
  pagination?: IServerGridPagination;
  sortList?: IServerGridSorts[]
  searchText?: string;
}

export interface IServerGridPageFilters {
  filters?: ServerGridFilter[];
}
