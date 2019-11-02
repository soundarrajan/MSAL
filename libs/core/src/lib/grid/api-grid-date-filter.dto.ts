import { IApiGridFilterDto } from '@shiptech/core/grid/api-grid-filter.dto';

export interface IApiGridDateFilterDto extends IApiGridFilterDto {
  dateType: string;
}
