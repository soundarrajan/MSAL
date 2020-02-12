import { GridApi, IServerSideGetRowsParams } from '@ag-grid-community/core';
import { IServerGridPagination } from '@shiptech/core/grid/server-grid/server-grid-pagination';

export function getShiptechFormatPagination(gridApi: GridApi, params: IServerSideGetRowsParams): IServerGridPagination {
  return {
    take: params.request.endRow - params.request.startRow,
    skip: params.request.startRow
  };
}
