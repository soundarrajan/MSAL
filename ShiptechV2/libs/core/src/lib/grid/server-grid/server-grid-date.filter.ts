import { ServerGridFilter } from '@shiptech/core/grid/server-grid/server-grid.filter';

export interface IServerGridDateFilter extends ServerGridFilter {
  dateType: string;
}
