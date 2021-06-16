import { Component, OnInit, ViewChild, Input, ElementRef, Output, EventEmitter, QueryList, ViewChildren, HostListener } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatExpansionPanel } from '@angular/material/expansion';
import { GridOptions } from '@ag-grid-community/core';
import { AGGridCellRendererComponent } from '../ag-grid/ag-grid-cell-renderer.component';
import { LoggerService } from '../../services/logger.service';
import { LocalService } from '../../services/local-service.service';
import { PortPopupService } from '../../services/port-popup.service';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

export interface IPortGrade {
  'HSFO': string[];
  'ULSFO': string[];
  'DIS': string[];
}
export interface IPortProduct {
  "productType": string;
  "bopsProductType": string;
  "maxTransferRate": string;
  "minSupplyQty": string;
  "maxSupplyQty": string;
  "lowestGradeProductName": string;
}
@Component({
  selector: 'app-port-popup',
  templateUrl: './port-popup.component.html',
  styleUrls: ['./port-popup.component.scss']
})
export class PortPopupComponent implements OnInit {

  @ViewChild('newRemarksMenuTrigger') newRemarksMenuTrigger: MatMenuTrigger;
  public alerts;
  public otherPorts;
  public agentsInfo;
  public hsfo;
  public ulsfo;
  public lsdis;
  public dis;
  public gridOptions: GridOptions;
  public defaultView: boolean = true;
  public selectionChange: boolean
  public defaultSelection = ["second"];
  public changeLog;
  public remarkTypes = [];
  public portSeverities = [];
  public portStatuses = [];
  public selectedType;
  public severity;
  public description = "";
  public count = 0;//to serve as ID of alerts
  public theme: boolean = true;
  PortProductAvailability: any;
  PortProductList: IPortProduct[] = [];
  PortGradeList: IPortGrade;
  portRemarkList: any = [];
  public shiptechUrl : string;

  constructor(private logger: LoggerService,private localService: LocalService, private portService : PortPopupService, private legacyLookupsDatabase: LegacyLookupsDatabase, private dialog: MatDialog) {
    this.shiptechUrl =  new URL(window.location.href).origin;
  }
  @Input() status: string = "standard-view";
  @Input('portData') popup_data;
  @Output() closePopup = new EventEmitter();
  @Output() showPortInfo = new EventEmitter();
  @ViewChild('second') second: MatExpansionPanel;
  @ViewChild('third') third: MatExpansionPanel;
  @ViewChild('fourth') fourth: MatExpansionPanel;
  @ViewChild('fifth') fifth: MatExpansionPanel;
  @ViewChild('sixth') sixth: MatExpansionPanel;

  ngOnInit() {
    this.localService.themeChange.subscribe(value => this.theme = value);
    this.loadMasterLookupData();
    // this.remarkTypes = ["Market type variation", "Port Closure", "Port Congestion", "Strike in Port"]
    this.changeLog = [
      {
        time: "MAR 12, 2020 12:43PM",
        action: "Alert marked as seen by John Smith"
      },
      {
        time: "MAR 12, 2020 1:43PM",
        action: "Alert marked as resolved by John Smith"
      }
    ]
    this.alerts = [

    ]
    this.loadPortBasicInfo(this.popup_data.locationId);
    this.loadOtherDetails(this.popup_data.locationId);
    this.loadAgentInfo(this.popup_data.locationId);
    this.hsfo = [
      { prd: 'RMG18005' },
      { prd: 'RMG38005' },
      { prd: 'RMK50005' }
    ]
    this.ulsfo = [
      { prd: 'RMD8001' },
      { prd: 'RMD8005L' },
      { prd: 'RMG18001' },
      { prd: 'RMG38001' }
    ]
    this.lsdis = [
      { prd: 'DMA01' }
    ]
    this.dis = [

    ]
    this.gridOptions = <GridOptions>{
      columnDefs: this.columnDefs,
      //enableColResize: false,
      // enableSorting: false,
      animateRows: false,
      headerHeight: 22,
      rowHeight: 30,
      defaultColDef: {
        filter: false,
        sortable: false,
        resizable: false
      },
      rowSelection: 'single',
      onGridReady: (params) => {
        this.gridOptions.api = params.api;
        this.gridOptions.columnApi = params.columnApi;
        this.gridOptions.api.setRowData(this.PortProductList);

      },
    };
  }
  ngAfterViewInit() {
    this.logger.logInfo('PortPopupComponent-ngAfterViewInit()', new Date());
  }
  async loadMasterLookupData() {
    this.remarkTypes = await this.legacyLookupsDatabase.getPortRemarks();
    this.portSeverities = await this.legacyLookupsDatabase.getPortSeverities();
    this.portStatuses = await this.legacyLookupsDatabase.getPortStatuses();
    // this.severity = this.portSeverities.find(item=>item.id==1);
    console.log(this.remarkTypes);
    
  }
  loadPortProductAvailability() {
    // let payloadReq = {'LocationId': 37}
    let payloadReq = {'LocationId': this.popup_data.locationId}
    
    this.portService.getPortProductAvailability(payloadReq).subscribe(async (response) => {
      console.log(response);
      this.PortProductAvailability = response?.payload;
      this.PortProductList = this.PortProductAvailability?.smartPortProductDtos;
      //apply row data to ag grid
      this.gridOptions.api.setRowData(this.PortProductList);
      this.PortGradeList = await this.formatPortGrade(this.PortProductAvailability?.smartPortGradeDtos);
      this.triggerEventToUpdate();
    })
  }
  async formatPortGrade(portgrade) {
    let portGradeArr = {'HSFO': [], 'ULSFO': [], 'DIS': []};
    var promises = new Promise(resolve => {
        portgrade.forEach((element, index) => {
        console.log(element);
        portGradeArr['HSFO'].push(element.hsfO35);
        portGradeArr['ULSFO'].push(element.hsfO05);
        portGradeArr['DIS'].push(element.dis);
        if(portgrade.length == index+1) { resolve(true) }
      });
    });
    await Promise.all([promises]);
    return portGradeArr;
  }
  
  triggerEventToUpdate() {
    let titleEle = document.getElementsByClassName('page-title')[0] as HTMLElement;
      titleEle.click();
  }

  public changeDefault(expandRef?:any) {
    if(this.third?.expanded || expandRef=='third') {
      this.loadPortProductAvailability();
    }
    if(this.second?.expanded || expandRef=='second') {
      this.loadPortRemarks();
    }

    // if (this.second.expanded && !this.third.expanded && !this.fourth.expanded && !this.fifth.expanded && !this.sixth.expanded) {
    //   this.defaultView = true;
    // }
    // else
    //   this.defaultView = false;
  }

  private columnDefs = [

    { headerName: 'Product ID', field: 'productType', headerTooltip: 'Product ID', width: 55, cellRendererFramework: AGGridCellRendererComponent, cellClass: ['font-bold aggrid-content-c '] },
    { 
      headerName: 'Max Pump.Rate', 
      field: 'maxTransferRate', 
      headerTooltip: 'Max Pump.Rate', 
      width: 70, 
      cellClass: ['aggrid-text-align-r '], 
      cellRendererFramework: AGGridCellRendererComponent,
      valueGetter: (params) => {
        return params?.data?.productType+' mt/h'
      }
    },
    { headerName: 'Min Supply Qty',
      field: 'minSupplyQty',
      headerTooltip: 'Min Supply Qty', 
      width: 55, 
      cellClass: ['aggrid-text-align-r '], 
      cellRendererFramework: AGGridCellRendererComponent,
      valueGetter: (params) => {
        return params?.data?.minSupplyQty+' mt'
      }
    },
    { headerName: 'Max Supply Qty', 
    field: 'maxSupplyQty', 
    headerTooltip: 'Max Supply Qty', 
    width: 70, 
    cellClass: ['aggrid-text-align-r '], 
    cellRendererFramework: AGGridCellRendererComponent,
      valueGetter: (params) => {
        return params?.data?.maxSupplyQty+' mt'
      }
    },
    { headerName: 'Lowest Grade', field: 'lowestGradeProductName', headerTooltip: 'Lowest Grade', width: 55, cellRendererFramework: AGGridCellRendererComponent, cellClass: ['aggrid-content-c'] }
  ];

  // private rowData = [
  //   {
  //     productid: 'HSFO', maxpumprate: '1500 mt/h', minsupqty: '100 mt', maxsupqty: '12000 mt', lowestgrade: 'RMK850'
  //   },
  //   {
  //     productid: 'ULSFO', maxpumprate: '1500 mt/h', minsupqty: '30 mt', maxsupqty: '12000 mt', lowestgrade: 'RMD8001'
  //   },
  //   {
  //     productid: 'LSDIS', maxpumprate: '1500 mt/h', minsupqty: '30 mt', maxsupqty: '12000 mt', lowestgrade: 'DMA01'
  //   },
  //   {
  //     productid: 'HSFO 0.5', maxpumprate: '1500 mt/h', minsupqty: '100 mt', maxsupqty: '12000 mt', lowestgrade: 'RMK85005'
  //   },


  // ];

  loadPortBasicInfo(locationId){
    if(locationId != null){
      let req = { LocationId : locationId}
      this.portService.getPortBasicInfo(req).subscribe((res: any)=>{
        if(res.payload.length > 0){
          this.popup_data.earliestTradingTime = res.payload[0].earliestTradingTime;
          this.popup_data.latestTradingTime = res.payload[0].latestTradingTime;
          this.popup_data.avlProdCategory = [];
          res.payload.filter(item=> {
            this.popup_data.avlProdCategory.push(item.availableProductCategory);
          });
          // this.popup_data.notavlProdCategory = ['DIS'],
        }
        this.triggerEventToUpdate();
      })
    }
  }

  loadAgentInfo(locationId){
    if(locationId != null){
      let req = { LocationId : locationId}
      this.portService.getAgentInfo(req).subscribe((res: any)=>{
        if(res.payload != undefined){
          this.agentsInfo = res.payload
        }
      })
    }
  }

  loadOtherDetails(locationId){
    if(locationId != null){
      let req = { LocationId : locationId };
      this.portService.getOtherDetails(req).subscribe((res: any)=>{
        if(res.payload != undefined){
          this.otherPorts = res.payload[0];
        }
      })
    }
  }

  saveRemark() {
    if(!(this.description) || this.description.trim()=='') {
      let descWarnMsg = "please enter description for the remark";
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        panelClass: 'confirmation-popup-operator',
        data:  { message: descWarnMsg, source: 'hardWarning' }
      });
      return;
    } else if(!(this.severity?.id)) {
      let severityWarnMsg = "select severity of the remark";
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        panelClass: 'confirmation-popup-operator',
        data:  { message: severityWarnMsg, source: 'hardWarning' }
      });
      return;
    }
    
    let remarkdefaultStatus = this.portStatuses.find(item=>item.name=='No Action Taken')
    let requestPayload = { 
        "PortId": this.popup_data?.locationId,
        "Remarks": [
          {
            "Id" : 0,
            "PortId": this.popup_data?.locationId,
            "RemarkTypes": {
              "id": this.selectedType?.id,
              "name": this.selectedType?.name
            },
            "RemarkStatus": {
              "id": remarkdefaultStatus?.id,
              "name": remarkdefaultStatus?.name
            },
            "RemarkSeverity": {
              "id": this.severity?.id,
              "name": this.severity?.name
            },
            "RemarkDescriptions": this.description,
            "RemarkComments": "",
            "IsDeleted" : 0
          }
        ]
    }
    // this.alerts.push(
    //   {
    //     id: this.count++,
    //     alert: this.selectedType,
    //     priority: this.severity,
    //     status: 'No Action Taken',
    //     description: this.description,
    //     comments: "",
    //     changeLog: []

    //   },
    // )
    // this.severity = this.portSeverities.find(item=>item.id==1);
    this.selectionChange = false;
    this.portService.putPortRemark(requestPayload).subscribe(data=> {
      console.log(data);
      this.closeMenu();
      this.portRemarkList = data.payload;
      this.triggerClickEvent();
    })
  }
  loadPortRemarks() {
    let requestPayload = {
      "PortId": this.popup_data?.locationId
    }
    this.portService.loadPortRemark(requestPayload).subscribe(data=> {
      console.log(data);
      this.portRemarkList = data.payload;
      this.triggerClickEvent();
    })
  }
  refreshPortRemark(portRemarkRes) {
    this.portRemarkList = (portRemarkRes?.payload?.length)? portRemarkRes.payload: [];
    this.triggerClickEvent();
  }
  
  triggerClickEvent() {
    let titleEle = document.getElementsByClassName('page-title')[0] as HTMLElement;
      titleEle.click();
  }
  closeMenu() {
    this.selectedType = "";
    this.description = "";
    this.severity = "";
    // this.severity = 1;
    this.selectionChange = false;
    this.newRemarksMenuTrigger.closeMenu();
  }

  setPortInfo(port) {
    this.showPortInfo.emit({ flag: true, port: port });
  }
}


@Component({
  selector: 'port-menu',
  template: `
  <mat-icon class="dropdown-icon" [ngClass]="{'active':!menuClick}" style="z-index: 1050;"
  [matMenuTriggerFor]="clickalertsmenu" #menuTrigger="matMenuTrigger"
  (mouseenter)="menuClick && toggleMenu($event);"
  (mouseleave)="!menuClick && toggleMenu2();" (click)="toggleMenu3($event)"
  (menuClosed)="toggleMenu1($event);">more_vert</mat-icon>
<mat-menu #clickalertsmenu="matMenu" class="common" xPosition="after">
<div class="alert-menu" [ngClass]="{'dark-theme':theme,'light-theme':!theme}">
  <div class="warning-header">
    <div style="margin-bottom: 5px;">
      <ng-container [ngSwitch]="item?.remarkSeverity?.name">
        <img *ngSwitchCase="'High'" class="warning-icon"
          src="./assets/customicons/red-warning-o.svg" alt="warning-icon">
        <img *ngSwitchCase="'Medium'" class="warning-icon"
          src="./assets/customicons/amber-warning-o.svg" alt="warning-icon">
        <img *ngSwitchDefault class="warning-icon"
          src="./assets/customicons/green-warning-o.svg" alt="warning-icon">
      </ng-container>
    </div>
    <div class="warning-title">
      {{item?.remarkTypes?.name}}
    </div>
    <div (click)="cancelMenu()" style="position: absolute;top: 8px;right: 0px;">
      <mat-icon class="close">close</mat-icon>
    </div>
  </div>
  <div class="comments">
                            <div>Description</div>
                            <mat-form-field appearance="fill">
                              <textarea matInput disabled [value]="item.remarkDescriptions"></textarea>
                            </mat-form-field>
                          </div>
  <div class="status">
    <div>Status</div>
    <mat-form-field appearance="fill">
      <mat-select #statusDropdown [value]="item?.remarkStatus?.name" [panelClass]="{'dark-theme':theme,'light-theme':!theme}"
        (selectionChange)="selectionChange = true" (click)="$event.stopPropagation();">
        <mat-option *ngFor="let status of portStatuses" [value]="status.name">{{status.displayName}}</mat-option>
      </mat-select>
    </mat-form-field>
  </div>
  <div *ngIf="item?.remarkStatus?.name == 'Resolved' || statusDropdown.value== 'Resolved'"
    class="comments">
    <div>Comments</div>
    <mat-form-field appearance="fill">
      <textarea style="caret-color:#fff !important;" matInput [(ngModel)]="item.comments"
        (click)="$event.stopPropagation();"></textarea>
    </mat-form-field>
  </div>
  <div *ngIf="item?.remarkStatus?.name != 'No Action Taken'" class="change-log">
    <div>Change Log</div>
    <div style="height:70px;max-height: 100px;overflow-y: scroll;">
      <div *ngFor="let data of item.changeLog" style="margin:5px 0px">
        <div style="display: flex;align-items: center;">
          <div class="circle-blue"></div>
          <div class="log-date">{{data.time}}</div>
        </div>
        <div class="log-action">{{data.action}}</div>
      </div>
    </div>
  </div>
  <div class="actions">
    <button mat-button class="cancel" (click)="cancelMenu()">CANCEL</button>
    <button mat-raised-button [ngClass]="{'active':selectionChange}" class="save"
      (click)="updatePortRemark(statusDropdown.value)">SAVE</button>
  </div>
  </div>
</mat-menu>
  `
})
export class PortMenuComponent {
  @Input('item') item;
  @Input('alerts') alerts;
  @Output('refreshPortRemark') refreshPortRemark = new EventEmitter();
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  portStatuses = [];
  public menuFlag: boolean = false;
  public menuClick: boolean = false;
  public selectionChange: boolean = false;
  public theme: boolean = true;
  constructor(private elem: ElementRef,private localService: LocalService, private portService : PortPopupService, private legacyLookupsDatabase: LegacyLookupsDatabase) { }
  ngOnInit(){
    this.localService.themeChange.subscribe(value => this.theme = value);
    this.loadMasterLookupData();
  }
  async loadMasterLookupData() {
    this.portStatuses = await this.legacyLookupsDatabase.getPortStatuses();
  }
  openMenu() {
    this.menuTrigger.openMenu();
    this.selectionChange = false;

  }
  closeMenu() {
    this.menuTrigger.closeMenu();
    this.selectionChange = false;
    this.menuClick = false;
    let panels = this.elem.nativeElement.querySelectorAll('.dropdown-icon');
    panels.forEach((element) => {
      element.classList.remove('active-class');
    });
  }

  toggleMenu1(event) {//onmenuclose
    this.selectionChange = false;
    this.menuClick = false;
    let panels = this.elem.nativeElement.querySelectorAll('.dropdown-icon');
    panels.forEach((element) => {
      element.classList.remove('active-class');
    });
  }
  toggleMenu(event) {//onenter

    this.openMenu()
    var overlay = document.querySelector('.cdk-overlay-container');
    overlay.classList.add('removeOverlay');

  }

  toggleMenu2() {//onleave
    this.menuClick = false;
    this.closeMenu();
    var overlay = document.querySelector('.cdk-overlay-container');
    overlay?.classList.remove('removeOverlay');

  }
  //onclick
  toggleMenu3(event) {
    var overlay = document.querySelector('.cdk-overlay-container');
    overlay.classList.remove('removeOverlay');
    this.menuClick = true;
    event.target.classList.add('active-class');
    this.openMenu();

  }
  updatePortRemark(status) {
    this.closeMenu();
      let selectedRemarkStatus = this.portStatuses.find(item=>item.name==status)
      let requestPayload = { 
          "PortId": this.item?.portId,
          "Remarks": [
            {
              "Id" : this.item?.id,
              "PortId": this.item?.portId,
              "RemarkTypes": {
                "id": this.item?.remarkTypes?.id,
                "name": this.item?.remarkTypes?.name
              },
              "RemarkStatus": {
                "id": selectedRemarkStatus?.id,
                "name": selectedRemarkStatus?.name
              },
              "RemarkSeverity": {
                "id": this.item?.remarkSeverity?.id,
                "name": this.item?.remarkSeverity?.name
              },
              "RemarkDescriptions": this.item?.remarkDescriptions,
              "RemarkComments": this.item?.comments,
              "IsDeleted" : 0
            }
          ]
      }
      this.selectionChange = false;
      this.portService.putPortRemark(requestPayload).subscribe(data=> {
        console.log(data);
        this.refreshPortRemark.emit(data);
      })
    // setTimeout(() => {
    //   this.alerts.forEach((element) => {
    //     if (element.id == this.item.id) {
    //       element.status = status;
    //       element.comments = this.item.comments
    //       var action = "Alert marked as " + status.toLowerCase() + " by Yusuf Hassan";
    //       element.changeLog.push({
    //         time: "MAR 12, 2020 12:43PM",
    //         action: action
    //       })
    //     }
    //   })
    // }, 100);
  }
  cancelMenu() {
    this.closeMenu();
  }
}
