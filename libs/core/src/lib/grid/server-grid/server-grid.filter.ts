import {
  ServerGridConditionFilterEnum,
  ShiptechGridFilterOperators
} from '@shiptech/core/grid/server-grid/server-grid-condition-filter.enum';
import { KnownFilterTypes } from '@shiptech/core/ui/components/ag-grid/type.definition';

export interface ServerGridFilter {
  columnType: KnownFilterTypes;
  conditionValue: ServerGridConditionFilterEnum;
  filterOperator?: ShiptechGridFilterOperators;
  values: any[];
  columnValue: string;
  isComputedColumn?: boolean
}
