import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ToastrService } from 'ngx-toastr';
import { ContractNegotiationService } from '../../services/contract-negotiation.service';
import { LocalService } from '../../services/local-service.service';
import { AdditionalCostPopupComponent } from '../../views/contract-negotiation-components/contract-negotiation-popups/additional-cost-popup/additional-cost-popup.component';
import { negoPricingDetailsComponent } from '../../../../../../core/src/lib/formula-pricing/pricing-details/pricing-details.component';
import { ModifyOfferPeriodPopupComponent } from '../../views/contract-negotiation-components/contract-negotiation-popups/modify-offer-period-popup/modify-offer-period-popup.component';
import { Store } from '@ngxs/store';
import { ContractNegotiationStoreModel } from '../../store/contract-negotiation.store';
import { ConfirmdialogComponent } from '../../../../../../core/src/lib/formula-pricing/confirmdialog/confirmdialog.component';
import { ContractRequest } from '../../store/actions/ag-grid-row.action';
import _, { cloneDeep } from 'lodash';
@Component({
    selector: 'cell-click-renderer',
    template: `
<div *ngIf="params.show" class="fly-away">
    <div [matMenuTriggerFor]="priceMenupopup" #pricePopupTrigger="matMenuTrigger"
        (click)="pricePopupTrigger.closeMenu()" class="cell-input"
        (contextmenu)="$event.preventDefault();$event.stopPropagation();pricePopupTrigger.openMenu();">
        <input  [disabled]="(params.data?.isFormulaPricing)"
        *ngIf="params.node.level != 0"
        [(ngModel)]="params.value"
        (change)="onInputChange()"
        (focusout)="calculateOfferPrice()"
        (focusin)="priceSplit()"
        >
        <span *ngIf="params.value == '432.5'" class="formula-indication-icon" 
        matTooltip="Formula Based Pricing - DOD" matTooltipClass="lightTooltip"></span>
    </div>
    <mat-menu #priceMenupopup="matMenu" class="darkPanel-add big">
        <div class="add-block" (click)="formulaPricingPopup(params)">
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
        <ng-container *ngIf="params && (params.data?.isFormulaPricing)">
        <div class="divider-line"></div>
        <div class="delete-block"
        (click)="(!params.data.isFormulaPricing) ? false : removeFormulaPrice(params);"
          [ngStyle]="{'opacity': (!params.data.isFormulaPricing) ? 0.5 : 1}">
          <div></div>
          <span>Remove Formula pricing</span>        
        </div>
        </ng-container>
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
        private store : Store,
        ) {

    }
    ngOnInit() {
        this.calculateOfferPrice();
    }
    calculateOfferPrice() {
        if(this.params.node.data.aditionalCost != null){
        let offerPrice = typeof this.params.node.data.OfferPrice === 'number' ? this.params.node.data.OfferPrice : Number(this.params.node.data.OfferPrice?.replace(/,/g, '') || 0);
        offerPrice += (this.params.node.data.aditionalCost || 0);
        this.params.value = this.tenantService.price(offerPrice);
        }
    }
   priceSplit() {
        this.params.value = this.params.node.data.OfferPrice;
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

    formulaPricingPopup(row) {        
        const dialogRef = this.dialog.open(negoPricingDetailsComponent, {
            width: '1164px',
            maxHeight: '95vh',
            height: 'auto',
            panelClass: ['additional-cost-popup', 'pricing-detail-popup-panel-class', 'scroll-change'],
            data: {
                contractRequestOfferId: row.data.id,              
                productId: row.data.ProductId,
                offerPriceFormulaId: row.data.offerPriceFormulaId
              },
        });

        dialogRef.afterClosed().subscribe(result => {
            //this.rowData[index].data[rowindex].offPrice = "432.5";
        });
    }

    removeFormulaPrice(param) {
        var contractRequestData = JSON.parse(JSON.stringify(this.store.selectSnapshot((state: ContractNegotiationStoreModel) => {
            return state['contractNegotiation'].ContractRequest[0];
          })));
        const dialogRef = this.dialog.open(ConfirmdialogComponent, {
          width: '368px',
          maxWidth: '80vw',
          panelClass: 'confirm-dialog',
          data: {
            message: 'Are you sure you want to remove this formula?',
            contractRequestOfferId: param.data.id,   
            productId: param.data.ProductId,
            offerPriceFormulaId: param.data.offerPriceFormulaId
          }
        });
     
        dialogRef.afterClosed().subscribe(result => {      
          if (param) {
            let contractRequestOfferId = param.data.id;
            let offerPriceFormulaId = param.data.offerPriceFormulaId;          
            if(result.removeFormula){
                this.contractService.removeFormula(contractRequestOfferId, offerPriceFormulaId).subscribe(result => {                
                    contractRequestData.locations.map( prod => {
                        if(prod.data.length > 0){
                            prod.data.map( req => {                 
                            if(req.id ==  contractRequestOfferId){                
                                req.isFormulaPricing = false;
                                req.offerPriceFormulaId = null;                               
                            }
                          })
                        }
                    });   

                this.store.dispatch(new ContractRequest([contractRequestData]));
                this.toaster.success('Formula removed successfully');           
                this.contractService.callGridRedrawService();   
                this.toaster.error('Offer Price is Required');             
                });
              }
          }
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
            if(result?.data)
            this.localService.addAdditionalCost(result,this.params.node.data.id);
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
                newParams.OfferPrice = this.params.value.replace(/,/g, '');
                this.contractService.updatePrices(newParams).subscribe((resp)=>{
                    let isRowAlreadyRefreshed = false;
                    if(!isNaN(parseFloat(resp))) {
                        this.localService.addAdditionalCost({ "data": resp },this.params.node.data.id);
                        isRowAlreadyRefreshed = true;
                    }

                    // ad grid data binding problem. previous value is 123.2 and new value is 123.200 in this scenario grid is not updating.
                    if(!isRowAlreadyRefreshed && Number(this.params.value.toString().replace(/,/g, '')) == Number(this.params.node.data.OfferPrice.replace(/,/g, ''))){
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
