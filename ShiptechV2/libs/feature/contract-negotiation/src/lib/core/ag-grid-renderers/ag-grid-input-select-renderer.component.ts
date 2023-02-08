import { Component, OnDestroy } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ContractNegotiationService } from '../../services/contract-negotiation.service';
import { LocalService } from '../../services/local-service.service';


@Component({
    selector: 'input-select-renderer',
    template: `
    <div class="d-flex align-items-center justify-content-between ht-100" style="margin-top: 2px;">
    <!-- <div class="cell-input-field ht-100">
        <div [attr.contenteditable]="true" class="ht-100">{{params.value}}</div>
    </div> -->
    <mat-form-field class="p-l-2 p-r-2 cell-select-field" appearance="none">
    <mat-select disableOptionCentering [(ngModel)]="params.unit" panelClass="unitcurrencytrigger" style="width: 50px;">
        <mat-select-trigger>
            {{params.unit}}
        </mat-select-trigger>
        <div class="fs-12 p-5-8">Change Unit</div>
        <div style="max-height: 113px;overflow:auto;">
            <mat-option class="currency-mat-select" *ngFor="let frequency of unitArr"
                [value]="frequency.name">
                <span>
                    <mat-radio-button
                    [checked]='frequency.id == params.node.data.quantityUomId'
                    (click)="updateQtyUnit(frequency.id)"
                    >{{ frequency.displayName}}
                    </mat-radio-button>
                </span>
            </mat-option>
        </div>
    </mat-select>
</mat-form-field>
</div> 
     `,
    styles: []
})
export class AGGridInputSelectRenderer implements ICellRendererAngularComp {
    public params: any;
    public unitArr;
    constructor(private localService: LocalService,public contractService: ContractNegotiationService) {
    }
    
    ngOnInit(): void {
        this.unitArr = this.localService.masterData['Uom']
    }


    agInit(params: any): void {
        this.params = params;
    }
    updateQtyUnit(id){
        let newParams = JSON.parse(JSON.stringify(this.params.node.data));
        newParams.quantityUomId = id;
        this.contractService.updatePrices(newParams).subscribe();
    }

    refresh(): boolean {
        return false;
    }
}
