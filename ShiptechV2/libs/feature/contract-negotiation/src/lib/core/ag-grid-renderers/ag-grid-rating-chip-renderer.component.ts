import { Component, OnDestroy } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { MatDialog } from "@angular/material/dialog";
import { SellerratingpopupComponent } from '@shiptech/core/ui/components/designsystem-v2/dialog-popup/sellerratingpopup/sellerratingpopup.component';
import { isObject } from 'lodash';


@Component({
    selector: 'rating-chip-renderer',
    template: `
    <div [ngClass]="params.cellClass"
    (click)="sellerratingpopup(params.data, params.label)">
    <div  class="truncate-125 chip">
        <div class="m-lr-5">
            {{params.value.grating}}
            <span class="star"></span>
        </div>
        <div>{{params.value.gprice}}</div>
    </div>
</div>
    `,
    styles: [

    ]
})
export class AGGridRatingChipRenderer implements ICellRendererAngularComp {
    public params: any;
    constructor(public dialog: MatDialog) {
    }
    agInit(params: any): void {
        this.params = params;
    }

    refresh(): boolean {
        return false;
    }

    sellerratingpopup(data : any, popupType:string) {
        let type = (popupType == 'gen-rating')?'genRating':'portRating';
        const dialogRef = this.dialog.open(SellerratingpopupComponent, {
          width: '1164px',
          height: '562px',
          panelClass: 'additional-cost-popup',
          /*data: {
            sellerId: data.sellerCounterpartyId,
            locationId : data.locationId,
            popupType : type
          }*/
          data: {
            sellerId: 385,
            locationId: 112,
            popupType: type
          }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
      }

}
