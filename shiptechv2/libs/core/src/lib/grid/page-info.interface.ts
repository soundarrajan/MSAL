import { DefaultPageSize } from '../ui/components/ag-grid/base.grid-view-model';

export interface IPageInfo {
  pageSize?: number;
  page?: number;
}

export class PageInfo implements IPageInfo {
  page: number;
  pageSize: number;

  constructor(pageInfo: Partial<IPageInfo> = {}) {
    this.page = pageInfo.page || 1;
    this.pageSize = pageInfo.pageSize || DefaultPageSize;
  }
}
