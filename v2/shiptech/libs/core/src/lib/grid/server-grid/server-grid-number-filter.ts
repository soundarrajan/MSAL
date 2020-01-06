import { ServerGridFilter } from '@shiptech/core/grid/server-grid/server-grid.filter';

export interface IServerGridNumberFilter extends ServerGridFilter {
  values: number[];
  precision?: number | ( () => number | null | undefined);
}
