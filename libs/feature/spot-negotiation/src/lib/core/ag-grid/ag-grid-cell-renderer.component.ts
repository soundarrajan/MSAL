import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
@Component({
  selector: 'ag-grid-cell-renderer',
  template: `
    <div
      [ngClass]="params.cellClass"
      matTooltip="{{ params.value }}"
      style="margin:0px"
    >
      <div class="truncate-125">{{ params.value }}</div>
    </div>
  `
})
export class AGGridCellRendererComponent implements ICellRendererAngularComp {
  public params: any;
  constructor(public router: Router) {}

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }
}
