import { IApiGridFilterDto } from '@shiptech/core/grid/api-grid-filter.dto';

export interface IApiGridNumberFilterDto extends IApiGridFilterDto {
  Values: number[];
}
