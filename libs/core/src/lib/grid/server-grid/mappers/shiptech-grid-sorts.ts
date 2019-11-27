import { IServerSideGetRowsParams } from 'ag-grid-community';
import { ServerGridSortParametersEnum } from '@shiptech/core/grid/server-grid/server-grid-sort-parameters.enum';
import { IServerGridSorts } from '@shiptech/core/grid/server-grid/server-grid-sorts';

export function getShiptechFormatSorts(params: IServerSideGetRowsParams, serverColumnKeyMap: Record<string, string>): IServerGridSorts[] {

  const sorts = params.request.sortModel.map((s, i) => ({
    // Note: TODO Temporary workaround to avoid providing gridApi as argument
    columnValue: serverColumnKeyMap[params.parentNode['gridApi'].getColumnDef(s.colId).field.split('.').slice(-1)[0]],
    isComputedColumn: false,
    sortIndex: i,
    sortParameter: ServerGridSortParametersEnum[s.sort]
  }));

  return sorts || [];
}
