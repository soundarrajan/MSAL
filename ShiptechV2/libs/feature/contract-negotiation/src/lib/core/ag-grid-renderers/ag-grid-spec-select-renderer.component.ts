import { Component, OnDestroy } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ContractNegotiationService } from '../../services/contract-negotiation.service';
import { LocalService } from '../../services/local-service.service';

@Component({
    selector: 'input-spec-select-renderer',
    template: `
    <div   [matMenuTriggerFor]="clickmenu1" style="width:100%;height:100%;"
    #menuTrigger="matMenuTrigger" [matMenuTriggerData]="{data: params.data}" class="cell-input t-align-left">
    <span>{{params.value}}</span>
</div>

<mat-menu #clickmenu1="matMenu" class="add-new-request-menu">
    <ng-template matMenuContent let-aliasMenuItems="data">
        <div class="expansion-popup" style="margin: 20px 0px;">
            <div class="select-product-container">
                <table style="margin-top:15px" class="col-md-12 no-padding" mat-table
                    [dataSource]="dataSource">
                    <ng-container matColumnDef="product">
                        <th style="float:left;margin-top:5px;" mat-header-cell *matHeaderCellDef> Spec Groups </th>
                        <td style="float:left" mat-cell *matCellDef="let element">
                            <mat-option [value]="element.name" style="padding-left:0">
                                <mat-radio-button [value]="element.id"
                                    (click)="updateProduct(element.id,element.name)">
                                    {{element.name}}
                                </mat-radio-button>
                            </mat-option>
                        </td>
                    </ng-container>

                    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                    <tr mat-row *matRowDef="let row; columns: displayedColumns;">
                    </tr>
                </table>
            </div>
        </div>
    </ng-template>
</mat-menu>
     `,
    styles: []
})
export class AGGridSpecSelectRenderer implements ICellRendererAngularComp {
    public params: any;
    constructor(private localService: LocalService,public contractService: ContractNegotiationService) {
    }
    displayedColumns: string[] = ['product'];
    dataSource: any;

    ngOnInit(): void {
        this.localService.getMasterDataList().then(data => {
        this.localService.masterData = data;
        let prodId = this.params.data.ProductId;
        let specGroupArr = [];
        let prod = this.localService.masterData['Product'].find(p => p.id == prodId);
        if(prod?.defaultSpecGroupId && prod.defaultSpecGroupId != 0){
        specGroupArr = this.localService.masterData['SpecGroup'].filter(sg => sg.productId === prodId || sg.id == prod.defaultSpecGroupId);
        } else {
        specGroupArr = this.localService.masterData['SpecGroup'].filter(sg => sg.productId === prodId);
        }
        this.dataSource = specGroupArr;
        });
    }

    agInit(params: any): void {
        this.params = params;
    }

    refresh(): boolean {
        return false;
    }

    updateProduct(id, value) {
        this.params.value = value;
        let newParams = JSON.parse(JSON.stringify(this.params.node.data));
        newParams.SpecGroupId = id;
        newParams.SpecGroupName = value;
        this.contractService.updatePrices(newParams).subscribe();
    }
}
