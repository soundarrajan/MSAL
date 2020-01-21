import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { GridApi, IAfterGuiAttachedParams, RowSelectedEvent } from 'ag-grid-community';
import { CellRendererConfig, ITypedCellRendererParams } from '../type.definition';
import { AgGridEventsEnum } from '../ag-grid.events';

export interface IAgCheckBoxRendererParams<TData = any, TField = any> extends Partial<ITypedCellRendererParams<TData, TField>> {
  selectionChange?: (isSelected: boolean, params?: IAgCheckBoxRendererParams<TData, TField>) => void;
  isVisible?: (params?: IAgCheckBoxRendererParams<TData, TField>) => boolean;
  isReadOnly?: (params?: IAgCheckBoxRendererParams<TData, TField>) => boolean;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-ag-check-box-renderer',
  templateUrl: './ag-check-box-renderer.component.html',
  styleUrls: ['./ag-check-box-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgCheckBoxRendererComponent implements OnInit, OnDestroy, ICellRendererAngularComp {
  isSelected: boolean = false;
  isVisible: boolean = true;
  isReadOnly: boolean = false;

  private _nodeId: string;
  private initParams: IAgCheckBoxRendererParams;
  private gridApi: GridApi;

  static withParams<TData = any, TField = any>(params: IAgCheckBoxRendererParams<TData, TField>): CellRendererConfig {
    return {
      cellRendererFramework: AgCheckBoxRendererComponent,
      cellRendererParams: params
    };
  }

  constructor(private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  agInit(params: IAgCheckBoxRendererParams): void {
    this.initParams = params;

    this.gridApi = params.api;
    this._nodeId = params.node.id;

    this.isReadOnly = this.initParams.isReadOnly?.(this.initParams) ?? false;
    this.isVisible = this.initParams.isVisible?.(this.initParams) ?? true;
    this.isSelected = params.node.isSelected();

    params.api.addEventListener(AgGridEventsEnum.rowSelected, this.onGridRowSelected.bind(this));

    this.changeDetector.markForCheck();
  }

  ngOnDestroy(): void {
    this.gridApi.removeEventListener(AgGridEventsEnum.rowSelected, this.onGridRowSelected);
  }

  onSelected(selected: boolean): void {
    this.isSelected = selected;

    this.initParams.node.setSelected(selected);

    this.initParams?.selectionChange?.(selected, this.initParams);
  }

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {
  }

  refresh(params: any): boolean {
    /** Get the cell to refresh. Return true if successful. Return false if not (or you don't have refresh logic),
     * then the grid will refresh the cell for you. */
    this.isReadOnly = this.initParams.isReadOnly?.(this.initParams) ?? false;
    this.isVisible = this.initParams.isVisible?.(this.initParams) ?? true;

    this.changeDetector.markForCheck();

    return true;
  }

  private onGridRowSelected(event: RowSelectedEvent): void {
    if (event.node.id === this._nodeId) {
      this.isSelected = event.node.isSelected();
      this.changeDetector.markForCheck();

      this.initParams?.selectionChange?.(this.isSelected, this.initParams);
    }
  }
}
