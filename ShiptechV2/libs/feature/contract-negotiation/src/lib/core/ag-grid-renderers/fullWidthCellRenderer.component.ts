import { Component, OnDestroy, ViewChild } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';


@Component({
  selector: 'full-width-cell-renderer',
  template: `
        <div *ngIf="params.show" class="full-width-renderer">
          <span>No Quote</span>
        </div>
    `,
  styles: [`
      .full-width-renderer {
        background-color: #E9E9E9;
        text-align:center;
        font-weight: 500;
        font-size: 12px;
        color: #828282;
        margin: 0px -10px;
}
    
      }
  `
  ],
})
export class fullWidthCellRenderer implements ICellRendererAngularComp {

  public params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

}
