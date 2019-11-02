import { IServerSideGetRowsParams } from 'ag-grid-community';
import { ApiGridSortParametersEnum } from '@shiptech/core/grid/api-grid-sort-parameters.enum';
import { IApiGridSortsDto } from '@shiptech/core/grid/api-grid-sorts.dto';

export function getShiptechFormatSorts(params: IServerSideGetRowsParams): IApiGridSortsDto[] {

  const sorts = params.request.sortModel.map((s, i) => ({
    // Note: Temporary workaround to avoid providing gridApi as argument
    columnValue: params.parentNode['gridApi'].getColumnDef(s.colId).field,
    isComputedColumn: false,
    sortIndex: i,
    sortParameter: ApiGridSortParametersEnum[s.sort]
  }));

  return sorts || [];
}
