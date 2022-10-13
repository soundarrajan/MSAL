import { R } from '@angular/cdk/keycodes';
import { Component, OnDestroy } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';


@Component({
    selector: 'cell-menu-renderer',
    template: `
    <div   [matMenuTriggerFor]="clickmenu1"
    #menuTrigger="matMenuTrigger" [matMenuTriggerData]="{data: params.data}" class="cell-input">
    {{params.value}}
</div>
<mat-menu #clickmenu1="matMenu" class="add-new-request-menu">
    <ng-template matMenuContent let-aliasMenuItems="data">
        <div class="expansion-popup" style="margin: 20px 0px;">
            <div class="select-product-container">
                <div class="col-md-12 header-container-product"
                    (click)="$event.stopPropagation(); $event.preventDefault();">
                    <div class="search-product-container col-md-10">
                        <span class="search-product-lookup">
                        </span>
                        <input matInput #inputBox1 placeholder="Search all and select a location"
                            class="search-product-input">
                    </div>
                    <div class="col-md-2">
                        <span class="expand-img"></span>
                    </div>
                </div>
                <table class="delivery-products-pop-up shiptech-delivery-popup col-md-12 no-padding" mat-table
                    [dataSource]="dataSource">

                    <ng-container matColumnDef="product">
                        <th mat-header-cell *matHeaderCellDef> Products </th>
                        <td mat-cell *matCellDef="let element">
                            <mat-option [value]="element.product" style="padding-left:0">
                                <mat-radio-button [value]="element.product"
                                    (click)="updateProduct(aliasMenuItems,element.product)">
                                    {{element.product}}
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
    dataSource = [
        { product: 'DMB MAX 0.1 %S', type: 'LSFO' },
        { product: 'DMA MAX 1%', type: 'DOGO' },
        { product: 'DMA MAX 1.5 %S', type: 'LSFO' },
        { product: 'RMG 380 MAX 0.5 %S', type: 'VLSFO' }
    ];
    displayedColumns: string[] = ['product', 'type'];
    agInit(params: any): void {
        this.params = params;
    }

    refresh(): boolean {
        return false;
    }

    updateProduct(row, value) {
        row.product = value;
        // this.rowData.forEach((data) => {
        //     if (data.status == row.status) {
        //         data.data.forEach(rec => {
        //             if (rec.id == row.id) {
        //                 rec.product = value;
        //                 return;
        //             }
        //         })
        //         return;
        //     }
        // })

    }

}
