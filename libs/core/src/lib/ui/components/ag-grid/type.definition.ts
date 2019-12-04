import {
  CellClassParams,
  ColDef,
  ColGroupDef,
  ICellEditorParams,
  ICellRendererParams,
  NewValueParams
} from 'ag-grid-community';
import {
  BaseColDefParams,
  BaseWithValueColDefParams,
  ValueGetterParams
} from 'ag-grid-community/dist/lib/entities/colDef';
import { RowNode } from 'ag-grid-community/dist/lib/entities/rowNode';
import { ComponentSelectorResult } from 'ag-grid-community/dist/lib/components/framework/userComponentFactory';

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

export interface TypedBaseColDefParams<TData = any> extends BaseColDefParams {
  data: TData;
}

export interface TypedValueGetterParams<T> extends ValueGetterParams {
  value: T;
}

export interface TypedCellRendererParams<TData = any, TField = any> extends Omit<ICellRendererParams, 'data' | 'value'> {
  data: TData;
  value: TField;
}

export interface TypedBaseColDefParams<TData = any, TField = any> extends Omit<BaseColDefParams, 'data' | 'value'> {
  data: TData;
}

export interface TypedNewValueParams<TData = any, TField = any> extends Omit<NewValueParams, 'data' | 'value' | 'oldValue' | 'newValue'> {
  oldValue: TField;
  newValue: TField;
}

export interface TypedNewValueParams<TData = any, TField = any> extends Omit<CellClassParams, 'data' | 'value'> {
  data: TData;
  value: TField;
}

export interface TypedColDef<TData = any, TField = any> extends Omit<ColDef, 'field'> {
  valueFormatter?: (params: TypedValueFormatterParams<TField>) => string;
  valueGetter?: ((params: TypedBaseColDefParams<TData>) => any) | string
  cellClassRules?: {
    [cssClassName: string]: ((params: TypedNewValueParams<TData, TField>) => boolean) | string;
  };
  field?: keyof TData,
  cellRendererSelector?: (params: TypedCellRendererParams<TData, TField>) => ComponentSelectorResult;
  onCellValueChanged?: (params: TypedNewValueParams<TData, TField>) => void;
}

export interface TypedColGroupDef extends Omit<ColGroupDef, 'children'> {
  children: (TypedColGroupDef | TypedColDef)[];
}

export interface TypedRowNode<TData = any> extends Omit<RowNode, 'data'> {
  data: TData
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
