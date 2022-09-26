import { Component, OnDestroy } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';


@Component({
    selector: 'cell-link-renderer',
    template: `
    <div>
      <span (click)="navigateTo($event)">{{params.value}}</span>
    </div>    `,
    styles: [

    ]
})
export class AGGridCellLinkRenderer implements ICellRendererAngularComp {
    public params: any;
    private checked = false;
    agInit(params: any): void {
        this.params = params;
        this.checked = this.params.value;
    }

    refresh(): boolean {
        return false;
    }


    navigateTo(e) {
        this.params.onClick(this.params.value);
    }


}
