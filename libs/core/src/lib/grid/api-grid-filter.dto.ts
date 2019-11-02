export interface IApiGridFilterDto {
  ColumnType: string;
  ConditionValue: string;
  FilterOperator?: number;
  Values: any[];
  columnValue: string;
  isComputedColumn: boolean
}
