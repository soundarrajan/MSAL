import { GridApi, IServerSideGetRowsParams } from '@ag-grid-community/core';
import { ServerGridSortParametersEnum } from '@shiptech/core/grid/server-grid/server-grid-sort-parameters.enum';
import { IServerGridSortsDto } from '@shiptech/core/grid/server-grid/server-grid-sorts';

export function getShiptechFormatSorts(gridApi: GridApi, params: IServerSideGetRowsParams, serverColumnKeyMap: Record<string, string>): IServerGridSortsDto {

  const sorts = params.request.sortModel.map((s, i) => ({
    columnValue: serverColumnKeyMap[s.colId],
    isComputedColumn: false,
    sortIndex: i,
    sortParameter: ServerGridSortParametersEnum[s.sort]
  }));

  return { sortList: sorts || [] };
}
