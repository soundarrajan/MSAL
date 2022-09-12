import {
  ServerGridConditionFilterEnum,
  ShiptechGridFilterOperators
} from '@shiptech/core/grid/server-grid/server-grid-condition-filter.enum';
import { AgGridKnownFilterTypes } from '@shiptech/core/ui/components/ag-grid/type.definition';

export interface ServerGridFilter {
  columnType: any;
  conditionValue: any;
  filterOperator?: any;
  values: any[];
  columnValue: string;
  isComputedColumn?: boolean;
}
