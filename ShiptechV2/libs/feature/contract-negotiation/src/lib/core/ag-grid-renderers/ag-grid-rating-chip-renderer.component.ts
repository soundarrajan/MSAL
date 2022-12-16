import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { MatDialog } from "@angular/material/dialog";
import { SellerratingpopupComponent } from '@shiptech/core/ui/components/designsystem-v2/dialog-popup/sellerratingpopup/sellerratingpopup.component';
@Component({
    selector: 'rating-chip-renderer',
    template: `
    <div [ngClass]="params.cellClass" *ngIf = "params.value.grating != null "
    (click)="sellerratingpopup(params.data, params.label)">
    <div  class="truncate-125 chip">
        <div class="m-lr-5"  *ngIf = "params.label == 'port-rating'" >
            {{params.value.prating}}
            <span class="star"></span>
        </div>
        <div class="m-lr-5"  *ngIf = "params.label == 'gen-rating'" >
        {{params.value.grating}}
        <span class="star"></span>
       </div>
        <div>{{params.value.gprice}}</div>
    </div>
  </div>
  <div  class="truncate-125 chip" *ngIf = "params.value.grating == null " style="background-color: rgb(196, 196, 196) !important">
  <div class="m-lr-5">NA</div>
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
        console.log(this.params);
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
          data: {
            sellerName: data.CounterpartyName,
            sellerId: data.CounterpartyId,
            locationId : data.LocationId,
            popupType : type
          }
        });
      }

}
