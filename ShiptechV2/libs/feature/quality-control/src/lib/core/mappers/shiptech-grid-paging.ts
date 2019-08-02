import { IServerSideGetRowsParams } from 'ag-grid-community';
import { IShiptechPagination } from '../../services/models/procurement-requests.dto';

export function getShiptechFormatPagination(params: IServerSideGetRowsParams): IShiptechPagination {
  return {
    take: params.request.endRow - params.request.startRow,
    skip: params.request.startRow
  };
}
