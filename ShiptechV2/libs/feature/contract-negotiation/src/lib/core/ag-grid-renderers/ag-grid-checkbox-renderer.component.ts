import { Component, OnDestroy, ViewChild  } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { MatMenuTrigger } from '@angular/material/menu';
import { LocalService } from '../../services/local-service.service';

@Component({
    selector: 'checkbox-renderer',
    template: `
    <div *ngIf="params.node.level != 0 && this.isCalculated" class="row-checkbox-renderer" 
            (mouseenter)="openMenu(params.status)" (click)="clickMenuOpened(params.status);" (mouseleave)="closeMenu();"(menuClosed)="hoverMenuClosed();">
    <div *ngIf="params.value" [ngClass]="params.cellClass">
        <div>
            <div [ngClass]="{
                'checkbox-svg':params.isClickable && !showChecked,
                'checkbox-checked-svg':params.isClickable && showChecked,
                'tick-mark-svg':!params.isClickable
                }" 
                (click)="params.isClickable && onChange()"></div>
        </div>
    </div>
    <div>
    <span [ngClass]="params.cellValueClass">{{params.value}}</span>
    </div>
    <div #hoverPopupTrigger="matMenuTrigger" [matMenuTriggerFor]="hoverMenupopup">
            <mat-menu #hoverMenupopup="matMenu" class="link-to-contract-menu" overlapTrigger="false">
                <span (mouseleave)="hoverPopupTrigger.closeMenu()">
                    <!-- (mouseleave)="hoverPopupTrigger.closeMenu()" -->
                    <div class="link-to">
                        <div></div><span>Link to Contract 12321</span>
                    </div>
                    <div class="link-to">
                        <div></div><span>Link to Contract 12322</span>
                    </div>
                </span>
            </mat-menu>
    </div>    
    
    <div>
    `,
    styles: [

    ]
})
export class AGGridCheckboxRenderer implements ICellRendererAngularComp {
    @ViewChild('hoverPopupTrigger') hoverPopupTrigger: MatMenuTrigger;
    public params: any;
    public showChecked = false;
    public isCalculated: boolean = false;
    public allowMouseLeave:boolean=true; 
    constructor(private localService: LocalService) {
      }
    agInit(params: any): void {
        this.params = params;
    }

    refresh(): boolean {
        return false;
    }

    onChange() {
        this.showChecked=!this.showChecked;
        this.localService.setContractPreviewEmail(this.showChecked);
        //this.params.node.setDataValue(this.params.colDef, this.checked);

    }

    openMenu(status){
        if(status == 'Contracted') {
            this.hoverPopupTrigger.openMenu();
            var  overlay = document.querySelector('.cdk-overlay-container');
            overlay.classList.add('removeOverlay');     
            var  overlay1 = document.querySelector('.cdk-overlay-pane');
            overlay1.classList.add('movedPanel');     
        }
        this.allowMouseLeave = true;
    }
    closeMenu(){
        if(this.allowMouseLeave){
            this.hoverPopupTrigger.closeMenu();
            var  overlay = document.querySelector('.cdk-overlay-container');
            overlay.classList.remove('removeOverlay');
        }
        
    }
    hoverMenuClosed(){
        var  overlay = document.querySelector('.cdk-overlay-container');
        overlay.classList.remove('removeOverlay');
        var  overlay1 = document.querySelector('.cdk-overlay-pane');
        overlay1.classList.remove('movedPanel');
    } 
    clickMenuOpened(status){
        if(status == 'Contracted') {
        this.allowMouseLeave = false;
        var  overlay = document.querySelector('.cdk-overlay-container');
        overlay.classList.remove('removeOverlay');
        var  overlay1 = document.querySelector('.cdk-overlay-pane');
        overlay1.classList.add('movedPanel');
        this.hoverPopupTrigger.openMenu();
        }
    }
    ngAfterViewInit() {
    this.localService.calculatePriceUpdate.subscribe(data => {
    //console.log(data);
    this.isCalculated=data;
    });
   }
}
