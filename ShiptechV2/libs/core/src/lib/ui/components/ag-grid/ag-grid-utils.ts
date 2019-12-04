/**
 * To be used in combination with  colDef.filter: 'agNumberColumnFilter'
 */
import { AgGridConditionTypeEnum, TypedNewValueParams } from './type.definition';

export const BooleanFilterParams = {
  suppressAndOrCondition: true,
  filterOptions: [
    'empty',
    {
      displayKey: AgGridConditionTypeEnum.YES,
      displayName: 'Yes',
      hideFilterInput: true,
      test: (filterValue: any, cellValue: any) => cellValue !== undefined && cellValue !== null && (cellValue.toString().toLowerCase() === '1' || cellValue.toString().toLowerCase() === 'true')
    }, {
      displayKey: AgGridConditionTypeEnum.NO,
      displayName: 'No',
      hideFilterInput: true,
      test: (filterValue: any, cellValue: any) => cellValue !== undefined && cellValue !== null && (cellValue.toString().toLowerCase() === '0' || cellValue?.toString().toLowerCase() === 'false')
    }]
};

export function refreshCellAsync<TData = any, TField = any>(params: TypedNewValueParams<TData, TField>): boolean {
  setTimeout(() => params.api.refreshCells({ columns: [params.colDef.colId], rowNodes: [params.node] }));
  return true;
}
