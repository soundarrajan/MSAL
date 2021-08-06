import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { SpotnegoAdditionalcostComponent } from '../../views/main/details/components/spot-negotiation-popups/spotnego-additionalcost/spotnego-additionalcost.component';
import { SpotnegoPricingDetailsComponent } from '../../views/main/details/components/spot-negotiation-popups/spotnego-pricing-details/spotnego-pricing-details.component';
import { SupplierCommentsPopupComponent } from '../../views/main/details/components/spot-negotiation-popups/supplier-comments-popup/supplier-comments-popup.component';
import { EmailPreviewPopupComponent } from '../../views/main/details/components/spot-negotiation-popups/email-preview-popup/email-preview-popup.component';
import { SpotnegoOtherdetailsComponent } from '../../views/main/details/components/spot-negotiation-popups/spotnego-otherdetails/spotnego-otherdetails.component';
import { SellerratingpopupComponent } from '../../views/main/details/components/spot-negotiation-popups/sellerratingpopup/sellerratingpopup.component';
import { ContactinformationpopupComponent } from '../../views/main/details/components/spot-negotiation-popups/contactinformationpopup/contactinformationpopup.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { SpotnegoOtherdetails2Component } from '../../views/main/details/components/spot-negotiation-popups/spotnego-otherdetails2/spotnego-otherdetails2.component';

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
        <div
          class="remove-icon-cell-hover float-away"
          (click)="deleteRow()"
        ></div>
      </div>
      <div class="hover-cell-lookup">
        <span
          class="counterpartytype-icon type-physicalsupplier"
          *ngIf="params.data.counterpartytype == 'physicalsupplier'"
          ><i class="fas fa-circle"></i
        ></span>
        <span
          class="counterpartytype-icon type-broker"
          *ngIf="params.data.counterpartytype == 'broker'"
          ><i class="fas fa-circle"></i
        ></span>
        <span
          class="counterpartytype-icon type-seller"
          *ngIf="params.data.counterpartytype == 'seller'"
          ><i class="fas fa-circle"></i
        ></span>
        <span
          class="info-flag"
          *ngIf="params.data.infoIcon == 'Yes'"
          matTooltipClass="darkTooltip"
          matTooltip="Temporary suspended counterparty"
        ></span>
        <span class="m-l-7">{{ params.value }}</span>
        <span class="sticky-icon">
          <span
            class="hover-lookup-icon"
            [matMenuTriggerFor]="clickmenupopup"
            #menuTrigger="matMenuTrigger"
          ></span>
          <span
            class="mail-icon mail-active"
            *ngIf="params.data.mail == 'mail-active'"
            matTooltipClass=""
            matTooltip=""
            >a</span
          >
          <span
            class="mail-icon mail-none"
            *ngIf="params.data.mail == 'mail-inactive'"
            matTooltipClass=""
            matTooltip=""
            >i</span
          >
          <span
            class="mail-icon mail-none"
            *ngIf="params.data.mail == 'mail-none'"
            matTooltipClass=""
            matTooltip=""
            >n</span
          >
          <span
            class="info-comment"
            (click)="suppliercommentspopup()"
            *ngIf="params.data.commentIcon == 'Yes'"
            matTooltipClass=""
            matTooltip=""
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
    </mat-menu>
    <div
      class="no-quote-text"
      *ngIf="params.data.isQuote === 'No quote' && params.value === '0'"
    >
      <span>No quote</span>
    </div>
    <div *ngIf="params.type == 'price-calc'">
      <div class="price-calc static-data" *ngIf="params.value === '100.00'">
        <span class="duplicate-icon"></span>
        $ {{ params.value }}
      </div>
      <div
        class="price-calc active"
        style="border:none !important;font-weight: 500;"
        *ngIf="params.value === '550.00'"
      >
        $ {{ params.value }}
      </div>
      <div class="price-calc" *ngIf="params.value === '-'">
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
          [ngModel]="inputValue"
          (keydown)="onInputChange($event, params)"
          autofocus
          #inputSection
          name="inputField"
          spellcheck="false"
          type="text"
          style="display:inline"
        />
        <div
          class="addButton"
          (click)="pricingdetailspopup($event, params)"
          *ngIf="ispriceCalculated"
        ></div>
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
    <div *ngIf="params.type == 'phy-supplier'">
      <div
        class="phySupplier"
        style="opacity: 0.7;"
        *ngIf="params.value != 'Same as seller'"
      >
        {{ params.value }}
      </div>
      <div class="phySupplier edit" *ngIf="params.value == 'Same as seller'">
        <span
          contentEditable="true"
          [matMenuTriggerFor]="clickmenu"
          #menuTrigger="matMenuTrigger"
          (click)="editSeller = false"
        >
          <span *ngIf="editSeller">Add P. Supplier</span>
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
                    [value]="element.counterparty"
                    [(ngModel)]="element.selected"
                    (click)="selectSupplier(element.counterparty)"
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
            <tr mat-row *matRowDef="let row; columns: counterpartyColumns"></tr>
          </table>

          <div class="proceed-div">
            <button mat-button class="mid-blue-button proceed-btn">
              Proceed
            </button>
          </div>
        </div>
      </div>
    </mat-menu>

    <div
      *ngIf="params.type == 'mat-check-box'"
      style="height:100%;display:flex;align-items:center;justify-content:center"
    >
      <!--<input type="checkbox" (click)="checkedHandler($event)"[checked]="params.value"/>-->
      <mat-checkbox
        [checked]="params.data.check"
        (click)="$event.stopPropagation()"
        class="light-checkbox small"
        [ngClass]="params.value == 'preferred' ? 'darkBorder' : ''"
      ></mat-checkbox>
    </div>

    <div *ngIf="params.type == 'addTpr'" class="addTpr">
      <span>{{ params.value }}</span>
      <div
        class="addButton"
        *ngIf="params.value != '-'"
        (click)="additionalcostpopup()"
      ></div>
    </div>
    <div
      *ngIf="params.type == 'totalOffer'"
      class="addTpr defaultAddicon"
      (click)="additionalcostpopup()"
    >
      <span>{{ params.value }}</span>
      <div class="addButton" *ngIf="params.value != '-'"></div>
    </div>
    <mat-menu #formulamenu="matMenu" class="small-menu darkPanel">
      <div
        class="p-tb-5"
        style="display:flex;align-items:center;"
        (click)="otherdetailspopup1()"
      >
        <span><div class="infocircle-icon"></div></span>
        <span class="fs-13"> Formula Based Pricing</span>
      </div>
      <hr class="menu-divider-line2" />
      <div
        class="p-tb-5"
        style="display:flex;align-items:center;"
        (click)="otherdetailspopup2()"
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
  `
})
export class AGGridCellRendererV2Component implements ICellRendererAngularComp {
  //@ViewChild('inputSection') inputSection: ElementRef;
  @ViewChild('inputSection', { static: true }) inputSection: ElementRef;
  @ViewChild('menuTriggerHover') menuTriggerHover: MatMenuTrigger;

  //@ViewChild('inputSection') inputSection;
  public params: any;
  public select = '$';
  public inputValue = '';
  public ispriceCalculated: boolean = true;
  public showFormula: boolean = false;
  public editCell: boolean;
  public myFormGroup;
  public editSeller: boolean = true;
  public editedSeller = '';
  public docVal = 'Document Uploaded';
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
  constructor(public router: Router, public dialog: MatDialog) {}

  ngOnInit() {
    this.myFormGroup = new FormGroup({
      frequency: new FormControl('')
    });
  }

  frequencyArr = [
    { key: '$', abbriviation: 'USD' },
    { key: '€', abbriviation: 'EURO' },
    { key: '£', abbriviation: 'GBP' }
  ];

  agInit(params: any): void {
    this.params = params;
  }

  // pricingdetailspopup(){
  //     const dialogRef = this.dialog.open(SpotnegoPricingDetailsComponent, {
  //       width: '1164px',
  //       height: '400px',
  //       panelClass: 'additional-cost-popup'
  //     });

  //     dialogRef.afterClosed().subscribe(result => {
  //       console.log(`Dialog result: ${result}`);
  //     });
  //   }

  hoverMenu(event) {
    event.target.classList.add('selectedIcon');
    this.menuTriggerHover.openMenu();
  }

  additionalcostpopup() {
    const dialogRef = this.dialog.open(SpotnegoAdditionalcostComponent, {
      width: '1170px',
      height: '450px',
      panelClass: 'additional-cost-popup'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  sellerratingpopup() {
    const dialogRef = this.dialog.open(SellerratingpopupComponent, {
      width: '1164px',
      height: '562px',
      panelClass: 'additional-cost-popup'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  /*rfqspopup(){
        const dialogRef = this.dialog.open(RfqspopupComponent, {
          width: '1194px',
          height: '177px',
          panelClass: 'additional-cost-popup'
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
      } */

  openEmailPreview() {
    const dialogRef = this.dialog.open(EmailPreviewPopupComponent, {
      width: '80vw',
      height: '90vh',
      panelClass: 'additional-cost-popup'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  otherdetailspopup1() {
    const dialogRef = this.dialog.open(SpotnegoOtherdetailsComponent, {
      width: '1164px',
      // minHeight: '470px',

      panelClass: ['additional-cost-popup', 'pricing-detail-popup-panel-class']
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  otherdetailspopup2() {
    const dialogRef = this.dialog.open(SpotnegoOtherdetails2Component, {
      width: '1164px',
      //minHeight: '470px',

      panelClass: ['additional-cost-popup', 'pricing-detail-popup-panel-class']
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  contactinformationpopup() {
    const dialogRef = this.dialog.open(ContactinformationpopupComponent, {
      width: '1194px',
      minHeight: '446px',
      panelClass: ['additional-cost-popup', 'supplier-contact-popup']
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  suppliercommentspopup() {
    const dialogRef = this.dialog.open(SupplierCommentsPopupComponent, {
      width: '672px',
      minHeight: '540px',
      panelClass: ['additional-cost-popup', 'supplier-contact-popup']
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  pricingdetailspopup(e, params) {
    //this.popupOpen = true;
    const dialogRef = this.dialog.open(SpotnegoPricingDetailsComponent, {
      width: '1164px',
      //maxHeight: '444px',

      panelClass: ['additional-cost-popup', 'pricing-detail-popup-panel-class']
    });

    dialogRef.afterClosed().subscribe(result => {
      e.target.parentElement.classList.add('active');
      this.inputValue = '560.19';
      var itemsToUpdate = [];
      params.api.forEachNodeAfterFilterAndSort(function(rowNode, index) {
        if (!rowNode.isSelected() === true) {
          return;
        }
        var data = rowNode.data;
        //data.offPrice = "$560.19";
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
      //this.editCell = true;
    });
  }

  onInputChange(e, params) {
    //console.log(params);

    e.target.parentElement.classList.add('active');
    //e.preventDefault();
    var itemsToUpdate = [];
    params.api.forEachNodeAfterFilterAndSort(function(rowNode, index) {
      // console.log("eeeeeeeee");
      //console.log(rowNode);
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
    //this.ispriceCalculated = false;
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
  selectSupplier(text) {
    //console.log(text);
    this.editedSeller = text;
  }
}
