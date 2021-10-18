export enum KnownExportType {
  exportToExcel = 'exportToExcel',
  exportToCsv = 'exportToCsv',
  exportToPdf = 'exportToPdf'
}

export interface IKnownExportType {
  type: number;
}

export interface IColumnsMapping {
  dtoPath: string;
  label: string;
}

export const KnownExportTypeLookupEnum: Record<
  KnownExportType,
  IKnownExportType
> = {
  [KnownExportType.exportToExcel]: {
    type: 1
  },
  [KnownExportType.exportToCsv]: {
    type: 2
  },
  [KnownExportType.exportToPdf]: {
    type: 3
  }
};
