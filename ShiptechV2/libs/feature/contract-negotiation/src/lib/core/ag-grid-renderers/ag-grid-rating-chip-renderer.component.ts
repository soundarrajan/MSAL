import { Component, OnDestroy } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { MatDialog } from "@angular/material/dialog";
import { SellerratingpopupComponent } from '@shiptech/core/ui/components/designsystem-v2/dialog-popup/sellerratingpopup/sellerratingpopup.component';


@Component({
    selector: 'rating-chip-renderer',
    template: `
    <div [ngClass]="params.cellClass"
    (click)="sellerratingpopup('port',params.value.grating,params.value.gprice,params.value.prating,params.value.pprice)">
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

    sellerratingpopup(type, genRating, genPrice, portRating, portPrice) {
        const dialogRef = this.dialog.open(SellerratingpopupComponent, {
          width: '1164px',
          height: '562px',
          panelClass: 'additional-cost-popup',
          data: { type: type, gRating: genRating, gPrice: genPrice, pRating: portRating, pPrice: portPrice }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
      }

}
