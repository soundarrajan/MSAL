import {
  Component,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  Inject
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { MatMenuTrigger } from '@angular/material/menu';
import { Store } from '@ngxs/store';
import { SpotnegoAdditionalcostComponent } from '../../views/main/details/components/spot-negotiation-popups/spotnego-additionalcost/spotnego-additionalcost.component';
import { SellerratingpopupComponent } from '../../views/main/details/components/spot-negotiation-popups/sellerratingpopup/sellerratingpopup.component';
import { EmailPreviewPopupComponent } from '../../views/main/details/components/spot-negotiation-popups/email-preview-popup/email-preview-popup.component';
import { ContactinformationpopupComponent } from '../../views/main/details/components/spot-negotiation-popups/contactinformationpopup/contactinformationpopup.component';
import { SupplierCommentsPopupComponent } from '../../views/main/details/components/spot-negotiation-popups/supplier-comments-popup/supplier-comments-popup.component';
import { SpotnegoRequestChangesComponent } from '../../views/main/details/components/spot-negotiation-popups/spotnego-request-changes/spotnego-request-changes.component';
import { SpotnegoPricingDetailsComponent } from '../../views/main/details/components/spot-negotiation-popups/spotnego-pricing-details/spotnego-pricing-details.component';
import { DecimalPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { SpotNegotiationService } from '../../services/spot-negotiation.service';
import _, { cloneDeep } from 'lodash';
import {
  EditLocationRow,
  SetLocationsRows,
  EditCounterpartyList
} from '../../store/actions/ag-grid-row.action';
import { SpotnegoSearchCtpyComponent } from '../../views/main/details/components/spot-negotiation-popups/spotnego-counterparties/spotnego-searchctpy.component';
import { SpotnegoOtherdetails2Component } from '../../views/main/details/components/spot-negotiation-popups/spotnego-otherdetails2/spotnego-otherdetails2.component';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
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
    <div *ngIf="params.type == 'searchbox-parent'">
      <div [ngClass]="params.cellClass">
        <div class="truncate-125">
          {{ this.format.htmlDecode(params.value) }}
        </div>
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
          class="counterpartytype-icon type-seller"
          *ngIf="params.data.counterpartyTypeName == 'Seller'"
          ><i class="fas fa-circle"></i
        ></span>
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
          class="counterpartytype-icon type-sludge"
          *ngIf="params.data.counterpartyTypeName == 'Sludge'"
          ><i class="fas fa-circle"></i
        ></span>
        <span
          class="info-flag"
          *ngIf="params.data.isSellerSuspended"
          matTooltipClass="darkTooltip"
          matTooltip="Temporary suspended counterparty"
          matTooltipClass="lightTooltip"
        ></span>
        <span
          class="m-l-7"
          matTooltip="{{ this.format.htmlDecode(params.value) }}"
          >{{ this.format.htmlDecode(params.value) }}</span
        >
        <span class="sticky-icon">
          <!--span class="hover-lookup-icon" [matMenuTriggerFor]="clickmenupopup" #menuTrigger="matMenuTrigger"></span>-->
          <span
            class="mail-icon-new mail-active"
            (click)="openEmailPreview(params)"
            *ngIf="isRfqSendForAnyProduct()"
            matTooltip="View preview email"
            matTooltipClass="lightTooltip"
            >a</span
          >
          <span
            class="mail-icon-new mail-none"
            (click)="openEmailPreview(params)"
            *ngIf="params.data.mail == 'mail-inactive'"
            matTooltipClass=""
            matTooltip=""
            >i</span
          >
          <span
            class="mail-icon-new mail-none"
            (click)="openEmailPreview(params)"
            *ngIf="params.data.mail == 'mail-inactive'"
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
        (click)="openSellerContactPopup(params)"
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
        <span class="fs-12" (click)="openEmailPreview(params)"
          >Preview Email</span
        >
      </div>
      <div class="p-tb-5" style="display:flex;align-items:center;">
        <span><div class="no-quote-icon"></div></span>
        <span class="fs-12" (click)="noQuoteAction(params)">No Quote</span>
      </div>
      <hr class="menu-divider-line" />
      <div class="p-tb-5" style="display:flex;align-items:center;">
        <span><div class="remove-icon"></div></span>
        <span class="fs-12" (click)="removeCounterparty()"
          >Remove counterparty</span
        >
      </div>
    </mat-menu>
    <div
      class="no-quote-text"
      *ngIf="params.data.isQuote === 'No quote' && params.value === '0'"
    >
      <span>No quote</span>
    </div>

    <!-- Offer price cell -->
    <!-- [ngClass]="!isOfferRequestAvailable() ? 'input-disabled' : '' " -->
    <div
      *ngIf="params.type == 'price-calc'"
      [ngClass]="!isOfferRequestAvailable() ? 'no-price-data' : ''"
    >
      <!-- TODO check this code... -->
      <span *ngIf="!isOfferRequestAvailable()">-</span>
      <div
        *ngIf="isOfferRequestAvailable()"
        [ngClass]="
          params.product.status === 'Stemmed' ||
          params.product.status === 'Confirmed'
            ? 'input-disabled-new'
            : ''
        "
      >
        <div class="price-calc static-data" *ngIf="params.value === '100.00'">
          <span class="duplicate-icon"></span>
          $ {{ params.value }}
        </div>
        <div
          class="price-calc active"
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
        <span class="duplicate-icon" *ngIf="params.data.requestOffers[params.index]?.isOfferPriceCopied"></span>
          <div
            id="custom-form-field"
            [ngClass]="ispriceCalculated ? '' : 'priceCalculated'"
          >
            <mat-form-field
              class="without-search currency-select-trigger"
              appearance="none"
            >
              <!-- ** {{params.data.requestOffers[0].currencyId}} --  -->
              <!-- ** {{params.currency}} --  -->
              <!-- ** {{paramsDataClone.currency}} --  -->
              <mat-label>Select Field</mat-label>
              <mat-select
                disableOptionCentering
                [(ngModel)]="paramsDataClone.currency"
                panelClass="currencyselecttrigger"
                (selectionChange)="onCurrencyChange($event, params)"
                [disabled]="params.index != 0"
              >
                <mat-select-trigger overlayPanelClass="123class">
                  {{ getCurrencyCode(paramsDataClone.currency) }}
                </mat-select-trigger>
                <mat-option [disabled]>Change Currency </mat-option>
                <mat-option
                  class="currency-mat-select"
                  *ngFor="let currency of currencyList"
                  [value]="currency.id"
                >
                  <span>
                    <mat-radio-group>
                      <mat-radio-button
                        [value]="currency.id"
                        [checked]="paramsDataClone.currency == currency.id"
                      >
                        {{ currency.code }}
                      </mat-radio-button>
                    </mat-radio-group>
                  </span>
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          <input
            class="inputField"
            id="{{ params.data.locationId }}/{{ params.index }}/{{
              params.rowIndex
            }}"
            (keyup.enter)="ongetfocus($event, params)"
            (change)="onPriceChange($event, params)"
            autofocus
            #inputSection
            value="{{ priceFormatValue(params.value) }}"
            autocomplete="off"
            name="inputField"
            spellcheck="false"
            type="text"
            style="display:inline"
            [matTooltip]="priceFormatValue(params.value)"
            [disabled]="
              params.product.status === 'Stemmed' ||
              params.product.status === 'Confirmed'
            "
          />

          <div
            class="addButton"
            (click)="otherdetailspopup($event, params)"
            *ngIf="
              params.value > 0 &&
              params.data.requestOffers[params.index]?.supplyQuantity == null
            "
          ></div>
          <div
            class="formulaButton"
            style="display:inline; position:absolute; left:78px;"
            (mouseenter)="hoverMenu($event)"
            [matMenuTriggerFor]="formulamenu"
            #menuTriggerHover="matMenuTrigger"
            *ngIf="
              params.value > 0 &&
              params.data.requestOffers[params.index]?.supplyQuantity != null
            "
          ></div>
        </div>
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
        *ngIf="params.data.requestOffers?.length > 0"
        id="EnabledPhySup{{ params.data.id }}"
        class="phySupplier edit"
        [matTooltip]="
          editSeller && params.data.physicalSupplierCounterpartyName
            ? this.format.htmlDecode(
                params.data.physicalSupplierCounterpartyName
              )
            : 'Add physical supplier'
        "
        matTooltipClass="lightTooltip"
      >
        <span *ngIf="params.data.isEditable">
          <span
            *ngIf="editSeller && params.data.physicalSupplierCounterpartyName"
            >{{ params.data.physicalSupplierCounterpartyName }}</span
          >
          <!--  <span *ngIf="!editSeller">{{ this.editedSeller }}</span> -->
        </span>

        <span
          *ngIf="!params.data.isEditable"
          contentEditable="true"
          [matMenuTriggerFor]="clickmenu"
          #menuTrigger="matMenuTrigger"
          (click)="setValuefun(params.data)"
        >
          <span
            *ngIf="editSeller && params.data.physicalSupplierCounterpartyName"
            >{{
              this.format.htmlDecode(
                params.data.physicalSupplierCounterpartyName
              )
            }}</span
          >
          <span
            *ngIf="
              editSeller && params.data.physicalSupplierCounterpartyName == null
            "
            >Add P. Supplier</span
          >
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
                (input)="search($event.target.value, params)"

              />
            </div>
            <div class="col-md-2">
              <span
                class="expand-img"
                (click)="openCounterpartyPopup(params.data.locationId)"
              ></span>
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
                  <mat-radio-button
                    [value]="element.name"
                    [checked]="element.isSelected"
                    (click)="selectSupplier(element)"
                  >
                    {{ element.name }}
                  </mat-radio-button>
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
            <button
              mat-button
              class="mid-blue-button proceed-btn"
              (click)="updatePhysicalSupplier()"
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </mat-menu>

    <div
      *ngIf="
        params.type == 'mat-check-box' &&
        params.status !== 'Stemmed' &&
        params.status !== 'Confirmed'
      "
      style="height:100%;display:flex;align-items:center;justify-content:center"
      [matTooltip]="
        params.data.preferredProducts?.includes(params.productId)
          ? 'Preferred product'
          : null
      "
      matTooltipClass="lightTooltip"
    >
      <!--<input type="checkbox" (click)="checkedHandler($event)"[checked]="params.value"/>-->
      <mat-checkbox
        [checked]="params.value"
        (click)="selectCounterParties(params)"
        class="light-checkbox small"
        [ngClass]="
          params.data.preferredProducts?.includes(params.productId)
            ? 'darkBorder'
            : ''
        "
      ></mat-checkbox>
    </div>

    <div *ngIf="params.type == 'addTpr'" class="addTpr">
      <span *ngIf="!params.value && params.value != 0">-</span>
      <span [matTooltip]="params.value">{{
        priceCalFormatValue(params.value)
      }}</span>
      <!--<div class="addButton" *ngIf="params.value !='-'" (click)="additionalcostpopup()"></div> -->
    </div>

    <div *ngIf="params.type == 'amt'" class="addTpr">
      <span *ngIf="!params.value && params.value != 0">-</span>
      <span [matTooltip]="params.value">{{
        priceCalFormatValue(params.value)
      }}</span>
    </div>

    <div *ngIf="params.type == 'diff'" class="addTpr">
      <span *ngIf="!params.value && params.value != 0">-</span>
      <span [matTooltip]="params.value">{{
        priceCalFormatValue(params.value)
      }}</span>
      <!--<div class="addButton" *ngIf="params.value !='-'" (click)="additionalcostpopup()"></div> -->
    </div>

    <div
      *ngIf="params.type == 'totalOffer'"
      class="addTpr defaultAddicon"
      [matTooltip]="
        params.data.totalCost ? 'Includes additional costs' : params.value
      "
      matTooltipClass="lightTooltip"
      [matMenuTriggerFor]="addAdditionalCostMenuPopUp"
      #addAdditionalCostPopUpTrigger="matMenuTrigger"
      (click)="addAdditionalCostPopUpTrigger.closeMenu()"
      (contextmenu)="openCostMenu($event, params.value)"
    >
      <span *ngIf="params.value">{{ priceCalFormatValue(params.value) }} </span>
      <span *ngIf="!params.value">-</span>
      <div class="dollarButton" *ngIf="params.data.totalCost"></div>
    </div>
    <mat-menu #addAdditionalCostMenuPopUp="matMenu" class="darkPanel-add big">
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
        (click)="otherdetailspopup($event, params)"
      >
        <span><div class="infocircle-icon"></div></span>
        <span class="fs-13">Other Details</span>
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
  @ViewChild('addAdditionalCostPopUpTrigger')
  addAdditionalCostPopUpTrigger: MatMenuTrigger;

  public showDollar: boolean = false;
  locations: any;
  public params: any;
  public select = '$';
  public inputValue = '';
  public ispriceCalculated: boolean = true;
  public showFormula: boolean = false;
  public editCell: boolean;
  public myFormGroup;
  public editSeller: boolean = true;
  public editedSeller = '';
  public phySupplierId = 0;
  public priceFormat = '';

  public docVal = 'Document Uploaded';
  counterpartyColumns: string[] = ['counterparty', 'blank'];
  counterpartyList = [];
  physicalSupplierList = [];
  visibleCounterpartyList = [];
  currencyList = [];
  currentRequestInfo: any;
  tenantService: any;
  currentRequestData: any[];
  locationsRows: any[];
  currentRequestSmallInfo: any;
  searchValue: string;
  paramsDataClone: any;
  resetPopup :any
  generalTenantSettings: any;
  baseUomId: any;
  constructor(
    @Inject(DecimalPipe)
    private _decimalPipe,
    public router: Router,
    public dialog: MatDialog,
    public store: Store,
    private toastr: ToastrService,
    private _spotNegotiationService: SpotNegotiationService,
    public format: TenantFormattingService,
    private changeDetector: ChangeDetectorRef,
    private route: ActivatedRoute,
    private tenantSettingsService: TenantSettingsService
  ) {
    this.generalTenantSettings = tenantSettingsService.getGeneralTenantSettings();
    this.baseUomId = this.generalTenantSettings.tenantFormats.currency.id;
  }

  ngOnInit() {
    let requestOffers = this.params.data.requestOffers;

    this.myFormGroup = new FormGroup({
      currency: new FormControl('')
    });
    this.paramsDataClone = _.cloneDeep(this.params.data);
    if (this.paramsDataClone.requestOffers) {
      this.paramsDataClone.currency = this.paramsDataClone.requestOffers[0].currencyId;
      this.paramsDataClone.oldCurrency = this.paramsDataClone.currency;
    }
    return this.store.selectSnapshot(({ spotNegotiation }) => {
      this.currentRequestInfo = spotNegotiation.currentRequestSmallInfo;
      this.tenantService = spotNegotiation.tenantConfigurations;
      this.currencyList = spotNegotiation.staticLists.filter(
        el => el.name == 'Currency'
      )[0].items;
      // Fetching counterparty list
      if (spotNegotiation.counterpartyList) {
        this.counterpartyList = spotNegotiation.counterpartyList;
        this.visibleCounterpartyList = this.counterpartyList.slice(0, 7);
      }
    });
  }

  isRfqSendForAnyProduct(): boolean {
    const { requestOffers } = this.params.data || {};

    if (!requestOffers) {
      return false;
    }

    const isRfqSend = requestOffers?.find(off => off.isRfqskipped === false);

    if (isRfqSend) {
      return true;
    }

    return false;
  }
  setValuefun(params) {
    this.searchValue = '';
     this.physicalSupplierList = this.store.selectSnapshot<any>((state: any) => {
        return state.spotNegotiation.physicalSupplierCounterpartyList.slice(0, 7);
    });
    let SelectedCounterpartyList = cloneDeep(this.physicalSupplierList);

    if (SelectedCounterpartyList?.length > 0) {
      SelectedCounterpartyList.forEach(element => {
        if (
          params.physicalSupplierCounterpartyId != null &&
          element.id == params.physicalSupplierCounterpartyId
        ) {
          element.isSelected = true;
          this.phySupplierId = element.id;
        } else {
          element.isSelected = false;
        }
      });
      this.visibleCounterpartyList = SelectedCounterpartyList;
    }
    if (
      params.physicalSupplierCounterpartyName != undefined &&
      params.physicalSupplierCounterpartyName != null
    ) {
      this.editedSeller = params.physicalSupplierCounterpartyName;
    } else {
      this.editedSeller = 'Add P. Supplier';
    }
    this.editSeller = false;
  }
  isOfferRequestAvailable(): boolean {
    // Array of requestoffers
    const { requestOffers } = this.params.data || {};

    if (!requestOffers) {
      return false;
    }

    const productId = this.params.product.id;

    const offerExists = requestOffers.find(
      e => e.requestProductId === productId && e.offerId
    );

    if (offerExists) {
      return true;
    }

    return false;
  }

  frequencyArr = [
    { key: '$', abbriviation: 'USDa' },
    { key: '€', abbriviation: 'EURO' },
    { key: '£', abbriviation: 'GBP' }
  ];

  agInit(params: any): void {
    this.params = params;
  }

 search(userInput: string, params: any): void {
    let selectedCounterpartyList = this.physicalSupplierList
      .filter(e => {
        if (e.name.toLowerCase().includes(userInput.toLowerCase())) {
          return true;
        }
        return false;
      })
      .slice(0, 7);
    if(selectedCounterpartyList.length === 0){
      const response = this._spotNegotiationService.getResponse(null, { Filters: [] }, { SortList: [] }, [{ ColumnName: 'CounterpartyTypes', Value: '1' }], userInput.toLowerCase(), { Skip: 0 , Take: 25 } )
      response.subscribe((res:any)=>{
          if(res?.payload?.length >0){
             let SelectedCounterpartyList1 = cloneDeep(res.payload);
             SelectedCounterpartyList1.forEach(element => {
              if (
                params?.data?.physicalSupplierCounterpartyId != null &&
                element.id == params?.data?.physicalSupplierCounterpartyId
              ) {
                element.isSelected = true;
              } else {
                element.isSelected = false;
              }
            });
            this.visibleCounterpartyList = SelectedCounterpartyList1.slice(0,7);
            this.changeDetector.detectChanges();
          }

      });
    }
    else{

      let SelectedCounterpartyList1 = cloneDeep(selectedCounterpartyList);
      if (SelectedCounterpartyList1?.length > 0) {
        SelectedCounterpartyList1.forEach(element => {
          if (
            params?.data?.physicalSupplierCounterpartyId != null &&
            element.id == params?.data?.physicalSupplierCounterpartyId
          ) {
            element.isSelected = true;
          } else {
            element.isSelected = false;
          }
        });
        this.visibleCounterpartyList = SelectedCounterpartyList1;
        this.changeDetector.detectChanges();
      }
    }
  }
  hoverMenu(event) {
    event.target.classList.add('selectedIcon');
    this.menuTriggerHover.openMenu();
  }
  selectCounterParties(params) {
    let updatedRow = { ...params.data };
    // if(updatedRow.requestOffers?.length >0 && updatedRow.requestOffers[0].price != null){
    //   if( (document.getElementsByClassName("Enabledconfirm") as any).length > 0){
    //     (document.getElementsByClassName("Enabledconfirm") as any).disabled = false;
    //   }
    // }
    updatedRow = this.formatRowData(updatedRow, params);
    // Update the store
    this.store.dispatch(new EditLocationRow(updatedRow));
    params.node.setData(updatedRow);
  }

  formatRowData(row, params) {
    this.store.subscribe(({ spotNegotiation, ...props }) => {
      this.currentRequestData = spotNegotiation.locations;
    });
    let currentLocProd = this.currentRequestData.filter(
      loc => loc.id == row.requestLocationId
    );
    if (currentLocProd.length > 0) {
      let currentLocProdCount = currentLocProd[0].requestProducts.length;
      if (params.value) {
        row.isSelected = false;
        row[params.column.colId] = false;
      } else {
        var checkallprod = this.checkallProd(row, params, currentLocProdCount);
        if (!checkallprod) {
          row.isSelected = true;
        }
        row[params.column.colId] = true;
      }
    }
    return row;
  }

  checkallProd(row, params, currentLocProdCount) {
    if (currentLocProdCount) {
      for (let index = 0; index < currentLocProdCount; index++) {
        let indx = index + 1;
        let val = 'checkProd' + indx;
        if (!row[val] && val != params.column.colId) {
          return true;
        }
      }
    }
    return false;
  }

  additionalcostpopup() {
    this.store.subscribe(({ spotNegotiation, ...props }) => {
      this.currentRequestSmallInfo = spotNegotiation.currentRequestSmallInfo;
    });
    let requestLocationId = this.params.data.requestLocationId;
    let findRequestLocationIndex = _.findIndex(
      this.currentRequestSmallInfo?.requestLocations,
      function(object: any) {
        return object.id == requestLocationId;
      }
    );
    if (findRequestLocationIndex != -1) {
      let requestLocation = this.currentRequestSmallInfo?.requestLocations[
        findRequestLocationIndex
      ];
      const dialogRef = this.dialog.open(SpotnegoAdditionalcostComponent, {
        width: '1170px',
        height: '450px',
        panelClass: 'additional-cost-popup',
        data: {
          requestLocation: requestLocation,
          rowData: this.params.data
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        const groupId = parseFloat(
          this.route.snapshot.params.spotNegotiationId
        );
        const requestLocationSellerId = this.params.data.id;
        this._spotNegotiationService
          .getPriceDetailsById(groupId, requestLocationSellerId)
          .subscribe((priceDetailsRes: any) => {
            let updatedRow = { ...this.params.data };
            updatedRow.totalOffer = priceDetailsRes.sellerOffers[0].totalOffer;
            updatedRow.totalCost = priceDetailsRes.sellerOffers[0].totalCost;
            updatedRow.requestOffers =
              priceDetailsRes.sellerOffers[0].requestOffers;
            // Update the store
            this.store.dispatch(new EditLocationRow(updatedRow));
            this.params.node.setData(updatedRow);
          });
      });
    }
  }
  sellerratingpopup() {
    const dialogRef = this.dialog.open(SellerratingpopupComponent, {
      width: '1164px',
      height: '562px',
      panelClass: 'additional-cost-popup'
    });
    dialogRef.afterClosed().subscribe(result => {});
  }

  openEmailPreview(params) {
    // if (this.currentRequestInfo.requestLocations.filter(loc => loc.id === params.data.requestLocationId
    // ).map(prod =>
    //   prod.requestProducts.map((e, i) => params.data['checkProd' + (i + 1)] ? e.id : undefined).filter(x => x)
    // )[0].length == 0) {
    //   this.toastr.error('Please select a product against the seller in order to preview email.');
    //   return;
    // }
    const dialogRef = this.dialog.open(EmailPreviewPopupComponent, {
      width: '80vw',
      height: '90vh',
      panelClass: 'additional-cost-popup',
      data: params.data
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  openSellerContactPopup(params) {
    const dialogRef = this.dialog.open(ContactinformationpopupComponent, {
      width: '1194px',
      minHeight: '446px',
      panelClass: ['additional-cost-popup', 'supplier-contact-popup'],
      data: {
        sellerId: params.data.sellerCounterpartyId,
        sellerName: params.data.sellerCounterpartyName,
        locationId: params.data.locationId
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  openCounterpartyPopup(locationId) {
    let RequestGroupId = 0;
    let currentRequestLocation = { id: '0', locationId: '0' };
    let sellerCounterpartyId = 0;
    let physicalSupplierCounterpartyName = '';
    let physicalSupplierCounterpartyId = '';

    if (this.currentRequestInfo) {
      RequestGroupId = parseInt(this.currentRequestInfo.requestGroupId);

      if (
        this.currentRequestInfo.requestLocations &&
        this.currentRequestInfo.requestLocations.length > 0
      ) {
        currentRequestLocation = this.currentRequestInfo.requestLocations[0];
      }
    }

    if (this.params.data.requestOffers) {
      (sellerCounterpartyId = this.params.data.sellerCounterpartyId),
        (physicalSupplierCounterpartyId = this.params.data
          .physicalSupplierCounterpartyId);
      physicalSupplierCounterpartyName = this.params.data
        .sellerCounterpartyName;
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
        isPhysicalSupplier: true,
        requestLocationSellerId: this.params.data.id,
        SellerCounterpartyId: sellerCounterpartyId,
        PhysicalSupplierCounterpartyName: physicalSupplierCounterpartyName,
        physicalSupplierCounterpartyId: physicalSupplierCounterpartyId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.sellerName) {
        this.editedSeller = result.sellerName;
      }
    });
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
    let num = plainNumber.split('.', 2);
    //Offer Price to follow precision set at tenant. Ignore the precision, if the decimal values are only 0s
    if (plainNumber == num) {
      this.priceFormat = '';
    } else {
      this.priceFormat = '1.' + 0 + '-' + productPricePrecision;
    }
    if (plainNumber) {
      if (productPricePrecision) {
        plainNumber = this.roundDown(plainNumber, productPricePrecision + 1);
      } else {
        plainNumber = Math.trunc(plainNumber);
      }

      return this._decimalPipe.transform(plainNumber, this.priceFormat);
    }
  }
  priceCalFormatValue(value) {
    if (typeof value == 'undefined' || value == null) {
      return null;
    }
    let plainNumber = value.toString().replace(/[^\d|\-+|\.+]/g, '');
    const number = parseFloat(plainNumber);
    if (isNaN(number)) {
      return null;
    }
    let productPricePrecision = this.tenantService.pricePrecision;

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
  otherdetailspopup(e, params) {
    const dialogRef = this.dialog.open(SpotnegoOtherdetails2Component, {
      width: '1164px',
      height: 'auto',
      maxHeight: '536px',
      panelClass: 'additional-cost-popup',
      data: params
    });
    dialogRef.afterClosed().subscribe(result => {});
  }
  onRightClickMenuOpened(e) {
    e.target.parentElement.classList.add('active');
  }

  returnrowindex(params) {
    const locations = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locations;
    });
    const locationsRows = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locationsRows;
    });
    let StartLocation = locations.findIndex(
      row => row.locationId == params.data.locationId
    );
    let startrow = params.rowIndex;
    let paramsindex = params.index;
    for (let st = StartLocation; st < locations.length; st++) {
      let currentlocationprodlen = locations[st].requestProducts.length - 1;
      let currentlocationsrows = locationsRows.filter(
        loc => loc.locationId == locations[st].locationId
      );
      let Endrow = currentlocationsrows.length;
      if (currentlocationsrows.length > 0) {
        for (let index = startrow; index < Endrow; index++) {
          let nextindex = index + 1;
          if (
            currentlocationsrows[nextindex] &&
            currentlocationsrows[nextindex].requestOffers
          ) {
            return (
              currentlocationsrows[nextindex].locationId +
              '/' +
              paramsindex +
              '/' +
              nextindex
            );
          } else {
            if (paramsindex < currentlocationprodlen) {
              index = -2;
              paramsindex = paramsindex + 1;
            } else {
              startrow = -1;
              paramsindex = 0;
            }
          }
        }
      }
    }
  }

  ongetfocus(event, params) {
    let idValue = this.returnrowindex(params);
    let element = document.getElementById(idValue);
    if (element) {
      element.focus();
    }
  }

  onPriceChange(e, params) {
    // const futureValue = e.target.value;

    // if (!futureValue) {
    //   return null;
    // }

    // if ((document.getElementsByClassName("Enabledconfirm") as any).length > 0) {
    //   (document.getElementsByClassName("Enabledconfirm") as any).disabled = false;
    // }
    params.colDef.valueSetter({
      colDef: params.colDef,
      data: params.data,
      newValue: e.target.value,
      event: e,
      elementidValue: this.returnrowindex(params)
    });
  }

  setNewRowData(newData, exchangeRateValue) {
    for (let i = 0; i < newData.requestOffers.length; i++) {
      newData.requestOffers[i].totalPrice =
        newData.requestOffers[i].totalPrice / exchangeRateValue;
      newData.requestOffers[i].amount =
        newData.requestOffers[i].amount / exchangeRateValue;
      newData.requestOffers[i].targetDifference =
        newData.requestOffers[i].targetDifference / exchangeRateValue;
    }
    newData.totalOffer = newData.totalOffer / exchangeRateValue;
    return newData;
  }

  onCurrencyChange(e, params) {
    var fromCurrency = this.paramsDataClone.oldCurrency;
    // var fromCurrency = this.tenantService.currencyId;
    let toCurrency = this.paramsDataClone.currency;

    var rowNode = params.api.getRowNode(params.node.id);
    var newData = _.cloneDeep(params.data);
    newData.currency = toCurrency;
    newData.requestOffers.map(el => {
      return (el.currencyId = toCurrency);
    });

    let payload = {
      fromCurrencyId: fromCurrency,
      toCurrencyId: toCurrency,
      toCurrencyCode: this.getCurrencyCode(toCurrency)
    };

    const response = this._spotNegotiationService.getExchangeRate(payload);
    response.subscribe((res: any) => {
      if (res.status) {
        this.store.dispatch(new EditLocationRow(newData));
        this.params.node.setData(newData);
        let requestOffers = this.params.data.requestOffers.map(e => {
          return {
            id: e.id,
            totalPrice: e.totalPrice / res.exchangeRateValue,
            amount: e.amount / res.exchangeRateValue,
            targetDifference: e.targetDifference / res.exchangeRateValue,
            currencyId: toCurrency
          };
        });
        let payload = {
          Offers: {
            id: this.params.data.requestOffers[0].offerId,
            totalOffer: this.params.data.totalOffer / res.exchangeRateValue,
            requestOffers: requestOffers
          }
        };

        const applyExchangeRate = this._spotNegotiationService.applyExchangeRate(
          payload
        );
        let futureRowData = this.setNewRowData(
          _.cloneDeep(newData),
          res.exchangeRateValue
        );
        applyExchangeRate.subscribe((res: any) => {
          if (res.status) {
            this.paramsDataClone.oldCurrency = this.paramsDataClone.currency;
            this.store.dispatch(new EditLocationRow(futureRowData));
          } else {
            this.paramsDataClone.currency = this.paramsDataClone.oldCurrency;
          }
        });

        /* params.data has all the data for applyExchangeRate */
      } else {
        this.paramsDataClone.currency = this.paramsDataClone.oldCurrency;
        this.toastr.warning(res.message);
        this.changeDetector.detectChanges();
      }
    });
  }

  getCurrencyCode(currencyId) {
    let currency = this.currencyList.filter(el => el.id == currencyId)[0];
    return currency ? currency.code : false;
  }

  checkedHandler(event) {
    let checked = event.target.checked;
    let colId = this.params.column.colId;
    this.params.node.setDataValue(colId, checked);
  }
  refresh(): boolean {
    return false;
  }
  noQuoteAction(params) {
    let noQuotePayload = {
      "requestOfferIds": params.data.requestOffers.map(e => e.id),
      "noQuote": !params.data.requestOffers[0].hasNoQuote
    };
    let response = this._spotNegotiationService.switchReqOffBasedOnQuote(noQuotePayload);
    response.subscribe((res: any) => {
      console.log(res);
    })
    console.log(noQuotePayload);
  }
  removeCounterparty() {
    // remove counterparty row clicked
    this.params.context.componentParent.removeCounterpartyRowClicked(
      this.params.data,
      this.params.node.rowIndex,
      this.params.api
    );
  }
  selectSupplier(element) {
    this.editedSeller = element.name;
    this.phySupplierId = element.id;
  }

  updatePhysicalSupplier() {
    let valid = false;
    if (!this.phySupplierId) {
      this.toastr.warning(
        'Invalid or same physical supplier selected, Please try selecting it again.'
      );
      return;
    }

    this.store.selectSnapshot<any>((state: any) => {
      if (state.spotNegotiation.locationsRows.length > 0) {
        const selectItems = state.spotNegotiation.locationsRows.filter(
          item =>
            item.locationId === this.params.data.locationId &&
            item.sellerCounterpartyId ===
              this.params.data.sellerCounterpartyId &&
            item.physicalSupplierCounterpartyId === this.phySupplierId &&
            item.id !== this.params.data.id
        );
        if (selectItems.length != 0) {
          this.locationsRows = state.spotNegotiation.locationsRows;
          this.locationsRows.forEach(element => {
            let updatedRow = { ...element };
            if (
              element.locationId == this.params.data.locationId &&
              element.id == this.params.data.id
            ) {
              if (this.params?.value && this.params?.value != null) {
                const PreviousPhySupplier = state.spotNegotiation.counterpartyList.filter(
                  item => item.name === this.params.value
                );
                if (PreviousPhySupplier.length != 0) {
                  updatedRow.physicalSupplierCounterpartyId =
                    PreviousPhySupplier[0].id;
                  updatedRow.physicalSupplierCounterpartyName =
                    PreviousPhySupplier[0].name;
                  this.store.dispatch(new EditLocationRow(updatedRow));

                  //this.store.dispatch(new EditCounterpartyList(updatedRow));
                  return (valid = true);
                }
              } else {
                updatedRow.physicalSupplierCounterpartyId = null;
                updatedRow.physicalSupplierCounterpartyName = null;
                this.store.dispatch(new EditLocationRow(updatedRow));
              }
            }
          });
        } else {
          return (valid = false);
        }
      }
    });
    if (valid) {
      this.toastr.error(
        'Physical supplier already available against the given the Seller.'
      );
      return;
    } else {
    }
    const locationsRows = this.store.selectSnapshot<string>((state: any) => {
      return state.spotNegotiation.locationsRows;
    });
    let payload = {
      requestGroupId: this.params.data.requestGroupId,
      requestLocationId: this.params.data.requestLocationId,
      sellerCounterpartyId: this.params.data.sellerCounterpartyId,
      requestLocationSellerId: this.params.data.id,
      phySupplierId: this.phySupplierId,
      physicalSupplierCounterpartyName: this.params.data.sellerCounterpartyName
    };
    const response = this._spotNegotiationService.updatePhySupplier(payload);
    response.subscribe((res: any) => {
      if (res.status) {
        const futureLocationsRows = this.getLocationRowsAddPhySupplier(
          JSON.parse(JSON.stringify(locationsRows))
        );

        if (this.phySupplierId && this.params?.value) {
          const counterpartyList = this.store.selectSnapshot<any>(
            (state: any) => {
              return state.spotNegotiation.physicalSupplierCounterpartyList;
            }
          );
          if (counterpartyList?.length > 0) {
            counterpartyList.forEach(element => {
              if (element.id == this.phySupplierId) {
                let updatedRow1 = { ...element };
                updatedRow1.isSelected = true;
                this.store.dispatch(new EditCounterpartyList(updatedRow1));
              } else if (element.name == this.params?.value) {
                let updatedRow1 = { ...element };
                updatedRow1.isSelected = false;
                this.store.dispatch(new EditCounterpartyList(updatedRow1));
              }
            });
          }
        }
        this.store.dispatch(new SetLocationsRows(futureLocationsRows));
        this.toastr.success('Phy. Supplier added successfully');
      } else {
        if (this.phySupplierId && this.params?.value) {
          const counterpartyList = this.store.selectSnapshot<any>(
            (state: any) => {
              return state.spotNegotiation.counterpartyList;
            }
          );
          if (counterpartyList?.length > 0) {
            counterpartyList.forEach(element => {
              if (element.id == this.phySupplierId) {
                let updatedRow1 = { ...element };
                updatedRow1.isSelected = false;
                this.store.dispatch(new EditCounterpartyList(updatedRow1));
              } else if (element.name == this.params?.value) {
                let updatedRow1 = { ...element };
                updatedRow1.isSelected = true;
                this.store.dispatch(new EditCounterpartyList(updatedRow1));
              }
            });
          }
        }
        this.toastr.error(res.message);
        return;
      }
    });
  }
  getLocationRowsAddPhySupplier(locationrow) {
    locationrow.forEach((element, key) => {
      if (element.id == this.params.data.id) {
        element.physicalSupplierCounterpartyId = this.phySupplierId;
        element.physicalSupplierCounterpartyName = this.editedSeller;
      }
    });
    return locationrow;
  }

  openCostMenu(event: any, totalOfferValue: any) {
    event.preventDefault();
    event.stopPropagation();
    if (totalOfferValue) {
      this.addAdditionalCostPopUpTrigger.openMenu();
    }
  }
}
