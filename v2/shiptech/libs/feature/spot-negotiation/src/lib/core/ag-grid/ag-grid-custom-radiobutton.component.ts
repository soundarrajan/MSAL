import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-ag-grid-custom-radiobutton',
  template: `
    <div>
      <mat-radio-group class="">
        <mat-radio-button
          value=""
          [(checked)]="params.node.selected"
          (change)="handleChange()"
        ></mat-radio-button>
      </mat-radio-group>
    </div>
  `,
  styles: [
    `
      .ng-star-inserted {
        width: 100%;
      }
    `
  ]
})
export class AgGridCustomRadiobuttonComponent
  implements ICellRendererAngularComp {
  public params: any;
  constructor(public router: Router) {}

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }
  handleChange() {
    this.params.node.setSelected(!this.params.node.selected);
  }
}
