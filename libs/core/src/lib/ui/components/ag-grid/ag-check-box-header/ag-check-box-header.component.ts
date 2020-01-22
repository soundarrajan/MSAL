import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular';
import { GridApi, IAfterGuiAttachedParams, IHeaderParams, RowNode } from 'ag-grid-community';
import { IAgCheckBoxRendererParams } from '../ag-check-box-renderer/ag-check-box-renderer.component';
import { HeaderRendererConfig } from '../type.definition';
import { AgGridEventsEnum } from '../ag-grid.events';

export interface IAgCheckBoxHeaderParams extends Partial<IHeaderParams> {
  selectionChange?: (isSelected: boolean, params?: IAgCheckBoxHeaderParams) => void;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-ag-check-box-header',
  templateUrl: './ag-check-box-header.component.html',
  styleUrls: ['./ag-check-box-header.component.scss'],
  // providers: [
  //   {provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'check'}
  // ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgCheckBoxHeaderComponent implements OnInit, OnDestroy, IHeaderAngularComp {
  get isSelected(): boolean {
    return this._isSelected;
  }

  indeterminate: boolean = false;

  set isSelected(value: boolean) {
    this._isSelected = value;
    this.indeterminate = this.isSelected === undefined;
  }

  private _isSelected: boolean = false;
  private initParams: IAgCheckBoxHeaderParams;
  private gridApi: GridApi;

  constructor(private changeDetector: ChangeDetectorRef) {
  }

  static withParams(params: IAgCheckBoxHeaderParams): HeaderRendererConfig {
    return {
      headerComponentFramework: AgCheckBoxHeaderComponent,
      headerComponentParams: params
    };
  }

  ngOnInit(): void {
  }

  agInit(params: IAgCheckBoxRendererParams): void {
    this.initParams = params;
    this.gridApi = params.api;

    this.initParams?.selectionChange?.(this._isSelected);
    this.subscribeToGridEvents();
  }

  private subscribeToGridEvents(): void {
    this.gridApi.addEventListener(AgGridEventsEnum.selectionChanged, this.selectionChanged.bind(this));
    this.gridApi.addEventListener(AgGridEventsEnum.viewportChanged, this.viewportChanged.bind(this));
    this.gridApi.addEventListener(AgGridEventsEnum.modelUpdated, this.modelUpdated.bind(this));
    this.gridApi.addEventListener(AgGridEventsEnum.filterChanged, this.onFilterChange.bind(this));
  }

  private UnsubscribeToGridEvents(): void {
    this.gridApi.removeEventListener(AgGridEventsEnum.selectionChanged, this.selectionChanged);
    this.gridApi.removeEventListener(AgGridEventsEnum.viewportChanged, this.viewportChanged);
    this.gridApi.removeEventListener(AgGridEventsEnum.modelUpdated, this.modelUpdated);
    this.gridApi.removeEventListener(AgGridEventsEnum.filterChanged, this.onFilterChange);
  }

  selectionChanged(): void {
    this.recheckGridSelection();
  }

  modelUpdated(): void {
    this.recheckGridSelection();
  }

  viewportChanged(): void {
    this.recheckGridSelection();
  }

  selectClick(selected: boolean): void {
    this.isSelected = selected;

    this.setAllVisibleNodes(selected);

    this.initParams?.selectionChange?.(this.isSelected);
  }

  private recheckGridSelection(): void {
    const allRowSelected = this.ensureAllSelected();

    if (this.isSelected !== allRowSelected) {
      this.isSelected = allRowSelected;

      this.initParams?.selectionChange?.(this.isSelected);
    }

    this.changeDetector.markForCheck();
  }

  // NOTE: On filter change the selection must be reset because there might be rows who are not displayed that remain selected
  private onFilterChange(): void {
    this.isSelected = false;
    this.initParams?.selectionChange?.(this.isSelected);
  }

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {
  }

  private setAllVisibleNodes(selected: boolean): void {
    // Note: Check node data, when loading the first row has no data so it can't be selected, throwing errors and behaving weird
    // Note: Loading rows are called stubs.

    if (this.gridApi) {
      this.gridApi.forEachNode((node, index) => {
        if (!node.stub && node.selectable) {
          node.setSelected(selected, false);
        }
      });
    }
  }

  private ensureAllSelected(): boolean {
    const rowNodes: RowNode[] = [];

    if (this.gridApi) {

      this.gridApi.forEachNode((node, index) => {
        if (!node.stub && node.selectable)
          rowNodes.push(node);
      });
    }

    if (rowNodes.length === 0)
      return false;
    else if (rowNodes.every(n => n.isSelected())) {
      return true;
    } else if (rowNodes.every(n => !n.isSelected())) {
      return false;
    }

    return undefined;
  }

  ngOnDestroy(): void {
    this.UnsubscribeToGridEvents();
  }

}
