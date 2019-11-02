import { IServerSideGetRowsParams } from 'ag-grid-community';
import { IApiGridPaginationDto } from '@shiptech/core/grid/api-grid-pagination.dto';

export function getShiptechFormatPagination(params: IServerSideGetRowsParams): IApiGridPaginationDto {
  return {
    take: params.request.endRow - params.request.startRow,
    skip: params.request.startRow
  };
}
