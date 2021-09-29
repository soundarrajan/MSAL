import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, ViewChildren } from '@angular/core';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import { SpotNegotiationService } from '../../services/spot-negotiation.service';
import { AddCounterpartyToLocations } from '../../store/actions/ag-grid-row.action';
import { AvailabletermcontractspopupComponent } from '../../views/main/details/components/spot-negotiation-popups/availabletermcontractspopup/availabletermcontractspopup.component';
import { MarketpricehistorypopupComponent } from '../../views/main/details/components/spot-negotiation-popups/marketpricehistorypopup/marketpricehistorypopup.component';
import { SpotnegoSearchCtpyComponent } from '../../views/main/details/components/spot-negotiation-popups/spotnego-counterparties/spotnego-searchctpy.component';
import { SpotnegoOfferpricehistoryComponent } from '../../views/main/details/components/spot-negotiation-popups/spotnego-offerpricehistory/spotnego-offerpricehistory.component';
import { SpnegoAddCounterpartyModel } from '../models/spnego-addcounterparty.model';

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
                  <span class="expand-img" (click)="openCounterpartyPopup(params.locationId)"></span>
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
                <button mat-button class="mid-blue-button proceed-btn" (click)="addCounterpartiesToLocation(params.locationId)">
                  Proceed
                </button>
              </div>
            </div>
          </div>
        </mat-menu>
        <div class="text">Counterparty Details</div>
        <div class="count">{{ selectedCounterparty.length }}</div>
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
        <div class="value">{{params.currentReqProdcutsLength}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="resize-grid-header" *ngIf="params.type == 'bg-header'">
      <div class="options">
        <div class="checkBox">
          <mat-checkbox class="noborder" [checked]="true"
            >{{params.product.productName}}</mat-checkbox
          >
        </div>
        <div class="optionsText">
          <div class="qty">
            <span class="title">Qty:</span>
            <span
              class="value"
              contenteditable="true"
              (keydown)="editQty($event)"
              >{{params.product.minQuantity}}/{{params.product.maxQuantity}} {{params.product.uomName}}</span
            >
          </div>
          <div class="arrow" (click)="pricinghistorypopup()">
            <span class="title">ICE Brent</span>
            <span class="image"></span>
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
              contenteditable="true"
              (keydown)="editQty($event)"
            >
              $559.00
            </div>
          </div>
          <div class="label-element red">
            <div class="title">Perf/BM</div>
            <div
              class="value"
              contenteditable="true"
              (keydown)="editQty($event)"
            >
              $559.00
            </div>
          </div>
          <div class="label-element dashed">
          <div class="title">Live price</div>
          $<input
            class="value"
            contenteditable="true"
            [(ngModel)]="LivePrice"
            (ngModelChange)="calculateTargetPrice()"
          />
          </div>
          <div class="label-element green">
            <div class="title">Target</div>
            <div
              class="value"
              contenteditable="false"
              (keydown)="editQty($event)"
            >
            {{targetValue}}
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
  targetValue:any;
  LivePrice : any;

  counterpartyColumns: string[] = ['counterparty', 'blank'];
  counterpartyList = [];
  visibleCounterpartyList = [];
  selectedCounterparty = [];
  currentRequestInfo = [];

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
    public dialog: MatDialog,
    private el: ElementRef,
    private store: Store,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private _spotNegotiationService: SpotNegotiationService,
    private changeDetector: ChangeDetectorRef,
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

  openCounterpartyPopup(locationId){
    let RequestGroupId = 0;
    let currentRequestLocation = {id:"0", locationId:"0"};

    if(this.currentRequestInfo && this.currentRequestInfo.length > 0){
      RequestGroupId = parseInt(this.currentRequestInfo[0].requestGroupId);

      if(this.currentRequestInfo[0].requestLocations
        && this.currentRequestInfo[0].requestLocations.length > 0){
        currentRequestLocation = this.currentRequestInfo[0].requestLocations[0];
        }
    }

    const dialogRef = this.dialog.open(SpotnegoSearchCtpyComponent, {
      width: '100vw',
      height: '95vh',
      maxWidth: '95vw',
      panelClass: 'search-request-popup',
      data:{
        "AddCounterpartiesAcrossLocations":false,
        "RequestGroupId":RequestGroupId,
        "RequestLocationId" : parseInt(currentRequestLocation.id),
        "LocationId" : locationId
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
      panelClass: 'additional-cost-popup'
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

  toBeAddedCounterparties(locationId) : SpnegoAddCounterpartyModel[] {
    if (this.currentRequestInfo && this.currentRequestInfo.length > 0) {

      let RequestGroupId = parseInt(this.currentRequestInfo[0].requestGroupId);
      let currentRequestLocation = this.currentRequestInfo[0].requestLocations
                                  .filter(x=> x.locationId === locationId)[0];

      return this.selectedCounterparty.map(val => <SpnegoAddCounterpartyModel>{
        requestGroupId: RequestGroupId,
        requestLocationId: parseInt(currentRequestLocation.id),
        locationId: parseInt(currentRequestLocation.locationId),
        id: 0,
        name: "",
        counterpartytypeId: 0,
        counterpartyTypeName: "",
        genPrice: "",
        genRating: "",
        isDeleted: false,
        isSelected: true,
        mail: "",
        portPrice: "",
        portRating: "",
        prefferedProductIds: "",
        sellerComments: "",
        sellerCounterpartyId: val.id,
        sellerCounterpartyName: val.name,
        senRating: "",
      });
    }
    else {
      return Array<SpnegoAddCounterpartyModel>();
    }
  }
  calculateTargetPrice(){
    //yet to be implemented(waiting for backend changes)
    this.targetValue=this.LivePrice+10;
   }
  addCounterpartiesToLocation(locationId){
    const selectedCounterparties = this.toBeAddedCounterparties(locationId);
    if(selectedCounterparties.length == 0)
      return;

    const RequestGroupId = this.route.snapshot.params.spotNegotiationId;
    let payload = {
      "requestGroupId": parseInt(RequestGroupId),
      "isAllLocation": false,
      "counterparties": selectedCounterparties
    };

    const response = this._spotNegotiationService.addCounterparties(payload);
    response.subscribe((res: any) => {
      if (res.status) {
        this.toastr.success(res.message);
        // Add in Store
        this.store.dispatch(new AddCounterpartyToLocations(payload.counterparties));
        this.changeDetector.markForCheck();
      }
      else{
        this.toastr.error(res.message);
        return;
      }
    });
  }
}
