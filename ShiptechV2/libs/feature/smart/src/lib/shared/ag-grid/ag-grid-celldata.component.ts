import { Component, ViewChild, ElementRef, Input } from "@angular/core";
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatInput } from '@angular/material/input';
import { LocalService } from '../../services/local-service.service';

@Component({
  selector: 'aggrid-cell-data',
  template:
    `
        <div *ngIf="params.type==='newRequest'">
  <div class="aggrid-content-center new-request">
    <span class="plus-icon"> + </span>
    <span class="content"> New Request </span>
  </div>
</div>

<div *ngIf="params.type=='multiple-values'">
  <div *ngIf="params.value" style="display:flex;flex-wrap:wrap;">
    <div *ngFor="let item of params.value" class="aggrid-content-center multiple-text w-auto">
      <span [matTooltip]="item" class="aggrid-text-resizable">{{item}}</span>
    </div>
  </div>
</div>

<div *ngIf="params.type=='link'">
  <div matTooltip="{{params.value}}" [ngClass]="params.cellClass">{{params.value}}</div>
</div>

<div *ngIf="params.type=='popup-multiple-values'">
<hover-menu #menu [items]="params.value"></hover-menu>
</div>


<div *ngIf="params.type=='edit'">
  <div [matTooltip]="inp.value"><input #inp [ngClass]="params.cellClass" [value]=params.value
      (keydown)="triggerChangeEvent()"></div>
</div>

<div *ngIf="params.type=='edit-disabled'">
  <div [matTooltip]="inp.value"><input #inp disabled [ngClass]="params.cellClass" [value]=params.value></div>
</div>

<div *ngIf="params.type=='disable-with-popup'">
  <div (mouseenter)="!menuClick  && toggleMenuInput($event,params.value);" (click)="toggleMenu3Input($event)"
    (mouseleave)="!menuClick  && toggleMenu2Input();" (menuClosed)="toggleMenu1Input($event);">
    <input disabled style="z-index: 1050;" [matMenuTriggerFor]="inputDisabledMenu" [matMenuTriggerData]="menuData"
      #inputMenuTrigger="matMenuTrigger" [ngClass]="params.cellClass" [value]="menuData.value">
    <span *ngIf="menuData.comments && menuData.comments!=''">
      <img class="infoIcon" src="../assets/customicons/info_amber.svg" alt="info">
    </span>
  </div>
</div>
<mat-menu #inputDisabledMenu="matMenu" class="common" xPosition="after">
  <ng-template matMenuContent let-data="menuData">
  <div class="edit-input-menu" [ngClass]="{'light-theme':!theme}">
    <div class="row header">
      <div>
        Port of Alboraya ({{menuData.port}})
      </div>
      <div class="line"></div>
      <div (click)="cancel()">
        <mat-icon class="close">close</mat-icon>
      </div>
    </div>
    <div class="input">
      <div>{{params.column.colDef.headerName}}</div>
      <mat-form-field appearance="fill">
        <input matInput disabled style="color:white;" [value]="menuData.value">
      </mat-form-field>
    </div>
    <div class="comments">
      <div>Comments</div>
      <mat-form-field appearance="fill">
        <textarea matInput disabled [value]="menuData.comments"></textarea>
      </mat-form-field>
    </div>
    </div>
  </ng-template>
</mat-menu>

<div *ngIf="params.type=='edit-with-popup'">
  <div (mouseenter)="!menuClick  && toggleMenuInput($event,params.value);" (click)="toggleMenu3Input($event)"
    (mouseleave)="!menuClick  && toggleMenu2Input();" (menuClosed)="toggleMenu1Input($event);">
    <input disabled style="z-index: 1050;" #inp [matMenuTriggerFor]="inputEditMenu" [matMenuTriggerData]="menuData"
      #inputMenuTrigger="matMenuTrigger" [ngClass]="params.cellClass" [value]="menuData.value">
    <span *ngIf="menuData.comments && menuData.comments!=''">
      <img class="infoIcon" src="../assets/customicons/info_amber.svg" alt="info">
    </span>
  </div>
</div>
<mat-menu #inputEditMenu="matMenu" class="common" xPosition="after">
  <ng-template matMenuContent let-data="menuData">
  <div class="edit-input-menu" [ngClass]="{'light-theme':!theme}">
    <div class="row header">
      <div>
        Port of Alboraya ({{menuData.port}})
      </div>
      <div class="line"></div>
      <div (click)="cancel()">
        <mat-icon class="close">close</mat-icon>
      </div>
    </div>
    <div class="input">
      <div>{{params.column.colDef.headerName}}</div>
      <mat-form-field appearance="fill">
        <input matInput #inpt id="inputValue" [value]="menuData.value" (keyup)="onEditCell()"
          (click)="$event.stopPropagation();">
      </mat-form-field>
    </div>
    <div class="comments">
      <div>Comments</div>
      <mat-form-field appearance="fill">
        <textarea matInput #cmnt [(ngModel)]="usercomments" (keyup)="onEditCell()"
          (click)="$event.stopPropagation();"></textarea>
      </mat-form-field>
    </div>
    <div class="actions">
      <button mat-button class="cancel" (click)="cancel()">CANCEL</button>
      <button mat-raised-button [disabled]="!enableSave" [ngClass]="{'active':enableSave}" class="save"
        (click)="saveInput(inpt.value)">Proceed</button>
    </div>
    </div>
  </ng-template>
</mat-menu>

<div *ngIf="params.type=='checkbox-disabled'" [ngClass]="params.cellClass">
  <div style="cursor:pointer;" (mouseenter)="!menuClick  && toggleMenuInput($event,params.value);" (click)="toggleMenu3Input($event)"
    (mouseleave)="!menuClick  && toggleMenu2Input();">
    <div style="z-index: 1050;pointer-events:none;" [matMenuTriggerFor]="checkboxDisabledMenu" [matMenuTriggerData]="menuData"
    #inputMenuTrigger="matMenuTrigger">
    <mat-checkbox disabled   style="cursor:pointer;" [ngClass]="params.cellClass" [checked]="menuData.value">
    </mat-checkbox>
    </div>
    <span *ngIf="menuData.comments && menuData.comments!=''">
      <img class="infoIcon" src="../assets/customicons/info_amber.svg" alt="info">
    </span>
  </div>

</div>
<mat-menu #checkboxDisabledMenu="matMenu" class="common edit-checkbox-menu" xPosition="after">
  <ng-template matMenuContent let-data="menuData">
  <div id="edit-checkbox-menu" [ngClass]="{'light-theme':!theme}">
    <div class="row header">
      <div>
        Port of Alboraya ({{menuData.port}})
      </div>
      <div class="line"></div>
      <div (click)="cancel()">
        <mat-icon class="close">close</mat-icon>
      </div>
    </div>
    <div class="input">
      <div>
        <span class="checkbox-title">Min SOA</span>
        <mat-checkbox disabled class="checkbox" [checked]="menuData.value">
        </mat-checkbox>
      </div>
    </div>
    <div class="comments">
      <div>Comments</div>
      <mat-form-field appearance="fill">
        <textarea matInput disabled [value]="menuData.comments"></textarea>
      </mat-form-field>
    </div>
    </div>
  </ng-template>
</mat-menu>

<div *ngIf="params.type=='checkbox'" [ngClass]="params.cellClass">
  <mat-checkbox [checked]="params.value" [(ngModel)]="params.data.ack" (change)="toggleOperAck()"></mat-checkbox>
</div>

<div *ngIf="params.type=='checkbox-with-popup'" [ngClass]="params.cellClass">

  <div  style="cursor:pointer;" (mouseenter)="!menuClick  && toggleMenuCheckbox($event);"
  (click)="toggleMenu3Checkbox($event)"
  (mouseleave)="!menuClick  && toggleMenu2Checkbox();">
  <mat-checkbox style="z-index: 1050;pointer-events:none;" disabled [checked]="menuData.value" 
  [matMenuTriggerFor]="checkboxEditMenu"
[matMenuTriggerData]="menuData" #inputMenuTrigger="matMenuTrigger" >
  </mat-checkbox>
  <span *ngIf="menuData.comments && menuData.comments!=''">
    <img class="infoIcon" src="../assets/customicons/info_amber.svg" alt="info">
  </span>
</div>
</div>
<mat-menu #checkboxEditMenu="matMenu" class="common edit-checkbox-menu" xPosition="after" yPosition="below">
  <ng-template matMenuContent let-data="menuData">
  <div id="edit-checkbox-menu" [ngClass]="{'light-theme':!theme}">
    <div class="row header">
      <div>
        Port of Alboraya ({{menuData.port}})
      </div>
      <div class="line"></div>
      <div (click)="cancel()">
        <mat-icon class="close">close</mat-icon>
      </div>
    </div>
    <div class="input">
      <div>
        <span class="checkbox-title">Min SOA</span>
        <mat-checkbox #chk class="checkbox" [(ngModel)]="isChecked" (click)="onCheckboxClick($event)">
        </mat-checkbox>
      </div>
    </div>
    <div class="comments">
      <div>Comments</div>
      <mat-form-field appearance="fill">
        <textarea matInput #cmnt [(ngModel)]="usercomments" (keyup)="onEditCell()"
          (click)="$event.stopPropagation();"></textarea>
      </mat-form-field>
    </div>
    <div class="actions">
      <button mat-button class="cancel" (click)="cancel()">CANCEL</button>
      <button mat-raised-button [disabled]="!enableSave" [ngClass]="{'active':enableSave}" class="save"
        (click)="saveCheckbox()">Proceed</button>
    </div>
    </div>
  </ng-template>
</mat-menu>

<div class="port-cell" *ngIf="params.type=='port-readOnly'">
  <div matTooltip="{{params.value}}" [ngClass]="params.cellClass"
    style="text-align: left;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;margin: 0px 5px;width: 90px;">
    {{params.value}}</div>
</div>

<div class="port-cell" *ngIf="params.type=='port'" style="display:flex;">
  <div style="width:15px;">
    <mat-checkbox #check [ngClass]="{'cell-checkbox':!check.checked}" [(ngModel)]="params.data.createReqFlag"
      (change)="portClicked()">
    </mat-checkbox>
  </div>
  <div matTooltip="{{params.value}}"
    style="text-align: left;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;margin: 0px 5px;width: 45px;">
    {{params.value}}
  </div>
  <div style="width:15px;">
    <div class="info-i" (click)="toggleMenu3Info($event)" 
      (mouseenter)="!menuClick  && toggleMenuInfo($event,params.value);"
      (mouseleave)="!menuClick  && toggleMenu2Info();">
      <div style="z-index: 1050;pointer-events:none;"
      #infomenuTrigger="matMenuTrigger" [matMenuTriggerFor]="infoPopup"
        [matMenuTriggerData]="{data:params.value}">
        <span>i</span>
    </div>

  </div>
</div>
<mat-menu  #infoPopup="matMenu" xPosition="after" class="common">
  <ng-template matMenuContent let-data="data">
    <div class="info_popup" [ngClass]="{'light-theme':!theme}">
      <div class="row info-header">
        <div>
          Port of Alboraya ({{data}})
        </div>
        <div class="line"></div>
        <div (click)="cancelMenu()">
          <mat-icon class="close">close</mat-icon>
        </div>
      </div>
      <div class="row info-content">
        <div>
          Vessel arrival details
        </div>
        <div>
          <ul style="padding-left: 14px;vertical-align: middle; margin: 6px 0px 0px;">
            <li><span class="sub-content-title">ETA: </span><span class="sub-content-value"> 2020-04-13
                10:00</span></li>
            <li><span class="sub-content-title">ETD: </span><span class="sub-content-value"> 2020-04-13
                10:00</span></li>
          </ul>
        </div>
      </div>
      <div class="line"></div>
      <div class="row info-content">
        <div>
          Reserve Rule - Distillates
        </div>
        <div class="chip">
          <div class="row chips">
            <div class="col-3 pd-0 m-r-5">
              <div class="chip-value">
                58
                <span class="unit">MT</span>
              </div>
              <div class="chip-name">
                DMA
              </div>
            </div>
            <div class="col-3 pd-0 m-l-r-5">
              <div class="chip-value">
                120
                <span class="unit">MT</span>
              </div>
              <div class="chip-name">
                DMB
              </div>
            </div>
            <div class="col-3 pd-0 m-l-5">
              <div class="chip-value">
                10
                <span class="unit">MT</span>
              </div>
              <div class="chip-name">
                DMX
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="line"></div>
      <div class="row info-footer">
        <span (click)="closeInfoPopup()"> Link to Port Master</span>
      </div>
    </div>
  </ng-template>
</mat-menu>


    
    `
})

export class AGGridCellDataComponent implements ICellRendererAngularComp {
  public params: any;
  public toolTip: string;
  public data;
  public menuData;
  public menuClick: boolean;
  public showInfoIcon: boolean;
  public enableSave: boolean;
  public usercomments;
  public isChecked;
  public theme:boolean = true;
  constructor(public router: Router, public dialog: MatDialog, private elem: ElementRef,private localService:LocalService) {
  }

  ngOnInit() {
    this.localService.themeChange.subscribe(value => this.theme = value);

  }

  agInit(params: any): void {
    this.params = params;
    this.menuData = params.value;
    this.usercomments = params.value.comments ? params.value.comments : '';
    this.isChecked = params.value;
    this.toolTip = params.value;
  }

  refresh(): boolean {
    return false;
  }

  // @HostListener('document:click', ['$event']) clickout(event) {
  //     document.onclick = (args: any) : void => {
  //         if(args.target.tagName === 'BODY') {
  //             this.infomenuTrigger.closeMenu();
  //         }
  //     }
  //   }
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  @ViewChild('infomenuTrigger') infomenuTrigger: MatMenuTrigger;
  @ViewChild('inputMenuTrigger') inputMenuTrigger: MatMenuTrigger;



  toggleMenuInfo(event, data) {//onenter
    this.infomenuTrigger.openMenu();
    var overlay = document.querySelector('.cdk-overlay-container');
    overlay.classList.add('removeOverlay');
  }

  toggleMenu2Info() {//onleave
    this.cancelMenu();
    var overlay = document.querySelector('.cdk-overlay-container');
    overlay.classList.remove('removeOverlay');
  }

  toggleMenu3Info(event) { //onclick
    var overlay = document.querySelector('.cdk-overlay-container');
    overlay.classList.remove('removeOverlay');
    this.infomenuTrigger.openMenu();
    event.target.classList.add('clicked');
    this.menuClick = true;

  }
  cancelMenu() {
    this.infomenuTrigger.closeMenu();
    this.menuClick = false;
    let panels = this.elem.nativeElement.querySelectorAll('.info-i');
    panels.forEach((element) => {
      element.classList.remove('clicked');
    });
  }
  toggleMenu1Input(event) {//onmenuclose
    this.menuClick = false;
    this.enableSave = false;

  }
  toggleMenuInput(event, data) {//onenter
    if (this.menuData.comments && this.menuData.comments != '') {
      this.inputMenuTrigger.openMenu();
      var overlay = document.querySelector('.cdk-overlay-container');
      overlay.classList.add('removeOverlay');
    }
  }

  toggleMenu2Input() {//onleave
    if (this.inputMenuTrigger.menuOpen) {
      this.inputMenuTrigger.closeMenu();
      var overlay = document.querySelector('.cdk-overlay-container');
      overlay.classList.remove('removeOverlay');
    }
  }

  toggleMenu3Input(event) { //onclick
    this.menuClick = true;
    this.inputMenuTrigger.openMenu();
    if (document.getElementById('inputValue')) {
      document.getElementById('inputValue').focus();
    }

  }

  toggleMenuCheckbox(event) {//onenter
    if (this.menuData.comments && this.menuData.comments != '') {
      var overlay = document.querySelector('.cdk-overlay-container');
      if (overlay)
        overlay.classList.add('removeOverlay');
      this.inputMenuTrigger.openMenu();
    }
    if ((event.pageY + 201 > (window.innerHeight + event.offsetY))) {
      setTimeout(() => {
        const panels = document.querySelector('.edit-checkbox-menu');
        if (panels)
          panels.classList.add('hover-popup-pos');
      }, 0);
    }
  }

  toggleMenu2Checkbox() {//onleave
    if (this.inputMenuTrigger.menuOpen) {
      //setTimeout(() => {
      //this.menuClick = false;
      this.inputMenuTrigger.closeMenu();
      var overlay = document.querySelector('.cdk-overlay-container');
      overlay.classList.remove('removeOverlay');

      // },1000);
    }
  }

  toggleMenu3Checkbox(event) { //onclick
    var overlay = document.querySelector('.cdk-overlay-container');
    if (overlay)
      overlay.classList.remove('removeOverlay');
    this.menuClick = true;
    this.inputMenuTrigger.openMenu();
    if ((event.pageY + 201 > (window.innerHeight + event.offsetY))) {
      setTimeout(() => {
        const panels = document.querySelector('.edit-checkbox-menu');
        if (panels)
          panels.classList.add('hover-popup-pos');
      }, 0);
    }

  }
  portClicked() {
    this.params.context.componentParent.portClicked();
  }

  toggleOperAck() {
    this.params.context.componentParent.toggleOperAck();
  }
  triggerChangeEvent() {
    this.params.context.componentParent.triggerChangeEvent();
  }
  onCheckboxClick(event) {
    if (this.usercomments != "")
      this.enableSave = true;
    else
      this.enableSave = false;
    event.stopPropagation();
  }
  onEditCell() {
    if (this.usercomments != "")
      this.enableSave = true;
    else
      this.enableSave = false;
  }

  saveInput(value) {
    if (this.menuData.value != value || this.menuData.comments != this.usercomments) {
      this.showInfoIcon = true;
      this.menuData.value = value;
      this.menuData.comments = this.usercomments;
    }
    this.menuClick = false;
    this.enableSave = false;
    var overlay = document.querySelector('.cdk-overlay-container');
    overlay.classList.remove('removeOverlay');
    this.inputMenuTrigger.closeMenu();
    this.triggerChangeEvent();
  }
  saveCheckbox() {
    if (this.menuData.value != this.isChecked || this.menuData.comments != this.usercomments) {
      this.showInfoIcon = true;
      this.menuData.value = this.isChecked;
      this.menuData.comments = this.usercomments;
    }
    this.menuClick = false;
    this.enableSave = false;
    var overlay = document.querySelector('.cdk-overlay-container');
    overlay.classList.remove('removeOverlay');
    this.inputMenuTrigger.closeMenu();
    this.triggerChangeEvent();
  }
  cancel() {
    var overlay = document.querySelector('.cdk-overlay-container');
    overlay.classList.remove('removeOverlay');
    this.inputMenuTrigger.closeMenu();
    this.menuClick = false;
    this.enableSave = false;
  }

  closeInfoPopup() {
    var overlay = document.querySelector('.cdk-overlay-container');
    overlay.classList.remove('removeOverlay');
    this.infomenuTrigger.closeMenu();
    this.menuClick = false;
    let panels = this.elem.nativeElement.querySelectorAll('.info-i');
    panels.forEach((element) => {
      element.classList.remove('clicked');
    });
  }
}
@Component({
  selector: 'hover-menu',
  template: `
  <div *ngIf="items" style="display:flex;flex-wrap:wrap;" #menuTrigger="matMenuTrigger" [matMenuTriggerFor]="hoverTitle"
  (mouseenter)="toggleMenu($event);" (mouseleave)="toggleMenu2();">
  <div *ngFor="let item of items" class="aggrid-content-center dark-multiple-text" >
  <div class=" aggrid-text-resizable"  >{{item}}</div>
          </div>
          <mat-menu class="outstanding-req-menu" #hoverTitle="matMenu" xPosition="after"  style="position: relative;bottom: 15px;left: 66px;">
          <div class="hover-tooltip" *ngFor="let item of items" [ngClass]="{'dark-theme':theme,'light-theme':!theme}">
              <table>
                <tr class="hover-title">
                  <td>{{item}}</td>
                  <td class="hover-value">350 BBLS</td>
                </tr>
                <tr class="hover-title">
                  <td>Request Date</td>
                  <td class="hover-value">12/09/2020</td>
                </tr>
              </table>
          </div>
        </mat-menu>
</div>
  
  `
})
export class HoverMenuComponent {
  @Input('items') items;

  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  public theme:boolean = true;
  constructor(private elem: ElementRef,private localService: LocalService) { }

  ngOnInit(){
    this.localService.themeChange.subscribe(value => this.theme = value);
  }

  toggleMenu(event) {//onenter
    this.menuTrigger.openMenu();
    var overlay = document.querySelector('.cdk-overlay-container');
    overlay.classList.add('removeOverlay');

  }

  toggleMenu2() {//onleave
    this.menuTrigger.closeMenu();
    var overlay = document.querySelector('.cdk-overlay-container');
    overlay.classList.remove('removeOverlay');

  }
}