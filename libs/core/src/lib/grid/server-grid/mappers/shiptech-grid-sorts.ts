import { IServerSideGetRowsParams } from 'ag-grid-community';
import { ServerGridSortParametersEnum } from '@shiptech/core/grid/server-grid/server-grid-sort-parameters.enum';
import { IServerGridSorts } from '@shiptech/core/grid/server-grid/server-grid-sorts';

export function getShiptechFormatSorts(params: IServerSideGetRowsParams): IServerGridSorts[] {

  const sorts = params.request.sortModel.map((s, i) => ({
    // Note: Temporary workaround to avoid providing gridApi as argument
    columnValue: params.parentNode['gridApi'].getColumnDef(s.colId).field,
    isComputedColumn: false,
    sortIndex: i,
    sortParameter: ServerGridSortParametersEnum[s.sort]
  }));

  return sorts || [];
}
