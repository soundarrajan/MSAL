export interface ExcelExportFormat {
  fileName: string;
  fileExtension: string;
  exportRefId: string;
  tenantId: number;
  userId: number;
  gridColumns?: [
    {
      name: string;
      prop: string;
      type: string;
      order: string;
      enableSorting: boolean;
      editable: boolean;
      dir: string;
      formatSetting: string;
      resizeable: boolean;
      cellTemplate: string;
      headerTemplate: string;
      visible: boolean;
      IsExternalFunc: boolean;
      IsExternalUrl: boolean;
      CombinedProp: string;
      ExternalUrl: string;
    }
  ];
  exportData: any[];
}
