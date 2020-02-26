import { IExportModuleTypes } from '@shiptech/core/ui/components/export/export-mapping';
import { AppConfig } from '@shiptech/core/config/app-config';

const appConfig = new AppConfig();
const _apiUrlInvoices = appConfig.v1.API.BASE_URL_DATA_INVOICES;

export enum ExportModulesType {
  QuantityControlReportList = 'QuantityControlReportList',
  InvoiceList = 'InvoiceList',
  InvoiceCompleteView = 'InvoiceCompleteView'
}

export namespace ExportApiPaths {
  export const getQuantityControlReportList = '';
  export const getInvoiceList = 'api/invoice/list';
}

export const ExportModuleTypeUrls: Record<
  ExportModulesType,
  IExportModuleTypes
> = {
  [ExportModulesType.QuantityControlReportList]: {
    apiUrl:
      'http://mail.24software.ro:8081/Integration1060/Shiptech10.Api.Invoice/api/invoice/export'
  },
  [ExportModulesType.InvoiceList]: {
    apiUrl: `${_apiUrlInvoices}/${ExportApiPaths.getInvoiceList}`
  },
  [ExportModulesType.InvoiceCompleteView]: {
    apiUrl: ''
  }
};
