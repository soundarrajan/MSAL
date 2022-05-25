import { Observable, pipe } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, ViewChildren } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import { SpotNegotiationService } from '../../services/spot-negotiation.service';
import {
  AddCounterpartyToLocations,
  AppendLocationsRowsOriData,
  EditLocationRow,
  EditLocations,
  UpdateRequest
} from '../../store/actions/ag-grid-row.action';
import { MarketpricehistorypopupComponent } from '../../views/main/details/components/spot-negotiation-popups/marketpricehistorypopup/marketpricehistorypopup.component';

import { SpotnegoOfferpricehistoryComponent } from '../../views/main/details/components/spot-negotiation-popups/spotnego-offerpricehistory/spotnego-offerpricehistory.component';
import { SpnegoAddCounterpartyModel } from '../models/spnego-addcounterparty.model';
import { TenantFormattingService } from '../../../../../../core/src/lib/services/formatting/tenant-formatting.service';
import { DecimalPipe } from '@angular/common';
import { SpotnegoSearchCtpyComponent } from '../../views/main/details/components/spot-negotiation-popups/spotnego-counterparties/spotnego-searchctpy.component';

import moment from 'moment';
import { BestcontractpopupComponent } from '../../views/main/details/components/spot-negotiation-popups/bestcontractpopup/bestcontractpopup.component';
import _, { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';

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
                (click)="$event.preventDefault()"
              >
                <div class="search-product-container col-md-10">
                  <span class="search-product-lookup"> </span>
                  <input
                    matInput
                    placeholder="Search and select counterparty"
                    class="search-product-input"
                    (click)="$event.stopPropagation()"
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
          ><i class="fas fa-circle"></i> <span class="text">Sludge</span></span
        >
      </div>
    </div>
    <div
      class="resize-grid-header"
      style="position: relative;"
      *ngIf="params.type == 'single-bg-header'"
    >
      <div class="border-line"></div>
      <div class="options">
        <div class="checkBox w-100" matTooltip="Total offer" matTooltipClass="lightTooltip" style="padding-top:0px;">
          Total Offer
        </div>
      </div>
      <div class="label" matTooltipClass="lightTooltip" matTooltip="No. of Products">
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
        <div class="checkBox" matTooltipClass="lightTooltip" matTooltip="{{ params.product.productName }}">
          <!-- <mat-checkbox class="noborder" [checked]="true">{{
            params.product.productName
          }}</mat-checkbox> -->
          <span class="noborder" style="padding: 4px !important">
            {{ params.product.productName }}
          </span>
        </div>
        <div class="optionsText">
          <div class="qty" matTooltipClass="lightTooltip" matTooltip="Min - Max quantities">
            <span class="title"style="font-size:12px">Qty:</span>
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
          <div
            class="arrow"
            [ngClass]="
              params.product.status === 'Stemmed' ? 'disabled-new-events' : ''
            "
            (click)="pricinghistorypopup(params)"
          >
            <span class="title" title="{{ params.product.indexName }}">{{
              params.product.indexCode == null ? '--' : params.product.indexCode
            }}</span>
            <span class="image"></span>
          </div>
          <div class="offer" (click)="offerpricehistorypopup(params)" matTooltipClass="lightTooltip" matTooltip="Offer price history">
            <span class="title">Offer</span>
            <span class="image"></span>
          </div>
        </div>
      </div>
      <div class="label">
        <div class="label-content">
          <div
            class="label-element" matTooltipClass="lightTooltip"
            [matTooltip]="
              (params.product.status.toLowerCase() != 'stemmed' &&
              !isLatestClosurePrice
                ? 'Price Outdated. Last published on: '
                : 'Pricing published on: ') +
              (this.closureDate == 'Invalid date' ? '--' : this.closureDate)
            "
            matTooltipClass="lightTooltip"
          >
            <div class="title">
              <span
                class="info-icon-amber"
                *ngIf="
                  params.product.status.toLowerCase() != 'stemmed' &&
                  !isLatestClosurePrice
                "
              ></span>
              Closure
            </div>
            <div
              class="value"
              [ngClass]="
                params.product.status === 'Stemmed' ? 'disabled-gray' : ''
              "
              contenteditable="false"
              (keydown)="editQty($event)"
            >
              {{ '$'+tenantService.FormatPriceTrailingZero(closureValue,'closure') }}
            </div>
          </div>
          <div
            class="label-element"
            [ngClass]="{
              red: params.product?.requestGroupProducts?.benchMark > 0,
              green: params.product?.requestGroupProducts?.benchMark < 0,
              black: params.product?.requestGroupProducts?.benchMark == 0
            }"
          >
            <div class="title">Perf/BM</div>
            <div 
              class="value" matTooltip="{{perfBM.innerText}}"
              matTooltipClass="lightTooltip"
              contenteditable="false"
              [ngClass]="
                params.product.status === 'Stemmed' ? 'input-disabled-new' : ''
              "
              #perfBM
            >
            <span>
            {{ '$' +
            tenantService.FormatPriceTrailingZero(
                  params.product.requestGroupProducts.benchMark,
                  'benchMark'
                )
              }}
            </span>
            </div>
          </div>
          <div class="label-element dashed" matTooltipClass="lightTooltip" matTooltip="{{ livePrice != undefined ? '$'+livePrice : '$--'}}">
            <div class="title">Manual Live price</div>
            $<input
              class="value"
              
              contenteditable="true"
              [(ngModel)]="livePrice"
              (change)="calculateTargetPrice()"
              [disabled]="
                params.product.status === 'Stemmed' ||
                params.product.status === 'Confirmed'
              "
            />
          </div>
          <div class="label-element green">
            <div class="title">Target</div>
            <div
              class="value" matTooltip="{{(targetValue  != null && targetValue  != 0) ? '$'+targetValue : '$--'}}"
              matTooltipClass="lightTooltip"
              contenteditable="false"
              (keydown)="editQty($event)"
            >
              $ {{ tenantService.FormatPriceTrailingZero(targetValue,'target') }}
            </div>
          </div>
          <div
            class="label-element bestcontract"
            (click)="bestcontractpopup(params)"
          >
            <div class="title">
              Best Contract
              <span
                [style.visibility]="
                  params.product.status === 'Stemmed' ? 'hidden' : 'visible'
                "
                class="eye-icon"
              ></span>
            </div>
            <div
              class="value"
              (keydown)="editQty($event)" matTooltipClass="lightTooltip"
              [matTooltip]="
                'Contract Id: ' +
                (this.bestContractId ? this.bestContractId : '--')
              "
              [ngClass]="
                params.product.status === 'Stemmed' ? 'disabled-gray' : ''
              "
            >
              {{ getBestContractPrice(params) }}
            </div>
          </div>
        </div>
        <div class="resize-icon" style="display: none;">
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
  closureValue: any;
  quoteDate: any;
  closureDate: any;
  bestContractId: any;
  targetValue: any;
  livePrice: any;
  benchMark: any;
  requestProductId: any;
  requestLocationId: any;
  public priceFormat = '';
  counterpartyColumns: string[] = ['counterparty', 'blank'];
  counterpartyList = [];
  visibleCounterpartyList = [];
  selectedCounterparty = [];
  currentRequestData: any[];
  currentRequestInfo: any;
  sellersCount$: Observable<number>;
  availableContracts = [];
  requests: any;
  isLatestClosurePrice: boolean = false;
  locations: any;
  ngOnInit(): any {
    this.store.selectSnapshot(({ spotNegotiation }) => {
      this.currentRequestInfo = spotNegotiation.currentRequestSmallInfo;
      this.availableContracts = spotNegotiation.availableContracts;
      this.requests = spotNegotiation.requests;
      // Fetching counterparty list
      if (
        this.counterpartyList.length === 0 &&
        spotNegotiation.counterpartyList
      ) {
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
    public tenantService: TenantFormattingService,
    private spinner: NgxSpinnerService,
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
    if (this.visibleCounterpartyList.length === 0) {
      const response = this._spotNegotiationService.getResponse(
        null,
        { Filters: [] },
        { SortList: [] },
        [{ ColumnName: 'CounterpartyTypes', Value: '1,2,3,11' }],
        userInput.toLowerCase(),
        { Skip: 0, Take: 25 }
      );
      response.subscribe((res: any) => {
        if (res?.payload?.length > 0) {
          this.visibleCounterpartyList = res.payload.slice(0, 7);
          this.changeDetector.detectChanges();
        }
      });
    }
  }

  openCounterpartyPopup(reqLocationId: number) {
    let RequestGroupId = 0;
    let currentRequestLocation = { id: '0', locationId: '0' };

    if (this.currentRequestInfo) {
      RequestGroupId = parseInt(this.currentRequestInfo.requestGroupId);

      if (
        this.currentRequestInfo.requestLocations &&
        this.currentRequestInfo.requestLocations.length > 0
      ) {
        currentRequestLocation = this.currentRequestInfo.requestLocations.filter(
          x => x.id == reqLocationId
        );
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
        RequestLocationId: currentRequestLocation[0].id,
        LocationId: currentRequestLocation[0].locationId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this._spotNegotiationService.callGridRefreshService();
    });
  }

  limitStrLength = (text, max_length) => {
    if (text.length > max_length - 3) {
      return text.substring(0, max_length).trimEnd() + '...';
    }

    return text;
  };

  agInit(params: any): void {
    this.params = params;
    this.store.selectSnapshot(({ spotNegotiation }) => {
      this.locations = spotNegotiation.locations;
    });

    if (this.params.product) {
      this.bestContractId = this.params.product.requestGroupProducts.bestContractId;
      this.requestProductId = this.params.product.id;
      this.requestLocationId = this.params.requestLocationId;
      this.quoteDate = moment(this.quoteDate).format('DD-MMM-YYYY');
      if (this.locations) {
        let requestLoc = this.locations.find(
          l => l.id == this.requestLocationId
        );
        if (requestLoc?.requestProducts) {
          let updatedProdLivePrice = requestLoc.requestProducts.find(
            p => p.id == this.requestProductId
          );
          let formattedLivePrice = this.tenantService.FormatPriceTrailingZero(
            updatedProdLivePrice.requestGroupProducts.livePrice,
            'livePrice'
          );
          this.livePrice = this.tenantService.liveformat(formattedLivePrice);
          this.targetValue =
            updatedProdLivePrice.requestGroupProducts.targetPrice;
          this.closureValue =
            updatedProdLivePrice.requestGroupProducts.closurePrice;
          this.isLatestClosurePrice =
            updatedProdLivePrice.requestGroupProducts.isLatestClosurePrice;
          this.closureDate = moment(
            updatedProdLivePrice.requestGroupProducts.closureDate
          ).format('DD-MMM-YYYY');
          this.benchMark = updatedProdLivePrice.requestGroupProducts.benchMark;
        }
      }
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

  offerpricehistorypopup(params: any) {
    const dialogRef = this.dialog.open(SpotnegoOfferpricehistoryComponent, {
      width: '40vw',
      panelClass: 'additional-cost-popup',
      data: {
        LocationName: this.currentRequestInfo.requestLocations.find(
          x => x.id == params.requestLocationId
        )?.locationName,
        ProductName: params.product.productName,
        RequestLocationId: params.requestLocationId,
        RequestProductId: params.product.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  pricinghistorypopup(params: any): void {
    const reqLocation = this.currentRequestInfo.requestLocations.find(
      x => x.id == params.requestLocationId
    );
    const dialogRef = this.dialog.open(MarketpricehistorypopupComponent, {
      width: '500vw',
      height: '90vh',
      panelClass: 'additional-cost-popup',
      data: {
        LocationId: reqLocation.locationId,
        ProductId: this.params.product.productId,
        RequestId: this.currentRequestInfo.id,
        indexName: params.product.indexName,
        locationName: reqLocation.locationName,
        productName: params.product.productName
      }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  bestcontractpopup(params): void {
    if (!this.availableContracts) {
      return;
    }
    if (params.product.status !== 'Stemmed') {
      let currentCellContracts = this.availableContracts.filter(el => {
        return (
          el.requestProductId == params.product.id &&
          el.requestLocationId == params.requestLocationId
        );
      });
      if (currentCellContracts.length == 0) {
        this.toastr.info('No Contracts available');
        return;
      }
      const dialogRef = this.dialog.open(BestcontractpopupComponent, {
        width: '1164px',
        panelClass: 'best-contract-popup',
        data: {
          data: currentCellContracts,
          info: {
            locationName: params.product.productName,
            productName: params.product.productName
          }
        }
      });
    }
  }

  getBestContractPrice(params): any {
    if (this.availableContracts && params.product.status !== 'Stemmed') {
      let currentCellContracts = this.availableContracts.filter(el => {
        return (
          el.requestProductId == params.product.id &&
          el.requestLocationId == params.requestLocationId
        );
      });
      let prices = Object.keys(currentCellContracts).map(function(key) {
        return currentCellContracts[key].fixedPrice;
      });

      let min = Math.min.apply(null, prices);
      let contractIds =
        currentCellContracts.length > 0
          ? currentCellContracts.filter(a => a.fixedPrice == min)
          : [];
      this.bestContractId = contractIds[0]?.contract.id;
      if (min !== null && min != 'Infinity') {
        return `$ ${this.tenantService.FormatPriceTrailingZero(min, 'benchMark')}`;
      }
    } else if (params.product.status === 'Stemmed') {
      let requestGroup, prices;
      this.requests.forEach(req => {
        req.requestLocations.forEach(reqLoc => {
          if (
            reqLoc.requestProducts.length > 0 &&
            reqLoc.id == params.requestLocationId
          ) {
            requestGroup = reqLoc.requestProducts.filter(reqProd => {
              return reqProd.id == params.product.id;
            });
          }
        });
      });
      this.closureValue = requestGroup[0].requestGroupProducts.closurePrice;
      this.isLatestClosurePrice =
        requestGroup[0].requestGroupProducts.isLatestClosurePrice;
      this.closureDate = moment(
        requestGroup[0].requestGroupProducts.closureDate
      ).format('DD-MMM-YYYY');
      this.benchMark = requestGroup[0].requestGroupProducts.benchMark;
      this.bestContractId = requestGroup[0].requestGroupProducts.bestContractId;
      prices = Object.keys(requestGroup).map(function(key) {
        return requestGroup[key].requestGroupProducts.bestContract;
      });
      let min = Math.min.apply(null, prices);
      if (min !== null && min != 'Infinity') {
        return `$ ${this.tenantService.FormatPriceTrailingZero(min, 'benchMark')}`;
      }
    }
    return '--';
  }

  editQty(e: any): any {
    if (e.keyCode === 37 || e.keyCode === 39) {
      e.stopPropagation();
    }
  }

  toBeAddedCounterparties(reqLocation: any): SpnegoAddCounterpartyModel[] {
    if (this.currentRequestInfo) {
      let RequestGroupId = parseInt(this.currentRequestInfo.requestGroupId);

      return this.selectedCounterparty.map(
        val =>
          <SpnegoAddCounterpartyModel>{
            requestGroupId: RequestGroupId,
            requestId: this.currentRequestInfo.id,
            requestLocationId: parseInt(reqLocation.id),
            locationId: parseInt(reqLocation.locationId),
            id: 0,
            name: '',
            counterpartytypeId: 0,
            counterpartyTypeName: val.seller
              ? 'Seller'
              : val.supplier
              ? 'Supplier'
              : val.broker
              ? 'Broker'
              : val.sludge
              ? 'Sludge'
              : '',
            genPrice: '',
            genRating: '',
            isDeleted: false,
            isSelected: true,
            mail: '',
            portPrice: '',
            portRating: '',
            prefferedProductIds: '',
            sellerComments: '',
            isSellerPortalComments: false,
            sellerCounterpartyId: val.id,
            sellerCounterpartyName: val.name,
            senRating: ''
          }
      );
    } else {
      return Array<SpnegoAddCounterpartyModel>();
    }
  }
  priceFormatValue(value, type?: any) {

    if (typeof value == 'undefined' || value == null) {
      return type == 'benchMark' || 'closure' ? '--' : null;
    }

    if (value == 0) {
      return type == 'benchMark' ? value : '--';
    }
    let format = /[^\d|\-+|\.+]/g;
    let plainNumber;
    value = value.toString().replace(/,/g, '');
    if (format.test(value.toString()) && type == 'livePrice') {
      this.toastr.warning('Live price should be a numeric value ');
      plainNumber = '';
    } else {
      plainNumber = value.toString().replace(format, '');
    }

    const number = parseFloat(plainNumber);

    if (isNaN(number)) {
      return null;
    }

    let productPricePrecision = this.tenantService.pricePrecision;

    let num = plainNumber.split('.', 2);
    //Live Price to follow precision set at tenant. Ignore the precision, if the decimal values are only 0s
    if (plainNumber == num && type == 'livePrice' ) {
      this.priceFormat = '';
    } else {
      this.priceFormat =
        '1.' + productPricePrecision + '-' + productPricePrecision;
    }

    if (plainNumber) {
      if (!productPricePrecision) {
        plainNumber = Math.trunc(plainNumber);
      }
      if (type && type == 'benchMark') {
        plainNumber = Math.abs(parseFloat(plainNumber));
      }
      plainNumber = this._decimalPipe.transform(plainNumber, this.priceFormat);
      return plainNumber;
      //Need to show perf/BM like if discount, just display the value in green font. incase of premium it will be red font    
      // // var numVal = plainNumber.toString().replace(/[^\d\.\-]/, "");
      // // var valWithoutZero = parseFloat(numVal);
      // // var valWithCommas= valWithoutZero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");  
      // // return valWithCommas;
    }
  }
  calculateTargetPrice() {
    this.spinner.show();
    const RequestGroupId = this.route.snapshot.params.spotNegotiationId;
    this.livePrice = this.tenantService.FormatPriceTrailingZero(this.livePrice, 'livePrice');
    this.livePrice =
      this.livePrice == null || this.livePrice == '--' ? 0 : this.livePrice;
    this.benchMark =
      this.benchMark == null || this.benchMark == '--' ? 0 : this.benchMark;
    const targetval =
      parseFloat(this.livePrice.toString().replace(/,/g, '')) + this.benchMark;
    this.targetValue = parseFloat(targetval.toString());
    //this.closureValue=parseInt(this.livePrice);
    let payload = {
      productPrice: {
        requestGroupId: parseInt(RequestGroupId),
        requestLocationId: this.requestLocationId,
        requestProductId: this.requestProductId,
        livePrice: this.livePrice.toString().replace(/,/g, ''),
        targetPrice: this.targetValue
      }
    };
    const response = this._spotNegotiationService.saveTargetPrice(payload);
    response.subscribe((res: any) => {
      this.spinner.hide();
      if (res.status) {
        let locations = [];
        let locationsRows = [];
        locations = this.store.selectSnapshot<any>((state: any) => {
          return state.spotNegotiation.locations;
        });
        locationsRows = this.store.selectSnapshot<any>((state: any) => {
          return state.spotNegotiation.locationsRows;
        });

        let reqs = this.store.selectSnapshot<any>((state: any) => {
          return state.spotNegotiation.requests;
        });

        reqs = reqs.map(e => {
          let requestLocations = e.requestLocations.map(reqLoc => {
            let requestProducts = reqLoc.requestProducts.map(reqProd => {
              if(reqProd.id == this.requestProductId){
                let requestGroupProducts = _.cloneDeep(reqProd.requestGroupProducts);
                  requestGroupProducts.targetPrice = this.targetValue;
                  requestGroupProducts.livePrice = this.livePrice.toString().replace(/,/g, '');
                  return { ...reqProd, requestGroupProducts };
              }
              return reqProd;
            });
            return { ...reqLoc, requestProducts };           
          });
           return { ...e, requestLocations };
        });
        if (locations.length > 0) {
          locations.forEach(element => {
            if (
              element.id == this.requestLocationId &&
              element.requestProducts
            ) {
              let filterLocationsRows = _.filter(locationsRows, function(elem) {
                return elem.requestLocationId == element.id;
              });
              let updatedLocRows = [];                          
              element.requestProducts.forEach((element1, index) => {
                if (
                  element1.id == this.requestProductId &&
                  element1.requestGroupProducts
                ) {
                  let updatedRow1 = Object.assign({}, element);
                  updatedRow1 = this.updateprice(
                    JSON.parse(JSON.stringify(updatedRow1)),
                    index
                  );
                  this.store.dispatch([new EditLocations(updatedRow1), new UpdateRequest(reqs)]);
                  for (let i = 0; i < filterLocationsRows.length; i++) {
                    const productDetails = this.getRowProductDetails(
                      filterLocationsRows[i],
                      updatedRow1.requestProducts[index].id
                    );
                    this.updateTargetDifference(
                      productDetails,
                      updatedRow1.requestProducts[index]
                    );

                    let futureRow = this.setRowProductDetails(
                      filterLocationsRows[i],
                      productDetails,
                      updatedRow1.requestProducts[index].id
                    );
                    updatedLocRows.push(futureRow); 
                  }
                }
              });
              if(updatedLocRows && updatedLocRows.length > 0)
                  this.store.dispatch(new EditLocationRow(updatedLocRows));
            }
          });
        }
      } else {
        this.toastr.error(res.message);
        return;
      }
    });
  }

  updateprice(updaterow, index) {
    updaterow.requestProducts[
      index
    ].requestGroupProducts.livePrice = this.livePrice;
    updaterow.requestProducts[
      index
    ].requestGroupProducts.targetPrice = this.targetValue;
    return updaterow;
  }

  setRowProductDetails(row, details, productId) {
    // returns a row;
    let futureRow = JSON.parse(JSON.stringify(row));

    if (!futureRow.requestOffers) {
      return futureRow;
    }

    for (let i = 0; i < futureRow.requestOffers.length; i++) {
      if (futureRow.requestOffers[i].requestProductId == productId) {
        futureRow.requestOffers[i] = details;
        break;
      }
    }
    return futureRow;
  }

  getRowProductDetails(row, productId) {
    let futureRow = JSON.parse(JSON.stringify(row));

    const emptyPriceDetails = {
      amount: null,
      contactCounterpartyId: null,
      currencyId: null,
      id: null,
      offerId: null,
      price: null,
      priceQuantityUomId: null,
      quotedProductId: null,
      requestProductId: productId,
      targetDifference: null,
      totalPrice: null
    };

    if (!futureRow.requestOffers) {
      return emptyPriceDetails;
    }

    const priceDetails = futureRow.requestOffers.find(
      item => item.requestProductId === productId
    );

    if (priceDetails) {
      return priceDetails;
    }

    return emptyPriceDetails;
  }

  updateTargetDifference(productDetails, product) {
    // Target Difference = Total Price - Target Price
    productDetails.targetDifference = productDetails.totalPrice
      ? productDetails.totalPrice -
        (product.requestGroupProducts
          ? product.requestGroupProducts.targetPrice
          : 0)
      : null;
    productDetails.targetDifference =
      product.requestGroupProducts.targetPrice == 0
        ? 0
        : productDetails.targetDifference;
  }

  addCounterpartiesToLocation(reqLocationId: number) {
    const RequestGroupId = this.route.snapshot.params.spotNegotiationId;
    let requestLocation = this.currentRequestInfo.requestLocations.filter(
      x => x.id === reqLocationId
    )[0];

    const selectedCounterparties = this.toBeAddedCounterparties(
      requestLocation
    );
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
        // this.store.dispatch(new AddCounterpartyToLocations(res.counterparties));
        // let Counterparties = clone(res.counterparties)
        //if(res.sellerOffers?.length>0){
        const futureLocationsRows = this.getLocationRowsWithPriceDetails(
          res.counterparties,
          res.sellerOffers
        );
        //this.store.dispatch(new AddCounterpartyToLocationsWithOffers(futureLocationsRows));
        // }
        // else
        this.store.dispatch(
          [new AddCounterpartyToLocations(futureLocationsRows), new AppendLocationsRowsOriData(futureLocationsRows)]
        );
        this.changeDetector.markForCheck();
      } else {
        this.toastr.error(res.message);
        return;
      }
    });
  }

  UpdateProductsSelection(requestLocations, row) {
    if (requestLocations.length != 0) {
      let currentLocProdCount = requestLocations[0].requestProducts.length;
      for (let index = 0; index < currentLocProdCount; index++) {
        let indx = index + 1;
        let val = 'checkProd' + indx;
        const status = requestLocations[0].requestProducts[index].status;
        row[val] =
          status === 'Stemmed' || status === 'Confirmed'
            ? false
            : row.isSelected;
        //row[val] = row.isSelected;
      }
    }
  }

  getLocationRowsWithPriceDetails(rowsArray, priceDetailsArray) {
    let counterpartyList: any;
    //let currencyList: any;
    this.currentRequestData = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locations;
    });
    counterpartyList = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.counterparties;
    });
    // currencyList = this.store.selectSnapshot<any>((state: any) => {
    //   return state.spotNegotiation.staticLists['currency'];
    // });

    let requests = this.store.selectSnapshot<any>((state: any) => {
        return state['spotNegotiation'].requests;
      });

    rowsArray.forEach((row, index) => {
      //let row = { ... reqLocSeller };
      let currentLocProd = this.currentRequestData.filter(
        row1 => row1.locationId == row.locationId
      );
      let requestProducts = requests.find(x => x.id == row.requestId)?.requestLocations?.find(l => l.id ==row.requestLocationId)?.requestProducts;
      this.UpdateProductsSelection(currentLocProd, row);
      // Optimize: Check first in the same index from priceDetailsArray; if it's not the same row, we will do the map bind
      if (
        index < priceDetailsArray?.length &&
        row.id === priceDetailsArray[index]?.requestLocationSellerId
      ) {
        priceDetailsArray[index].requestOffers.forEach(element1 => {
          if (
            element1.requestProductId != undefined &&
            element1.requestProductId != null &&
            this.currentRequestData?.length > 0
          ) {
            if (
              currentLocProd.length > 0 &&
              currentLocProd[0].requestProducts.length > 0
            ) {
              let FilterProdut = currentLocProd[0].requestProducts.filter(
                col => col.id == element1.requestProductId
              );
              element1.requestProductTypeOrderBy = FilterProdut[0]?.productTypeOrderBy;
              if (
                FilterProdut.length > 0 &&
                FilterProdut[0].status != undefined &&
                FilterProdut[0].status == 'Stemmed'
              ) {
                row.isEditable = true;
              }
            }
          }
        });
        row.isSelected = priceDetailsArray[index].isSelected;
        row.physicalSupplierCounterpartyId =
          priceDetailsArray[index].physicalSupplierCounterpartyId;
        if (priceDetailsArray[index].physicalSupplierCounterpartyId) {
          row.physicalSupplierCounterpartyName = counterpartyList.find(
            x => x.id == priceDetailsArray[index].physicalSupplierCounterpartyId
          ).displayName;
        }
        row.totalOffer = priceDetailsArray[index].totalOffer;
        row.totalCost = priceDetailsArray[index].totalCost;
        row.requestAdditionalCosts = priceDetailsArray[index].requestAdditionalCosts;
        row.isRfqSend = row.requestOffers?.some(off => off.isRfqskipped === false);
        row.requestOffers = row.requestOffers.map(e => {
          let isStemmed = requestProducts?.find(rp => rp.id == e.requestProductId)?.status;
           return { ...e, reqProdStatus: isStemmed };
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
      if (priceDetailsArray != undefined && priceDetailsArray?.length > 0) {
        const detailsForCurrentRow = priceDetailsArray?.filter(
          e => e?.requestLocationSellerId === row.id
        );

        // We found something
        if (detailsForCurrentRow.length > 0) {
          detailsForCurrentRow[0].requestOffers.forEach(element1 => {
            if (
              element1.requestProductId != undefined &&
              element1.requestProductId != null &&
              this.currentRequestData?.length > 0
            ) {
              if (
                currentLocProd.length > 0 &&
                currentLocProd[0].requestProducts.length > 0
              ) {
                let FilterProdut = currentLocProd[0].requestProducts.filter(
                  col => col.id == element1.requestProductId
                );
                element1.requestProductTypeOrderBy = FilterProdut[0]?.productTypeOrderBy;
                if (
                  FilterProdut.length > 0 &&
                  FilterProdut[0].status != undefined &&
                  FilterProdut[0].status == 'Stemmed'
                ) {
                  row.isEditable = true;
                }
              }
            }
          });
          row.isSelected = detailsForCurrentRow[0].isSelected;
          row.physicalSupplierCounterpartyId =
            detailsForCurrentRow[0].physicalSupplierCounterpartyId;
          if (detailsForCurrentRow[0].physicalSupplierCounterpartyId) {
            row.physicalSupplierCounterpartyName = counterpartyList.find(
              x =>
                x.id == detailsForCurrentRow[0].physicalSupplierCounterpartyId
            ).displayName;
          }

          row.isRfqSend = row.requestOffers?.some(off => off.isRfqskipped === false);
          row.totalOffer = detailsForCurrentRow[0].totalOffer;
          row.totalCost = detailsForCurrentRow[0].totalCost;
          row.requestAdditionalCosts = detailsForCurrentRow[0].requestAdditionalCosts;
          row.requestOffers = row.requestOffers.map(e => {
            let isStemmed = requestProducts?.find(rp => rp.id == e.requestProductId)?.status;
             return { ...e, reqProdStatus: isStemmed };
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
      }

      return row;
    });

    return rowsArray;
  }
}
