import { IServerGridPagination } from '@shiptech/core/grid/server-grid/server-grid-pagination';
import { IServerGridSorts, IServerGridSortsDto } from '@shiptech/core/grid/server-grid/server-grid-sorts';
import { ServerGridFilter } from '@shiptech/core/grid/server-grid/server-grid.filter';
import { ServerGridFilterFilter } from "@shiptech/core/grid/server-grid/server-grid-filter.filter";

export interface IServerGridInfo {
  pageFilters?: IServerGridPageFilters;
  pagination?: IServerGridPagination;
  sortList?: IServerGridSortsDto
  searchText?: string;
  filters?: ServerGridFilterFilter[]
}

export interface IServerGridPageFilters {
  filters?: ServerGridFilter[];
}
