import { Component, OnDestroy } from '@angular/core';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
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
    constructor(
        public contractService: ContractNegotiationService,
        private toaster: ToastrService,
        public format: TenantFormattingService,){
    }
    agInit(params: any): void {
        this.params = params;
    }

    refresh(): boolean {
        return false;
    }
    onQtyValueChange() {
        if (typeof this.params.value != 'number' && this.params.value != null && this.params.value != '')
        this.params.value = Number(this.params.value.toString().replace(/,/g, ''));
        if(this.params.value > 0 && this.params.value != ''){
            let newParams = JSON.parse(JSON.stringify(this.params.node.data));
            newParams[this.params.type] = this.params.value;
            this.contractService.updatePrices(newParams).subscribe();
        }else{
            this.params.value = this.params.data[this.params.type]; 
            this.toaster.error('Please enter valid '+ this.params.type+ ' value');
        }
    }   
}
