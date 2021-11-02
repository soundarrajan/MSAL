import { Component, ElementRef, ViewChild, ChangeDetectorRef, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { MatMenuTrigger } from '@angular/material/menu';
import { Select, Store } from '@ngxs/store';
import { SpotnegoAdditionalcostComponent } from '../../views/main/details/components/spot-negotiation-popups/spotnego-additionalcost/spotnego-additionalcost.component';
import { SellerratingpopupComponent } from '../../views/main/details/components/spot-negotiation-popups/sellerratingpopup/sellerratingpopup.component';
import { EmailPreviewPopupComponent } from '../../views/main/details/components/spot-negotiation-popups/email-preview-popup/email-preview-popup.component';
import { ContactinformationpopupComponent } from '../../views/main/details/components/spot-negotiation-popups/contactinformationpopup/contactinformationpopup.component';
import { SupplierCommentsPopupComponent } from '../../views/main/details/components/spot-negotiation-popups/supplier-comments-popup/supplier-comments-popup.component';
import { SpotnegoRequestChangesComponent } from '../../views/main/details/components/spot-negotiation-popups/spotnego-request-changes/spotnego-request-changes.component';
import { SpotnegoPricingDetailsComponent } from '../../views/main/details/components/spot-negotiation-popups/spotnego-pricing-details/spotnego-pricing-details.component';
import { TenantFormattingService } from '../../../../../../core/src/lib/services/formatting/tenant-formatting.service';
import { DecimalPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { SpotNegotiationService } from '../../services/spot-negotiation.service';

import { SelectSeller,EditLocationRow } from '../../store/actions/ag-grid-row.action';
import { SpotnegoSearchCtpyComponent } from '../../views/main/details/components/spot-negotiation-popups/spotnego-counterparties/spotnego-searchctpy.component';
@Component({
  selector: 'ag-grid-cell-renderer',
  template: `
    <div *ngIf="params.type == 'singlerow'">
      <div
        [ngClass]="params.cellClass"
        matTooltip="{{ params.value }}"
        style="margin:0px"
      >
        <div class="truncate-125">{{ params.value }}</div>
      </div>
    </div>
    <div *ngIf="params.type == 'multirow'">
      <div *ngIf="params.data.data">
        <div
          *ngFor="let item of params.data.data"
          class="aggrid-multirow"
          [ngClass]="params.classes"
        >
          <span class="aggrid-text-resizable">{{ item[params.label] }}</span>
        </div>
        <div
          *ngIf="!params.data.data"
          style="line-height: 15px"
          [ngClass]="params.classes"
        >
          <span style="line-height: 15px" class="aggrid-text-resizable">{{
            params.data
          }}</span>
        </div>
      </div>
    </div>
    <div *ngIf="params.type == 'roundchip'">
      <div *ngFor="let item of params.data.data" class="aggrid-multirow">
        <div [ngClass]="params.cellClass" title="{{ item[params.label] }}">
          {{
            params.letter != null
              ? item[params.label].charAt(params.letter).toUpperCase()
              : item[params.label]
          }}
        </div>
      </div>
    </div>
    <div *ngIf="params.type == 'rating-chip'">
      <div
        [ngClass]="params.cellClass"
        matTooltip=""
        style=""
        (click)="sellerratingpopup()"
      >
        <div *ngIf="params.label == 'gen-rating'" class="truncate-125 chip">
          <div>{{ params.data.genRating }}<span class="star"></span></div>
          <div>{{ params.data.genPrice }}</div>
        </div>
        <div *ngIf="params.label == 'port-rating'" class="truncate-125 chip">
          <div>{{ params.data.portRating }}<span class="star"></span></div>
          <div>{{ params.data.portPrice }}</div>
        </div>
      </div>
    </div>
    <div *ngIf="params.type == 'hover-cell-lookup'" class="fly-away">
      <div>
        <!--<div class="remove-icon-cell-hover float-away" (click)='deleteRow();'></div>-->
      </div>
      <div
        class="hover-cell-lookup"
        [matMenuTriggerFor]="clickmenupopup"
        #menuPopupTrigger="matMenuTrigger"
        (click)="menuPopupTrigger.closeMenu()"
        (contextmenu)="
          $event.preventDefault();
          $event.stopPropagation();
          menuPopupTrigger.openMenu()
        "
      >
        <span
          class="counterpartytype-icon type-physicalsupplier"
          *ngIf="params.data.counterpartyTypeName == 'Supplier'"
          ><i class="fas fa-circle"></i
        ></span>
        <span
          class="counterpartytype-icon type-broker"
          *ngIf="params.data.counterpartyTypeName == 'Broker'"
          ><i class="fas fa-circle"></i
        ></span>
        <span
          class="counterpartytype-icon type-seller"
          *ngIf="params.data.counterpartyTypeName == 'Seller'"
          ><i class="fas fa-circle"></i
        ></span>
        <span
          class="info-flag"
          *ngIf="params.data.infoIcon == 'Yes'"
          matTooltipClass="darkTooltip"
          matTooltip="Temporary suspended counterparty"
          matTooltipClass="lightTooltip"
        ></span>
        <span class="m-l-7" matTooltip="{{params.value}}">{{ params.value }}</span>
        <span class="sticky-icon">
          <!--span class="hover-lookup-icon" [matMenuTriggerFor]="clickmenupopup" #menuTrigger="matMenuTrigger"></span>-->
          <span
            class="mail-icon mail-active"
            (click)="openEmailPreview()"
            *ngIf="params.data.mail == 'mail-active'"
            matTooltip="View preview email"
            matTooltipClass="lightTooltip"
            >a</span
          >
          <span
            class="mail-icon mail-none"
            (click)="openEmailPreview()"
            *ngIf="params.data.mail == 'mail-inactive'"
            matTooltipClass=""
            matTooltip=""
            >i</span
          >
          <span
            class="mail-icon mail-none"
            (click)="openEmailPreview()"
            *ngIf="params.data.mail == 'mail-none'"
            matTooltipClass=""
            matTooltip=""
            >n</span
          >
          <span
            class="info-comment"
            matTooltip="View supplier comments"
            matTooltipClass="lightTooltip"
            (click)="suppliercommentspopup()"
            *ngIf="params.data.commentIcon == 'Yes'"
          ></span>
          <span
            class="info-comment-inactive"
            (click)="suppliercommentspopup()"
            *ngIf="params.data.commentIcon == 'No'"
            matTooltipClass=""
            matTooltip=""
          ></span>
          <span
            class=""
            *ngIf="params.data.commentIcon == 'None'"
            matTooltipClass=""
            matTooltip=""
          ></span>

          <span
            class=""
            *ngIf="params.data.commentIcon == ''"
            matTooltipClass=""
            matTooltip=""
          ></span>
        </span>
      </div>
    </div>
    <mat-menu #clickmenupopup="matMenu" class="small-menu darkPanel">
      <div
        class="p-tb-5"
        style="display:flex;align-items:center;"
        (click)="contactinformationpopup()"
      >
        <span><div class="id-icon"></div></span>
        <span class="fs-12">Supplier Contact</span>
      </div>
      <!-- <div class="p-tb-5" style="display:flex;align-items:center;">
      <span><div class="blue-comments-icon"></div></span>
      <span class="fs-12">Supplier Comments</span>
    </div> -->

      <!-- <div class="p-tb-5" style="display:flex;align-items:center;">
      <span><div class="quote-icon"></div></span>
      <span class="fs-12">Quote</span>
    </div>-->
      <!-- <div class="p-tb-5" style="display:flex;align-items:center;">
      <span><div class="requote-icon"></div></span>
      <span class="fs-12">Requote</span>
    </div> -->
      <!--<div class="p-tb-5" style="display:flex;align-items:center;">
      <span><div class="share-icon"></div></span>
      <span class="fs-12">Share Best Quote</span>
    </div>
    <div class="p-tb-5" style="display:flex;align-items:center;">
      <span><div class="archive-icon"></div></span>
      <span class="fs-12">Archive Quote</span>
    </div>-->
      <hr class="menu-divider-line" />
      <div class="p-tb-5" style="display:flex;align-items:center;">
        <span><div class="view-rfq-icon"></div></span>
        <span class="fs-12" (click)="openEmailPreview()">Preview Email</span>
      </div>
      <div class="p-tb-5" style="display:flex;align-items:center;">
        <span><div class="no-quote-icon"></div></span>
        <span class="fs-12">No Quote</span>
      </div>
      <hr class="menu-divider-line" />
      <div class="p-tb-5" style="display:flex;align-items:center;">
        <span><div class="remove-icon"></div></span>
        <span class="fs-12" (click)="deleteRow()">Remove counterparty</span>
      </div>
    </mat-menu>
    <div
      class="no-quote-text"
      *ngIf="params.data.isQuote === 'No quote' && params.value === '0'"
    >
      <span>No quote</span>
    </div>

    <!-- Offer price cell -->
    <div *ngIf="params.type == 'price-calc'" [ngClass]="!isOfferRequestAvailable() ? 'input-disabled' : '' ">
      <!-- TODO check this code... -->
      <div class="price-calc static-data" *ngIf="params.value === '100.00'">
        <span class="duplicate-icon"></span>
        $ {{ params.value }}
      </div>
      <div
        [ngClass]="params.value ? 'price-calc active' : 'price-calc'"
        [matMenuTriggerFor]="priceMenupopup"
        #pricePopupTrigger="matMenuTrigger"
        (click)="pricePopupTrigger.closeMenu()"
        (contextmenu)="
          $event.preventDefault();
          $event.stopPropagation();
          onRightClickMenuOpened($event);
          pricePopupTrigger.openMenu()
        "
      >
        <div
          id="custom-form-field"
          style="display:relative;"
          [ngClass]="ispriceCalculated ? '' : 'priceCalculated'"
        >
          <mat-form-field
            class="without-search currency-select-trigger"
            appearance="none"
            [formGroup]="myFormGroup"
          >
            <mat-label>Select Field</mat-label>
            <mat-select
              disableOptionCentering
              [(ngModel)]="select"
              formControlName="frequency"
              panelClass="currencyselecttrigger"
            >
              <mat-select-trigger overlayPanelClass="123class">
                {{ myFormGroup.controls['frequency'].value }}
              </mat-select-trigger>
              <mat-option [disabled]>Change Currency </mat-option>
              <mat-option
                class="currency-mat-select"
                *ngFor="let frequency of frequencyArr"
                [value]="frequency.key"
              >
                <span>
                  <mat-radio-button>{{
                    frequency.abbriviation
                  }}</mat-radio-button></span
                >
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <input
          class="inputField"
          (blur)="onBlur($event, params)"
          autofocus
          #inputSection
          value="{{priceFormatValue(params.value)}}"
          autocomplete="off"
          name="inputField"
          spellcheck="false"
          type="text"
          style="display:inline"
        />
        <!--<div class="addButton" (click)="pricingdetailspopup($event,params)" *ngIf="ispriceCalculated"></div>-->
        <div
          class="formulaButton"
          style="display:inline; position:absolute; left:78px;"
          (mouseenter)="hoverMenu($event)"
          [matMenuTriggerFor]="formulamenu"
          #menuTriggerHover="matMenuTrigger"
          *ngIf="showFormula"
        ></div>
      </div>
    </div>
    <!-- End offer price cell -->

    <mat-menu #priceMenupopup="matMenu" class="darkPanel-add big">
      <div class="add-block" (click)="pricingdetailspopup($event, params)">
        <div></div>
        <span>Add/View Formula pricing</span>
      </div>
      <div class="divider-line"></div>
      <div class="add-block" (click)="requestChange($event, params)">
        <div></div>
        <span>Add/View Request changes</span>
      </div>
    </mat-menu>
    <div *ngIf="params.type == 'phy-supplier'">
      <div
        class="phySupplier edit"
        matTooltip="Add physical supplier"
        matTooltipClass="lightTooltip"
      >
        <span
          contentEditable="true"
          [matMenuTriggerFor]="clickmenu"
          #menuTrigger="matMenuTrigger"
          (click)="editSeller = false"
        >
          <span *ngIf="editSeller&&params.data.physicalSupplierCounterpartyName">{{params.data.physicalSupplierCounterpartyName}}</span>
          <span *ngIf="editSeller&&params.data.physicalSupplierCounterpartyName==null">Add P. Supplier</span>
          <span *ngIf="!editSeller">{{ this.editedSeller }}</span>
        </span>
        <!--<div class="addButton"></div>-->
      </div>
    </div>
    <mat-menu #clickmenu="matMenu" class="add-new-request-menu">
      <div
        *ngIf="!editSeller"
        class="expansion-popup"
        style="margin: 20px 0px;"
      >
        <div class="select-product-container">
          <div
            class="col-md-12 header-container-product"
            (click)="$event.stopPropagation(); $event.preventDefault()"
          >
            <div class="search-product-container col-md-10">
              <span class="search-product-lookup"> </span>
              <input
                matInput
                placeholder="Search and select counterparty"
                class="search-product-input"
                (input)="search($event.target.value)"
              />
            </div>
            <div class="col-md-2">
              <span class="expand-img"
              (click)="openCounterpartyPopup(params.locationId)"></span>
            </div>
          </div>
          <table
            class="delivery-products-pop-up col-md-12 no-padding"
            mat-table
            (click)="$event.stopPropagation()"
            [dataSource]="visibleCounterpartyList"
          >
            <ng-container matColumnDef="counterparty">
              <th mat-header-cell *matHeaderCellDef>Counterparty</th>
              <td mat-cell *matCellDef="let element">
                <mat-option [value]="element">
                  <mat-checkbox
                    [value]="element.name"
                    (click)="selectSupplier(element.name,element.id)"
                  >
                  {{ element.name }}
                  </mat-checkbox>
                </mat-option>
              </td>
            </ng-container>
            <ng-container matColumnDef="blank">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let element"></td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="counterpartyColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: counterpartyColumns"></tr>
          </table>

          <div class="proceed-div">
            <button mat-button class="mid-blue-button proceed-btn" (click)="updatePhysicalSupplier()">
              Proceed
            </button>
          </div>
        </div>
      </div>
    </mat-menu>

    <div
      *ngIf="params.type == 'mat-check-box'"
      style="height:100%;display:flex;align-items:center;justify-content:center"
      [matTooltip]="params.data.preferredProducts.includes(params.productId) ? 'Preferred product' : null"
      matTooltipClass="lightTooltip"
    >
      <!--<input type="checkbox" (click)="checkedHandler($event)"[checked]="params.value"/>-->
      <mat-checkbox
        [checked]="params.value"
        (click)="selectCounterParties(params)"
        class="light-checkbox small"
        [ngClass]="params.data.preferredProducts.includes(params.productId) ? 'darkBorder' : ''"
      ></mat-checkbox>
    </div>

    <div *ngIf="params.type == 'addTpr'" class="addTpr">
    <span *ngIf="!params.value">-</span>
      <span>{{ priceFormatValue(params.value) }}</span>
      <!--<div class="addButton" *ngIf="params.value !='-'" (click)="additionalcostpopup()"></div> -->
    </div>

    <div *ngIf="params.type == 'amt'" class="addTpr">
      <span *ngIf="!params.value">-</span>
      <span>{{ priceFormatValue(params.value) }}</span>
    </div>

    <div *ngIf="params.type == 'diff'" class="addTpr">
    <span *ngIf="!params.value">-</span>
      <span>{{ priceFormatValue(params.value) }}</span>
      <!--<div class="addButton" *ngIf="params.value !='-'" (click)="additionalcostpopup()"></div> -->
    </div>

    <div
      *ngIf="params.type == 'totalOffer'"
      class="addTpr defaultAddicon"
      [matTooltip]="params.value != '-' ? 'includes additional costs' : null"
      matTooltipClass="lightTooltip"
      [matMenuTriggerFor]="totalOfferMenupopup"
      #totalOfferPopupTrigger="matMenuTrigger"
      (click)="totalOfferPopupTrigger.closeMenu()"
      (contextmenu)="
        $event.preventDefault();
        $event.stopPropagation();
        totalOfferPopupTrigger.openMenu()
      "
    >
      <span (click)="additionalcostpopup()">{{
        priceFormatValue(params.value)
      }}</span>
      <div class="dollarButton" *ngIf="params.value == '500.00'"></div>
    </div>
    <mat-menu #totalOfferMenupopup="matMenu" class="darkPanel-add big">
      <div class="add-block" (click)="additionalcostpopup()">
        <div></div>
        <span>Add additional cost</span>
      </div>
    </mat-menu>

    <mat-menu #formulamenu="matMenu" class="small-menu darkPanel">
      <div
        class="p-tb-5"
        style="display:flex;align-items:center;"
        (click)="pricingdetailspopup($event, params)"
      >
        <span><div class="infocircle-icon"></div></span>
        <span class="fs-13"> Formula Based Pricing</span>
      </div>
      <hr class="menu-divider-line2" />
      <div
        class="p-tb-5"
        style="display:flex;align-items:center;"
        (click)="requestChange($event, params)"
      >
        <span><div class="infocircle-icon"></div></span>
        <span class="fs-13">Quotation different from Request</span>
      </div>
    </mat-menu>
    <div
      *ngIf="params.type === 'dashed-border-notes'"
      class="dashed-border-note"
    >
      <div class="dashed-border-notes">
        <input matInput [(ngModel)]="docVal" matTooltip="{{ docVal }}" />
      </div>
    </div>
    <div
      *ngIf="params.type === 'dashed-border-darkcell'"
      class="staticEditCell"
    >
      <div class="dashed-border" style="">
        <input matInput [(ngModel)]="params.value" />
      </div>
    </div>
    <div *ngIf="params.type === 'border-cell'">
      <div class="border-cell">
        <span class="left-data">{{ params.value }}</span>
        <span class="right-data">{{ params.data.orderProduct }}</span>
      </div>
    </div>
    <div *ngIf="params.type === 'dark-border-cell'">
      <div class="border-cell">
        {{ params.value }}
      </div>
    </div>
    <div
      *ngIf="params.type === 'dashed-border-dark-search'"
      class="cell-bg-border"
    >
      <div class="truncate-100p inner-cell dark" style="padding: 0 3px;">
        <span class="dashed-border with-search">
          <p>{{ params.value }}</p>
          <span class="search-icon-dark"></span>
        </span>
      </div>
    </div>
  `
})
export class AGGridCellRendererV2Component implements ICellRendererAngularComp {
  @ViewChild('inputSection') inputSection: ElementRef;
  @ViewChild('menuTriggerHover') menuTriggerHover: MatMenuTrigger;

  public showDollar: boolean = false;
  public params: any;
  public select = '$';
  public inputValue = '';
  public ispriceCalculated: boolean = true;
  public showFormula: boolean = false;
  public editCell: boolean;
  public myFormGroup;
  public editSeller: boolean = true;
  public editedSeller = '';
  public phySupplierId=0;
  public priceFormat = '';

  public docVal = 'Document Uploaded';
  counterpartyColumns: string[] = ['counterparty', 'blank'];
  counterpartyList=[];
  visibleCounterpartyList = [];
  currentRequestInfo : any;
  constructor(
    @Inject(DecimalPipe)
    private _decimalPipe,
    public router: Router,
    public dialog: MatDialog,
    public store: Store,
    private toastr: ToastrService,
    private _spotNegotiationService: SpotNegotiationService,
    private tenantService: TenantFormattingService
  ) {}

  ngOnInit() {
    this.myFormGroup = new FormGroup({
      frequency: new FormControl('')
    });
    return this.store.selectSnapshot(({ spotNegotiation }) => {
      this.currentRequestInfo = spotNegotiation.currentRequestSmallInfo;
      // Fetching counterparty list
      if (spotNegotiation.counterpartyList) {
        this.counterpartyList = spotNegotiation.counterpartyList;
        this.visibleCounterpartyList = this.counterpartyList.slice(0,7);
      }
    });
  }

  isOfferRequestAvailable() : boolean {
    // Array of requestoffers
    const { requestOffers } = this.params.data || {};

    if(!requestOffers) {
      return false;
    }

    const productId = this.params.product.id;

    const offerExists = requestOffers.find(e => e.requestProductId === productId && e.offerId);


    if(offerExists){
      return true;
    }

    return false;
  }

  frequencyArr = [
    { key: '$', abbriviation: 'USD' },
    { key: '€', abbriviation: 'EURO' },
    { key: '£', abbriviation: 'GBP' }
  ];

  agInit(params: any): void {
    this.params = params;
  }
  search(userInput: string): void {
    this.visibleCounterpartyList = this.counterpartyList
    .filter(e => {
      if (e.name.toLowerCase().includes(userInput.toLowerCase())) {
        return true;
      }
      return false;
    })
    .slice(0, 7);
  }
  hoverMenu(event) {
    event.target.classList.add('selectedIcon');
    this.menuTriggerHover.openMenu();
  }

  selectCounterParties(params){
      let updatedRow = { ...params.data };
      updatedRow = this.formatRowData(updatedRow, params);
      // Update the store
      this.store.dispatch(new EditLocationRow(updatedRow));
      params.node.setData(updatedRow);
  }

  formatRowData(row, params) {
    if(params.value){
      row.isSelected = false;
     if(params.column.colId == 'checkProd1'){
        row.checkProd1 =false;
      }
      else if(params.column.colId == 'checkProd2'){
        row.checkProd2 = false;
      }
      else if(params.column.colId == 'checkProd3'){
        row.checkProd3 = false;
      }
      else if(params.column.colId == 'checkProd4'){
        row.checkProd4 = false;
      }
      else if(params.column.colId == 'checkProd5'){
        row.checkProd5 = false;
      }
    }else{
      row.isSelected = false;
     if(params.column.colId == 'checkProd1'){
        row.checkProd1 =true;

      }
      else if(params.column.colId == 'checkProd2'){
        row.checkProd2 = true;
      }
      else if(params.column.colId == 'checkProd3'){
        row.checkProd3 = true;
      }
      else if(params.column.colId == 'checkProd4'){
        row.checkProd4 = true;
      }
      else if(params.column.colId == 'checkProd5'){
        row.checkProd5 = true;
      }
    }
    return row;
}
  additionalcostpopup() {
    const dialogRef = this.dialog.open(SpotnegoAdditionalcostComponent, {
      width: '1170px',
      height: '450px',
      panelClass: 'additional-cost-popup'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.showDollar = true;
    });
  }
  sellerratingpopup() {
    const dialogRef = this.dialog.open(SellerratingpopupComponent, {
      width: '1164px',
      height: '562px',
      panelClass: 'additional-cost-popup'
    });
    dialogRef.afterClosed().subscribe(result => {});
  }

  openEmailPreview() {
    const dialogRef = this.dialog.open(EmailPreviewPopupComponent, {
      width: '80vw',
      height: '90vh',
      panelClass: 'additional-cost-popup'
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  contactinformationpopup() {
    const dialogRef = this.dialog.open(ContactinformationpopupComponent, {
      width: '1194px',
      minHeight: '446px',
      panelClass: ['additional-cost-popup', 'supplier-contact-popup']
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  openCounterpartyPopup(locationId) {
    let RequestGroupId = 0;
    let currentRequestLocation = { id: '0', locationId: '0' };

    if (this.currentRequestInfo) {
      RequestGroupId = parseInt(this.currentRequestInfo.requestGroupId);

      if(this.currentRequestInfo.requestLocations
        && this.currentRequestInfo.requestLocations.length > 0){
        currentRequestLocation = this.currentRequestInfo.requestLocations[0];
      }
    }

    const dialogRef = this.dialog.open(SpotnegoSearchCtpyComponent, {
      width: '100vw',
      height: '95vh',
      maxWidth: '95vw',
      panelClass: 'search-request-popup',
      data: {
        AddCounterpartiesAcrossLocations: false,
        RequestGroupId: RequestGroupId,
        RequestLocationId: parseInt(currentRequestLocation.id),
        LocationId: locationId,
        isPhysicalSupplier:true,
        phySupplierId:this.phySupplierId,
        requestLocationSellerId:this.params.data.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }
  suppliercommentspopup() {
    const dialogRef = this.dialog.open(SupplierCommentsPopupComponent, {
      width: '672px',
      minHeight: '540px',
      panelClass: ['additional-cost-popup', 'supplier-contact-popup']
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  requestChange(e, params) {
    const dialogRef = this.dialog.open(SpotnegoRequestChangesComponent, {
      width: '1164px',
      panelClass: ['additional-cost-popup', 'pricing-detail-popup-panel-class']
    });

    dialogRef.afterClosed().subscribe(result => {
      e.target.parentElement.classList.add('active');
      this.inputValue = '560.19';
      var itemsToUpdate = [];
      let rowData = [];

      params.api.forEachNodeAfterFilterAndSort(function(rowNode, index) {
        if (!rowNode.isSelected() === true) {
          return;
        }
        var data = rowNode.data;
        data.tPr = '$560.19';
        data.amt = '4,48,152.00';
        data.diff = '1.19';
        data.phySupplier = 'Same as seller';
        itemsToUpdate.push(data);
      });
      var res = params.api.applyTransaction({ update: itemsToUpdate });
      params.api.deselectAll(); //optional
      this.ispriceCalculated = false;
      this.showFormula = true;
    });
  }

  roundDown(value, pricePrecision) {
    let precisionFactor = 1;
    let response = 0;
    const intvalue = parseFloat(value);
    if (pricePrecision === 1) {
      precisionFactor = 10;
    }
    if (pricePrecision === 2) {
      precisionFactor = 100;
    }
    if (pricePrecision === 3) {
      precisionFactor = 1000;
    }
    if (pricePrecision === 4) {
      precisionFactor = 10000;
    }
    response = Math.floor(intvalue * precisionFactor) / precisionFactor;
    return response.toString();
  }

  priceFormatValue(value) {
    if (typeof value == 'undefined' || value == null) {
      return null;
    }

    let plainNumber = value.toString().replace(/[^\d|\-+|\.+]/g, '');

    const number = parseFloat(plainNumber);

    if (isNaN(number)) {
      return null;
    }

    let productPricePrecision = this.tenantService.pricePrecision;

    // if (pricePrecision) {
    //   productPricePrecision = pricePrecision;
    // }

    this.priceFormat =
      '1.' + productPricePrecision + '-' + productPricePrecision;

    if (plainNumber) {
      if (productPricePrecision) {
        plainNumber = this.roundDown(plainNumber, productPricePrecision + 1);
      } else {
        plainNumber = Math.trunc(plainNumber);
      }

      return this._decimalPipe.transform(plainNumber, this.priceFormat);
    }
  }

  pricingdetailspopup(e, params) {
    const dialogRef = this.dialog.open(SpotnegoPricingDetailsComponent, {
      width: '1164px',
      panelClass: ['additional-cost-popup', 'pricing-detail-popup-panel-class']
    });

    dialogRef.afterClosed().subscribe(result => {
      e.target.parentElement.classList.add('active');
      this.inputValue = '560.19';
      var itemsToUpdate = [];
      let rowData = [];

      params.api.forEachNodeAfterFilterAndSort(function(rowNode, index) {
        if (!rowNode.isSelected() === true) {
          return;
        }
        var data = rowNode.data;
        data.tPr = '$560.19';
        data.amt = '4,48,152.00';
        data.diff = '1.19';
        data.phySupplier = 'Same as seller';
        itemsToUpdate.push(data);
      });
      var res = params.api.applyTransaction({ update: itemsToUpdate });
      params.api.deselectAll(); //optional
      this.ispriceCalculated = false;
      this.showFormula = true;
    });
  }

  onRightClickMenuOpened(e) {
    e.target.parentElement.classList.add('active');
  }
  onBlur(e, params) {
    const futureValue = e.target.value;

    if (!futureValue) {
      return null;
    }


    params.colDef.valueSetter({
      colDef: params.colDef,
      data: params.data,
      newValue: futureValue
    });
  }
  checkedHandler(event) {
    let checked = event.target.checked;
    let colId = this.params.column.colId;
    this.params.node.setDataValue(colId, checked);
  }
  refresh(): boolean {
    return false;
  }
  deleteRow() {
    let rowData = [];
    this.params.api.forEachNode(node => rowData.push(node.data));
    let index = this.params.node.rowIndex;
    let newData = [];
    newData = rowData.splice(index, 1);
    this.params.api.applyTransaction({ remove: newData });
  }
  selectSupplier(text,id) {
    this.editedSeller = text;
    this.phySupplierId=id;
  }

  updatePhysicalSupplier(){
    let payload = {
      "RequestLocationSellerId": this.params.data.id,
      "PhySupplierId": this.phySupplierId
    };
    const response = this._spotNegotiationService.updatePhySupplier(payload);
    response.subscribe((res: any) => {
      if (res.status) {
        this.toastr.success(res.message);
      } else {
        this.toastr.error(res.message);
        return;
      }
    });
  }

}
