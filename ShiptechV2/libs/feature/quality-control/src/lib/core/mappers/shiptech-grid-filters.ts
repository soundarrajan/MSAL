import { GridApi, IServerSideGetRowsParams } from 'ag-grid-community';
import { IShiptechFilter, ShiptechConditionValues } from '../../services/models/procurement-requests.dto';
import * as _ from 'lodash';

export function getShiptechFormatFilters(params: IServerSideGetRowsParams): IShiptechFilter[] {
  const filtersWithKeys = _.mapValues(params.request.filterModel, (value, key) => ({ ...value, key }));

  const filters = _.values(filtersWithKeys).map(f => ({
      ColumnType: f.filterType,
      ConditionValue: ShiptechConditionValues[f.type],
      columnValue: params.parentNode['gridApi'].getColumnDef(f.key).field,
      isComputedColumn: false,
      FilterOperator: 0,
      Values: [f.filter.toString()]
    }
  ));

  return filters || [];
}
