import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { AdditionalCostPopupComponent } from '../../views/contract-negotiation-components/contract-negotiation-popups/additional-cost-popup/additional-cost-popup.component';
import { FormulaPricingPopupComponent } from '../../views/contract-negotiation-components/contract-negotiation-popups/formula-pricing-popup/formula-pricing-popup.component';
import { ModifyOfferPeriodPopupComponent } from '../../views/contract-negotiation-components/contract-negotiation-popups/modify-offer-period-popup/modify-offer-period-popup.component';


@Component({
    selector: 'cell-click-renderer',
    template: `
<div *ngIf="params.type=='offerprice-hover-cell'" class="fly-away">
    <div [matMenuTriggerFor]="priceMenupopup" #pricePopupTrigger="matMenuTrigger"
        (click)="pricePopupTrigger.closeMenu()" class="cell-input"
        (contextmenu)="$event.preventDefault();$event.stopPropagation();pricePopupTrigger.openMenu();">
        <input [(ngModel)]="params.value" (change)="onInputChange()" *ngIf="params.node.level != 0">


    </div>
    <mat-menu #priceMenupopup="matMenu" class="darkPanel-add big">
        <div class="add-block" (click)="formulaPricingPopup()">
            <div></div><span>Add/View Formula pricing</span>
        </div>
        <div class="divider-line"></div>
        <div class="add-block" (click)="additionalCostPopup()">
            <div></div><span>Add/View Additional Cost</span>
        </div>
        <div class="divider-line"></div>
        <div class="add-block" (click)="modifyOfferPeriod($event,params)">
            <div></div><span>Modify Offer Period</span>
        </div>
    </mat-menu>
</div>  
       `,
    styles: [

    ]
})
export class AGGridCellClickRendererComponent implements ICellRendererAngularComp {

    public params: any;
    dummyId = 121;
    constructor(public dialog: MatDialog, private toaster: ToastrService) {

    }

    agInit(params: any): void {
        this.params = params;
    }

    refresh(): boolean {
        return false;
    }

    

    addToAnotherNego() {
        this.toaster.show('<div class="image-placeholder"><span class="image"></span></div><div class="message">Negotiation duplicated successfully and available in request list</div>',
            '', {
            enableHtml: true,
            toastClass: "toast-alert toast-green custom-toast", // toast-green, toast-amber, toast-red, toast-grey
            timeOut: 2000
        });
    }

    addAnotherOffer(val) {
        let index = -1;
        let rowData = [];
        this.params.api.forEachNode((node, i) => {
            if (node.data && node.data.CounterpartyName == val) {
                node.data.id = this.dummyId;
                index = i;
                rowData.push(node.data);
            }
        });
        this.params.api.applyTransaction({ add: rowData, addIndex: index });

    }

    formulaPricingPopup() {
        const dialogRef = this.dialog.open(FormulaPricingPopupComponent, {
            width: '1164px',
            maxHeight: '95vh',
            height: 'auto',
            panelClass: ['additional-cost-popup', 'pricing-detail-popup-panel-class', 'scroll-change'],
        });

        dialogRef.afterClosed().subscribe(result => {
            //this.rowData[index].data[rowindex].offPrice = "432.5";
        });
    }

    additionalCostPopup() {
        const dialogRef = this.dialog.open(AdditionalCostPopupComponent, {
            width: '1170px',
            height: 'auto',
            maxHeight: '80vh',
            panelClass: 'additional-cost-popup',
        });

        dialogRef.afterClosed().subscribe(result => {
            //this.rowData[index].data[rowindex].offPrice = Number(this.rowData[index].data[rowindex].offPrice) + 100;
        });
    }

    modifyOfferPeriod(e, params) {
        const dialogRef = this.dialog.open(ModifyOfferPeriodPopupComponent, {
            width: '350px',
            height: '150px',
            panelClass: ['additional-cost-popup'],
        });

        dialogRef.afterClosed().subscribe(result => {
            //row.offerPeriod = result;
        });
    }

    onInputChange(){
console.log(this.params.data.Status)
        if(this.params.data.Status=='Rejected'){
            this.params.context.componentParent.toggleProgressBar(this.params.data);

        }
    }
}
