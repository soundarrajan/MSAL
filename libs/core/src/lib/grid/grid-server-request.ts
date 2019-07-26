import { IServerSideGetRowsParams } from 'ag-grid-community';
import { ISortInfo } from './sort-info.interface';
import { IPageInfo } from './page-info.interface';

export interface IAgSortDef {
  colId: string;
  sort: 'ASC' | 'DESC';
}

export interface IGridServerRequest {
  filter: any;
  sorts: ISortInfo[];
  pageInfo: IPageInfo;
}

export function mapToServerRequest(request: IServerSideGetRowsParams): IGridServerRequest {
  const gridRequest = request.request;

  const pageSize = gridRequest.endRow - gridRequest.startRow;
  const page = gridRequest.startRow / pageSize + 1;

  return {
    filter: gridRequest.filterModel,
    sorts: gridRequest.sortModel.map((s: IAgSortDef) => ({ column: s.colId, sort: s.sort })),
    pageInfo: { pageSize, page }
  };
}

export function mapToPageInfo(request: IServerSideGetRowsParams): IPageInfo {
  const gridRequest = request.request;

  const pageSize = gridRequest.endRow - gridRequest.startRow;
  const page = gridRequest.startRow / pageSize + 1;

  return {
    page,
    pageSize
  };
}
