import { IApiGridPaginationDto } from '@shiptech/core/grid/api-grid-pagination.dto';
import { IApiGridSortsDto } from '@shiptech/core/grid/api-grid-sorts.dto';
import { IApiGridFilterDto } from '@shiptech/core/grid/api-grid-filter.dto';

export interface IApiGridRequestDto {
  pagination?: IApiGridPaginationDto;
  sortList?: IApiGridSortsDto[]
  filters?: IApiGridFilterDto[];
  searchText?: string;
}
