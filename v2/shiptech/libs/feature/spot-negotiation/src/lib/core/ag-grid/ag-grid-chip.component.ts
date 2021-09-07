import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
@Component({
  selector: 'aggrid-chip',
  template: `
    <mat-chip-list>
      <mat-chip
        color="accent"
        matTooltip="{{ toolTip }}"
        [ngClass]="{
          'aggrid-roundchip': params.type == 'round',
          chipbase: params.color == 'chipbase',
          darkgreen: params.color == 'darkgreen'
        }"
        class="text-center aggrid-custom-chip chipbase mat-chip mat-primary mat-standard-chip"
        (click)="showICDetails()"
        >{{ this.params.value }}
      </mat-chip></mat-chip-list
    >
  `
})
export class AggridChipComponent implements ICellRendererAngularComp {
  public params: any;
  public toolTip: String;
  constructor(public router: Router) {}

  agInit(params: any): void {
    this.params = params;
    this.toolTip = params.value;
    if (params.tooltip == 'creator') {
      this.toolTip = params.data.createdby_name;
    }
    if (params.tooltip == 'updater') {
      this.toolTip = params.data.updatedby_name;
    }
  }

  refresh(): boolean {
    return false;
  }

  public showdata(data) {}
  public showICDetails() {
    this.params.context.componentParent.showICDetails(this.params.data);
  }
}
