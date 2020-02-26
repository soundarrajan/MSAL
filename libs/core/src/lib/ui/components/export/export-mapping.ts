export enum KnownExportType {
  exportToExcel = 1,
  exportToCsv = 2,
  exportToPdf = 3
}

export interface IColumnsMapping {
  dtoPath: string;
  label: string;
}

export interface IExportModuleTypes {
  apiUrl: string;
}
