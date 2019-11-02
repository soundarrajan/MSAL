import { IPageInfo, PageInfo } from '@shiptech/core/grid/page-info.interface';
import { ISortInfo } from '@shiptech/core/grid/sort-info.interface';

export class QcReportsListStateModel {
  pageInfo: IPageInfo;
  filter: any;
  sortList: ISortInfo[];
  isLoading: boolean;
  isLoaded: boolean;

  constructor(state: Partial<QcReportsListStateModel> = {}) {
    this.filter = state.filter;
    this.sortList = state.sortList;
    this.pageInfo = new PageInfo();
    this.isLoading = state.isLoading || false;
    this.isLoaded = state.isLoaded || false;
  }
}

export interface IQcReportsListState extends QcReportsListStateModel {
}
