import { ColDef, ICellEditorParams, ICellRendererParams } from 'ag-grid-community';
import { BaseWithValueColDefParams } from 'ag-grid-community/dist/lib/entities/colDef';

export type CellRendererConfig = Pick<ColDef, 'cellRendererFramework' | 'cellRendererParams'>;
export type CellEditorConfig = Pick<ColDef, 'cellEditorFramework' | 'cellEditorParams'>;
export type HeaderRendererConfig = Pick<ColDef, 'headerComponentFramework' | 'headerComponentParams'>;

export type ICellRendererParamsExtended<T> = T & ICellRendererParams;
export type ICellEditorParamsExtended<T> = T & ICellEditorParams;

export type FilterConfig = Pick<ColDef, 'filter' | 'filterParams'>;

export interface TypedCellRendererColDef<TCellRendererParams = any> extends ColDef {
  cellRendererParams?: TCellRendererParams;
}

export interface TypedValueFormatterParams<T> extends BaseWithValueColDefParams {
  value: T;
}

export interface TypedColDef<TData = any, TField = any> extends ColDef {
  valueFormatter?: (params: TypedValueFormatterParams<TField>) => string;
  cellClassRules?: {
    [cssClassName: string]: (((params: { data: TData }) => boolean) | string);
  };
}

export function getColDef<T = any>(colDef: TypedCellRendererColDef<T>): TypedCellRendererColDef<T> {
  return colDef;
}

export interface IGridColumns {
  [id: string]: ColDef;
}

export class PdsListColumnDefinitions<T> {
}

export enum RowModelType {
  Infinite = 'infinite',
  ServerSide = 'serverSide',
  ClientSide = 'clientSide',
  Viewport = 'viewport'
}

export enum RowSelection {
  Single = 'single',
  Multiple = 'multiple'
}

export enum AgGridConditionTypeEnum {
  YES = 'true',
  NO = 'false',
  NULL = 'null',
  NOT_NULL = 'notNull',
  EQUALS = 'equals',
  NOT_EQUAL = 'notEqual',
  LESS_THAN = 'lessThan',
  LESS_THAN_OR_EQUAL = 'lessThanOrEqual',
  GREATER_THAN = 'greaterThan',
  GREATER_THAN_OR_EQUAL = 'greaterThanOrEqual',
  IN_RANGE = 'inRange',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'notContains',
  STARTS_WITH = 'startsWith',
  ENDS_WITH = 'endsWith'
}

export interface AgGridFilter {
  condition1?: AgGridDateFilter | AgGridTextFilter
  condition2?: AgGridDateFilter | AgGridTextFilter
  operator?: string;
  filterType: knownFilterTypes;
  key: string;
  type: AgGridConditionTypeEnum
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

/**
 * To be used in combination with  colDef.filter: 'agNumberColumnFilter'
 */
export const BooleanFilterParams = {
  suppressAndOrCondition: true,
  filterOptions: [
    'empty',
    {
      displayKey: AgGridConditionTypeEnum.YES,
      displayName: 'Yes',
      hideFilterInput: true,
      test: () => {
      }
    }, {
      displayKey: AgGridConditionTypeEnum.NO,
      displayName: 'No',
      hideFilterInput: true,
      test: () => {
      }
    }]
};
