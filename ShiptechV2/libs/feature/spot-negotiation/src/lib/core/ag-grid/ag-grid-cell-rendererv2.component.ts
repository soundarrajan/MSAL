import {
  Component,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
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
  EditCounterpartyList,
  UpdateSpecificRequests
} from '../../store/actions/ag-grid-row.action';
import { SpotnegoSearchCtpyComponent } from '../../views/main/details/components/spot-negotiation-popups/spotnego-counterparties/spotnego-searchctpy.component';
import { SpotnegoOtherdetails2Component } from '../../views/main/details/components/spot-negotiation-popups/spotnego-otherdetails2/spotnego-otherdetails2.component';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { SpotNegotiationStoreModel } from '../../store/spot-negotiation.store';
import { SpotNegotiationPriceCalcService } from '../../services/spot-negotiation-price-calc.service';
@Component({
  selector: 'ag-grid-cell-renderer',
  template: `
    <div *ngIf="params.type == 'singlerow'">
      <div
        [ngClass]="params.cellClass" matTooltipClass="lightTooltip"
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
          matTooltipClass="lightTooltip"
          matTooltip="Temporary suspended counterparty"
        ></span>
        <span
          class="m-l-7"
          matTooltipClass="lightTooltip"
          matTooltip="{{ this.format.htmlDecode(params.value) }}"
          >{{ this.format.htmlDecode(params.value) }}</span
        >
        <span class="sticky-icon">
          <!--span class="hover-lookup-icon" [matMenuTriggerFor]="clickmenupopup" #menuTrigger="matMenuTrigger"></span>-->
          <span
            class="mail-icon-new mail-active"
            (click)="openEmailPreview(params)"
            *ngIf="params.data.isRfqSend"
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
            [ngClass]="{
              'info-comment': this.params.data.isSellerPortalComments,
              'info-comment-inactive': !this.params.data.isSellerPortalComments
            }"
            matTooltip="View supplier comments"
            (click)="suppliercommentspopup(params.data)"
            *ngIf="this.params.data.sellerComments?.length > 0"
            matTooltipClass=""
          ></span>
        </span>
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
      <div
        class="p-tb-5"
        style="display:flex;align-items:center;"
        (click)="suppliercommentspopup(params.data)"
      >
        <span><div class="blue-comments-icon"></div></span>
        <span class="fs-12">Supplier Comments</span>
      </div>
      <hr class="menu-divider-line" />
      <div class="p-tb-5" style="display:flex;align-items:center;">
        <span><div class="view-rfq-icon"></div></span>
        <span class="fs-12" (click)="openEmailPreview(params)"
          >Preview Email</span
        >
      </div>
      <div class="p-tb-5" style="display:flex;align-items:center;">
        <span><div class="no-quote-icon"></div></span>
        <span class="fs-12" (click)="noQuoteAction(params, 'no-quote')"
          >No Quote</span
        >
      </div>
      <div class="p-tb-5" style="display:flex;align-items:center;">
        <span>
          <div class="enable-quote-icon"></div>
        </span>
        <span class="fs-12" (click)="noQuoteAction(params, 'enable-quote')"
          >Enable Quote</span
        >
      </div>
      <hr class="menu-divider-line" />
      <div class="p-tb-5" style="display:flex;align-items:center;">
        <span><div class="remove-icon"></div></span>
        <span class="fs-12" (click)="removeCounterparty()"
          >Remove counterparty</span
        >
      </div>
      </mat-menu>
    </div>

    <div class="no-quote-text aggrid-text-align-c"
      *ngIf="params.type == 'price-calc' &&
      (this.paramsDataCloneForNoQuote?.requestOffers && this.paramsDataCloneForNoQuote?.requestOffers[params.index]?.hasNoQuote)">
      <span>No quote</span>
    </div>
    <!-- Offer price cell -->
    <!-- [ngClass]="!isOfferRequestAvailable() ? 'input-disabled' : '' " -->
    <div *ngIf="params.type == 'price-calc' && !(this.paramsDataCloneForNoQuote?.requestOffers && this.paramsDataCloneForNoQuote?.requestOffers[params.index]?.hasNoQuote)"
      [ngClass]="!this.isOfferAvaialble ? 'no-price-data' : ''">
      <!-- TODO check this code... -->
      <span *ngIf="!this.isOfferAvaialble">-</span>
      <div
        *ngIf="this.isOfferAvaialble"
        [ngClass]="params.product.status === 'Stemmed' || params.product.status === 'Confirmed'
            ? 'input-disabled-new'
            : ''">
        <!-- <div class="price-calc static-data" *ngIf="params.value === '100.00'">
          <span class="duplicate-icon"></span>
          $ {{ params.value }}
        </div> -->
        <div class="price-calc active"
          [matMenuTriggerFor]="priceMenupopup"
          #pricePopupTrigger="matMenuTrigger"
          (click)="pricePopupTrigger.closeMenu()"
          (contextmenu)="
            $event.preventDefault();
            $event.stopPropagation();
            onRightClickMenuOpened($event);
            pricePopupTrigger.openMenu()">
          <span class="duplicate-icon" *ngIf="params.data.requestOffers[params.index]?.isOfferPriceCopied"></span>
          <div id="custom-form-field" [ngClass]="ispriceCalculated ? '' : 'priceCalculated'">
            <mat-form-field
              class="without-search currency-select-trigger"
              appearance="none">
              <!-- ** {{params.data.requestOffers[0].currencyId}} --  -->
              <!-- ** {{params.currency}} --  -->
              <!-- ** {{ paramsDataClone.currency  --  -->
              <mat-label>Select Field</mat-label>
              <mat-select
              style="font-size: 9px;"
                disableOptionCentering
                [(ngModel)]="paramsDataClone.currency"
                panelClass="currencyselecttrigger"
                (selectionChange)="onCurrencyChange($event, params)"
                [disabled]="paramsDataClone.hasAnyProductStemmed && paramsDataClone.isOfferConfirmed"
              >
                <mat-option [disabled]>Change Currency </mat-option>
                <mat-option
                  class="currency-mat-select"
                  *ngFor="let currency of currencyList"
                  [value]="currency.id">
                  <span>
                    <mat-radio-group>
                      <mat-radio-button
                        [value]="currency.id"
                        [checked]="paramsDataClone.currency == currency.id">
                        {{ currency.code }}
                      </mat-radio-button>
                    </mat-radio-group>
                  </span>
                </mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field
              class="without-search currency-select-trigger"
              appearance="none"
              *ngIf="(params.product.status === 'Stemmed' || params.product.status === 'Confirmed')
                  && (params | checkIfProductIsStemmedWithAnotherSeller : checkIfProductIsStemmedWithAnotherSeller1)">
              <mat-label >Select Field</mat-label>
              <mat-select
                disableOptionCentering
                [(ngModel)]="paramsDataClone.currency"
                panelClass="currencyselecttrigger"
                (selectionChange)="onCurrencyChange($event, params)"
                [disabled]="paramsDataClone.hasAnyProductStemmed && paramsDataClone.isOfferConfirmed"
              >
                <mat-select-trigger overlayPanelClass="123class">
                  {{ paramsDataClone.currency | getCurrencyCode:getCurrencyCode1 }}
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
            id="{{ params.data.requestLocationId }}/{{ params.rowIndex }}/{{
              params.index
            }}"
            (keydown.enter)="onGetFocus($event, params)"
            (keydown.Tab)="onGetFocus($event, params)"
            (focus)="getCurrentOfferValue($event)"
            (change)="onPriceChange($event, params)"
            autofocus
            #inputSection
            value="{{ params.value |  priceFormatValue : priceFormatValue1 }}"
            autocomplete="off"
            name="inputField"
            spellcheck="false"
            type="text"
            style="display:inline"
            matTooltipClass="lightTooltip"
            [matTooltip]="params.value |  priceFormatValue : priceFormatValue1"
            [disabled]="params.product.status === 'Stemmed' || params.product.status === 'Confirmed'"
            [ngClass]="params.product.status === 'Stemmed' || params.product.status === 'Confirmed' ? 'inputFieldHighlightOff' : ''"
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
            style="display:inline; position:absolute; left:112px;"
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
      <!-- <div class="add-block" (click)="pricingdetailspopup($event, params)">
        <div></div>
        <span>Add/View Formula pricing</span>
      </div> -->
      <div class="divider-line"></div>
      <div class="add-block" (click)="otherdetailspopup($event, params)">
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
        <ng-container *ngIf="paramsDataClone.hasAnyProductStemmed && paramsDataClone.isOfferConfirmed;
         then second else first">
            
        </ng-container>
        <ng-template #first>
        <span
           *ngIf="!params.data.isEditable"
            [matMenuTriggerFor]="clickmenu"
            #menuTrigger="matMenuTrigger"
            (click)="setValuefun(params.data)">
            <span
            *ngIf="editSeller && params.data.physicalSupplierCounterpartyName"
            >{{
              this.format.htmlDecode(
                params.data.physicalSupplierCounterpartyName
              )
            }}</span>
          <span
            *ngIf="
              editSeller && params.data.physicalSupplierCounterpartyName == null
            "
            >Add P. Supplier</span
          >
          <span *ngIf="!editSeller">{{ this.editedSeller }}</span>
        </span>
        </ng-template>
        <ng-template #second>
        <span
            *ngIf="editSeller && params.data.physicalSupplierCounterpartyName"
            >{{
              this.format.htmlDecode(
                params.data.physicalSupplierCounterpartyName
              )
            }}</span>
        </ng-template>
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
            (click)="$event.preventDefault()"
          >
            <div class="search-product-container col-md-10">
              <span class="search-product-lookup"> </span>
              <input
                matInput
                placeholder="Search and select counterparty"
                class="search-product-input"
                (input)="search($event.target.value, params)"
                (click)="$event.stopPropagation()"
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

    <div
      *ngIf="
        params.type == 'addTpr' && !(this.params.data?.requestOffers && this.params.data?.requestOffers[params.index]?.hasNoQuote)
      "
      class="addTpr"
    >
      <span *ngIf="!params.value && params.value != 0">-</span>
      <span [matTooltip]="priceCalFormatValue(params.value)" matTooltipClass="lightTooltip"> {{
        params.value | priceFormatValue : priceFormatValue1
      }}</span>
      <!--<div class="addButton" *ngIf="params.value !='-'" (click)="additionalcostpopup()"></div> -->
    </div>

    <div
      *ngIf="
        params.type == 'amt' && !(this.params.data?.requestOffers && this.params.data?.requestOffers[params.index]?.hasNoQuote)
      "
      class="addTpr"
    >
      <span *ngIf="!params.value && params.value != 0">-</span>
      <span [matTooltip]="priceCalFormatValue(params.value)" matTooltipClass="lightTooltip"> {{
        params.value | priceFormatValue : priceFormatValue1
      }}</span>
    </div>

    <div
      *ngIf="
        params.type == 'diff' && !(this.params.data?.requestOffers && this.params.data?.requestOffers[params.index]?.hasNoQuote)
      "
      class="addTpr"
    >
      <span *ngIf="!params.value && params.value != 0">-</span>
      <span [matTooltip]="priceCalFormatValue(params.value)" matTooltipClass="lightTooltip">{{
        params.value | priceFormatValue : priceFormatValue1
      }}</span>
      <!--<div class="addButton" *ngIf="params.value !='-'" (click)="additionalcostpopup()"></div> -->
    </div>

    <div
      *ngIf="params.type == 'totalOffer'"
      class="addTpr defaultAddicon total-offer"
      [matTooltip]="
      params.value? format.amount(params.value)+' (Includes additional costs)' : ''
      "
      matTooltipClass="lightTooltip"
      [matMenuTriggerFor]="addAdditionalCostMenuPopUp"
      #addAdditionalCostPopUpTrigger="matMenuTrigger"
      (click)="addAdditionalCostPopUpTrigger.closeMenu()"
      (contextmenu)="openCostMenu($event, params.value)"
    >
      <span *ngIf="params.value">{{ format.amount(params.value) }} </span>
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
        <input matInput [(ngModel)]="docVal" matTooltipClass="lightTooltip" matTooltip="{{ docVal }}" />
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
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
  })
export class AGGridCellRendererV2Component implements ICellRendererAngularComp {
  @ViewChild('inputSection') inputSection: ElementRef;
  @ViewChild('menuTriggerHover') menuTriggerHover: MatMenuTrigger;
  @ViewChild('addAdditionalCostPopUpTrigger')
  addAdditionalCostPopUpTrigger: MatMenuTrigger;

  public showDollar: boolean = false;
  locations: any;
  public params: any;
  isOfferAvaialble: boolean = false
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
  public stcount = 0;
  public docVal = 'Document Uploaded';
  counterpartyColumns: string[] = ['counterparty', 'blank'];
  counterpartyList = [];
  physicalSupplierList = [];
  visibleCounterpartyList = [];
  selectedSellerList=[];
  currencyList = [];
  currentRequestInfo: any;
  tenantService: any;
  currentRequestData: any[];
  locationsRows: any[];
  currentRequestSmallInfo: any;
  searchValue: string;
  paramsDataClone: any;
  resetPopup: any;
  generalTenantSettings: any;
  baseCurrencyId: any;
  additionalCostList: any[] = [];
  locationRowsAcrossRequest: any;
  paramsDataCloneForNoQuote: any;
  costTypeList: any[] = [];
  uomList: any[] = [];
  currencyListForAdditionalCost: any[] = [];
  priceChanged: boolean = false;
  check_count = 0;
  offerOldValue : number;
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
    private tenantSettingsService: TenantSettingsService,
    private spinner: NgxSpinnerService,
    private legacyLookupsDatabase: LegacyLookupsDatabase,
    private spotNegotiationPriceCalcService: SpotNegotiationPriceCalcService
  ) {
    this.legacyLookupsDatabase.getTableByName('costType').then(response => {
      this.costTypeList = response;
    });
    this.legacyLookupsDatabase.getTableByName('uom').then(response => {
      this.uomList = response;
    });

    this.legacyLookupsDatabase.getTableByName('currency').then(response => {
      this.currencyList = response;
      this.currencyListForAdditionalCost = response;
    });

    this.generalTenantSettings = tenantSettingsService.getGeneralTenantSettings();
    this.baseCurrencyId = this.generalTenantSettings.tenantFormats.currency.id;
  }

  ngOnInit() {
    let requestOffers = this.params.data.requestOffers;

    this.legacyLookupsDatabase.getTableByName('currency').then(response => {
      this.currencyList = response;
      this.currencyListForAdditionalCost = response;
    });

    this.myFormGroup = new FormGroup({
      currency: new FormControl('')
    });
    this.paramsDataClone = _.cloneDeep(this.params.data);
    this.priceChanged = false;
    if (
      this.paramsDataClone.requestOffers &&
      this.params.type === 'price-calc'
    ) {
      this.paramsDataClone.currency = this.paramsDataClone.requestOffers[0].currencyId;
      this.paramsDataClone.currencyCode = this.paramsDataClone.requestOffers[0].currencyCode;
      this.paramsDataClone.oldCurrency = this.paramsDataClone.currency;
    }

    return this.store.selectSnapshot<any>((state: any) => {
      this.currentRequestInfo = state.spotNegotiation.currentRequestSmallInfo;
      this.tenantService = state.spotNegotiation.tenantConfigurations;
      this.locationRowsAcrossRequest = state.spotNegotiation.locationsRows;

      if (state.spotNegotiation.staticLists)
        this.currencyList = state.spotNegotiation.staticLists['currency'];
      // Fetching counterparty list
      if (state.spotNegotiation.counterpartyList) {
        this.counterpartyList = state.spotNegotiation.counterpartyList;
        this.visibleCounterpartyList = this.counterpartyList.slice(0, 7);
      }

      if (
        this.params.data.requestOffers &&
        (this.params.type === 'price-calc' ||
          this.params.type == 'addTpr' ||
          this.params.type == 'amt' ||
          this.params.type == 'diff')
      ) {
        let requestLocationId = this.params.data.requestLocationId;
        let currentLocation = _.find(
          this.currentRequestInfo.requestLocations,
          function(location) {
            return location.id == requestLocationId;
          }
        );
        if (currentLocation) {
          let products = currentLocation.requestProducts;
          this.paramsDataCloneForNoQuote = _.cloneDeep(this.params.data);
          this.paramsDataCloneForNoQuote.requestOffers = [];
          for (let i = 0; i < products.length; i++) {
            let findRequestOfferIndex = _.findIndex(
              this.params.data.requestOffers,
              function(object: any) {
                return object.requestProductId == products[i].id;
              }
            );
            if (findRequestOfferIndex === -1) {
              this.paramsDataCloneForNoQuote.requestOffers.push({});
            } else {
              this.paramsDataCloneForNoQuote.requestOffers.push(
                this.params.data.requestOffers[findRequestOfferIndex]
              );
            }
          }
        }
      }

      if (state.spotNegotiation.additionalCostList) {
        this.additionalCostList = _.cloneDeep(
          state.spotNegotiation.additionalCostList
        );
      }
    });
  }
  public isRfqSendForAnyProduct1 = ()=> {
    const { requestOffers } = this.params.data || {};
    if (!requestOffers) {
      return false;
    }
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
      this.editedSeller = this.format.htmlDecode(params.physicalSupplierCounterpartyName);
    } else {
      this.editedSeller = 'Add P. Supplier';
    }
    this.editSeller = false;
  }
  public isOfferRequestAvailable1 = () =>{
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
  isOfferRequestAvailable(): boolean {
    //console.log(this.stcount++ +" isOfferRequestAvailable...");
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
    if(this.params.product){
      const { requestOffers } = this.params.data || {};

    if (!requestOffers) {
      this.isOfferAvaialble = false;
      return;
    }
    const productId = this.params.product.id;

    const offerExists = requestOffers.find(
      e => e.requestProductId === productId && e.offerId
    );

    if (offerExists) {
      this.isOfferAvaialble =  true;
    }

//    this.isOfferAvaialble = false;
    }
    //this.params.data.isOfferAvaialble = this.isOfferRequestAvailable();
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
    if (selectedCounterpartyList.length === 0) {
      const response = this._spotNegotiationService.getResponse(
        null,
        { Filters: [] },
        { SortList: [] },
        [{ ColumnName: 'CounterpartyTypes', Value: '1' }],
        userInput.toLowerCase(),
        { Skip: 0, Take: 25 }
      );
      response.subscribe((res: any) => {
        if (res?.payload?.length > 0) {
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
          this.visibleCounterpartyList = SelectedCounterpartyList1.slice(0, 7);
          this.changeDetector.detectChanges();
        }
      });
    } else {
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

  updateSpecificRequest(requestLocationId, requestProductId, selectAll) {
    let currentRequestSmallInfo = _.cloneDeep(
      this.store.selectSnapshot((state: SpotNegotiationStoreModel) => {
        return state['spotNegotiation'].currentRequestSmallInfo;
      })
    );
    let findRequestLocationIndex = _.findIndex(
      currentRequestSmallInfo.requestLocations,
      function(object: any) {
        return object.id == requestLocationId;
      }
    );
    if (findRequestLocationIndex != -1) {
      let requestLocation =
        currentRequestSmallInfo.requestLocations[findRequestLocationIndex];
      let findProductIndex = _.findIndex(
        requestLocation?.requestProducts,
        function(object: any) {
          return object.id == requestProductId;
        }
      );
      if (findProductIndex != -1) {
        let requestProduct = requestLocation.requestProducts[findProductIndex];
        requestProduct.isSelected = selectAll;
        this.store.dispatch(
          new UpdateSpecificRequests([currentRequestSmallInfo])
        );
      }
    }
  }

  selectCounterParties(params) {
//    let updatedRow = { ...params.data };
    let updatedRow = _.cloneDeep(this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locationsRows?.find(lr => lr.id == params.data.id);
    }));
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
    this.currentRequestData = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locations;
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
    this.currentRequestSmallInfo = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.currentRequestSmallInfo;
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
        width: '95%',
        height: 'auto',
        maxWidth : '100vw',
        panelClass: 'additional-cost-popup',
        data: {
          requestLocation: requestLocation,
          rowData: this.params.data,
          costTypeList: this.costTypeList,
          uomList: this.uomList,
          currencyList: this.currencyListForAdditionalCost
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (!result) {
          const groupId = parseFloat(
            this.route.snapshot.params.spotNegotiationId
          );
          const requestLocationSellerId = this.params.data.id;
          this._spotNegotiationService
            .getPriceDetailsById(groupId, requestLocationSellerId)
            .subscribe(async (priceDetailsRes: any) => {
              let updatedRow = { ...this.params.data };
              updatedRow.totalOffer =
                priceDetailsRes.sellerOffers[0].totalOffer;
              updatedRow.totalCost = priceDetailsRes.sellerOffers[0].totalCost;
              updatedRow.requestOffers =
                priceDetailsRes.sellerOffers[0].requestOffers;
              updatedRow.requestAdditionalCosts = priceDetailsRes.sellerOffers[0].requestAdditionalCosts;
                var locRow = await this.spotNegotiationPriceCalcService.checkAdditionalCost(
                  updatedRow,
                  updatedRow);
              // Update the store
              this.store.dispatch(new EditLocationRow(locRow));
              this.params.node.setData(locRow);
              this._spotNegotiationService.callGridRedrawService();
            });
        } else {
          this.getPriceDetails();
        }
      });
    }
  }

  getPriceDetails() {
    // Get current id from url and make a request with that data.
    const locationsRows = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locationsRows;
    });
    const groupId = this.route.snapshot.params.spotNegotiationId;
    let rows = _.cloneDeep(locationsRows);
    this._spotNegotiationService
      .getPriceDetails(groupId)
      .subscribe(async (res: any) => {
        if (res['sellerOffers']) {
          const futureLocationsRows = this.getLocationRowsWithPriceDetails(
            rows,
            res['sellerOffers']
          );
          let reqLocationRows : any =[];
          for (const locRow of futureLocationsRows) {
            var data = await this.spotNegotiationPriceCalcService.checkAdditionalCost(
              locRow,
              locRow);
              reqLocationRows.push(data);
          }
          this.store.dispatch(new SetLocationsRows(reqLocationRows));
        }
      });
  }

  getLocationRowsWithPriceDetails(rowsArray, priceDetailsArray) {
    let currentRequestData: any;
    //let currencyList: any
    currentRequestData = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locations;
    });

    // currencyList = this.store.selectSnapshot<any>((state: any) => {
    //   return state.spotNegotiation.staticLists['currency'];
    // });

    let requests = _.cloneDeep(
      this.store.selectSnapshot((state: SpotNegotiationStoreModel) => {
        return state['spotNegotiation'].requests;
      })
    );

    rowsArray.forEach((row, index) => {
      let currentLocProd = currentRequestData.filter(
        row1 => row1.locationId == row.locationId
      );
      let requestProducts = requests.find(x => x.id == row.requestId)?.requestLocations?.find(l => l.id ==row.requestLocationId)?.requestProducts;
      // Optimize: Check first in the same index from priceDetailsArray; if it's not the same row, we will do the map bind
      if (
        index < priceDetailsArray.length &&
        row.id === priceDetailsArray[index]?.requestLocationSellerId
      ) {
        row.requestOffers = priceDetailsArray[index].requestOffers;
        row.isSelected = priceDetailsArray[index].isSelected;
        // row.physicalSupplierCounterpartyId =
        //   priceDetailsArray[index].physicalSupplierCounterpartyId;
        // if (priceDetailsArray[index].physicalSupplierCounterpartyId) {
        //   row.physicalSupplierCounterpartyName = counterpartyList.find(
        //     x => x.id == priceDetailsArray[index].physicalSupplierCounterpartyId
        //   ).displayName;
        // }
        // row.requestOffers = priceDetailsArray[
        //   index
        // ].requestOffers?.sort((a, b) =>
        //   a.requestProductId > b.requestProductId ? 1 : -1
        // );
        
        row.totalOffer = priceDetailsArray[index].totalOffer;
        row.totalCost = priceDetailsArray[index].totalCost;
        row.requestAdditionalCosts = priceDetailsArray[index].requestAdditionalCosts;
        
        this.UpdateProductsSelection(currentLocProd, row);
        row.isRfqSend = row.requestOffers?.some(off => off.isRfqskipped === false);
        row.requestOffers = row.requestOffers.map(e => {
          let isStemmed = requestProducts?.find(rp => rp.id == e.requestProductId)?.status;
          let requestProductTypeOrderBy = requestProducts?.find(rp => rp.id == e.requestProductId)?.productTypeOrderBy;
          return { ...e, reqProdStatus: isStemmed, requestProductTypeOrderBy: requestProductTypeOrderBy };
        });
        row.hasAnyProductStemmed = row.requestOffers?.some(off => off.reqProdStatus == 'Stemmed');
        row.isOfferConfirmed = row.requestOffers?.some(off => off.orderProducts && off.orderProducts.length > 0);      
        row.requestOffers = row.requestOffers?.sort((a, b) =>
          a.requestProductTypeOrderBy === b.requestProductTypeOrderBy
            ? a.requestProductId > b.requestProductId
              ? 1
              : -1
            : a.requestProductTypeOrderBy > b.requestProductTypeOrderBy
            ? 1
            : -1
        );
        return row;
      }

      // Else if not in the same index
      const detailsForCurrentRow = priceDetailsArray.filter(
        e => e.requestLocationSellerId === row.id
      );

      // We found something
      if (detailsForCurrentRow.length > 0) {
        row.requestOffers = detailsForCurrentRow[0].requestOffers;
        row.isSelected = detailsForCurrentRow[0].isSelected;
        // row.physicalSupplierCounterpartyId =
        //   detailsForCurrentRow[0].physicalSupplierCounterpartyId;
        // if (detailsForCurrentRow[0].physicalSupplierCounterpartyId) {
        //   row.physicalSupplierCounterpartyName = counterpartyList.find(
        //     x => x.id == detailsForCurrentRow[0].physicalSupplierCounterpartyId
        //   ).displayName;
        // }
        row.totalOffer = detailsForCurrentRow[0].totalOffer;
        row.totalCost = detailsForCurrentRow[0].totalCost;
        row.requestAdditionalCosts = detailsForCurrentRow[0].requestAdditionalCosts;
        this.UpdateProductsSelection(currentLocProd, row);
        row.isRfqSend = row.requestOffers?.some(off => off.isRfqskipped === false);
        row.requestOffers = row.requestOffers.map(e => {
          let isStemmed = requestProducts?.find(rp => rp.id == e.requestProductId)?.status;
          let requestProductTypeOrderBy = requestProducts?.find(rp => rp.id == e.requestProductId)?.productTypeOrderBy;
          return { ...e, reqProdStatus: isStemmed, requestProductTypeOrderBy: requestProductTypeOrderBy };
        });
        row.hasAnyProductStemmed = row.requestOffers?.some(off => off.reqProdStatus == 'Stemmed');
        row.isOfferConfirmed = row.requestOffers?.some(off => off.orderProducts && off.orderProducts.length > 0);
        row.requestOffers = row.requestOffers?.sort((a, b) =>
          a.requestProductTypeOrderBy === b.requestProductTypeOrderBy
            ? a.requestProductId > b.requestProductId
              ? 1
              : -1
            : a.requestProductTypeOrderBy > b.requestProductTypeOrderBy
            ? 1
            : -1
        );
      }
      return row;
    });

    return rowsArray;
  }

  UpdateProductsSelection(currentLocProd, row) {
    if (currentLocProd.length != 0) {
      let currentLocProdCount = currentLocProd[0].requestProducts.length;
      for (let index = 0; index < currentLocProdCount; index++) {
        let indx = index + 1;
        let val = 'checkProd' + indx;
        const status = currentLocProd[0].requestProducts[index].status;
        row[val] =
          status === 'Stemmed' || status === 'Confirmed'
            ? false
            : row.isSelected;
        //row[val] = row.isSelected;
      }
    }
  }

  sellerratingpopup() {
    //console.log("sellerratingpopup");
    const dialogRef = this.dialog.open(SellerratingpopupComponent, {
      width: '1164px',
      height: '562px',
      panelClass: 'additional-cost-popup'
    });
    dialogRef.afterClosed().subscribe(result => {
      this._spotNegotiationService.callGridRefreshService();
    });
  }

  openEmailPreview(params) {
    this.store.selectSnapshot<any>((state: any) => {
      this.locationRowsAcrossRequest = state.spotNegotiation.locationsRows;
    });
    let locRow = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locationsRows?.find(lr => lr.id == params.data.id);
    });

    let sellerData = this.locationRowsAcrossRequest.filter(
      s =>
        s.sellerCounterpartyId == locRow.sellerCounterpartyId &&
        s.requestId == locRow.requestId
    );
    let products = this.currentRequestInfo.requestLocations.filter(loc => this.locationRowsAcrossRequest.some(s => s.sellerCounterpartyId == locRow.sellerCounterpartyId && s.requestId == locRow.requestId && s.requestLocationId ==  loc.id)).map(prod =>
      prod.requestProducts.map((e, i) => locRow['checkProd' + (i + 1)] ? e.id : undefined).filter(x => x)
    )

    if (products[0].length==0) {
      this.toastr.error('Please select products to preview email.');
      return;
    }
    const dialogRef = this.dialog.open(EmailPreviewPopupComponent, {
      width: '80vw',
      height: '90vh',
      panelClass: 'additional-cost-popup',
      data: sellerData
    });

    dialogRef.afterClosed().subscribe(result => {
      this._spotNegotiationService.callGridRefreshService();
    });
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
      this._spotNegotiationService.callGridRefreshService();
    });
  }
  suppliercommentspopup(params) {
    const dialogRef = this.dialog.open(SupplierCommentsPopupComponent, {
      width: '513px',
      minHeight: '260px',
      panelClass: ['additional-cost-popup', 'supplier-contact-popup'],
      data: params,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this._spotNegotiationService.callGridRefreshService();
    });
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
      this._spotNegotiationService.callGridRefreshService();
    });
  }
  public priceFormatValue1 = (value) => {
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
      if (!productPricePrecision) {
        plainNumber = Math.trunc(plainNumber);
      }
      return this._decimalPipe.transform(plainNumber, this.priceFormat);
    }
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
      if (!productPricePrecision) {
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
      if (!productPricePrecision) {
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
      this._spotNegotiationService.callGridRefreshService();
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
    dialogRef.afterClosed().subscribe(result => {
      this._spotNegotiationService.callGridRefreshService();
    });
  }
  onRightClickMenuOpened(e) {
    e.target.parentElement.classList.add('active');
  }

  getColumnProductIndex(requestLocation, requestOffer) {
    if (requestLocation) {
      let findProductIndex = _.findIndex(
        requestLocation.requestProducts,
        function(object: any) {
          return object.id == requestOffer.requestProductId;
        }
      );
      if (findProductIndex != -1) {
        let product = requestLocation.requestProducts[findProductIndex];
        if (!(product.status === 'Stemmed' || product.status === 'Confirmed')) {
          return findProductIndex;
        }
      }
    }
    return -1;
  }

  returnRowIndex(params) {
    let locations = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.currentRequestSmallInfo;
    }).requestLocations;
    const locationsRows = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locationsRows;
    });
    let indexOfStartLocation = locations.findIndex(
      row => row.locationId == params.data.locationId
    );
    let rowIndex = params.rowIndex;
    let paramsIndex = params.index;
    let currentLocationRowId = params.data.id;
    let currentRequestLocationId = params.data.requestLocationId;
    // console.log('Row Index:', rowIndex);
    // console.log('Params Index:', paramsIndex);

    for (let i = indexOfStartLocation; i < locations.length; i++) {
      let requestLocation = locations[i];
      if (requestLocation.id !== currentRequestLocationId) {
        rowIndex = 0;
      }
      let currentLocationRows = locationsRows.filter(
        loc => loc.requestLocationId == requestLocation.id
      );
      if (currentLocationRows.length > 0) {
        // console.log('Current Location Rows:', currentLocationRows);
        for (let j = rowIndex; j < currentLocationRows.length; j++) {
          if (currentLocationRows[j].requestOffers) {
            // console.log('Row :', currentLocationRows[i]);
            for (
              let k = 0;
              k < currentLocationRows[j].requestOffers.length;
              k++
            ) {
              let requestOffer = currentLocationRows[j].requestOffers[k];
              let productAreStemmedOrConfirmed = this.checkIfProductIsStemmedOrConfirmed(
                requestLocation,
                requestOffer
              );
              if (!productAreStemmedOrConfirmed && !requestOffer.hasNoQuote) {
                // console.log('Request Offer :', requestOffer);

                let columnIndex = this.getColumnProductIndex(
                  requestLocation,
                  requestOffer
                );
                if (columnIndex != -1) {
                  // console.log('Column Product Index:', columnIndex);
                  //If exists cells with no stemmed product on the same row && columnIndex > paramsIndex
                  if (
                    currentLocationRows[j].id == currentLocationRowId &&
                    columnIndex > paramsIndex
                  ) {
                    // console.log('Same line', currentLocationRows[j]);
                    let id =
                      currentLocationRows[j].requestLocationId +
                      '/' +
                      j +
                      '/' +
                      columnIndex;
                    return id;
                  } else if (
                    currentLocationRows[j].id !== currentLocationRowId
                  ) {
                    //Next rows
                    // console.log('Next line', currentLocationRows[j]);
                    let id =
                      currentLocationRows[j].requestLocationId +
                      '/' +
                      j +
                      '/' +
                      columnIndex;
                    return id;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  onGetFocus(event, params) {
    debugger;
    if (!this.priceChanged) {
      let idValue = this.returnRowIndex(params);
      let element = document.getElementById(idValue);
      if (element) {
        this.moveCursorToEnd(element);
      }
    }
  }

  moveCursorToEnd(element) {
    var len = element.value.length;
    if (element.setSelectionRange) {
      setTimeout(() => {
        element.focus();
        element.setSelectionRange(len, len);
      }, 500);
      
    } else if (element.createTextRange) {
      var t = element.createTextRange();
      t.collapse(true);
      t.moveEnd('character', len);
      t.moveStart('character', len);
      t.select();
    }
  }

  onPriceChange(e, params) {
    this.priceChanged = false;
    if((e.target.value !='' && this.offerOldValue != e.target.value) || (e.target.value == '' && this.offerOldValue > 0) ){
      params.colDef.valueSetter({
        colDef: params.colDef,
        data: params.data,
        newValue: e.target.value,
        event: e,
        elementidValue: this.returnRowIndex(params)
      });
    }else{
      this.onGetFocus(e, params);
    }
  }
  public getCurrentOfferValue(e){
    this.offerOldValue = e.target.value;
  }
  public checkIfSellerHasAtleastOneProductStemmedAndAnyOrderCreated1 = (params) => {
    const requestLocation = this.getCurrentRequestLocation();
    for (let i = 0; i < params?.requestOffers.length; i++) {
      if (
        this.checkIfProductIsStemmedOrConfirmed(
          requestLocation,
          params.requestOffers[i]
        )
        &&
        params.requestOffers[i].orderProducts &&
        params.requestOffers[i].orderProducts.length > 0
      ) {
        return true;
      }
    }
    return false;
  }
  checkIfSellerHasAtleastOneProductStemmedAndAnyOrderCreated(params) {
    //console.log(this.stcount++ +" checkIfSellerHasAtleastOneProductStemmedAndAnyOrderCreated...");
    const requestLocation = this.getCurrentRequestLocation();
    for (let i = 0; i < params.requestOffers.length; i++) {
      if (
        this.checkIfProductIsStemmedOrConfirmed(
          requestLocation,
          params.requestOffers[i]
        ) &&
        params.requestOffers[i].orderProducts &&
        params.requestOffers[i].orderProducts.length > 0
      ) {
        return true;
      }
    }
    return false;
  }

  checkIfProductIsStemmedWithAnotherSeller1(params) {
    let product = params.product;
    let findOffer = _.find(params.requestOffers, function(requestOffer) {
      return requestOffer.requestProductId === product.id;
    });
    if (findOffer) {
      if (findOffer.orderProducts && findOffer.orderProducts.length > 0) {
        return true;
      }
    }
    return false;
  }
  checkIfProductIsStemmedWithAnotherSeller(params, product) {
    let findOffer = _.find(params.requestOffers, function(requestOffer) {
      return requestOffer.requestProductId === product.id;
    });
    if (findOffer) {
      if (findOffer.orderProducts && findOffer.orderProducts.length > 0) {
        return true;
      }
    }
    return false;
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

  getCurrentRequestLocation() {
 // console.log(this.stcount++ +" getCurrentRequestLocation...");
    this.currentRequestSmallInfo = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.currentRequestSmallInfo;
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
      return requestLocation;
    }
    return null;
  }

  checkIfProductIsStemmedOrConfirmed(requestLocation, requestOffer) {
    if (requestLocation != null) {
      let findProductIndex = _.findIndex(
        requestLocation.requestProducts,
        function(object: any) {
          return object.id == requestOffer.requestProductId;
        }
      );
      if (findProductIndex != -1) {
        let product = requestLocation.requestProducts[findProductIndex];
        if (product.status === 'Stemmed' || product.status === 'Confirmed') {
          return true;
        }
        return false;
      }
    }
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
    let exchangeRateValue = 1;
    this.spinner.show();
    const response = this._spotNegotiationService.getExchangeRate(payload);
    response.subscribe((res: any) => {
      if (res.status) {
        exchangeRateValue = res.exchangeRateValue;
        //this.store.dispatch(new EditLocationRow(newData));
        this.params.node.setData(newData);
        let requestOffers = this.params.data.requestOffers.map(e => {
          return {
            id: e.id,
            totalPrice: e.totalPrice / res.exchangeRateValue,
            amount: e.amount / res.exchangeRateValue,
            targetDifference: e.targetDifference / res.exchangeRateValue,
            currencyId: toCurrency,
            exchangeRateToBaseCurrency:
              this.baseCurrencyId === toCurrency ? 1 : res.exchangeRateValue
          };
        });
        let payload = {
          Offers: {
            id: this.params.data.requestOffers[0].offerId,
            totalOffer: this.params.data.totalOffer / res.exchangeRateValue,
            requestOffers: requestOffers
          }
        };
        params.api?.showLoadingOverlay();
        const applyExchangeRate = this._spotNegotiationService.applyExchangeRate(
          payload
        );
        // let futureRowData = this.setNewRowData(
        //   _.cloneDeep(newData),
        //   res.exchangeRateValue
        // );
        applyExchangeRate.subscribe((res: any) => {
        params.api?.hideOverlay();
          if (res.status) {
            this.paramsDataClone.oldCurrency = this.paramsDataClone.currency;
            //this.store.dispatch(new EditLocationRow(futureRowData));
            this.changeCurrencyForAdditionalCost(
              this.paramsDataClone.currency,
              exchangeRateValue
            );
            this._spotNegotiationService.callGridRefreshService();
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
      setTimeout(() => {this.spinner.hide()}, 1000);
    });
  }

  changeCurrencyForAdditionalCost(currencyId, exchangeRateValue) {
    this.checkAdditionalCost(
      _.cloneDeep(this.params.data),
      currencyId,
      exchangeRateValue
    );
  }

  async checkAdditionalCost(sellerOffers, currencyId, exchangeRateValue) {
    this.currentRequestSmallInfo = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.currentRequestSmallInfo;
    });

    let requestLocationId = sellerOffers.requestLocationId;
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
      const payload = {
        offerId: sellerOffers.requestOffers[0].offerId,
        requestLocationId: sellerOffers.requestLocationId,
        isLocationBased: false
      };
      this.getSellerLine(sellerOffers);
      //this.spinner.show();
      // let response = await this._spotNegotiationService
      //   .getAdditionalCosts(payload)
      //   //.subscribe((response: any) => {
      //     if(response != null){
      //     if (typeof response === 'string') {
      //       //this.spinner.hide();
      //       return;
      //     } else {
      //       let offerAdditionalCostList = _.cloneDeep(
      //         response.offerAdditionalCosts
      //       ) as AdditionalCostViewModel[];
      //       for (let i = 0; i < offerAdditionalCostList.length; i++) {
      //         if (offerAdditionalCostList[i].currencyId != currencyId) {
      //           offerAdditionalCostList[i].currencyId = currencyId;
      //           offerAdditionalCostList[i].extraAmount =
      //             offerAdditionalCostList[i].extraAmount; // / exchangeRateValue;
      //           offerAdditionalCostList[i].amount =
      //             offerAdditionalCostList[i].amount; // / exchangeRateValue;
      //           offerAdditionalCostList[i].ratePerUom =
      //             offerAdditionalCostList[i].ratePerUom; // / exchangeRateValue;
      //         }
      //       }
      //       this.saveAdditionalCosts(
      //         offerAdditionalCostList,
      //         response.locationAdditionalCosts,
      //         sellerOffers
      //       );
      //     }
      //   //});
      // }
    }
  }

  saveAdditionalCosts(
    offerAdditionalCostList,
    locationAdditionalCostsList,
    sellerOffers
  ) {
    this.getSellerLine(sellerOffers);
    // let payload = {
    //   additionalCosts: offerAdditionalCostList.concat(
    //     locationAdditionalCostsList
    //   )
    // };
    // this._spotNegotiationService
    //   .saveOfferAdditionalCosts(payload)
    //   .subscribe((res: any) => {
    //     if (res.status) {
    //       this.getSellerLine(sellerOffers);
    //     } else {
    //       this.spinner.hide();
    //       this.toastr.error('Please try again later.');
    //     }
    //   });
  }

  getSellerLine(sellerOffers) {
    const groupId = parseFloat(this.route.snapshot.params.spotNegotiationId);
    // let currencyList : any;
    // currencyList = this.store.selectSnapshot<any>((state: any) => {
    //   return state.spotNegotiation.staticLists['currency'];
    // });
    let requests = _.cloneDeep(
      this.store.selectSnapshot((state: SpotNegotiationStoreModel) => {
        return state['spotNegotiation'].requests;
      })
    );

    const requestLocationSellerId = sellerOffers.id;
    this._spotNegotiationService
      .getPriceDetailsById(groupId, requestLocationSellerId)
      .subscribe(async (priceDetailsRes: any) => {
        this.spinner.hide();
        let updatedRow = { ...this.params.data };
        updatedRow.totalOffer = priceDetailsRes.sellerOffers[0].totalOffer;
        updatedRow.totalCost = priceDetailsRes.sellerOffers[0].totalCost;
        updatedRow.requestOffers =
          priceDetailsRes.sellerOffers[0].requestOffers;
        updatedRow.isRfqSend = updatedRow.requestOffers?.some(off => off.isRfqskipped === false);
        let requestProducts = requests.find(x => x.id == updatedRow.requestId)?.requestLocations?.find(l => l.id ==updatedRow.requestLocationId)?.requestProducts;
        updatedRow.requestOffers = updatedRow.requestOffers.map(e => {
          let isStemmed = requestProducts?.find(rp => rp.id == e.requestProductId)?.status;
           return { ...e, reqProdStatus: isStemmed };
        });
        updatedRow.hasAnyProductStemmed = updatedRow.requestOffers?.some(off => off.reqProdStatus == 'Stemmed');
        updatedRow.isOfferConfirmed = updatedRow.requestOffers?.some(off => off.orderProducts && off.orderProducts.length > 0);
        updatedRow.requestAdditionalCosts = priceDetailsRes.sellerOffers[0].requestAdditionalCosts;
        // Update the store
        var locRow = await this.spotNegotiationPriceCalcService.checkAdditionalCost(
          updatedRow,
          updatedRow);
        this.store.dispatch(new EditLocationRow(locRow));
        this.params.node.setData(locRow);
      });
  }
  public getCurrencyCode1 = (currencyId)  => {
    //this._spotNegotiationService.callGridRefreshService();
    let currency = this.currencyList?.filter(el => el.id == currencyId)[0];
    return currency ? currency.code : false;
  }

  getCurrencyCode(currencyId) {
    //console.log( this.check_count++ + "getCurrencyCode...");
    let currency = this.currencyList?.filter(el => el.id == currencyId)[0];
    //console.log(currency);
    return currency ? currency.code : false;
  }

  checkedHandler(event) {
    let checked = event.target.checked;
    let colId = this.params.column.colId;
    this.params.node.setDataValue(colId, checked);
  }
  refresh() {
    return false;
  }
  FilterselectedRowForRFQ() {
    let requests = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.requests;
    });
    let locationsRows = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locationsRows;
    });

    //this.store.subscribe(({ spotNegotiation }) => {
      this.selectedSellerList = [];
      requests.forEach(req => {
        req.requestLocations.forEach(element => {
          locationsRows.forEach(element1 => {
            if (element.id == element1.requestLocationId) {
              if (
                element1['checkProd1'] ||
                element1['checkProd2'] ||
                element1['checkProd3'] ||
                element1['checkProd4'] ||
                element1['checkProd5']
              ) {
                var Sellectedsellerdata = this.ConstuctSellerPayload(
                  element1,
                  element.requestProducts,
                  req
                );
                if (Sellectedsellerdata) {
                  this.selectedSellerList.push(Sellectedsellerdata);
                }
              }
            }
          });
        });
      });
    //});
    return this.selectedSellerList;
  }

  ConstuctSellerPayload(Seller, requestProducts, Request) {
    let selectedproductIds = [];
    let selectedproduct = [];
    let rfqId = 0;

    if (Seller['checkProd1']) {
      selectedproductIds.push(requestProducts[0].id);
      selectedproduct.push(requestProducts[0]);
    }
    if (Seller['checkProd2']) {
      selectedproductIds.push(requestProducts[1].id);
      selectedproduct.push(requestProducts[1]);
    }
    if (Seller['checkProd3']) {
      selectedproductIds.push(requestProducts[2].id);
      selectedproduct.push(requestProducts[2]);
    }
    if (Seller['checkProd4']) {
      selectedproductIds.push(requestProducts[3].id);
      selectedproduct.push(requestProducts[3]);
    }
    if (Seller['checkProd5']) {
      selectedproductIds.push(requestProducts[4].id);
      selectedproduct.push(requestProducts[4]);
    }
    if (Seller.requestOffers !== undefined && Seller.requestOffers.length > 0) {
      rfqId = Seller.requestOffers[0].rfqId;
      //isRfqSkipped = Seller.requestOffers[0].isRfqskipped;
    }
    return {
      RequestLocationSellerId: Seller.id,
      SellerId: Seller.sellerCounterpartyId,
      RequestLocationId: Seller.requestLocationId,
      LocationID: Seller.locationId,
      RequestId: Request.id,
      physicalSupplierCounterpartyId: Seller.physicalSupplierCounterpartyId,
      RequestProductIds: selectedproductIds,
      RequestProducts: selectedproduct,
      RfqId: rfqId,
      RequestOffers: Seller.requestOffers?.filter(row =>
        selectedproductIds.includes(row.requestProductId)
      )
    };
  }

  noQuoteAction(params, type) {

    this.FilterselectedRowForRFQ();
    let requestOfferIds = [];
    this.selectedSellerList.forEach(e => {
      if (e.RequestOffers && e.RequestOffers.length > 0)
        requestOfferIds.push([...e.RequestOffers.map(e => e)]);
    });
    requestOfferIds = requestOfferIds.reduce((acc, val) => acc.concat(val), []); // flatten array
    if (requestOfferIds.length == 0) {
      this.toastr.warning(
        "Offer Price cannot be marked as 'No Quote' as RFQ has neither been skipped or sent."
      );
      return;
    }
    if (type == 'enable-quote') {
      let quotedElements = _.filter(requestOfferIds, e => {
        return !e.hasNoQuote;
      });
      if (quotedElements && quotedElements.length) {
        this.toastr.warning(
          'Enable Quote can be applied only on Offer Price marked as No Quote'
        );
        return;
      }
    } else if (type == 'no-quote') {
      let quotedElements = _.filter(requestOfferIds, e => {
        return e.hasNoQuote;
      });
      if (quotedElements && quotedElements.length) {
        this.toastr.warning(
          'Cannot perform the action. Please check the selections made!'
        );
        return;
      }
    }
    let noQuotePayload = {
      requestOfferIds: requestOfferIds.map(e => e.id),
      noQuote: type === 'no-quote' ? true : false
    };
    let response = this._spotNegotiationService.switchReqOffBasedOnQuote(
      noQuotePayload
    );
    this.spinner.show();
    response.subscribe((res: any) => {
      if (res) {
        let successMessage =
          type === 'enable-quote'
            ? 'Selected Offer Price has been enabled.'
            : "Selected Offers have been marked as 'No Quote' successfully.";
        this.toastr.success(successMessage,'',{timeOut: 800});
        this.getSellerLineDetails();
      } else {
        this.spinner.hide();
        this.toastr.error('An error has occurred!');
      }
    });
  }
  public  checkIfRequestOffersHasNoQuote1 = (index) =>{
    if (
      this.paramsDataCloneForNoQuote &&
      this.paramsDataCloneForNoQuote.requestOffers &&
      this.paramsDataCloneForNoQuote.requestOffers[index] &&
      this.paramsDataCloneForNoQuote.requestOffers[index].hasNoQuote
    ) {
      return true;
    }
    return false;
  }

  checkIfRequestOffersHasNoQuote(index) {
    if (
      this.paramsDataCloneForNoQuote &&
      this.paramsDataCloneForNoQuote.requestOffers &&
      this.paramsDataCloneForNoQuote.requestOffers[index] &&
      this.paramsDataCloneForNoQuote.requestOffers[index].hasNoQuote
    ) {
      return true;
    }
    return false;
  }

  getSellerLineDetails() {
    const groupId = parseFloat(this.route.snapshot.params.spotNegotiationId);
    const requestLocationSellerId = this.params.data.id;
    this._spotNegotiationService
      .getPriceDetailsById(groupId, requestLocationSellerId)
      .subscribe(async (priceDetailsRes: any) => {
        this.spinner.hide();
        let updatedRow = { ...this.params.data };
        updatedRow.totalOffer = priceDetailsRes.sellerOffers[0].totalOffer;
        updatedRow.totalCost = priceDetailsRes.sellerOffers[0].totalCost;
        updatedRow.requestOffers =
          priceDetailsRes.sellerOffers[0].requestOffers;
        updatedRow.requestAdditionalCosts = priceDetailsRes.sellerOffers[0].requestAdditionalCosts;
        // Update the store
        var locRow = await this.spotNegotiationPriceCalcService.checkAdditionalCost(
          updatedRow,
          updatedRow);
          locRow.requestOffers = locRow.requestOffers?.sort((a, b) =>
          a.requestProductTypeOrderBy === b.requestProductTypeOrderBy
            ? a.requestProductId > b.requestProductId
              ? 1
              : -1
            : a.requestProductTypeOrderBy > b.requestProductTypeOrderBy
            ? 1
            : -1
        );
        this.store.dispatch(new EditLocationRow(locRow));
        this._spotNegotiationService.callGridRedrawService();
        this.params.node.setData(updatedRow);
      });
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
            item.requestId === this.params.data.requestId &&
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
        this.toastr.success('Phy. Supplier added successfully','',{timeOut: 800});
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
