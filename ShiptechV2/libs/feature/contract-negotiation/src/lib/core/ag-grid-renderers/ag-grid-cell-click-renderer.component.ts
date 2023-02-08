import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { ContractNegotiationService } from '../../services/contract-negotiation.service';
import { LocalService } from '../../services/local-service.service';
import { AdditionalCostPopupComponent } from '../../views/contract-negotiation-components/contract-negotiation-popups/additional-cost-popup/additional-cost-popup.component';
import { FormulaPricingPopupComponent } from '../../views/contract-negotiation-components/contract-negotiation-popups/formula-pricing-popup/formula-pricing-popup.component';
import { ModifyOfferPeriodPopupComponent } from '../../views/contract-negotiation-components/contract-negotiation-popups/modify-offer-period-popup/modify-offer-period-popup.component';


@Component({
    selector: 'cell-click-renderer',
    template: `
<div *ngIf="params.show" class="fly-away">
    <div [matMenuTriggerFor]="priceMenupopup" #pricePopupTrigger="matMenuTrigger"
        (click)="pricePopupTrigger.closeMenu()" class="cell-input"
        (contextmenu)="$event.preventDefault();$event.stopPropagation();pricePopupTrigger.openMenu();">
        <input [(ngModel)]="params.value" (change)="onInputChange()" *ngIf="params.node.level != 0">
        <span *ngIf="params.value == '432.5'" class="formula-indication-icon" 
        matTooltip="Formula Based Pricing - DOD" matTooltipClass="lightTooltip"></span>
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
    constructor(
        public dialog: MatDialog,
        private toaster: ToastrService,
        public contractService: ContractNegotiationService,
        private tenantService: TenantFormattingService,
        private localService: LocalService,
        ) {

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
        if(this.params.node.data.OfferPrice == null || this.params.node.data.OfferPrice == undefined || this.params.node.data.OfferPrice == ''){
            this.toaster.error('No Quote is Captured');
            return;
        }
        const dialogRef = this.dialog.open(AdditionalCostPopupComponent, {
            width: '1170px',
            height: 'auto',
            maxHeight: '80vh',
            panelClass: 'additional-cost-popup',
            data : this.params.node.data
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
        if(this.params.node.data.MinQuantity > 0 
            && this.params.node.data.MaxQuantity > 0 
            && this.params.node.data.SpecGroupName != '' 
            && this.params.node.data.SpecGroupName != null
            && this.params.node.data.quantityUomId != ''
            && this.params.node.data.quantityUomId != null
            && this.params.node.data.ProductId != ''
            && this.params.node.data.ProductId != null
            && this.params.node.data.ValidityDate != ''
            && this.params.node.data.ValidityDate != null
            ) {

            if(Number(this.params.value.replace(/,/g, '')) > 0 && this.params.value != ''){
                let newParams = JSON.parse(JSON.stringify(this.params.node.data));
                newParams.OfferPrice = this.tenantService.price(this.params.value);
                this.contractService.updatePrices(newParams).subscribe(()=>{
                    // ad grid data binding problem. previous value is 123.2 and new value is 123.200 in this scenario grid is not updating.
                    if(Number(this.params.value) == Number(this.params.node.data.OfferPrice)){
                        this.localService.callGridRefreshService([this.params.node.data.id]);
                    }
                    this.localService.getContractStatus().subscribe((status) => {
                        if(status == 'Inquired'){
                            this.localService.setContractStatus('Quoted');
                        }
                    });
                });
            }else{
                this.params.value = this.params.node.data.OfferPrice;
                this.toaster.error('Please enter valid price');
            }       
        }else{
            this.params.value = this.params.node.data.OfferPrice;
            if(this.params.node.data.ProductId == '' || this.params.node.data.ProductId == null){
                this.toaster.error('Please select the Product');
                return;
            }
            if(this.params.node.data.SpecGroupName == '' || this.params.node.data.SpecGroupName == null){
                this.toaster.error('Please fill the "Spec Group Name" fields with valid values');
                return;
            }
            if(this.params.node.data.MinQuantity == 0 || this.params.node.data.MinQuantity == null){
                this.toaster.error('Please fill the "Min Qty" fields with valid values');
                return;
            }
            if(this.params.node.data.MaxQuantity == 0 || this.params.node.data.MaxQuantity == null){
                this.toaster.error('Please fill the "Max Qty" fields with valid values');
                return;
            }
            
            if(this.params.node.data.quantityUomId == '' || this.params.node.data.quantityUomId == null){
                this.toaster.error('Please fill the "UOM" fields with valid values');
                return;
            }
            if(this.params.node.data.ValidityDate == '' || this.params.node.data.ValidityDate == null){
                this.toaster.error('Please fill the "Validity Date" fields with valid date');
                return;
            }
        }

        // if(this.params.data.Status=='Rejected'){
        //     this.params.context.componentParent.toggleProgressBar(this.params.data);
        // }
    }
}
