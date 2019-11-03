import { IServerSideGetRowsParams } from 'ag-grid-community';
import { IServerGridPagination } from '@shiptech/core/grid/server-grid/server-grid-pagination';

export function getShiptechFormatPagination(params: IServerSideGetRowsParams): IServerGridPagination {
  return {
    take: params.request.endRow - params.request.startRow,
    skip: params.request.startRow
  };
}
