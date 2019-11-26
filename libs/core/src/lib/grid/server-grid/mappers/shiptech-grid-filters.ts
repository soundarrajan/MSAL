import { IServerSideGetRowsParams } from 'ag-grid-community';
import * as _ from 'lodash';
import { nameof, Omit } from '@shiptech/core/utils/type-definitions';
import { ServerGridFilter } from '@shiptech/core/grid/server-grid/server-grid.filter';
import { IServerGridDateFilter } from '@shiptech/core/grid/server-grid/server-grid-date.filter';
import { IServerGridTextFilter } from '@shiptech/core/grid/server-grid/server-grid-text-filter';
import { IServerGridNumberFilter } from '@shiptech/core/grid/server-grid/server-grid-number-filter';
import {
  AgGridConditionTypeToServer,
  ShiptechGridFilterOperators
} from '@shiptech/core/grid/server-grid/server-grid-condition-filter.enum';
import {
  AgGridConditionTypeEnum,
  AgGridDateFilter,
  AgGridFilter,
  AgGridNumberFilter,
  AgGridTextFilter,
  knownFilterTypes
} from '@shiptech/core/ui/components/ag-grid/type.definition';

export function getShiptechFormatFilters(params: IServerSideGetRowsParams): ServerGridFilter[] {
  const filtersWithKeys = _.mapValues(params.request.filterModel, (value, key) => ({ ...value, key }));
  const filters = flattenFilters(_.values(filtersWithKeys)).map(f => getShiptechFormatFilter(f, params));
  return filters || [];
}

function getShiptechFormatFilter(filter: AgGridFilter, params: IServerSideGetRowsParams): ServerGridFilter {
  const colDef = params.parentNode['gridApi'].getColumnDef(filter.key);

  let result: Omit<ServerGridFilter, 'values'> = {
    columnType: filter.filterType,
    conditionValue: AgGridConditionTypeToServer[filter.type],
    columnValue: colDef.field.split('.').slice(-1)[0],
    isComputedColumn: false,
    filterOperator: ShiptechGridFilterOperators[filter.operator] || 0
  };

  if (filter.filterType === knownFilterTypes.Text) {
    result = <IServerGridTextFilter>{
      ...result,
      values: [(<AgGridTextFilter>filter).filter?.toString()]
    };
  }

  if (filter.filterType === knownFilterTypes.Date) {
    result = <IServerGridDateFilter>{
      ...result,
      dateType: 'server',
      values: [(<AgGridDateFilter>filter).dateFrom.toString()]
    };
  }

  if (filter.filterType === knownFilterTypes.Number) {
    const numberFilter = <AgGridNumberFilter>filter;
    const precision = typeof colDef.filterParams?.precision === 'function' ? colDef.filterParams.precision() : typeof colDef.filterParams.precision === 'number' ? colDef.filterParams.precision : undefined;

    result = <IServerGridNumberFilter>{
      ...result,
      precision: precision,
      values: filter.type === AgGridConditionTypeEnum.YES ? [1] :
        filter.type === AgGridConditionTypeEnum.NO ? [0] :
          numberFilter.filterTo ? [numberFilter.filter, numberFilter.filterTo] : [numberFilter.filter]
    };
  }

  return <ServerGridFilter>result;
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

