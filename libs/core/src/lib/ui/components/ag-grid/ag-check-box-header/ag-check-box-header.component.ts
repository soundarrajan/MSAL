import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular';
import { GridApi, IAfterGuiAttachedParams, IHeaderParams, RowNode } from 'ag-grid-community';
import { IAgCheckBoxRendererParams } from '../ag-check-box-renderer/ag-check-box-renderer.component';
import { HeaderRendererConfig } from '../type.definition';
import { AgGridEventsEnum } from '../ag-grid.events';

export interface IAgCheckBoxHeaderParams extends Partial<IHeaderParams> {
  // Note: This does not work well with ag-grid column virtualisation, because it will re-select everything when column re-renders (horizontal scrollbar).
  // Note: Temp-workaround is to disable it
  initiallyAllSelected?: boolean;
  selectionChange?: (isSelected: boolean, params?: IAgCheckBoxHeaderParams) => void;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-ag-check-box-header',
  templateUrl: './ag-check-box-header.component.html',
  styleUrls: ['./ag-check-box-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgCheckBoxHeaderComponent implements OnInit, OnDestroy, IHeaderAngularComp {
  isSelected: boolean = false;
  private initParams: IAgCheckBoxHeaderParams;
  private gridApi: GridApi;

  constructor(private changeDetector: ChangeDetectorRef) {}

  static withParams(params: IAgCheckBoxHeaderParams): HeaderRendererConfig {
    return {
      headerComponentFramework: AgCheckBoxHeaderComponent,
      headerComponentParams: params
    };
  }

  ngOnInit(): void {}

  agInit(params: IAgCheckBoxRendererParams): void {
    this.initParams = params;
    this.gridApi = params.api;

    // Note: This does not work well with ag-grid column virtualisation, because it will re-select everything when column re-renders (horizontal scrollbar).
    // Note: Temp-workaround is to disable it
    this.isSelected = !!this.initParams.initiallyAllSelected;
    this.initParams?.selectionChange?.(this.isSelected);

    this.gridApi.addEventListener(AgGridEventsEnum.selectionChanged, this.selectionChanged.bind(this));
    this.gridApi.addEventListener(AgGridEventsEnum.viewportChanged, this.viewportChanged.bind(this));
    this.gridApi.addEventListener(AgGridEventsEnum.modelUpdated, this.modelUpdated.bind(this));
    this.gridApi.addEventListener(AgGridEventsEnum.filterChanged, this.onFilterChange.bind(this));
  }

  ngOnDestroy(): void {
    this.gridApi.removeEventListener(AgGridEventsEnum.selectionChanged, this.selectionChanged);
    this.gridApi.removeEventListener(AgGridEventsEnum.viewportChanged, this.viewportChanged);
    this.gridApi.removeEventListener(AgGridEventsEnum.modelUpdated, this.modelUpdated);
    this.gridApi.removeEventListener(AgGridEventsEnum.filterChanged, this.onFilterChange);
  }

  selectionChanged(): void {
    this.checkSelected();
  }

  modelUpdated(): void {
    this.checkSelected();
  }

  viewportChanged(): void {
    this.checkSelected();
  }

  onSelected(selected: boolean): void {
    this.isSelected = selected;

    this.setAllVisibleNodes(selected);

    this.initParams?.selectionChange?.(this.isSelected);
  }

  private checkSelected(): void {
    this.isSelected = this.ensureAllSelected();

    if (this.isSelected !== undefined) {
      this.updateSelection();
    }

    this.changeDetector.markForCheck();
  }

  private updateSelection(): void {
    if (this.isSelected !== undefined) {
      this.setAllVisibleNodes(this.isSelected);
      this.initParams?.selectionChange?.(this.isSelected);
    }
  }

  // NOTE: On filter change the selection must be reset because there might be rows who are not displayed that remain selected
  private onFilterChange(): void {
    this.isSelected = false;
    this.initParams?.selectionChange?.(this.isSelected);
  }

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {}

  private setAllVisibleNodes(selected: boolean): void {
    // Note: Check node data, when loading the first row has no data so it can't be selected, throwing errors and behaving weird
    // Note: Loading rows are called stubs.

    if(this.gridApi){
      this.gridApi.forEachNode((node, index) => {
        if (!node.stub) {
          node.setSelected(selected, false);
        }
      });
    }
  }

  private ensureAllSelected(): boolean {
    const rowNodes: RowNode[] = [];

    if(this.gridApi){

      this.gridApi.forEachNode((node, index) => {
        rowNodes.push(node);
      });
    }

    if(rowNodes.length === 0)
      return false;
    else if (rowNodes.filter(n => !n.stub).every(n => n.isSelected())) {
      return true;
    } else if (rowNodes.filter(n => !n.stub).every(n => !n.isSelected())) {
      return false;
    }

    return undefined;
  }
}
