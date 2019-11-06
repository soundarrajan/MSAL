import { IPageInfo, PageInfo } from '@shiptech/core/grid/page-info.interface';
import { ISortInfo } from '@shiptech/core/grid/sort-info.interface';
import {
  IQcReportListSummaryState,
  QcReportListSummaryStateModel
} from './qc-report-list-summary/qc-report-list-summary.state';

export class QcReportsListStateModel {
  pageInfo: IPageInfo;
  filter: any;
  sortList: ISortInfo[];
  isLoading: boolean;
  isLoaded: boolean;
  summary: IQcReportListSummaryState = new QcReportListSummaryStateModel();

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
