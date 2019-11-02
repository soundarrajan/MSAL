import { ServerGridSortParametersEnum } from '@shiptech/core/grid/server-grid/server-grid-sort-parameters.enum';

export interface IServerGridSorts {
  columnValue: string;
  sortIndex: number;
  sortParameter: ServerGridSortParametersEnum;
  isComputedColumn?: boolean;
}
