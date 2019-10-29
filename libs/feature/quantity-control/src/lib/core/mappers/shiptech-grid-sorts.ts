import { IServerSideGetRowsParams } from 'ag-grid-community';
import { IShiptechSorts, ShiptechSortParamtersEnum } from '../../services/models/generic-shiptech.dto';

export function getShiptechFormatSorts(params: IServerSideGetRowsParams): IShiptechSorts[] {

  const sorts = params.request.sortModel.map((s, i) => ({
    // Note: Temporary workaround to avoid providing gridApi as argument
    columnValue: params.parentNode['gridApi'].getColumnDef(s.colId).field,
    isComputedColumn: false,
    sortIndex: i,
    sortParameter: ShiptechSortParamtersEnum[s.sort]
  }));

  return sorts || [];
}
