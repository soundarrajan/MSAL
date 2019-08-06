import { IServerSideGetRowsParams } from 'ag-grid-community';
import {
  IShiptechDateFilter,
  IShiptechFilter, IShiptechNumberFilter,
  IShiptechTextFilter,
  ShiptechConditionValues
} from '../../services/models/procurement-requests.dto';
import * as _ from 'lodash';
import { nameof, Omit } from '@shiptech/core';

export function getShiptechFormatFilters(params: IServerSideGetRowsParams): IShiptechFilter[] {
  const filtersWithKeys = _.mapValues(params.request.filterModel, (value, key) => ({ ...value, key }));
  const filters = flattenFilters(_.values(filtersWithKeys)).map(f => getShiptechFormatFilter(f, params));
  return filters || [];
}

function getShiptechFormatFilter(filter: AgGridFilter, params: IServerSideGetRowsParams): IShiptechFilter {
  let result: Omit<IShiptechFilter, 'Values'> = {
    ColumnType: filter.filterType,
    ConditionValue: ShiptechConditionValues[filter.type],
    columnValue: params.parentNode['gridApi'].getColumnDef(filter.key).field,
    isComputedColumn: false,
    FilterOperator: ShiptechGridFilterOperators[filter.operator] || 0
  };

  if (filter.filterType === knownFilterTypes.Text) {
    result = <IShiptechTextFilter>{
      ...result,
      Values: [(<AgGridTextFilter>filter).filter.toString()]
    };
  }

  if (filter.filterType === knownFilterTypes.Date) {
    result = <IShiptechDateFilter>{
      ...result,
      dateType: 'server',
      Values: [(<AgGridDateFilter>filter).dateFrom.toString()]
    };
  }

  if (filter.filterType === knownFilterTypes.Number) {
    const numberFilter = <AgGridNumberFilter>filter;

    result = <IShiptechNumberFilter>{
      ...result,
      // TODO: Temporary workaround to avoid backend crash on number value
      ColumnType: 'Quantity',
      Values: numberFilter.filterTo ? [numberFilter.filter, numberFilter.filterTo] : [numberFilter.filter]
    };
  }

  return <IShiptechFilter>result;

}

function flattenFilters(filters: AgGridFilter[]): AgGridFilter[] {
  const result = [];
  filters.forEach(filter => {
    if (!filter.hasOwnProperty(nameof<AgGridFilter>('condition1'))) {
      result.push(filter);
      return;
    }

    result.push({ ...filter['condition1'], key: filter.key, operator: filter.operator });

    if (!filter.hasOwnProperty(nameof<AgGridFilter>('condition2'))) {
      return;
    }

    result.push({ ...filter['condition2'], key: filter.key, operator: filter.operator });
  });

  return result;
}

export interface AgGridFilter {
  condition1?: AgGridDateFilter | AgGridTextFilter
  condition2?: AgGridDateFilter | AgGridTextFilter
  operator?: string;
  filterType: knownFilterTypes;
  key: string;
  type: ShiptechConditionValues
}

export interface AgGridDateFilter extends AgGridFilter {
  dateFrom: string;
  dateTo: string;
}

export interface AgGridTextFilter extends AgGridFilter {
  filter: string;
}

export interface AgGridNumberFilter extends AgGridFilter {
  filter: number;
  filterTo?: number;
}

export enum knownFilterTypes {
  Text = 'text',
  Date = 'date',
  Number = 'number'

}

export enum ShiptechGridFilterOperators {
  AND = 1,
  OR = 2
}

