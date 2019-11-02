import { IApiGridFilterDto } from '@shiptech/core/grid/api-grid-filter.dto';

export interface IApiGridTextFilterDto extends IApiGridFilterDto {
  Values: string[];
}
