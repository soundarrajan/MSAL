import { IPageInfo, PageInfo } from '@shiptech/core/grid/page-info.interface';
import { ISortInfo } from '@shiptech/core/grid/sort-info.interface';

export class PortCallsListStateModel {
  pageInfo: IPageInfo;
  filter: any;
  sorts: ISortInfo[];
  isLoading: boolean;
  isLoaded: boolean;

  constructor(state: Partial<PortCallsListStateModel> = {}) {
    this.filter = state.filter;
    this.sorts = state.sorts;
    this.pageInfo = new PageInfo();
    this.isLoading = state.isLoading || false;
    this.isLoaded = state.isLoaded || false;
  }
}

export interface IPortCallsList extends PortCallsListStateModel {}
