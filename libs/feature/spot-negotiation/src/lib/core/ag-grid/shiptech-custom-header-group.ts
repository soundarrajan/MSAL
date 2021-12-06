import { Observable, pipe } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, ViewChildren } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import { SpotNegotiationService } from '../../services/spot-negotiation.service';
import { AddCounterpartyToLocations } from '../../store/actions/ag-grid-row.action';
import { AvailabletermcontractspopupComponent } from '../../views/main/details/components/spot-negotiation-popups/availabletermcontractspopup/availabletermcontractspopup.component';
import { MarketpricehistorypopupComponent } from '../../views/main/details/components/spot-negotiation-popups/marketpricehistorypopup/marketpricehistorypopup.component';

import { SpotnegoOfferpricehistoryComponent } from '../../views/main/details/components/spot-negotiation-popups/spotnego-offerpricehistory/spotnego-offerpricehistory.component';
import { SpnegoAddCounterpartyModel } from '../models/spnego-addcounterparty.model';
import { TenantFormattingService } from '../../../../../../core/src/lib/services/formatting/tenant-formatting.service';
import { DecimalPipe } from '@angular/common';
import { SpotnegoSearchCtpyComponent } from '../../views/main/details/components/spot-negotiation-popups/spotnego-counterparties/spotnego-searchctpy.component';
import { SpotNegotiationStore, SpotNegotiationStoreModel } from '../../store/spot-negotiation.store';
import { count, filter, map } from 'rxjs/operators';
import moment from 'moment';

@Component({
  selector: 'app-loading-overlay',
  template: `
    <div class="grid-header" *ngIf="params.type == 'plain-header'">
      <div class="title">
        <span
          class="add-icon"
          [matMenuTriggerFor]="clickmenu"
          #menuTrigger="matMenuTrigger"
        ></span>
        <mat-menu #clickmenu="matMenu" class="add-new-request-menu">
          <div class="expansion-popup" style="margin: 20px 0px;">
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
                  <span
                    class="expand-img"
                    (click)="openCounterpartyPopup(params.reqLocationId)"
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
                      <mat-checkbox
                        [value]="element"
                        (change)="onCounterpartyCheckboxChange($event, element)"
                      >
                        {{ limitStrLength(element.name, 25) }}
                      </mat-checkbox>
                    </mat-option>
                  </td>
                </ng-container>
                <ng-container matColumnDef="blank">
                  <th mat-header-cell *matHeaderCellDef></th>
                  <td mat-cell *matCellDef="let element"></td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="counterpartyColumns"></tr>
                <tr
                  mat-row
                  *matRowDef="let row; columns: counterpartyColumns"
                ></tr>
              </table>

              <div class="proceed-div">
                <button
                  mat-button
                  class="mid-blue-button proceed-btn"
                  (click)="addCounterpartiesToLocation(params.reqLocationId)"
                >
                  Proceed
                </button>
              </div>
            </div>
          </div>
        </mat-menu>
        <div class="text">Counterparty Details</div>
        <div class="count">{{ params.selectedSellersCount }}</div>
      </div>
      <!--<div class="action">
        <div class="search"></div>
        <div class="menu"></div>
        <div class="filter"></div>
    </div>-->
      <div style="border-bottom: 3px solid #E0E1E4; margin: 10px -30px;"></div>
      <div style="float:right;">
        <span
          style="margin-left: 10px;"
          class="counterpartytype-icon type-seller"
          ><i class="fas fa-circle"></i> <span class="text">Seller</span></span
        >
        <span
          style="margin-left: 10px;"
          class="counterpartytype-icon type-broker"
          ><i class="fas fa-circle"></i> <span class="text">Broker</span></span
        >
        <span
          style="margin-left: 10px;"
          class="counterpartytype-icon type-physicalsupplier"
          ><i class="fas fa-circle"></i>
          <span class="text">Physical Supplier</span></span
        >
        <span
          style="margin-left: 10px;"
          class="counterpartytype-icon type-sludge"
          ><i class="fas fa-circle"></i>
          <span class="text">Sludge</span></span
        >
      </div>
    </div>
    <div
      class="resize-grid-header"
      style="position: relative;"
      *ngIf="params.type == 'single-bg-header'"
    >
      <div class="border-line"></div>
      <div class="options" style="padding-top: 5px;padding-bottom:10px; ">
        <div class="checkBox w-100" style="padding-top:0px;">
          Total Offer
        </div>
      </div>
      <div class="label" matTooltip="No. of Products">
        <div class="label-content" style="width:95%;">
        <div class="label-element w-100" style="width:100%;">
        <div class="title">No. of Products</div>
        <div class="value">{{ params.noOfProducts }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="resize-grid-header" *ngIf="params.type == 'bg-header'">
      <div class="options">
        <div class="checkBox" matTooltip="{{params.product.productName}}">
          <mat-checkbox class="noborder" [checked]="true">{{
            params.product.productName
          }}</mat-checkbox>
        </div>
        <div class="optionsText">
          <div class="qty">
            <span class="title">Qty:</span>
            <span
              class="value"
              contenteditable="true"
              (keydown)="editQty($event)"
              >{{ params.product.minQuantity }}/{{
                params.product.maxQuantity
              }}
              {{ params.product.uomName }}</span
            >
          </div>
          <div class="arrow" (click)="pricinghistorypopup()">
            <span class="title"  title = "{{ params.product.indexName }}">{{ params.product.indexCode == null ? '--' : params.product.indexCode }}</span>
            <span class="image" ></span>
          </div>
          <div class="offer" (click)="offerpricehistorypopup()">
            <span class="title">Offer</span>
            <span class="image"></span>
          </div>
        </div>
      </div>
      <div class="label">
        <div class="label-content">
          <div class="label-element">
            <div class="title">Closure</div>
            <div
              class="value"
              [matTooltip]="'Pricing published on: ' + quoteDate "
              contenteditable="false"
              (keydown)="editQty($event)"
            >
             $ {{ priceFormatValue(closureValue) }}
            </div>
          </div>
          <div class="label-element" [ngClass]="{'red': params.product?.requestGroupProducts?.benchmark>0, 'green': params.product?.requestGroupProducts?.benchmark<0, 'black': params.product?.requestGroupProducts?.benchmark==0}">
            <div class="title">Perf/BM</div>
            <div
              class="value"
              contenteditable="true"
              (keydown)="editQty($event)"
            >
             $ {{ priceFormatValue(params.product.requestGroupProducts.benchmark) }}
            </div>
          </div>
          <div class="label-element dashed">
            <div class="title">Live price</div>
            $<input
              class="value"
              contenteditable="true"
              [(ngModel)]="livePrice"
              (focusout)="calculateTargetPrice()"
            />
          </div>
          <div class="label-element green">
            <div class="title">Target</div>
            <div
              class="value"
              contenteditable="false"
              (keydown)="editQty($event)"
            >
             $ {{ priceFormatValue(targetValue) }}
            </div>
          </div>
          <div
            class="label-element bestcontract"
            (click)="availabletermcontractpopup()"
          >
            <div class="title">
              Best Contract
              <span class="eye-icon"></span>
            </div>
            <div
              class="value"
              contenteditable="true"
              (keydown)="editQty($event)"
            >
              $559.00
            </div>
          </div>
        </div>
        <div class="resize-icon">
          <div
            class="img resizeIcons"
            [ngClass]="this.expandState"
            (click)="expandOrCollapse(true)"
          ></div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .customHeaderLabel {
        position: fixed;
        width: 100%;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShiptechCustomHeaderGroup {
  //@ViewChildren('resieIcon') el:ElementRef;
  @ViewChildren('resieIcon') resieIcons: ElementRef<HTMLInputElement>;
  public params: any;
  selected = 'eur';
  selected1 = 'bbl';
  isExpand: boolean;
  public resizeIconss: any;
  public expandState: string;
  closureValue:any;
  quoteDate:any;
  targetValue: any;
  livePrice: any;
  benchmark: any;
  requestProductId: any;
  requestLocationId: any;
  public priceFormat = '';

  counterpartyColumns: string[] = ['counterparty', 'blank'];
  counterpartyList = [];
  visibleCounterpartyList = [];
  selectedCounterparty = [];
  currentRequestInfo:any;
  sellersCount$: Observable<number>;

  ngOnInit(): any {
    return this.store.selectSnapshot(({ spotNegotiation }) => {
      this.currentRequestInfo = spotNegotiation.currentRequestSmallInfo;

      // Fetching counterparty list
      if (this.counterpartyList.length === 0 && spotNegotiation.counterpartyList) {
        this.counterpartyList = spotNegotiation.counterpartyList;
        this.visibleCounterpartyList = this.counterpartyList.slice(0, 7);
      }
    });
  }

  constructor(
    @Inject(DecimalPipe)
    private _decimalPipe,
    public dialog: MatDialog,
    private el: ElementRef,
    private store: Store,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private _spotNegotiationService: SpotNegotiationService,
    private changeDetector: ChangeDetectorRef,
    private tenantService: TenantFormattingService,
    @Inject(DOCUMENT) private _document: HTMLDocument
  ) {
    this.targetValue = '';
  }

  onCounterpartyCheckboxChange(checkbox: any, element: any): void {
   if (checkbox.checked) {
      // Add to selected counterparty list
      this.selectedCounterparty.push(element);
    }

    if (!checkbox.checked) {
      // Remove from selected counterparty list
      this.selectedCounterparty = this.selectedCounterparty.filter(
        e => e.id !== element.id
      );
    }
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

  openCounterpartyPopup(reqLocationId: number) {
    let RequestGroupId = 0;
    let currentRequestLocation = { id: '0', locationId: '0' };

    if (this.currentRequestInfo) {
      RequestGroupId = parseInt(this.currentRequestInfo.requestGroupId);

      if(this.currentRequestInfo.requestLocations &&
          this.currentRequestInfo.requestLocations.length > 0){
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
        LocationId: parseInt(currentRequestLocation.locationId),
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  limitStrLength = (text, max_length) => {
    if (text.length > max_length - 3) {
      return text.substring(0, max_length).trimEnd() + '...';
    }

    return text;
  };

  agInit(params: any): void {
    this.params = params;
    if (this.params.product) {
      let formattedLivePrice= this.priceFormatValue(this.params.product.requestGroupProducts.livePrice);
      this.livePrice = formattedLivePrice;
      this.targetValue = this.params.product.requestGroupProducts.targetPrice;
      this.closureValue=this.params.product.requestGroupProducts.closure;
      this.quoteDate=this.params.product.requestGroupProducts.quoteDate;
      this.benchmark = this.params.product.requestGroupProducts.benchmark;
      this.requestProductId = this.params.product.id;
      this.requestLocationId = this.params.requestLocationId;
      this.quoteDate = moment(this.quoteDate).format('DD-MMM-YYYY');
    }

    this.params.columnGroup
      .getOriginalColumnGroup()
      .addEventListener('expandedChanged', this.syncExpandButtons.bind(this));
    this.syncExpandButtons();
  }

  expandOrCollapse(isExpanded) {
    const currentState = this.params.columnGroup
      .getOriginalColumnGroup()
      .isExpanded();

    const groupNames = ['grid1', 'grid2', 'grid3'];
    groupNames.forEach(groupId => {
      this.params.columnApi.setColumnGroupOpened(groupId, !currentState);
    });

    if (currentState) this.params.api.sizeColumnsToFit();
    //this.invokeParentMethod();
  }

  invokeParentMethod(): void {
    this.params.context.componentParent.resizeGrid();
  }

  syncExpandButtons(): void {
    if (this.params.columnGroup.getOriginalColumnGroup().isExpanded()) {
      this.expandState = 'expand';
    } else {
      this.expandState = '';
    }
  }

  offerpricehistorypopup(): void {
    const dialogRef = this.dialog.open(SpotnegoOfferpricehistoryComponent, {
      width: '500vw',
      height: '90vh',
      panelClass: 'additional-cost-popup'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  pricinghistorypopup(): void {
    const dialogRef = this.dialog.open(MarketpricehistorypopupComponent, {
      width: '500vw',
      height: '90vh',
      panelClass: 'additional-cost-popup',
      data: { LocationId : this.currentRequestInfo.requestLocations[0].locationId, ProductId : this.params.product.productId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  availabletermcontractpopup(): void {
    const dialogRef = this.dialog.open(AvailabletermcontractspopupComponent, {
      width: '1164px',
      height: '179px',
      panelClass: 'additional-cost-popup'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  editQty(e: any): any {
    if (e.keyCode === 37 || e.keyCode === 39) {
      e.stopPropagation();
    }
  }

  toBeAddedCounterparties(reqLocation: any): SpnegoAddCounterpartyModel[] {
    if (this.currentRequestInfo) {
      let RequestGroupId = parseInt(this.currentRequestInfo.requestGroupId);

      return this.selectedCounterparty.map(val =>
          <SpnegoAddCounterpartyModel>{
            requestGroupId: RequestGroupId,
            requestId: this.currentRequestInfo.id,
            requestLocationId: parseInt(reqLocation.id),
            locationId: parseInt(reqLocation.locationId),
            id: 0,
            name: '',
            counterpartytypeId: 0,
            counterpartyTypeName: (val.seller)? 'Seller': (val.supplier)? 'Supplier' : (val.broker)? 'Broker' : (val.sludge)? 'Sludge' : '',
            genPrice: '',
            genRating: '',
            isDeleted: false,
            isSelected: true,
            mail: '',
            portPrice: '',
            portRating: '',
            prefferedProductIds: '',
            sellerComments: '',
            sellerCounterpartyId: val.id,
            sellerCounterpartyName: val.name,
            senRating: ''
          }
      );
    } else {
      return Array<SpnegoAddCounterpartyModel>();
    }
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

    if (value == 0) {
      return '--';
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

  calculateTargetPrice() {
    this.livePrice= this.priceFormatValue(this.livePrice);
    this.livePrice = (this.livePrice == null ? 0 : this.livePrice);
    this.targetValue = parseInt(this.livePrice) + parseInt(this.benchmark);
    this.closureValue=parseInt(this.livePrice);
    let payload = {
      "productPrice": {
      "requestLocationId": this.requestLocationId,
      "requestProductId": this.requestProductId,
      "livePrice": parseInt(this.livePrice),
      "targetPrice": parseInt(this.targetValue)
      }
    };
    const response = this._spotNegotiationService.saveTargetPrice(payload);
    response.subscribe((res: any) => {
      if (res.status) {
        //this.toastr.success(res.message);
      } else {
        this.toastr.error(res.message);
        return;
      }
    });
  }

  addCounterpartiesToLocation(reqLocationId: number) {
    const RequestGroupId = this.route.snapshot.params.spotNegotiationId;
    let requestLocation = this.currentRequestInfo.requestLocations.filter(x => x.id === reqLocationId)[0];

    const selectedCounterparties = this.toBeAddedCounterparties(requestLocation);
    if (selectedCounterparties.length == 0) return;

    let payload = {
      requestGroupId: parseInt(RequestGroupId),
      isAllLocation: false,
      counterparties: selectedCounterparties,
      locationName: requestLocation.locationName
    };

    const response = this._spotNegotiationService.addCounterparties(payload);
    response.subscribe((res: any) => {
      if (res.status) {
        this.toastr.success(res.message);
        // Add in Store
        this.store.dispatch(new AddCounterpartyToLocations(res.counterparties));
        this.changeDetector.markForCheck();
      } else {
        this.toastr.error(res.message);
        return;
      }
    });
  }
}
