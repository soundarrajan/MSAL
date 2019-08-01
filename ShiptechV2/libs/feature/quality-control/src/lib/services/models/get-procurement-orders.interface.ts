import { IShiptechFilter, IShiptechPagination, IShiptechSorts } from './procurement-requests.dto';

export interface IGetProcurementOrders {
  filters?: IShiptechFilter[],
  pagination: IShiptechPagination,
  sorts?: IShiptechSorts[],
  searchText?: string;
}
