import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
  selector: 'app-ag-grid-cell-style',
  template: `<div [ngClass]="params.cellClass">
  <div class="truncate-100p inner-cell" style="padding-right: 10px;">{{params.value}}</div>
  </div>
  `,
  styles: [`
  .ng-star-inserted{
      width: 100%;
    }
    `
  ]
})
export class AgGridCellStyleComponent implements ICellRendererAngularComp {

  public params: any;
	constructor(public router: Router) {    
    }        
	
    agInit(params: any): void {
        this.params = params;
    }

    refresh(): boolean {
        return false;
    }
    handleChange() {
        this.params.node.setSelected(!this.params.node.selected)
      }

}
