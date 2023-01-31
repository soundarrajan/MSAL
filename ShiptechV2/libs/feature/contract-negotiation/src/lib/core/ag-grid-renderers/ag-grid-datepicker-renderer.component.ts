import { Component, OnDestroy, ViewChild, } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ContractNegotiationService } from '../../services/contract-negotiation.service';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'datepicker-renderer',
    template: `
    <div class="cell-input">
    <input [matDatepicker]="picker" class="t-align-left" (dateChange)="dateChangeUpdate($event)"  [(ngModel)]="initialDate" (click)="$event.stopPropagation();picker.open();">
    <mat-datepicker [panelClass]="dark?'new-datepicker datepicker-darktheme':'new-datepicker'" #picker>
    </mat-datepicker> </div>  
    `,
    styles: [

    ]
})
export class AGGridDatepickerRenderer implements ICellRendererAngularComp {
    public params: any;
    public dark:boolean = false;
    initialDate;
    @ViewChild('picker') picker;
    constructor(public contractService: ContractNegotiationService,private toastr: ToastrService) {
    }
    agInit(params: any): void {
        this.params = params;
        if(this.params.value != null && this.params.value != undefined)
        this.initialDate = new Date(this.params.value);
        else
        this.initialDate = this.params.value;
    }
    dateChangeUpdate(e : MatDatepickerInputEvent<Date>) {
        if(e.value == null && e.value == undefined){
            this.params.value = this.params.data.ValidityDate;
            this.toastr.error('Pleaae enter valid date');
            return;
        }
        let newParams = JSON.parse(JSON.stringify(this.params.node.data));
        newParams.ValidityDate = e.value;
        this.contractService.updatePrices(newParams).subscribe(()=>{
        });
    }

    refresh(): boolean {
        return false;
    }


}
