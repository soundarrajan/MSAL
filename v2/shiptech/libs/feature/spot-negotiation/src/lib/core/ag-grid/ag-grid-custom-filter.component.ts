import { Component, ViewChild, ViewContainerRef } from '@angular/core';

import {
  IAfterGuiAttachedParams,
  IDoesFilterPassParams,
  IFilterParams,
  RowNode
} from 'ag-grid-community';
import { IFilterAngularComp } from 'ag-grid-angular';
export interface Unit {
  value: string;
  name: string;
}
@Component({
  selector: 'filter-cell',
  template: `
    <div ref="tabBody" class="ag-tab-body">
      <div class="ag-filter">
        <div>
          <div class="ag-filter-body-wrapper">
            <div ref="ag-filter-loading" class="loading-filter ag-hidden">
              Loading...
            </div>
            <div>
              <div class="ag-filter-header-container">
                <select
                  class="ag-filter-select"
                  id="filterType"
                  [(ngModel)]="condition"
                >
                  <option value="equals">Equals</option>
                  <option value="notEqual">Not equal</option>
                  <option value="lessThan">Less than</option>
                  <option value="lessThanOrEqual">Less than or equals</option>
                  <option value="greaterThan">Greater than</option>
                  <option value="greaterThanOrEqual"
                    >Greater than or equals</option
                  >
                  <!--<option value="inRange">In range</option>!-->
                </select>
              </div>
              <div>
                <div
                  class="ag-input-text-wrapper search-container"
                  id="ag-mini-filter"
                >
                  <input
                    type="text"
                    placeholder="Search..."
                    #input
                    [ngModel]="searchText"
                    (ngModelChange)="onChange($event)"
                  />
                  <select
                    placeholder="Select"
                    [(ngModel)]="selectedUnit"
                    name="unit"
                    (ngModelChange)="onChangeUnit($event)"
                  >
                    <option *ngFor="let unit of units" [value]="unit.value">{{
                      unit.name
                    }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="ag-filter-apply-panel" id="applyPanel">
      <button type="button" id="clearButton" class="fbtn" (click)="onClear()">
        Clear Filter
      </button>
      <button type="button" id="applyButton" class="fbtn" (click)="onApply()">
        Apply Filter
      </button>
    </div>
  `,
  styles: [
    `
      .ag-primary-cols-list-panel {
        height: 150px;
      }
      .container {
        width: 100%;
        height: 100%;
      }

      input {
        height: 20px;
      }
      .ag-filter-filter {
        width: 50%;
      }
      .fbtn {
        color: #1cabe0 !important;
        cursor: pointer;
      }
      select {
        border: 0;
        outline: 0;
        background-color: transparent;
        box-shadow: 0px 2px 0px 0px #eaecee;
        margin-bottom: -4px;
        padding-bottom: 6px;
      }
      select:focus {
        box-shadow: 0px 2px 0px 0px #1cabe0;
        border: 0;
      }

      .select_box:after {
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid #f00;
        position: absolute;
        top: 40%;
        right: 5px;
        content: '';
        z-index: 98;
      }
      .search-container {
        padding: 0px 6px;
      }
      .search-container select {
        margin-left: 12px;
      }
      .search-container input {
        height: 30px;
        padding-bottom: 0px;
      }
      .search-container input:focus {
        padding-bottom: 0px;
      }
    `
  ]
})
export class AggridCustomFilter implements IFilterAngularComp {
  private params;
  private valueGetter: (rowNode: RowNode) => any;
  public searchText: string = '';
  public condition = 'equals';
  public selectedUnit = '';
  public filterTo;

  units: Unit[] = [
    { value: 'BBL', name: 'BBL' },
    { value: 'MT', name: 'MT' },
    { value: 'GAL', name: 'GAL' }
  ];

  @ViewChild('input', { read: ViewContainerRef }) public input;

  agInit(params): void {
    this.params = params;
    this.valueGetter = params.valueGetter;
  }

  isFilterActive(): boolean {
    return (
      (this.searchText !== null &&
        this.searchText !== undefined &&
        this.searchText !== '') ||
      (this.selectedUnit !== null &&
        this.selectedUnit !== undefined &&
        this.selectedUnit !== '')
    );
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    // console.log(typeof(params.data[this.params.primaryColId]));
    // console.log(typeof(params.data[this.params.secondaryColId]));
    if (
      this.selectedUnit != null &&
      this.selectedUnit != '' &&
      this.selectedUnit != undefined
    ) {
      if (params.data[this.params.secondaryColId] == this.selectedUnit) {
        if (
          this.searchText !== null &&
          this.searchText !== undefined &&
          this.searchText !== ''
        ) {
          return this.validateWithCondition(
            Number(params.data[this.params.primaryColId])
          );
        } else {
          return true;
        }
      } else {
        return false;
      }
    } else {
      if (
        this.searchText !== null &&
        this.searchText !== undefined &&
        this.searchText !== ''
      ) {
        return this.validateWithCondition(
          Number(params.data[this.params.primaryColId])
        );
      } else {
        return true;
      }
    }
  }

  validateWithCondition(value: number): boolean {
    if (this.condition == 'equals') return value == Number(this.searchText);
    else if (this.condition == 'notEqual')
      return value != Number(this.searchText);
    else if (this.condition == 'lessThan')
      return value < Number(this.searchText);
    else if (this.condition == 'lessThanOrEqual')
      return value <= Number(this.searchText);
    else if (this.condition == 'greaterThan')
      return value > Number(this.searchText);
    else if (this.condition == 'greaterThanOrEqual')
      return value >= Number(this.searchText);
    else if (this.condition == 'inRange')
      return Number(this.searchText) < value > this.filterTo;

    return false;
  }

  getModel(): any {
    return {
      type: this.condition,
      filter: this.searchText + ' ' + this.selectedUnit,
      filterTo: null
    };
  }

  setModel(model: any): void {
    this.searchText = model ? model.filter : '';
    this.condition = model ? model.type : '';
    this.filterTo = model ? model.filterTo : '';
  }

  ngAfterViewInit(params: IAfterGuiAttachedParams): void {
    window.setTimeout(() => {
      this.input.element.nativeElement.focus();
    });
  }

  // noinspection JSMethodCanBeStatic
  componentMethod(message: string): void {
    alert(`Alert from PartialMatchFilterComponent ${message}`);
  }

  onChange(newValue): void {
    if (this.searchText !== newValue) {
      this.searchText = newValue;
      // this.params.filterChangedCallback(); //comment this when use apply button
    }
  }

  onChangeUnit(newValue): void {
    if (this.searchText !== newValue) {
      this.selectedUnit = newValue;
      // this.params.filterChangedCallback(); //comment this when use apply button
    }
  }

  onApply() {
    if (this.isFilterActive()) this.params.filterChangedCallback();
  }

  onClear() {
    this.condition = 'equals';
    this.searchText = '';
    this.selectedUnit = '';
    this.params.filterChangedCallback();
  }
}
