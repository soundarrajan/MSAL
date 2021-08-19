import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AvailabletermcontractspopupComponent } from '../../views/main/details/components/spot-negotiation-popups/availabletermcontractspopup/availabletermcontractspopup.component';
import { MarketpricehistorypopupComponent } from '../../views/main/details/components/spot-negotiation-popups/marketpricehistorypopup/marketpricehistorypopup.component';
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
                  <span class="expand-img"></span>
                </div>
              </div>
              <table
                class="delivery-products-pop-up col-md-12 no-padding"
                mat-table
                (click)="$event.stopPropagation()"
                [dataSource]="counterpartyList"
              >
                <ng-container matColumnDef="counterparty">
                  <th mat-header-cell *matHeaderCellDef>Counterparty</th>
                  <td mat-cell *matCellDef="let element">
                    <mat-option [value]="element">
                      <mat-checkbox
                        [value]="element"
                        [(ngModel)]="element.selected"
                      >
                        {{ element.counterparty }}
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
                <button mat-button class="mid-blue-button proceed-btn">
                  Proceed
                </button>
              </div>
            </div>
          </div>
        </mat-menu>
        <div class="text">Counterparty Details</div>
        <div class="count">16</div>
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
            <div class="value">3</div>
          </div>
        </div>
      </div>
    </div>
    <div class="resize-grid-header" *ngIf="params.type == 'bg-header'">
      <div class="options">
        <div class="checkBox">
          <mat-checkbox class="noborder" [checked]="true"
            >DMA 0.1%</mat-checkbox
          >
        </div>
        <div class="optionsText">
          <div class="qty">
            <span class="title">Qty:</span>
            <span
              class="value"
              contenteditable="true"
              (keydown)="editQty($event)"
              >600/800 MT</span
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
  counterpartyList = [
    { counterparty: 'Shell North America Division', selected: false },
    { counterparty: 'Shell North America Division', selected: false },
    { counterparty: 'Trefoil Oil and Sales', selected: false },
    { counterparty: 'Shell North America Corporation', selected: false },
    { counterparty: 'Shell North America Corporation', selected: false },
    { counterparty: 'Shell North America Corporation', selected: false },
    { counterparty: 'Shell North America Corporation', selected: false },
    { counterparty: 'Shell North America Corporation', selected: false }
  ];

  constructor(
    private el: ElementRef,
    @Inject(DOCUMENT) private _document: HTMLDocument,
    public dialog: MatDialog
  ) {}

  search(userInput: string): void {}

  agInit(params): void {
    this.params = params;
    this.params.columnGroup
      .getOriginalColumnGroup()
      .addEventListener('expandedChanged', this.syncExpandButtons.bind(this));
    this.syncExpandButtons();
  }

  expandOrCollapse(isExpanded) {
    let currentState = this.params.columnGroup
      .getOriginalColumnGroup()
      .isExpanded();
    let groupNames = ['grid1', 'grid2', 'grid3'];
    groupNames.forEach(groupId => {
      this.params.columnApi.setColumnGroupOpened(groupId, !currentState);
    });

    if (currentState) this.params.api.sizeColumnsToFit();
    //this.invokeParentMethod();
  }

  invokeParentMethod() {
    this.params.context.componentParent.resizeGrid();
  }

  syncExpandButtons() {
    if (this.params.columnGroup.getOriginalColumnGroup().isExpanded()) {
      this.expandState = 'expand';
    } else {
      this.expandState = '';
    }
  }

  offerpricehistorypopup() {
    const dialogRef = this.dialog.open(SpotnegoOfferpricehistoryComponent, {
      width: '500vw',
      height: '90vh',
      panelClass: 'additional-cost-popup'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  pricinghistorypopup() {
    const dialogRef = this.dialog.open(MarketpricehistorypopupComponent, {
      width: '500vw',
      height: '90vh',
      panelClass: 'additional-cost-popup'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  availabletermcontractpopup() {
    const dialogRef = this.dialog.open(AvailabletermcontractspopupComponent, {
      width: '1164px',
      height: '179px',
      panelClass: 'additional-cost-popup'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  editQty(e) {
    if (e.keyCode == 37 || e.keyCode == 39) {
      e.stopPropagation();
    }
  }
}
