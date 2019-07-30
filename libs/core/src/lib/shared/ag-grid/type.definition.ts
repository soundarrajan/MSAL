import { ColDef, ICellEditorParams, ICellRendererParams } from 'ag-grid-community';

export type CellRendererConfig = Pick<ColDef, 'cellRendererFramework' | 'cellRendererParams'>;
export type CellEditorConfig = Pick<ColDef, 'cellEditorFramework' | 'cellEditorParams'>;
export type HeaderRendererConfig = Pick<ColDef, 'headerComponentFramework' | 'headerComponentParams'>;

export type ICellRendererParamsExtended<T> = T & ICellRendererParams;
export type ICellEditorParamsExtended<T> = T & ICellEditorParams;

export type FilterConfig = Pick<ColDef, 'filter' | 'filterParams'>;

export interface TypedColDef<TCellRendererParams = any> extends ColDef {
  cellRendererParams?: TCellRendererParams;
}

// export class TColDef {
// //   static create<T = any>(colDef: TypedColDef<T>): TypedColDef<T> {
// //     return colDef;
// //   }
// // }

export function getColDef<T = any>(colDef: TypedColDef<T>): TypedColDef<T> {
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
