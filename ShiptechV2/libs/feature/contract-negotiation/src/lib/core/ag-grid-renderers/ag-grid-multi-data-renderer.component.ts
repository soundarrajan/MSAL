import { Component } from "@angular/core";
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from "ag-grid-angular";
@Component({
    selector: 'ag-grid-multi-data-renderer',
    template: `
    <div class="multi-data">
    <div *ngFor="let item of params.value; let i = index" class="container">
        <div style="height:7px"></div>
        <ng-container *ngIf="item[params.label]!='' && params.label=='locationName'">            
            <div *ngIf="item[params.label]!='' && params.label=='locationName'"
                [matTooltip]="item[params.label]" matTooltipClass="lightTooltip" [ngClass]="params.cellClass">{{item[params.label]}}</div>                
            <div *ngFor="let items of item.products; let j = index">
                <div *ngIf="j!=0" style="height:22px;"></div>
               
            </div> 
            <div *ngIf="i!=(params.data.locations.length-1)" style="border-top:1px solid #F1F1F2;;position:relative;top:7px;width: 100%"></div>           
        </ng-container>
        <ng-container *ngIf="params.label!='locationName'">           
            <div *ngFor="let items of item.products; let k = index" class="loop-container" 
            [ngStyle]="item.products.length>1 && k==(item.products.length-1) && params.label!='productName'&& params.label!='offers'?{'margin-bottom': '1px'} : {'margin-bottom': '0px'}"> 
            <div *ngIf="k!=0" style="height:4px;"></div>
                <div  [matTooltip]="items[params.label]"
                
                matTooltipClass="lightTooltip"  [ngClass]="params.cellClass">{{items[params.label]}}</div>               
            </div>
            <div *ngIf="item.products.length==1" style="border-top:1px solid #F1F1F2;;position:relative;top:7px;width: 100%"></div>
            <div *ngIf="item.products.length>1 && i!=(params.data.locations.length-1)" style="border-top:1px solid #F1F1F2;;position:relative;top:5px;width: 100%"></div>          
        </ng-container>
        <div style="height:7px"></div>
    </div>
</div>
        
        
    `
})

export class AGGridMultiDataRendererComponent implements ICellRendererAngularComp {
    public params: any;
    constructor(public router: Router) {
    }

    agInit(params: any): void {
        this.params = params;
    }

    refresh(): boolean {
        return false;
    }
}

