import { ServerGridFilter } from '@shiptech/core/grid/server-grid/server-grid.filter';

export interface IServerGridNumberFilter extends ServerGridFilter {
  Values: number[];
}
