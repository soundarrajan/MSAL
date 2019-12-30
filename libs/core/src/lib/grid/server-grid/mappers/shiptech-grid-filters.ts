import { IServerSideGetRowsParams } from 'ag-grid-community';
import * as _ from 'lodash';
import { nameof, Omit } from '@shiptech/core/utils/type-definitions';
import { ServerGridFilter } from '@shiptech/core/grid/server-grid/server-grid.filter';
import { IServerGridDateFilter } from '@shiptech/core/grid/server-grid/server-grid-date.filter';
import { IServerGridTextFilter } from '@shiptech/core/grid/server-grid/server-grid-text-filter';
import { IServerGridNumberFilter } from '@shiptech/core/grid/server-grid/server-grid-number-filter';
import { AgGridConditionTypeToServer, ShiptechGridFilterOperators } from '@shiptech/core/grid/server-grid/server-grid-condition-filter.enum';
import {
  AgGridConditionTypeEnum,
  IAgGridDateFilter,
  IAgGridNumberFilter,
  IAgGridTextFilter,
  AgGridKnownFilterTypes,
  AgGridFilterModel
} from '@shiptech/core/ui/components/ag-grid/type.definition';
import { getShiptechFormatPagination } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-paging';
import { getShiptechFormatSorts } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-sorts';
import { IServerGridInfo } from '@shiptech/core/grid/server-grid/server-grid-request-response';

type AgGridFilterModelWithKey  = AgGridFilterModel & { key: string};

export function getShiptechFormatFilters(params: IServerSideGetRowsParams, serverColumnKeyMap: Record<string, string>): ServerGridFilter[] {
  const filtersWithKeys = _.mapValues(params.request.filterModel, (value, key) => (<AgGridFilterModelWithKey>{ ...value, key }));
  const filters = flattenFilters(_.values(filtersWithKeys)).map(f => getShiptechFormatFilter(f, params, serverColumnKeyMap));
  return filters || [];
}

function getShiptechFormatFilter(filter: AgGridFilterModelWithKey, params: IServerSideGetRowsParams, serverColumnKeyMap: Record<string, string>): ServerGridFilter {
  // Note: TODO Temporary workaround to avoid providing gridApi as argument
  const colDef = params.parentNode['gridApi'].getColumnDef(filter.key);

  let result: Omit<ServerGridFilter, 'values'> = {
    columnType: filter.filterType,
    conditionValue: AgGridConditionTypeToServer[filter.type],
    columnValue: serverColumnKeyMap[colDef.field.split('.').slice(-1)[0]],
    isComputedColumn: false,
    filterOperator: ShiptechGridFilterOperators[filter.operator] || 0
  };

  if (filter.filterType === AgGridKnownFilterTypes.Text) {
    result = <IServerGridTextFilter>{
      ...result,
      values: [(<IAgGridTextFilter><unknown>filter).filter?.toString()]
    };
  }

  if (filter.filterType === AgGridKnownFilterTypes.Date) {
    result = <IServerGridDateFilter>{
      ...result,
      dateType: 'server',
      values: [(<IAgGridDateFilter><unknown>filter).dateFrom.toString()]
    };
  }

  if (filter.filterType === AgGridKnownFilterTypes.Number) {
    const numberFilter = <IAgGridNumberFilter><unknown>filter;
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

function flattenFilters(filters: AgGridFilterModelWithKey[]): AgGridFilterModelWithKey[] {
  const result = [];
  filters.forEach(filter => {
    if (!filter.hasOwnProperty(nameof<AgGridFilterModel>('condition1'))) {
      result.push(filter);
      return;
    }

    result.push({ ...filter['condition1'], key: filter.key, operator: filter.operator });

    if (!filter.hasOwnProperty(nameof<AgGridFilterModel>('condition2'))) {
      return;
    }

    result.push({ ...filter['condition2'], key: filter.key, operator: filter.operator });
  });

  return result;
}

export function transformLocalToServeGridInfo(params: IServerSideGetRowsParams, serverColumnKeyMap: Record<string, string>, searchText?: string): IServerGridInfo {
  return {
    pagination: getShiptechFormatPagination(params),
    sortList: getShiptechFormatSorts(params, serverColumnKeyMap),
    pageFilters: {
      filters: getShiptechFormatFilters(params, serverColumnKeyMap)
    },
    searchText: searchText
  };
}
