import {IDisplayLookupDto} from "@shiptech/core/lookups/display-lookup-dto.interface";

export interface IScheduleDashboardLabelConfigurationDto extends IDisplayLookupDto{
  code: string | Promise<string>;
  transactionTypeId: number;
  index: number;
}
