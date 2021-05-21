import { Component } from "@angular/core";
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
@Component({
    selector: 'ag-grid-cell-renderer',
    template: `<div [ngClass]="params.cellClass" matTooltip="{{params.value}}" style="margin:0px">{{params.value}}</div> `
})

export class AGGridCellRendererComponent implements ICellRendererAngularComp  {
    public params: any;
	constructor(public router: Router) {    
    }        
	
    agInit(params: any): void {
        this.params = params;
        this.params.value = this.params?.value?.toString().toLowerCase();
    }

    refresh(): boolean {
        return false;
    }
}