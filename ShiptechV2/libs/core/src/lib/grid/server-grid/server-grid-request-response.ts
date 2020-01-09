import { IServerGridPagination } from '@shiptech/core/grid/server-grid/server-grid-pagination';
import { IServerGridSorts, IServerGridSortsDto } from '@shiptech/core/grid/server-grid/server-grid-sorts';
import { ServerGridFilter } from '@shiptech/core/grid/server-grid/server-grid.filter';
import { ServerQueryFilter } from "@shiptech/core/grid/server-grid/server-query.filter";

export interface IServerGridInfo {
  pageFilters?: IServerGridPageFilters;
  pagination?: IServerGridPagination;
  sortList?: IServerGridSortsDto
  searchText?: string;
  filters?: ServerQueryFilter[]
}

export interface IServerGridPageFilters {
  filters?: ServerGridFilter[];
}
