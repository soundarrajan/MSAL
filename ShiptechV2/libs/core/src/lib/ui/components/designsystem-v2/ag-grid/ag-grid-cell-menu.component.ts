import { Component, ViewChild, ElementRef } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { OperationalAmountDialog } from "src/app/movements/popup-screens/operational-amount.component";
import { OpsSpecParameterDialog } from "src/app/movements/popup-screens/ops-spec-parameter.component";
import { EditSortOrderDialog } from "src/app/movements/popup-screens/edit-sort-order.component";
import { Router } from "@angular/router";
import { SpecParameterDialog } from '../../../movements/popup-screens/spec-parameter.component';
import { LocalService } from 'src/app/services/local-service.service';

@Component({
    selector: 'aggrid-cell-data',
    template: `
    <div *ngIf="params.type=='cell-hover-click-menu-popup'">
    <span [ngStyle]="{'text-align':params?.align}"
          style="width: 85%;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{params.value}}</span>
    <span style="top: 6px; right:16px;" class="product-popup"
          [matMenuTriggerFor]="clickmenupopup" #menuTrigger="matMenuTrigger" (mouseenter)="menuTrigger.openMenu()"
          (click)="$event.stopPropagation();" (menuOpened)="clickMenuOpened();" (menuClosed)="clickMenuClosed();"></span>
    <div class="blue-menu-icon" *ngIf="blueMenuIcon" style="position: absolute;top: -3px;right: 7px;"><img class="p-r-10"
              src="../../../assets/customicons/blue-menu-icon.svg" width="25" alt="Savc As icon"></div>
  
  </div>
  <mat-menu #clickmenupopup="matMenu" class="small-menu" yPosition="above">
    <span (mouseleave)="menuTrigger.closeMenu();">
              <div class="no-border p-lr-0" *ngFor="let item of params.labels">
                  <div class="hover-click-menu-popup" (click)="openPopup(item.name);">
                     <div [class]="item.iconClass?item.iconClass:'no-icon-class'"></div> <div class="fs-12">{{item.name}}</div>
    </div>
    </div>
    </span>
  </mat-menu>
  
  <div *ngIf="params.type=='hover-click-drag-menu-singleGrid'" class="hover-click-drag-menu" [ngStyle]="{'justify-content':params.cell_alignment?params.cell_alignment:null}">
    <div class="popup-icon info-icon hover-menu-icon" [matMenuTriggerFor]="hovertogglemenuSingle"
      #hovermenuTriggerSingleGrid="matMenuTrigger" (click)="freezeMenuOpened($event);" (mouseenter)="hoverPopupOpen($event);"
      (mouseleave)="hoverOutPopup();" (menuClosed)="freezeMenuClosed($event);"></div>
    <div [ngClass]="params.cellClass" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;" (click)="navigateTo($event)">
      {{params.value}}</div>
  </div>
  <mat-menu #hovertogglemenuSingle="matMenu" class="matmenu-blue-v2 hover-menu-white" xPosition="after" [hasBackdrop]="false">
    <div (keydown)="$event.stopPropagation()" (click)="$event.stopPropagation();$event.preventDefault();" cdkDrag
      cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle class="blue-popup">
      <h2 mat-dialog-title class="dialog-title blue-title">
        {{params.headerLabel}}
      </h2>
      <div *ngIf="isMenuOpen" class="close-btn-red" (click)="freezePopupClose($event);"></div>
      <table style="position:relative;">
        <thead>
          <tr class="head">
            <th>Label</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of params.rowDetails;">
            <td [title]="item.label">{{item.label}}</td>
            <td [title]="item.value">{{item.value}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </mat-menu>
  
  <div *ngIf="params.type=='hover-click-drag-menu-dualGrid-left'" class="hover-click-drag-menu">
    <div class="popup-icon info-icon hover-menu-icon" [matMenuTriggerFor]="hovertogglemenuLeft"
      #hovermenuTriggerLeftGrid="matMenuTrigger" (click)="freezeMenuOpened($event,true);"
      (mouseenter)="hoverPopupOpen($event,true);" (mouseleave)="hoverOutPopup(true);"
      (menuClosed)="freezeMenuClosed($event,true);"></div>
    <div [ngClass]="params.cellClass" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
      {{params.value}}</div>
  </div>
  <mat-menu #hovertogglemenuLeft="matMenu" class="matmenu-blue-v2 hover-menu-white" xPosition="after" [hasBackdrop]="false">
    <div (keydown)="$event.stopPropagation()" (click)="$event.stopPropagation();$event.preventDefault();" cdkDrag
      cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle class="blue-popup">
      <h2 mat-dialog-title class="dialog-title blue-title">
      {{params.headerLabel}}
      </h2>
      <div *ngIf="isMenuOpen" class="close-btn-red" (click)="freezePopupClose($event,true);"></div>
      <table style="position:relative;">
        <thead>
          <tr class="head">
            <th>Label</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of params.rowDetails;">
          <td [title]="item.label">{{item.label}}</td>
          <td [title]="item.value">{{item.value}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </mat-menu>
  
  <div *ngIf="params.type=='hover-click-drag-menu-dualGrid-right'" class="hover-click-drag-menu">
    <div class="popup-icon info-icon hover-menu-icon" [matMenuTriggerFor]="hovermenuTriggerRight"
      #hovermenuTriggerRightGrid="matMenuTrigger" (click)="freezeMenuOpened($event,false);"
      (mouseenter)="hoverPopupOpen($event,false);" (mouseleave)="hoverOutPopup(false);"
      (menuClosed)="freezeMenuClosed($event,false);"></div>
    <div [ngClass]="params.cellClass" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
      {{params.value}}</div>
  </div>
  <mat-menu #hovermenuTriggerRight="matMenu" class="matmenu-blue-v2 hover-menu-white" xPosition="after" [hasBackdrop]="false">
    <div (keydown)="$event.stopPropagation()" (click)="$event.stopPropagation();$event.preventDefault();" cdkDrag
      cdkDragRootElement=".cdk-overlay-pane" cdkDragHandle class="blue-popup">
      <h2 mat-dialog-title class="dialog-title blue-title">
      {{params.headerLabel}}
      </h2>
      <div *ngIf="isMenuOpen" class="close-btn-red" (click)="freezePopupClose($event,false);"></div>
      <table style="position:relative;">
        <thead>
          <tr class="head">
            <th>Label</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of params.rowDetails;">
          <td [title]="item.label">{{item.label}}</td>
          <td [title]="item.value">{{item.value}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </mat-menu>
  `,
    styles: []
})

export class AGGridCellMenuPopupComponent implements ICellRendererAngularComp {
    public params: any;
    public toolTip: string;
    public blueMenuIcon: boolean = false;
    public isMenuOpen: boolean = false;
    public allowMouseLeave: boolean = true;
    @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
    @ViewChild('hovermenuTriggerLeftGrid') hovermenuTriggerLeftGrid: MatMenuTrigger;
    @ViewChild('hovermenuTriggerRightGrid') hovermenuTriggerRightGrid: MatMenuTrigger;
    @ViewChild('hovermenuTriggerSingleGrid') hovermenuTriggerSingleGrid: MatMenuTrigger;
    constructor(private router: Router, public dialog: MatDialog, private elem: ElementRef, private service: LocalService) {
        // Close the opened matmenu on tab change
        this.service.getFutureSettlementTabChange().subscribe((index) => {
            if (this.hovermenuTriggerLeftGrid && this.hovermenuTriggerLeftGrid.menuOpen)
                this.hovermenuTriggerLeftGrid.closeMenu();
            if (this.hovermenuTriggerRightGrid && this.hovermenuTriggerRightGrid.menuOpen)
                this.hovermenuTriggerRightGrid.closeMenu();
        });
    }

    ngOnInit() {
    }

    agInit(params: any): void {
        this.params = params;
        this.toolTip = params.value;
    }

    refresh(): boolean {
        return false;
    }

    clickMenuOpened() {
        this.blueMenuIcon = true;
    }

    clickMenuClosed() {
        this.blueMenuIcon = false;
    }


    openPopup(label) {
        let dialogRef;
        switch (label) {
            case 'Costing Details': {
                dialogRef = this.dialog.open(OperationalAmountDialog, {
                    width: '600px',
                    maxHeight: '600px',
                    panelClass: 'movements-popup-grid'
                });
                break;
            }
            case 'Spec Group': {
                dialogRef = this.dialog.open(OpsSpecParameterDialog, {
                    width: '900px',
                    maxHeight: '480px',
                    panelClass: 'movements-popup-grid'
                });
                break;
            }
            case 'Sort Order': {
                dialogRef = this.dialog.open(EditSortOrderDialog, {
                    width: '100%',
                    maxHeight: '100%',
                    panelClass: 'movements-popup-grid'
                });
                break;
            }
            case 'Spec Parameter': {
                dialogRef = this.dialog.open(SpecParameterDialog, {
                    width: '956px',
                    maxHeight: '480px',
                    panelClass: 'movements-popup-grid'
                });
                break;
            }

        }
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    // TYPE=hover-click-drag-menu
    freezePopupClose(ev, left?) {
        this.isMenuOpen = false;
        if (left == true) {
            ev.target.parentElement.style.removeProperty('transform');
            this.hovermenuTriggerLeftGrid.closeMenu();

        } else if (left == false) {
            ev.target.parentElement.style.removeProperty('transform');
            this.hovermenuTriggerRightGrid.closeMenu();
        }
        else {
            ev.target.parentElement.style.removeProperty('transform');
            this.hovermenuTriggerSingleGrid.closeMenu();
        }

        var overlay = document.querySelector('.cdk-overlay-container');
        setTimeout(function () {
            overlay.classList.remove('removeOverlay');
            overlay.classList.remove('halfOverlay');
        }, 1000);
    }

    freezeMenuOpened(event, left?) {
        this.isMenuOpen = true;
        this.allowMouseLeave = false;
        event.target.classList.add('selectedIcon-v2');
        var overlay = document.querySelector('.cdk-overlay-container');
        if (left == true) {
            this.hovermenuTriggerLeftGrid.openMenu();
            setTimeout(function () {
                overlay.classList.add('halfOverlay');
            }, 1000);

            var hovericon = Array.from(document.querySelectorAll<HTMLElement>('.hoverdisable'));
            hovericon.forEach((element) => {
                element.style.pointerEvents = "none";

            });
        }
        else if (left == false) {
            this.hovermenuTriggerRightGrid.openMenu();
            overlay.classList.add('removeOverlay');
            const frameZones = Array.from(document.querySelectorAll('.cdk-overlay-pane'));
            if (frameZones.length <= 1) {
                frameZones[0].classList.add('movedpanel2');
                frameZones[0].classList.remove('movedpanel1');
                frameZones[0].classList.remove('movedpanel');
                overlay.classList.remove('halfOverlay');
            } else {
                frameZones.forEach((el) => {
                    frameZones[1].classList.add('movedpanel2');
                    frameZones[1].classList.remove('movedpanel1');
                    frameZones[1].classList.remove('movedpanel');
                    overlay.classList.add('halfOverlay');
                });
            }
            var hovericon = Array.from(document.querySelectorAll<HTMLElement>('.hoverdisable1'));
            hovericon.forEach((element) => {
                element.style.pointerEvents = "none";

            });

        }
        else {
            this.hovermenuTriggerSingleGrid.openMenu();
            var hovericon = Array.from(document.querySelectorAll<HTMLElement>('.hoverdisable'));
            hovericon.forEach((element) => {
                element.style.pointerEvents = "none";

            });
        }
    }

    hoverPopupOpen(event, left?) {
        event.target.classList.add('selectedIcon-v2');
        if (left == true) {
            this.hovermenuTriggerLeftGrid.openMenu();
            var overlay = document.querySelector('.cdk-overlay-container');
            overlay.classList.add('removeOverlay');
            var overlay1 = document.querySelector('.cdk-overlay-pane');
            overlay1.classList.add('movedpanel');
            const frameZones = Array.from(document.querySelectorAll('.cdk-overlay-pane'));
            if (frameZones.length > 1) {
                frameZones[1].classList.add('movedpanel');
            }
        }
        else if (left == false) {
            this.hovermenuTriggerRightGrid.openMenu();
            var overlay = document.querySelector('.cdk-overlay-container');
            overlay.classList.add('removeOverlay');
            overlay.classList.add('halfOverlay');
            const frameZones = Array.from(document.querySelectorAll('.cdk-overlay-pane'));
            if (frameZones.length <= 1) {
                frameZones[0].classList.add('movedpanel1');
            } else {
                frameZones.forEach((el) => {
                    frameZones[1].classList.add('movedpanel1');
                });
            }
        }
        else {
            this.hovermenuTriggerSingleGrid.openMenu();
            var overlay = document.querySelector('.cdk-overlay-container');
            overlay.classList.add('removeOverlay');
            var overlay1 = document.querySelector('.cdk-overlay-pane');
            overlay1.classList.add('movedpanel');
            const frameZones = Array.from(document.querySelectorAll('.cdk-overlay-pane'));
            if (frameZones.length > 1) {
                frameZones[1].classList.add('movedpanel');
            }
        }
        this.allowMouseLeave = true;
    }

    hoverOutPopup(left?) {
        if (this.allowMouseLeave) {
            var overlay = document.querySelector('.cdk-overlay-container');
            if (left == true) {
                this.hovermenuTriggerLeftGrid.closeMenu();
                overlay.classList.remove('removeOverlay');
                overlay.classList.remove('halfOverlay');
            }
            else if (left == false) {
                this.hovermenuTriggerRightGrid.closeMenu();
                overlay.classList.remove('removeOverlay');
                overlay.classList.remove('halfOverlay');
            }
            else {
                this.hovermenuTriggerSingleGrid.closeMenu();
                overlay.classList.remove('removeOverlay');
            }
        }
    }

    navigateTo() {
        this.params.onClick(this.params);
    }

    freezeMenuClosed(event, left?) {
        let panels = this.elem.nativeElement.querySelectorAll('.hover-menu-icon');
        panels.forEach((element) => {
            element.classList.remove('selectedIcon-v2');
        });
        if (left == true) {
            var hovericon = Array.from(document.querySelectorAll<HTMLElement>('.hoverdisable'));
            hovericon.forEach((element) => {
                element.style.pointerEvents = "auto";
            });
        }
        else if (left == false) {
            var hovericon = Array.from(document.querySelectorAll<HTMLElement>('.hoverdisable1'));
            hovericon.forEach((element) => {
                element.style.pointerEvents = "auto";
            });
        }
        else {
            var hovericon = Array.from(document.querySelectorAll<HTMLElement>('.hoverdisable'));
            hovericon.forEach((element) => {
                element.style.pointerEvents = "auto";
            });
        }
        var overlay = document.querySelector('.cdk-overlay-container');
        var totalPopup = Array.from(document.querySelectorAll('.cdk-overlay-connected-position-bounding-box'));
        if (totalPopup.length == 1) {
            overlay.classList.add('fullOverlay');
            overlay.classList.add('removeOverlay');
        }
    }
    // public rowDetails =
    //     [
    //         { label: "Trade Date", value: "12/10/2020" },
    //         { label: "Contract Name", value: "Oct-Contract" },
    //         { label: "Expiry Date", value: "12/12/2018" },
    //         { label: "Lots", value: "5" },
    //         { label: "MTM Price", value: "12,600 USD" },
    //         { label: "P&L(before cost)", value: "12,800,000 USD" },
    //         { label: "Book", value: "Test Book" },
    //         { label: "Strategy", value: "Test Strategy" },
    //         { label: "Trade ID", value: "PHB1029922" },
    //         { label: "Parent Trade ID", value: "PHB28332222" },
    //         { label: "EFP", value: "EFP18212" },
    //         { label: "Exchange", value: "NYSE" },
    //         { label: "Clearing Broker", value: "Veinberger Lukas" },
    //         { label: "Total Fee", value: "12,000 USD" },
    //         { label: "Status", value: "Confirmed" }
    //     ];
}