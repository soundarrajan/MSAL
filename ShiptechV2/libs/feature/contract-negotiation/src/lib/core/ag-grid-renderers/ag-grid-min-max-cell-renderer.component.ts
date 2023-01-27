import { Component, OnDestroy } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { ContractNegotiationService } from '../../services/contract-negotiation.service';


@Component({
    selector: 'cell-min-max-cell-renderer',
    template: `
    <div *ngIf="params.show" class="cell-input">
      <input [(ngModel)]="params.value" (change)="onQtyValueChange()">
    </div>`,
    styles: [

    ]
})
export class AGGridMinMaxCellRenderer implements ICellRendererAngularComp {
    public params: any;
    constructor(public contractService: ContractNegotiationService,private toaster: ToastrService,){
    }
    agInit(params: any): void {
        this.params = params;
    }

    refresh(): boolean {
        return false;
    }
    onQtyValueChange() {
        this.params.value = Number(this.params.value);
        if(this.params.value > 0 && this.params.value != ''){
            let newParams = JSON.parse(JSON.stringify(this.params.node.data));
            newParams[this.params.type] = this.params.value;
            this.contractService.updatePrices(newParams).subscribe();
        }else{
            this.params.value = this.params.data.MinQuantity; 
            this.toaster.error('Please enter valid value');
        }
        
    }   
}
