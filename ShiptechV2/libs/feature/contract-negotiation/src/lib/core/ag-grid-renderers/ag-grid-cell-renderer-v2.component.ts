import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
@Component({
  selector: 'ag-grid-cell-renderer-v2',
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
export class AGGridCellV2RendererComponent implements ICellRendererAngularComp {
  public params: any;
  constructor(public router: Router) {}

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }
}
