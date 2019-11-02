import { ApiGridSortParametersEnum } from '@shiptech/core/grid/api-grid-sort-parameters.enum';

export interface IApiGridSortsDto {
  columnValue: string;
  sortIndex: number;
  sortParameter: ApiGridSortParametersEnum;
  isComputedColumn?: boolean;
}
