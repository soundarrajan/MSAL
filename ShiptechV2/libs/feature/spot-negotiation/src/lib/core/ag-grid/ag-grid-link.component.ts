import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
@Component({
  selector: 'aggrid-link',
  template: `
    <span class="ng-star-inserted aggridlink">{{ this.params.value }}</span>
    <span
      class="ag-grid-copy float-right"
      id="list-icon"
      (click)="showPopup()"
    ></span>
  `
})
export class AggridLinkComponent implements ICellRendererAngularComp {
  public params: any;
  public toolTip: String;
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
    // this.params.context.componentParent.showICDetails(this.params.data);
  }

  public showPopup() {
    window.alert('Popup Action');
  }
}
