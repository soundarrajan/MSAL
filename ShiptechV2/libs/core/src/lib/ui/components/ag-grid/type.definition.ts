import { ColDef, ICellEditorParams, ICellRendererParams } from 'ag-grid-community';
import { BaseWithValueColDefParams, ValueFormatterParams } from 'ag-grid-community/dist/lib/entities/colDef';

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
    [cssClassName: string]: (((params: { data: TData}) => boolean) | string);
  };
}

// export class TColDef {
// //   static create<T = any>(colDef: TypedColDef<T>): TypedColDef<T> {
// //     return colDef;
// //   }
// // }

export function getColDef<T = any>(colDef: TypedCellRendererColDef<T>): TypedCellRendererColDef<T> {
  return colDef;
}

export interface IGridColumns {
  [id: string]: ColDef;
}

export class PdsListColumnDefinitions<T> {}

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
