import { R } from '@angular/cdk/keycodes';
import { Component, OnDestroy } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { ContractNegotiationService } from '../../services/contract-negotiation.service';
import { LocalService } from '../../services/local-service.service';


@Component({
    selector: 'cell-menu-renderer',
    template: `
    <div   [matMenuTriggerFor]="clickmenu1" (click)="fillInitialProductData()"
    #menuTrigger="matMenuTrigger" [matMenuTriggerData]="{data: params.data}" class="cell-input">
    {{params.value}}
    </div>
<mat-menu #clickmenu1="matMenu" class="add-new-request-menu">
    <ng-template matMenuContent let-aliasMenuItems="data">
        <div class="expansion-popup">
            <div class="select-product-container" style="margin-top:23px;">
                <div class="col-md-12 header-container-product"
                    (click)="$event.stopPropagation(); $event.preventDefault();">
                    <div class="search-product-container col-md-10">
                        <span class="search-product-lookup">
                        </span>
                        <input matInput #inputBox1 placeholder="Search all and select a Product" (input)="applyFilter(inputBox1.value)"
                            class="search-product-input">
                    </div>
                    <div class="col-md-2">
                        <span class="expand-img"></span>
                    </div>
                </div>
                <table class="delivery-products-pop-up shiptech-delivery-popup col-md-12 no-padding" mat-table
                    [dataSource]="dataSource">

                    <ng-container matColumnDef="product">
                        <th style="margin-top:5px" mat-header-cell *matHeaderCellDef> Products </th>
                        <td mat-cell *matCellDef="let element">
                            <mat-option [value]="element.product" style="padding-left:0">
                                <mat-radio-button [value]="element.id"
                                    (click)="updateProduct(element.id,element.name)">
                                    {{element.name}}
                                </mat-radio-button>
                            </mat-option>
                        </td>
                    </ng-container>


                    <ng-container matColumnDef="type">
                        <th mat-header-cell *matHeaderCellDef> Type </th>
                        <td mat-cell *matCellDef="let element">
                            <mat-option>
                                 {{element.type}} 
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
    styles: [

    ]
})

export class AGGridCellMenuRenderer implements ICellRendererAngularComp {
    public params: any;
    displayedColumns: string[] = ['product', 'type'];
    constructor(
        private localService: LocalService,
        public contractService: ContractNegotiationService,
        private toastr: ToastrService) {
    }
    dataSource: any; 
    ngOnInit(): void {
        this.dataSource = this.localService.masterData['Product'].slice(0, 14);
        this.dataSource = JSON.parse(JSON.stringify(this.dataSource));
        this.appendProductType();
    }
    agInit(params: any): void {
        this.params = params;
    }

    refresh(): boolean {
        return false;
    }
    fillInitialProductData(){
        this.dataSource = this.localService.masterData['Product'].slice(0, 14);
        this.dataSource = JSON.parse(JSON.stringify(this.dataSource));
        this.appendProductType();
    }
    updateProduct(prodId, value) {
        let specGroupArr;
        let newParams = JSON.parse(JSON.stringify(this.params.node.data));
        newParams.ProductId = prodId;
        let prod = this.localService.masterData['Product'].find(p => p.id == prodId);

        if(prod?.defaultSpecGroupId && prod.defaultSpecGroupId != 0){
            specGroupArr = this.localService.masterData['SpecGroup'].filter(sg => sg.id == prod.defaultSpecGroupId);
            newParams.SpecGroupId = specGroupArr[0].id;
            newParams.SpecGroupName = specGroupArr[0].name;
        } else {
            specGroupArr = this.localService.masterData['SpecGroup'].filter(sg => sg.productId === prodId);
            newParams.SpecGroupId = null;
            newParams.SpecGroupName = null;
        }

        if(specGroupArr.length > 0){
            this.params.value = value;
            this.contractService.updatePrices(newParams).subscribe();
        }else{
            this.toastr.error('No Spec Group found for '+ value);
        }
        
    }

    appendProductType() {
        this.dataSource.forEach(element => {
            element.type = this.localService.masterData['ProductType']
            .find(x => x.id == element.productTypeId).name;
        });
    }

    applyFilter(filterValue: string) {
        if (filterValue) {
            this.dataSource = this.localService.masterData['Product']
                .filter(option => option.name.toLowerCase()
                .includes(filterValue.toLowerCase()))
                .slice(0, 14);
            this.appendProductType();
        } else {
            this.fillInitialProductData();
        }
    }
}
