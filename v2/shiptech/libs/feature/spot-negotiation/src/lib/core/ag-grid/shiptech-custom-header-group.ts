import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, ViewChildren } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { AddRow, AddSelectedRow } from '../../store/actions/ag-grid-row.action';
import { AvailabletermcontractspopupComponent } from '../../views/main/details/components/spot-negotiation-popups/availabletermcontractspopup/availabletermcontractspopup.component';
import { MarketpricehistorypopupComponent } from '../../views/main/details/components/spot-negotiation-popups/marketpricehistorypopup/marketpricehistorypopup.component';
import { SpotnegoSearchCtpyComponent } from '../../views/main/details/components/spot-negotiation-popups/spotnego-counterparties/spotnego-searchctpy.component';
import { SpotnegoOfferpricehistoryComponent } from '../../views/main/details/components/spot-negotiation-popups/spotnego-offerpricehistory/spotnego-offerpricehistory.component';

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
                  <span class="expand-img" (click)="openCounterpartyPopup()"></span>
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
                        (change)="onCounterPartyCheckBoxChange($event, element)"
                        [(ngModel)]="element.selected"
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
                <button mat-button class="mid-blue-button proceed-btn" (click)="addCounterpartiesToLocation()">
                  Proceed
                </button>
              </div>
            </div>
          </div>
        </mat-menu>
        <div class="text">Counterparty Details</div>
        <div class="count">{{ selectedCounterParty.length }}</div>
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
          <div class="label-element w-100">
            <div class="title">No. of Products</div>
            <div class="value">{{params.currentReqDatalength}}</div>
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
            <div
              class="value"
              contenteditable="true"
              (keydown)="editQty($event)"
            >
              $559.00
            </div>
          </div>
          <div class="label-element green">
            <div class="title">Target</div>
            <div
              class="value"
              contenteditable="true"
              (keydown)="editQty($event)"
            >
              $559.00
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
  ]
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

  counterpartyColumns: string[] = ['counterparty', 'blank'];
  counterpartyList = [];
  visibleCounterpartyList = [];
  selectedCounterParty = [];

  ngOnInit(): any {
    return this.store.selectSnapshot(({ spotNegotiation }) => {
      // Index [0] "SellerWithInactive"
      // Index [1] "Seller"

      if (this.counterpartyList.length === 0) {
        this.counterpartyList = spotNegotiation.staticLists[1].items;
        this.visibleCounterpartyList = this.counterpartyList.slice(0, 7);
      }
    });
  }

  constructor(
    public dialog: MatDialog,
    private el: ElementRef,
    private store: Store,
    @Inject(DOCUMENT) private _document: HTMLDocument
  ) {}

  onCounterPartyCheckBoxChange(checkbox: any, element: any): void {
    if (checkbox.checked) {
      // Add to selected counterparty list
      this.selectedCounterParty.push(element);
    }

    if (!checkbox.checked) {
      // Remove from selected counterparty list
      this.selectedCounterParty = this.selectedCounterParty.filter(
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

  openCounterpartyPopup(){
    const dialogRef = this.dialog.open(SpotnegoSearchCtpyComponent, {
      width: '100vw',
      height: '95vh',
      maxWidth: '95vw',
      panelClass: 'search-request-popup'
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
  addCounterpartiesToLocation(){
    debugger;
    this.store.dispatch(new AddSelectedRow(this.selectedCounterParty));
  }
}
