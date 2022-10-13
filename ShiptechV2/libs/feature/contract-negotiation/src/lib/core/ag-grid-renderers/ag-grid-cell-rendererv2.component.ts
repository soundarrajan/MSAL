import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from "ag-grid-angular";
import { AdditionalCostPopupComponent } from "../../views/contract-negotiation-components/contract-negotiation-popups/additional-cost-popup/additional-cost-popup.component";
//import { FormulaPricingPopupComponent } from "../../views/contract-negotiation-components/contract-negotiation-popups/formula-pricing-popup/formula-pricing-popup.component";
//import { SellerratingpopupComponent } from 'src/app/shiptech-spot-negotiation/spot-negotiation-popups/sellerratingpopup/sellerratingpopup.component';
import { EmailPreviewPopupComponent } from "../../views/contract-negotiation-components/contract-negotiation-popups/email-preview-popup/email-preview-popup.component";
//import { ContactinformationpopupComponent } from 'src/app/shiptech-spot-negotiation/spot-negotiation-popups/contactinformationpopup/contactinformationpopup.component';
//import { SupplierCommentsPopupComponent } from "src/app/shiptech-spot-negotiation/spot-negotiation-popups/supplier-comments-popup/supplier-comments-popup.component";
import { MatMenuTrigger } from "@angular/material/menu";
//import { SpotnegoRequestChangesComponent } from "src/app/shiptech/shiptech-spot-negotiation/spot-negotiation-popups/spotnego-request-changes/spotnego-request-changes.component";
import { LocalService } from "../../services/local-service.service";
import { SellerratingpopupComponent } from "@shiptech/core/ui/components/designsystem-v2/dialog-popup/sellerratingpopup/sellerratingpopup.component";"src/app/shiptech/shiptech-components/sellerratingpopup/sellerratingpopup.component";

@Component({
  selector: 'ag-grid-cell-renderer',
  template: `
    <div  *ngIf="params.type=='singlerow'">   
        <div [ngClass]="params.cellClass" matTooltip="{{params.value}}" style="margin:0px"><div class="truncate-125">{{params.value}}</div></div>
    </div>
    <div  *ngIf="params.type=='multirow'">
        <div *ngIf="params.data.data"  >
            <div *ngFor="let item of params.data.data" class="aggrid-multirow" [ngClass]="params.classes">
                <span  class="aggrid-text-resizable">{{item[params.label]}}</span>
            </div>
            <div  *ngIf="!params.data.data"  style="line-height: 15px" [ngClass]="params.classes">
                <span  style="line-height: 15px" class="aggrid-text-resizable">{{params.data}}</span>
            </div>
        </div>
    </div>
    <div  *ngIf="params.type=='roundchip'">   
        <div *ngFor="let item of params.data.data" class="aggrid-multirow">     
            <div [ngClass]="params.cellClass" title="{{item[params.label]}}" > 
                {{params.letter!=null ? item[params.label].charAt(params.letter).toUpperCase():item[params.label]}}
            </div>
        </div>                    
    </div>
    <div  *ngIf="params.type=='rating-chip'">   
    <div [ngClass]="params.cellClass" matTooltip="" style="display:flex;align-items: center;
    justify-content: center;" (click)="sellerratingpopup('port',params.data.genRating,params.data.genPrice,params.data.portRating,params.data.portPrice)">
    <div *ngIf="params.label=='gen-rating'" class="truncate-125 chip" [ngStyle]="{'background-color': (params.data.genRating =='' && params.data.genPrice =='') ? '#C4C4C4' :'' }"><div *ngIf="(params.data.genRating =='' && params.data.genPrice =='')">NA</div>
    <div [ngStyle]="{'margin-right': (params.data.genRating !='' && params.data.genPrice !='') ? '8px' :'' }">{{params.data.genRating}}<span class="star" *ngIf="params.data.genRating !=''"></span></div><div>{{params.data.genPrice}}</div></div>
    <div *ngIf="params.label=='port-rating'" class="truncate-125 chip" [ngStyle]="{'background-color': (params.data.portRating =='' && params.data.portPrice =='') ? '#C4C4C4' :'' }"><div *ngIf="(params.data.portRating =='' && params.data.portPrice =='')">NA</div>
    <div [ngStyle]="{'margin-right': (params.data.portRating !='' && params.data.portPrice !='') ? '8px' :'' }">{{params.data.portRating}}<span class="star" *ngIf="params.data.portRating !=''"></span></div><div>{{params.data.portPrice}}</div></div>
    </div>
    </div>
    <div  *ngIf="params.type=='hover-cell-lookup'" class="fly-away"> 
    <div >
    <!--<div class="remove-icon-cell-hover float-away" (click)='deleteRow();'></div>-->
    </div>
        <div class="hover-cell-lookup" [matMenuTriggerFor]="clickmenupopup" #menuPopupTrigger="matMenuTrigger" (click)="menuPopupTrigger.closeMenu()" (contextmenu)="$event.preventDefault();$event.stopPropagation();menuPopupTrigger.openMenu()"> 
        <span class="counterpartytype-icon type-physicalsupplier"*ngIf="params.data.counterpartytype=='physicalsupplier'"><i class="fas fa-circle"></i></span>
        <span class="counterpartytype-icon type-broker"*ngIf="params.data.counterpartytype=='broker'"><i class="fas fa-circle"></i></span>
        <span class="counterpartytype-icon type-seller"*ngIf="params.data.counterpartytype=='seller'"><i class="fas fa-circle"></i></span>
        <span class="info-flag" *ngIf="params.data.infoIcon=='Yes'" matTooltipClass="darkTooltip" matTooltip="Temporary suspended counterparty" matTooltipClass="lightTooltip"></span>
        <span class="m-l-7" matTooltip={{params.value}} matTooltipClass="lightTooltip">{{params.value}}</span>
        <span class="sticky-icon">
        <!--span class="hover-lookup-icon" [matMenuTriggerFor]="clickmenupopup" #menuTrigger="matMenuTrigger"></span>-->
        <!-- <span class="mail-icon" *ngIf="!showMaerskData" (click)="openEmailPreview(params)" [ngClass]="(params.data.check1 || params.data.check2 || params.data.check3) ? 'mail-active' : mailSent ? 'mail-inactive' : 'mail-none'" [matTooltip]="(params.data.check1 || params.data.check2 || params.data.check3) ? 'Preview email' : 'Email sent'" matTooltipClass="lightTooltip">a</span>
        <span class="mail-icon" *ngIf="showMaerskData" (click)="openEmailPreview(params)" [ngClass]="(params.data.check1 || params.data.check2 || params.data.check3) ? 'mail-active' : mailSent ? 'mail-inactive' : 'mail-active'" [matTooltip]="(params.data.check1 || params.data.check2 || params.data.check3) ? 'Preview email' : 'Email sent'" matTooltipClass="lightTooltip">a</span> -->
        <span class="mail-icon" (click)="openEmailPreview(params)" [ngClass]="(params.data.check1 || params.data.check2 || params.data.check3) ? 'mail-active' : mailSent ? 'mail-inactive' : 'mail-none'" [matTooltip]="(params.data.check1 || params.data.check2 || params.data.check3) ? 'Preview email' : 'Email sent'" matTooltipClass="lightTooltip">a</span>
        <!--<span class="mail-icon" [ngClass]="mailSent ? 'mail-inactive' : 'mail-none'"  matTooltipClass="" matTooltip="">i</span> -->
        <span class="mail-icon mail-none" *ngIf="params.data.mail=='mail-none'" matTooltipClass="" matTooltip="">n</span>
        <span class="info-comment" matTooltip="View supplier comments" matTooltipClass="lightTooltip" (click)="suppliercommentspopup()" *ngIf="params.data.commentIcon=='Yes'"></span>
        <span class="info-comment-inactive" (click)="suppliercommentspopup()" *ngIf="params.data.commentIcon=='No'" matTooltipClass="" matTooltip=""></span>
        <span class="" *ngIf="params.data.commentIcon=='None'" matTooltipClass="" matTooltip=""></span>
        
        <span class="" *ngIf="params.data.commentIcon==''" matTooltipClass="" matTooltip=""></span>
        </span>
        
        </div>
    </div>
    <mat-menu #clickmenupopup="matMenu" class="small-menu darkPanel">
    <div class="p-tb-5" style="display:flex;align-items:center;" (click)="contactinformationpopup()">
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
    <hr class="menu-divider-line">
    <div class="p-tb-5" style="display:flex;align-items:center;">
      <span><div class="view-rfq-icon"></div></span>
      <span class="fs-12" (click)="openEmailPreview(params)">Preview email</span>
    </div>
    <div class="p-tb-5" style="display:flex;align-items:center;">
      <span><div class="no-quote-icon"></div></span>
      <span class="fs-12">No Quote</span>
    </div>
    <hr class="menu-divider-line">
    <div class="p-tb-5" style="display:flex;align-items:center;">
      <span><div class="remove-icon"></div></span>
      <span class="fs-12" (click)="deleteRow()">Remove counterparty</span>
    </div>
    </mat-menu>
    <div class="no-quote-text" *ngIf="params.data.isQuote === 'No quote' && params.value === '0'">
      <span>No quote</span>
    </div>
    <div *ngIf="params.type=='price-calc'">
        <div class="price-calc static-data" matTooltip={{params.value}} matTooltipClass="lightTooltip" *ngIf="params.value === '100.00'">
        <span class="duplicate-icon"></span>
          <span style="font-size:10px;padding-right:5px;">USD</span> {{params.value}}
        </div>
        <div class="price-calc active" matTooltip={{params.value}} matTooltipClass="lightTooltip" style="border:none !important;font-weight: 500;" *ngIf="params.value === '550.00' ||(params.value !='-' && showMaerskData) ">
        <span style="font-size:10px;padding-right:5px;">USD</span> {{params.value}}
        </div>
        <div class="price-calc" *ngIf="params.value === '-'" [matMenuTriggerFor]="priceMenupopup" #pricePopupTrigger="matMenuTrigger"  (click)="pricePopupTrigger.closeMenu()" (contextmenu)="$event.preventDefault();$event.stopPropagation();onRightClickMenuOpened($event);pricePopupTrigger.openMenu();">
        <div id="custom-form-field" style="display:relative;"[ngClass]="ispriceCalculated ? '' : 'priceCalculated'">
        <mat-form-field class="without-search currency-select-trigger" appearance="none" [formGroup]="myFormGroup">
            <mat-label>Select Field</mat-label>
            <mat-select disableOptionCentering 
            [(ngModel)]="select"
            formControlName="frequency" panelClass="currencyselecttrigger"
            >
            <mat-select-trigger overlayPanelClass="123class">
                {{myFormGroup.controls['frequency'].value}}
            </mat-select-trigger>
            <div style="padding:5px 10px;">Change Currency</div>
            <div style="overflow:scroll;height:113px;">
            <mat-option class="currency-mat-select" *ngFor="let frequency of frequencyArr" [value]="frequency.abbriviation">
              <span> <mat-radio-button>{{ frequency.abbriviation}}</mat-radio-button></span>
            </mat-option>
            </div>
            </mat-select>
        </mat-form-field>
        </div>
        <input class="inputField" [ngModel]="inputValue"  (focusin)="addRowFocus()" (focusout)="removeRowFocus()" (keydown)="onInputChange($event,params)"  autofocus #inputSection autocomplete="off" name="inputField" 
        spellcheck="false" type='text' style="display:inline">
        <!--<div class="addButton" (click)="pricingdetailspopup($event,params)" *ngIf="ispriceCalculated"></div>-->
        <div class="formulaButton" style="display:inline; position:absolute; left:112px;" (mouseenter)="hoverMenu($event);" [matMenuTriggerFor]="formulamenu" #menuTriggerHover="matMenuTrigger" *ngIf="showFormula"></div>
        </div>
    </div>
    <mat-menu #priceMenupopup="matMenu" class="darkPanel-add big">
    <div class="add-block" (click)="pricingdetailspopup($event,params)"><div></div><span>Add/View Formula pricing</span></div>
    <div class="divider-line"></div>
    <div class="add-block" (click)="requestChange($event,params)"><div></div><span>Add/View Request changes</span></div>
    </mat-menu>
    <div  *ngIf="params.type=='phy-supplier'"> 
        <!-- <div class="phySupplier" style="opacity: 0.7;" *ngIf="params.value !='Same as seller'"> 
        {{params.value}}
        </div> -->
        <div class="phySupplier edit"> 
        <span contentEditable=true [matMenuTriggerFor]="clickmenu" #menuTrigger="matMenuTrigger">
        <!-- <span>Add P. Supplier</span> -->
        <span matTooltip="{{params.value}}" matTooltipClass="lightTooltip">{{params.value}}</span>
        </span>
        <!--<div class="addButton"></div>-->
        </div>
    </div>
    <mat-menu  #clickmenu="matMenu" class="add-new-request-menu">
    <div class="expansion-popup" style="margin: 20px 0px;">
        <div class="select-product-container">
            <div class="col-md-12 header-container-product" (click)="$event.stopPropagation(); $event.preventDefault()">
            <div class="search-product-container col-md-10">
                <span class="search-product-lookup">
                </span>
                <input matInput
                    placeholder="Search and select counterparty"
                    class="search-product-input">
                    </div>
            <div class="col-md-2">
                <span class="expand-img"></span>
            </div>
            </div>
            <table class="delivery-products-pop-up col-md-12 no-padding" mat-table (click)="$event.stopPropagation()" [dataSource]="counterpartyList">
                                                    
                <ng-container matColumnDef="counterparty">
                    <th mat-header-cell *matHeaderCellDef> Counterparty </th>
                    <td mat-cell *matCellDef="let element"> 
                    <mat-option [value]="element">
                        <mat-checkbox [value]="element.counterparty" [(ngModel)]="element.selected" (click)="selectSupplier(element.counterparty)">
                            {{element.counterparty}}
                        </mat-checkbox>
                    </mat-option>
                    </td>
                </ng-container>
                <ng-container matColumnDef="blank">
                    <th mat-header-cell *matHeaderCellDef></th>
                    <td mat-cell *matCellDef="let element">
                    </td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="counterpartyColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: counterpartyColumns;"></tr>
            </table>
            <div class="proceed-div">
                <button mat-button class="mid-blue-button proceed-btn">Proceed</button>
            </div>
        </div>
        </div>
      </mat-menu>
  
    <div  *ngIf="params.type=='mat-check-box'" style="height:100%;display:flex;align-items:center;justify-content:center" [matTooltip]="params.value=='preferred' ? 'Preffered product' : null" matTooltipClass="lightTooltip"> 
    <!--<input type="checkbox" (click)="checkedHandler($event)"[checked]="params.value"/>-->
    <mat-checkbox [(ngModel)]="params.data[params.val]" (click)="$event.stopPropagation();checkBoxEvent($event)" class="light-checkbox small"  [ngClass]="params.value=='preferred' ? 'darkBorder' : ''"></mat-checkbox>
    </div>

    <div  *ngIf="params.type=='addTpr'" class="addTpr"> 
    <div *ngIf="params.value == '-'">
        <span>{{params.value}}</span>
    </div>
    <!--<div class="addButton" *ngIf="params.value !='-'" (click)="additionalcostpopup()"></div> -->
    <div *ngIf="params.value == '518.50'">
        <span>{{params.value}}</span>
    </div>
    </div>
    <div  *ngIf="params.type=='totalOffer'" class="addTpr defaultAddicon" [matTooltip]="(params.data.totalOfferActive==true) ? 'includes additional costs' : null" matTooltipClass="lightTooltip" [matMenuTriggerFor]="totalOfferMenupopup" #totalOfferPopupTrigger="matMenuTrigger"  (click)="totalOfferPopupTrigger.closeMenu()" 
    (contextmenu)="$event.preventDefault();$event.stopPropagation();totalOfferPopupTrigger.openMenu();"> 
    <span (click)="additionalcostpopup(params.data.name)">{{params.value}}</span>
    <div class="dollarButton" *ngIf="params.value =='500.00' || (showMaerskData && params.data.totalOfferActive)" ></div>
    </div>
    <mat-menu #totalOfferMenupopup="matMenu" class="darkPanel-add big">
    <div class="add-block" (click)="additionalcostpopup(params.data.name)"><div></div><span>Add additional cost</span></div>
    </mat-menu>

    <mat-menu #formulamenu="matMenu"   class="small-menu darkPanel">
    <div class="p-tb-5" style="display:flex;align-items:center;" (click)="pricingdetailspopup($event,params)">
      <span><div class="infocircle-icon"></div></span>
      <span class="fs-13"> Formula Based Pricing</span>
    </div>
    <hr class="menu-divider-line2">
    <div class="p-tb-5" style="display:flex;align-items:center;" (click)="requestChange($event,params)">
      <span><div class="infocircle-icon"></div></span>
      <span class="fs-13">Quotation different from Request</span>
    </div>
  </mat-menu>
  <div *ngIf="params.type==='dashed-border-notes'" class="dashed-border-note">
  <div class='dashed-border-notes'><input matInput [(ngModel)]="docVal" matTooltip="{{docVal}}" matTooltipClass="lightTooltip"></div>
       
  </div>
  <div *ngIf="params.type==='dashed-border-darkcell'" class="staticEditCell">
  <div class="dashed-border" style="">
  <input matInput [(ngModel)]=params.value>
  </div>
  </div>
  <div *ngIf="params.type==='dashed-border-with-dropdown'" class="staticEditCell" 

  >
  <div class="dashed-border d-flex align-items-center" style="cursor:pointer" 
  (click)="openMenu=true;"
  [matMenuTriggerFor]="prodSelectionMenupopup" #menuTrigger="matMenuTrigger">
  <input matInput [(ngModel)]=params.value matTooltip="{{params.value}}">
  <mat-icon class="drop-down-arrow">arrow_drop_down</mat-icon>
  </div>
  </div>

  <mat-menu  #prodSelectionMenupopup="matMenu"  class="darkPanel-add menuPopup">
    <app-dark-selection-menu [value]="params.value" (onProductChange)="updateProduct($event)"></app-dark-selection-menu>
  </mat-menu>



  <div *ngIf="params.type==='border-cell'">
  <div class="border-cell">
    <span class="left-data">{{params.value}}</span>
    <span class="right-data">{{params.data.orderProduct}}</span>
  </div>
  </div>
  <div *ngIf="params.type==='dark-border-cell'">
  <div class="border-cell">
    {{params.value}}
  </div>
  </div>
  <div *ngIf="params.type==='dashed-border-dark-search'" class="cell-bg-border">
  <div class="truncate-100p inner-cell dark" style="padding: 0 3px;">
      <span class="dashed-border with-search">
          <p>{{params.value}}</p>
          <span class="search-icon-dark"></span>
      </span>           
  </div>
</div>
<div *ngIf="params.type==='plain-select'">
  <mat-form-field class="without-search custom-select-option" appearance="legacy">
    <mat-select  panelClass="general-info-select-container" [(ngModel)]="params.value">
      <mat-option *ngFor="let value of params.valueArr" [value]="value">{{value}}</mat-option>
    </mat-select>
  </mat-form-field>
</div>
<div *ngIf="params.type==='status-circle'">
  <div class="status-circle"><span class="circle" [ngClass]="params.value"></span>{{params.value}}</div>
</div>
<div *ngIf="params.type==='chip-bg' && params.value!=''">
  <div *ngIf="params.data.data && params.label!='circle'" style="margin-top:10px">
  <div *ngFor="let item of params.data.data" class="aggrid-multirow">
     <div *ngIf="item[params.label]!=''" [ngClass]="params.cellClass">{{item[params.label]}}</div>
  </div>
  </div>
  <div *ngIf="params.label==='circle'">
  <div [ngClass]="params.cellClass">{{params.value}}</div>
  </div>
</div>
<div *ngIf="params.type==='linkTo'">
<span (click)="navigateTo($event)">{{params.value}}</span>
</div>
<div *ngIf="params.type==='chip-lightTooltip'">
<div [ngClass]="params.cellClass" matTooltip="{{params.value}}" matTooltipClass="lightTooltip" style="margin:0px"><div class="truncate-125">{{params.value}}</div></div>
</div>
`
})

export class AGGridCellRendererV2Component implements ICellRendererAngularComp {
  @ViewChild('inputSection') inputSection: ElementRef;
  @ViewChild('menuTriggerHover') menuTriggerHover: MatMenuTrigger;

  public showDollar: boolean = false;
  public params: any;
  public select = "USD";
  public inputValue = "";
  public ispriceCalculated: boolean = true;
  public showFormula: boolean = false;
  public editCell: boolean;
  public myFormGroup;
  public editSeller: boolean = true;
  public editedSeller = "";
  public docVal = "Document Uploaded";
  sendRFQemailList = [];
  mailSent: boolean;
  counterpartyColumns: string[] = ['counterparty', 'blank'];
  counterpartyList = [
    { 'counterparty': 'Shell North America Division', 'selected': false },
    { 'counterparty': 'Shell North America Division', 'selected': false },
    { 'counterparty': 'Trefoil Oil and Sales', 'selected': false },
    { 'counterparty': 'Shell North America Corporation', 'selected': false },
    { 'counterparty': 'Shell North America Corporation', 'selected': false },
    { 'counterparty': 'Shell North America Corporation', 'selected': false },
    { 'counterparty': 'Shell North America Corporation', 'selected': false },
    { 'counterparty': 'Shell North America Corporation', 'selected': false }
  ];
  companyCode;
  showMaerskData: boolean;
  openMenu: boolean = false;

  constructor(public router: Router, public dialog: MatDialog, private localService: LocalService) {
  }

  ngOnInit() {
    this.myFormGroup = new FormGroup({
      frequency: new FormControl('USD')
    });
    this.companyCode = this.localService.getcompayCode();
    if (this.companyCode == "maersk") {
      this.showMaerskData = true;
    }
  }

  frequencyArr = [
    { key: '$', abbriviation: 'USD' },
    { key: '€', abbriviation: 'EURO' },
    { key: '£', abbriviation: 'GBP' },
    { key: '¥', abbriviation: 'YEN' }
  ];

  agInit(params: any): void {
    this.params = params;
  }

  navigateTo() {
    this.params.onClick(this.params);
  }

  hoverMenu(event) {
    event.target.classList.add('selectedIcon');
    this.menuTriggerHover.openMenu();
  }

  additionalcostpopup(data) {
    const dialogRef = this.dialog.open(AdditionalCostPopupComponent, {
      width: '1170px',
      height: 'auto',
      minHeight: '450px',
      maxHeight: '80vh',
      panelClass: 'additional-cost-popup',
      data: { counterpartyName: data }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.showDollar = true;
    });
  }
  sellerratingpopup(type, genRating, genPrice, portRating, portPrice) {
    //alert(genRating);
    const dialogRef = this.dialog.open(SellerratingpopupComponent, {
      width: '1164px',
      height: '562px',
      panelClass: 'additional-cost-popup',
      data: { type: type, gRating: genRating, gPrice: genPrice, pRating: portRating, pPrice: portPrice }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  /*openEmailPreview(params) {
    if (this.sendRFQemailList.length > 1) {
      const dialogRef = this.dialog.open(PreviewRfqPopupComponent, {
        width: '350px',
        height: '290px',
        panelClass: 'additional-cost-popup',
        data: {
          productId: this.params.data.check1 ? this.params.data[0].id : this.params.data.check2 ? this.params.data[1].id : this.params.data[2].id,
        }
      });

      dialogRef.afterClosed().subscribe(result => {
      });
    } else {
      const dialogRef = this.dialog.open(EmailPreviewPopupComponent, {
        width: '80vw',
        height: '90vh',
        panelClass: 'additional-cost-popup'
      });

      dialogRef.afterClosed().subscribe(result => {
        this.mailSent = true;
        var itemsToUpdate = [];
        params.api.forEachNodeAfterFilterAndSort(function (rowNode, index) {
          /* if (!rowNode.isSelected() === true) {
            return;
          } */
          /*var data = rowNode.data;
          //data.mail = 'mail-inactive';
          data.check1 = false;
          data.tPr = "-";
          data.amt = "-";
          data.diff = "-";
          itemsToUpdate.push(data);
        });
        var res = params.api.applyTransaction({ update: itemsToUpdate });
        this.sendRFQemailList.push(this.params.data.check1 ? this.params.data[0].name : this.params.data.check2 ? this.params.data[1].name : this.params.data[2].name);
      });
    }

  }*/

  /*contactinformationpopup() {
    const dialogRef = this.dialog.open(ContactinformationpopupComponent, {
      width: '1194px',
      minHeight: '446px',
      maxHeight: '90vh',
      panelClass: ['additional-cost-popup', 'supplier-contact-popup']
    });

    dialogRef.afterClosed().subscribe(result => {
    });

  }

  suppliercommentspopup() {
    const dialogRef = this.dialog.open(SupplierCommentsNewPopupComponent, {
      width: '513px',
      minHeight: '260px',
      panelClass: ['additional-cost-popup', 'supplier-contact-popup'],
      data: { name: this.params.data }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  requestChange(e, params) {
    const dialogRef = this.dialog.open(SpotnegoRequestChangesComponent, {
      width: '1164px',
      panelClass: ['additional-cost-popup', 'pricing-detail-popup-panel-class'],
    });

    dialogRef.afterClosed().subscribe(result => {
      e.target.parentElement.classList.add('active');
      this.inputValue = "560.19";
      var itemsToUpdate = [];
      let rowData = [];

      params.api.forEachNodeAfterFilterAndSort(function (rowNode, index) {

        if (!rowNode.isSelected() === true) {
          return;
        }
        var data = rowNode.data;
        data.tPr = "$560.19";
        data.amt = "4,48,152.00";
        data.diff = "1.19";
        data.phySupplier = "Same as seller";
        itemsToUpdate.push(data);
      });
      var res = params.api.applyTransaction({ update: itemsToUpdate });
      params.api.deselectAll();//optional
      this.ispriceCalculated = false;
      this.showFormula = true;
    });
  }*/
  /*pricingdetailspopup(e, params) {
    const dialogRef = this.dialog.open(FormulaPricingPopupComponent, {
      width: '1164px',
      maxHeight: '690px',
      height: 'auto',
      panelClass: ['additional-cost-popup', 'pricing-detail-popup-panel-class', 'scroll-change'],
    });

    dialogRef.afterClosed().subscribe(result => {
      e.target.parentElement.classList.add('active');
      this.inputValue = "560.19";
      var itemsToUpdate = [];
      let rowData = [];

      params.api.forEachNodeAfterFilterAndSort(function (rowNode, index) {

        if (!rowNode.isSelected() === true) {
          return;
        }
        var data = rowNode.data;
        data.tPr = "$560.19";
        data.amt = "4,48,152.00";
        data.diff = "1.19";
        data.phySupplier = "Same as seller";
        itemsToUpdate.push(data);
      });
      var res = params.api.applyTransaction({ update: itemsToUpdate });
      params.api.deselectAll();//optional
      this.ispriceCalculated = false;
      this.showFormula = true;
    });
  }*/

  onRightClickMenuOpened(e) {
    e.target.parentElement.classList.add('active');
  }
  removeRowFocus() {
    //document.querySelector('.ag-grid-v2').classList.remove('row-focus');
  }
  addRowFocus() {
    //document.querySelector('.ag-grid-v2').classList.add('row-focus');
  }
  onInputChange(e, params) {
    //document.querySelector('.ag-grid-v2').classList.add('row-focus');
    e.target.parentElement.classList.add('active');
    if (e.keyCode == 9) {
      var itemsToUpdate = [];
      params.api.forEachNodeAfterFilterAndSort(function (rowNode, index) {
        if (!rowNode.isSelected() === true) {
          return;
        }
        var data = rowNode.data;
        data.tPr = "$560.19";
        data.amt = "4,48,152.00";
        data.diff = "1.19";
        data.phySupplier = "Same as seller";
        itemsToUpdate.push(data);
      });
      var res = params.api.applyTransaction({ update: itemsToUpdate });
      params.api.deselectAll();//optional   
    }
  }
  checkedHandler(event) {
    let checked = event.target.checked;
    let colId = this.params.column.colId;
    this.params.node.setDataValue(colId, checked);

  }

  checkBoxEvent(event) {
    this.params.context.componentParent.noQuoteChange();
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
    this.editedSeller = text;
  }
  updateProduct(e) {
    this.params.value = e;
  }
}