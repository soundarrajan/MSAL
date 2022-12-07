import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EmailPreviewPopupComponent } from '../../views/contract-negotiation-components/contract-negotiation-popups/email-preview-popup/email-preview-popup.component';
import _ from 'lodash';
import { RemoveCounterpartyPopupComponent } from '../../views/contract-negotiation-components/contract-negotiation-popups/remove-counterparty-popup/remove-counterparty-popup.component';
import { ContractNegotiationService } from '../../services/contract-negotiation.service';
@Component({
  selector: 'shiptech-counterpartie-name-cell',
  template: `
    <div class="fly-away">
      <div class="hover-cell-lookup d-flex align-items-center ">
        <span class="info-flag" *ngIf="params.node.data?.isSellerSuspended" matTooltipClass="lightTooltip" matTooltip="Temporary suspended counterparty"></span>

        <div class="m-l-7 ellipsis" style="cursor: pointer;" matTooltip="{{ decodeSpecificField(params.value) }}" matTooltipClass="lightTooltip" [matMenuTriggerFor]="clickmenupopup" #menuPopupTrigger="matMenuTrigger" [matMenuTriggerData]="{ data: params.value }" (contextmenu)="$event.preventDefault(); $event.stopPropagation(); menuPopupTrigger.openMenu()">
          {{ decodeSpecificField(params.value) }}
        </div>
        <div (click)="params.value && openEmailPreview(params)" *ngIf="rfqSendFlag" matTooltip="Preview RFQ" matTooltipClass="lightTooltip" [ngClass]="{ 'preview-rfq-icon': params.value }"></div>
      </div>

      <mat-menu #clickmenupopup="matMenu" class="small-menu darkPanel">
        <ng-template matMenuContent let-aliasMenuItems="data">
          <div class="p-tb-5" style="display:flex;align-items:center;" (click)="addAnotherOffer(aliasMenuItems)">
            <div class="popup-icon-align">
              <div class="add-blue-icon"></div>
            </div>
            <div class="fs-13">Add another offer</div>
          </div>
          <div class="p-tb-5" *ngIf="rfqSendFlag" style="display:flex;align-items:center;">
            <div class="popup-icon-align">
              <div class="preview-rfq-icon"></div>
            </div>
            <div class="fs-13" (click)="openEmailPreview(params)">Preview RFQ email</div>
          </div>
          <div class="p-tb-5" style="display:flex;align-items:center;">
                <div class="popup-icon-align">
                    <div class="contract-enable-quote-icon"></div>
                </div>
                <div class="fs-13">Enable quote</div>
          </div>
          <hr class="menu-divider-line" />

          <ng-container *ngIf="aliasMenuItems.Status == 'Contracted'">
            <!-- *ngIf="aliasMenuItems.Status=='Contracted'" -->
            <div class="p-tb-5" (click)="addToAnotherNego()" style="display:flex;align-items:center;">
              <div class="popup-icon-align">
                <div class="add-blue-icon"></div>
              </div>
              <div class="fs-13">Add to another nego</div>
            </div>
            <hr class="menu-divider-line" />
          </ng-container>
          <div class="p-tb-5" style="display:flex;align-items:center;">
            <div class="popup-icon-align">
              <div class="delete-icon"></div>
            </div>
            <div class="fs-13" (click)="removeCounterpartyPopup(params)">Remove counterparty</div>
          </div>
        </ng-template>
      </mat-menu>
    </div>
  `,
  styles: []
})
export class CounterpartieNameCellComponent implements OnInit, ICellRendererAngularComp {
  public params: any;
  public rfqSendFlag: boolean = false;
  dummyId = 121;
  constructor(public dialog: MatDialog, private toaster: ToastrService, private contractService : ContractNegotiationService) {}

  ngOnInit(): void {}
  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  openEmailPreview(params) {
    const dialogRef = this.dialog.open(EmailPreviewPopupComponent, {
      width: '80vw',
      height: '90vh',
      panelClass: 'remove-padding-popup'
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  removeCounterpartyPopup(params) {
        
    this.toaster.success(params.node.data.CounterpartyName+' have been removed');
    this.deleteRow(params.node.data.id)
    // const dialogRef = this.dialog.open(RemoveCounterpartyPopupComponent, {
    //   width: '340px',
    //   height: 'auto',
    //   panelClass: 'delete-chat-popup'
    // });

    // dialogRef.afterClosed().subscribe(result => {
      
    //   if(result){
    //     //this.deleteRow(params.node.data.id);
        
    //   }
    // });
  }


  addToAnotherNego() {
    this.toaster.show('<div class="image-placeholder"><span class="image"></span></div><div class="message">Negotiation duplicated successfully and available in request list</div>', '', {
      enableHtml: true,
      toastClass: 'toast-alert toast-green custom-toast', // toast-green, toast-amber, toast-red, toast-grey
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

  deleteRow(counterpartyId) {
    this.contractService.RemoveCounterparty(counterpartyId).subscribe();
    let rowData = [];
    this.params.api.forEachNode(node => rowData.push(node.data));
    let index = this.params.node.rowIndex;
    let newData = [];
    newData = rowData.splice(index, 1);
    this.params.api.applyTransaction({ remove: newData });
  }

  decodeSpecificField(modelValue) {
    const decode = function (str) {
      return str.replace(/&#(\d+);/g, function (match, dec) {
        return String.fromCharCode(dec);
      });
    };
    return decode(_.unescape(modelValue));
  }

  
}
