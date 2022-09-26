import { Component, OnDestroy, ViewChild, } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'datepicker-renderer',
    template: `
    <div class="cell-input">
    <input [matDatepicker]="picker" class="t-align-left" [formControl]="initialDate" (click)="$event.stopPropagation();picker.open();">
    <mat-datepicker [panelClass]="dark?'new-datepicker datepicker-darktheme':'new-datepicker'" #picker>
    </mat-datepicker> </div>  
    `,
    styles: [

    ]
})
export class AGGridDatepickerRenderer implements ICellRendererAngularComp {
    public params: any;
    public dark:boolean = false;
    initialDate = new FormControl();
    @ViewChild('picker') picker;
    agInit(params: any): void {
        this.params = params;
        this.initialDate.setValue(new Date(this.params.value));

    }

    refresh(): boolean {
        return false;
    }


}
