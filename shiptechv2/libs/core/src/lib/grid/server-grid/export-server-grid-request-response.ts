import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';

export enum ExportTypeEnum {
  excel = 1,
  csv = 2,
  pdf = 3
}

export interface IExportColumn {
  dtoPath: string;
  label: string;
}

export interface IExportServerGridInfo extends IServerGridInfo {
  exportType: ExportTypeEnum;
  columns: IExportColumn[];
  dateTimeOffset: number;
  timeZone: string;
}
