export interface ServerGridFilter {
  columnType: string;
  conditionValue: string;
  filterOperator?: number;
  values: any[];
  columnValue: string;
  isComputedColumn: boolean
}
