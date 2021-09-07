import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
@Component({
  selector: 'aggrid-status-chip',
  template: `
    <mat-chip-list>
      <mat-chip
        color="accent"
        matTooltip="{{ toolTip }}"
        [ngClass]="[
          params.value == 'Confirmed'
            ? 'darkgreen'
            : params.value == 'Unconfirmed'
            ? 'amber'
            : params.value == 'Settled'
            ? 'lightgreen'
            : params.value == 'Unposted'
            ? 'red'
            : ''
        ]"
        class="aggrid-custom-chip mat-chip mat-primary mat-standard-chip"
        (click)="showICDetails()"
        >{{ this.params.value }}
      </mat-chip></mat-chip-list
    >
  `
})
export class AggridStatusChipComponent implements ICellRendererAngularComp {
  public params: any;
  public toolTip: string;
  constructor(public router: Router) {}

  agInit(params: any): void {
    this.params = params;
    this.toolTip = params.value;
  }

  refresh(): boolean {
    return false;
  }

  public showdata(data) {}
  public showICDetails() {
    this.params.context.componentParent.showICDetails(this.params.data);
  }
}
