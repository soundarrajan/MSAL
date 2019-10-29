export interface IShiptechSorts {
  columnValue: string;
  sortIndex: number;
  sortParameter: ShiptechSortParamtersEnum;
  isComputedColumn?: boolean;
}


export enum ShiptechSortParamtersEnum {
  asc = 1,
  desc = 2
}


export interface IShiptechFilter {
  ColumnType: string;
  ConditionValue: string;
  FilterOperator?: number;
  Values: any[];
  columnValue: string;
  isComputedColumn: boolean
}

export interface IShiptechDateFilter extends IShiptechFilter {
  dateType: string;
}

export interface IShiptechTextFilter extends IShiptechFilter {
  Values: string[];
}

export interface IShiptechNumberFilter extends IShiptechFilter {
  Values: number[];
}

export enum ShiptechConditionValues {
  isBlank = 'IS BLANK',
  isNotBlank = 'IS NOT NULL',
  contains = 'LIKE',
  notContains = 'NOT LIKE',
  equals = '=',
  notEqual = '!=',
  startsWith = 'LIKE1',
  endsWith = 'LIKE2',
  greaterThan = '>',
  greaterThanOrEqual = '>=',
  lessThan = '<',
  lessThanOrEqual = '<=',
  inRange = 'between'

}

export interface IShiptechPagination {
  skip: number;
  take: number;
}
