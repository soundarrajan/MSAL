import { ServerGridFilter } from '@shiptech/core/grid/server-grid/server-grid.filter';

export interface IServerGridTextFilter extends ServerGridFilter {
  values: string[];
}
