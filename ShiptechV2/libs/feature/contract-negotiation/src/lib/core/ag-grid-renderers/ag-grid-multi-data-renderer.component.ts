import { Component } from "@angular/core";
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from "ag-grid-angular";
@Component({
    selector: 'ag-grid-multi-data-renderer',
    template: `
    <div class="multi-data">
    <div *ngFor="let item of flocation; let i = index" class="container">
        <div style="height:7px"></div>
        <ng-container *ngIf="item[params.label]!='' && params.label=='locationName'">            
            <div *ngIf="item[params.label]!='' && params.label=='locationName'"
                [matTooltip]="item[params.label]" matTooltipClass="lightTooltip" [ngClass]="params.cellClass">{{item[params.label]}}</div>                
            <div *ngFor="let items of item.products; let j = index">
                <div *ngIf="j!=0" style="height:22px;"></div>
               
            </div> 
            <div *ngIf="i!=(flocation?.length-1)" style="border-top:1px solid #F1F1F2;;position:relative;top:7px;width: 100%"></div>           
        </ng-container>
        <ng-container *ngIf="params.label!='locationName'">           
            <div *ngFor="let items of item.products; let k = index" class="loop-container" 
            [ngStyle]="item.products?.length>1 && k==(item.products?.length-1) && params.label!='productName'&& params.label!='offers'?{'margin-bottom': '1px'} : {'margin-bottom': '0px'}"> 
            <div *ngIf="k!=0" style="height:4px;"></div>
                <div  [matTooltip]="items[params.label]"
                
                matTooltipClass="lightTooltip"  [ngClass]="params.cellClass">{{items[params.label]}}</div>               
            </div>
            <div *ngIf="item.products?.length==1" style="border-top:1px solid #F1F1F2;;position:relative;top:7px;width: 100%"></div>
            <div *ngIf="item.products?.length>1 && i!=(flocation?.length-1)" style="border-top:1px solid #F1F1F2;;position:relative;top:5px;width: 100%"></div>          
        </ng-container>
        <div style="height:7px"></div>
    </div>
</div>
        
        
    `
})

export class AGGridMultiDataRendererComponent implements ICellRendererAngularComp {
    public params: any;
    public flocation = [];
    constructor(public router: Router) {
    }

    agInit(params: any): void {
        this.params = params;
        let product_sText = params.api.getFilterInstance('productName').getModel()?.filter;
        let product_fType = params.api.getFilterInstance('productName').getModel()?.type;

        let pro_filtered = [];
        // console.log(product_sText);
        // console.log(product_fType);  
        // console.log(this.params.data.id);
        // console.log(this.params.data);
        switch (product_fType) {
            case 'contains': {
                let pro_filtered_location = [];
                pro_filtered_location = this.params.data['locations'].map((element) => {
                    return { ...element, products: element.products.filter((subElement) => subElement.productName.toUpperCase().indexOf(product_sText.toUpperCase()) != -1) }
                })
                console.log(pro_filtered_location, "b4");
                pro_filtered = pro_filtered_location.filter(element => element.products.length > 0);
                console.log(pro_filtered, "Afr");
            }
                break;
        }

        if (product_sText && product_fType == 'contains')
            this.flocation = [...pro_filtered];
        else
            this.flocation = [...params.data['locations']];

        let location_sText = params.api.getFilterInstance('locations').getModel()?.filter;
        let location_fType = params.api.getFilterInstance('locations').getModel()?.type;

        let loc_filtered = [];
        switch (location_fType) {
            case 'contains':
                {
                    loc_filtered = this.flocation.filter(function (str) {
                        if (str != null && str.locationName != null)
                            return str.locationName.indexOf(location_sText.toUpperCase()) != -1;
                    });
                }
                break;
            case 'notContains':
                // this.selected = 'quantity';
                break;
            case 'equals':
                // this.selected = 'residue';
                break;
            case 'notEqual':
                // this.selected = 'residue';
                break;
            case 'startsWith':
                // this.selected = 'residue';
                break;
            case 'endsWith':
                // this.selected = 'residue';
                break;
            default:
                // this.selected = 'quantity';
                break;
        }


        if (location_sText && location_fType == 'contains')
            this.flocation = loc_filtered;
        else if (!product_sText && product_fType == 'contains')
            this.flocation = [...params.data['locations']];


    }

    refresh(): boolean {
        return false;
    }
}

