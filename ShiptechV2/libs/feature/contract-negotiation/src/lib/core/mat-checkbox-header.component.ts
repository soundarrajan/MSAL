import { Component, ElementRef, Inject, QueryList, ViewChild, ViewChildren } from '@angular/core';

@Component({
    selector: 'mat-checkbox-header',
    template: `<div class="container">
    <mat-checkbox class="light-checkbox small preferred" (change) = "onChange($event)" [ngClass]="params.displayName"></mat-checkbox>
    </div>`,
    styles: [`
        .container {
            width: 100%;
            margin-top: 6px;
            margin-left: 3px;
        }
    `]
})
export class MatCheckboxHeaderComponent {
    params: any;
    constructor() {
    }
    agInit(params: any): void {
        this.params = params;
    }
    onChange(event){
        this.params.context.componentParent.selectAllRows(event.checked);
    }
}
