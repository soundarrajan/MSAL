import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';

export interface IScheduleDashboardLabelConfigurationDto
  extends IDisplayLookupDto {
  code: string;
  transactionTypeId: number;
  index: number;
}

export interface IScheduleDashboardLabelConfigurationWithPromiseDto
  extends IDisplayLookupDto {
  code: Promise<string>;
  transactionTypeId: number;
  index: number;
}
