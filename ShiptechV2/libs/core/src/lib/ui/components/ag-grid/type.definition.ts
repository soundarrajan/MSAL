import {
  CellClassParams,
  ColDef,
  ColGroupDef,
  ICellEditorParams,
  ICellRendererParams,
  IFilterParams,
  IRowModel,
  NewValueParams,
  RowNode,
  ValueFormatterParams,
  ValueGetterParams
} from '@ag-grid-community/core';
import {ComponentSelectorResult} from '@ag-grid-community/core/dist/cjs/components/framework/userComponentFactory';
import {BaseColDefParams, BaseWithValueColDefParams} from '@ag-grid-community/core/dist/cjs/entities/colDef';
import {GridApi} from "@ag-grid-community/core/dist/cjs/gridApi";
import {Column} from "@ag-grid-community/core/dist/cjs/entities/column";
import {NullComparator} from "@ag-grid-community/core/dist/cjs/filter/provided/scalerFilter";

export type CellRendererConfig = Pick<ColDef, 'cellRendererFramework' | 'cellRendererParams'>;
export type CellEditorConfig = Pick<ColDef, 'cellEditorFramework' | 'cellEditorParams'>;
export type HeaderRendererConfig = Pick<ColDef, 'headerComponentFramework' | 'headerComponentParams'>;

export type ICellRendererParamsExtended<T> = T & ICellRendererParams;
export type ICellEditorParamsExtended<T> = T & ICellEditorParams;

export type FilterConfig = Pick<ColDef, 'filter' | 'filterParams'>;

export interface ITypedCellRendererColDef<TCellRendererParams = any> extends ColDef {
  cellRendererParams?: TCellRendererParams;
}

export interface ITypedValueFormatterParams<T> extends BaseWithValueColDefParams {

}

export interface ITypedValueGetterParams<T> extends BaseColDefParams {
  getValue: (field: string) => any;
}

export interface ITypedCellRendererParams<TData = any, TField = any> extends Omit<ICellRendererParams, 'data' | 'value'> {
  data: TData;
  value: TField;
}

export interface ITypedBaseColDefParams<TData = any, TField = any> extends Omit<BaseColDefParams, 'data' | 'value'> {
  data: TData;
}

export interface ITypedNewValueParams<TData = any, TField = any> extends Omit<NewValueParams, 'data' | 'value' | 'oldValue' | 'newValue'> {
  oldValue: TField;
  newValue: TField;
}

export interface ITypedValueParams<TData = any, TField = any> extends Omit<CellClassParams, 'data' | 'value'> {
  data: TData;
  value: TField;
}

export interface ITypedRowModel<TData = any> extends Omit<IRowModel, 'getRow' | 'getRowNode'> {
  getRow(index: number): TypedRowNode<TData> | null;

  /** Returns the rowNode for given id. */
  getRowNode(id: string): TypedRowNode<TData> | null;
}

export interface TypedFilterParams<TData = any, TField = any> extends Omit<Partial<IFilterParams>, 'colDef' | 'rowModel' | 'valueGetter'> {
  colDef?: ITypedColDef<TData, TField>;
  rowModel?: ITypedRowModel<TData>;
  clearButton?: boolean;
  applyButton?: boolean;
  valueGetter?: (rowNode: TypedRowNode<TData>) => any;
}

export interface IAgGridCellClassRules<TData = any, TField = any> {
  [cssClassName: string]: ((params: ITypedValueParams<TData, TField>) => boolean) | string;
}

export interface ITypedColDef<TData = any, TField = any> extends Omit<ColDef, 'field' | 'filterParams'> {
  valueFormatter?: (params: ValueFormatterParams) => string;
  valueGetter?: ((params: ValueGetterParams) => any) | string;
  cellClassRules?: IAgGridCellClassRules;
  cellStyle?: (params: ITypedValueParams<TData, TField>) => Partial<CSSStyleDeclaration>;
  field?: keyof TData,
  cellRendererSelector?: (params: ITypedCellRendererParams<TData, TField>) => ComponentSelectorResult;
  onCellValueChanged?: (params: ITypedValueParams<TData, TField>) => void;
  filterParams?: TypedFilterParams<TData, TField>;
}

export interface ITypedColGroupDef extends Omit<ColGroupDef, 'children'> {
  children: (ITypedColGroupDef | ITypedColDef)[];
}

export interface TypedRowNode<TData = any> extends Omit<RowNode, 'data'> {
  data: TData
}

export function getColDef<T = any>(colDef: ITypedCellRendererColDef<T>): ITypedCellRendererColDef<T> {
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

export enum AgGridOperatorEnum {
  OR = 'OR',
  AND = 'AND',
}

export const AgGridConditionTypeLabels: Record<AgGridConditionTypeEnum, string> = {
  [AgGridConditionTypeEnum.YES]: 'is true',
  [AgGridConditionTypeEnum.NO]: 'is false',
  [AgGridConditionTypeEnum.NULL]: 'is null',
  [AgGridConditionTypeEnum.NOT_NULL]: 'is not null',
  [AgGridConditionTypeEnum.EQUALS]: 'equals',
  [AgGridConditionTypeEnum.NOT_EQUAL]: 'is not equal',
  [AgGridConditionTypeEnum.LESS_THAN]: 'is less than',
  [AgGridConditionTypeEnum.LESS_THAN_OR_EQUAL]: 'less than or equal',
  [AgGridConditionTypeEnum.GREATER_THAN]: 'is greater than',
  [AgGridConditionTypeEnum.GREATER_THAN_OR_EQUAL]: 'is greater than or equal',
  [AgGridConditionTypeEnum.IN_RANGE]: 'is in range',
  [AgGridConditionTypeEnum.CONTAINS]: 'contains',
  [AgGridConditionTypeEnum.NOT_CONTAINS]: 'not contains',
  [AgGridConditionTypeEnum.STARTS_WITH]: 'starts with',
  [AgGridConditionTypeEnum.ENDS_WITH]: 'ends with'
};

export interface IAgGridBaseFilter {
  filterType: AgGridKnownFilterTypes;
  type: AgGridConditionTypeEnum
}

export interface IAgGridConditionFilter extends IAgGridBaseFilter {
  condition1?: IAgGridDateFilter | IAgGridTextFilter
  condition2?: IAgGridDateFilter | IAgGridTextFilter
  operator?: AgGridOperatorEnum;
}

export interface IAgGridDateFilter extends IAgGridBaseFilter {
  dateFrom: string;
  dateTo: string;
}

export interface IAgGridTextFilter extends IAgGridBaseFilter {
  filter: string;
}

export interface IAgGridNumberFilter extends IAgGridBaseFilter {
  filter: number;
  filterTo?: number;
}

export enum AgGridKnownFilterTypes {
  Text = 'text',
  Date = 'date',
  Number = 'number'
}

export type AgGridFilterModel = IAgGridBaseFilter & Partial<IAgGridConditionFilter>;

export interface ITypedFilterOptionDef {
  displayKey: string;
  displayName: string;
  test: (filterValue: any, cellValue: any) => boolean;
  hideFilterInput?: boolean;
}

export interface ITypedFilterParams {
  api: GridApi;
  column: Column;
  colDef: ColDef;
  rowModel: IRowModel;
  filterChangedCallback: (additionalEventAttributes?: any) => void;
  filterModifiedCallback: () => void;
  valueGetter: (rowNode: RowNode) => any;
  doesRowPassOtherFilter: (rowNode: RowNode) => boolean;
  context: any;
}

export interface ITypedProvidedFilterParams extends IFilterParams {
  clearButton?: boolean;
  resetButton?: boolean;
  applyButton?: boolean;
  newRowsAction?: string;
  debounceMs?: number;
}

export interface ITypedFilterOptionDef {
  displayKey: string;
  displayName: string;
  test: (filterValue: any, cellValue: any) => boolean;
  hideFilterInput?: boolean;
}

export interface ITypedSimpleFilterParams extends ITypedProvidedFilterParams {
  filterOptions?: (ITypedFilterOptionDef | string)[];
  defaultOption?: string;
  suppressAndOrCondition?: boolean;
}

export interface ITypedScalarFilterParams extends ITypedSimpleFilterParams {
  inRangeInclusive?: boolean;
  includeBlanksInEquals?: boolean;
  includeBlanksInLessThan?: boolean;
  includeBlanksInGreaterThan?: boolean;
  /** @deprecated in v21*/
  nullComparator?: NullComparator;
}

export declare class TypedOptionsFactory {
  protected customFilterOptions: {
    [name: string]: ITypedFilterOptionDef;
  };
  protected filterOptions: (ITypedFilterOptionDef | string)[];
  protected defaultOption: string;
  private mapCustomOptions;
  private selectDefaultItem;

  init(params: ITypedScalarFilterParams, defaultOptions: string[]): void;

  getFilterOptions(): (ITypedFilterOptionDef | string)[];

  getDefaultOption(): string;

  getCustomOption(name: string): ITypedFilterOptionDef;
}
