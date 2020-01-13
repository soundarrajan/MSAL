import { IServerGridPagination } from '@shiptech/core/grid/server-grid/server-grid-pagination';
import { IServerGridSortsDto } from '@shiptech/core/grid/server-grid/server-grid-sorts';
import { ServerGridFilter } from '@shiptech/core/grid/server-grid/server-grid.filter';

export interface IServerGridInfo {
  pageFilters?: IServerGridPageFilters;
  pagination?: IServerGridPagination;
  sortList?: IServerGridSortsDto
  searchText?: string;
}

export interface IServerGridPageFilters {
  filters?: ServerGridFilter[];
}

