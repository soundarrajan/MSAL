import { Component } from "@angular/core";
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { LocalService } from '../../services/local-service.service';

@Component({
    selector: 'ag-grid-cell-renderer',
    template: `
    <div *ngIf="this?.params?.colDef?.filter!=='date'" [ngClass]="params.cellClass" [ngStyle]="params.cellStyle" matTooltip="{{params.value}}" style="margin:0px">{{params.value}}</div>
    <div *ngIf="this?.params?.colDef?.filter=='date'" [ngClass]="params.cellClass" matTooltip="{{params.value | utcDatePipe | date: 'dd/MM/yyyy'}}" style="margin:0px">{{params.value | date: 'dd/MM/yyyy'}}</div>
    `
})
export class AGGridCellRendererComponent implements ICellRendererAngularComp  {
    public params: any;
    public shiptechUrl: string ;
    public data;
    public menuData;
    public etaDays: any;
    public etaInTime: any;
    public etdDays: any;
    public theme:boolean = true;
    public etdInTime: any;
    public shiptechPortUrl: string;
	constructor(public router: Router, private localService:LocalService) {    
        this.shiptechUrl =  new URL(window.location.href).origin;;
        this.shiptechPortUrl = `${this.shiptechUrl}/#/masters/locations/edit/`;
    }        
	
    agInit(params: any): void {
        this.params = params;
        this.menuData = params.value;
    }
    ngOnInit() {
        this.localService.themeChange.subscribe(value => this.theme = value);
      }

    refresh(): boolean {
        return false;
    }
} 