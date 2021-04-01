import { Component, OnInit, ViewChild, Input, ElementRef, Output, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatExpansionPanel } from '@angular/material/expansion';
import { GridOptions } from '@ag-grid-community/core';
import { AGGridCellRendererComponent } from '../ag-grid/ag-grid-cell-renderer.component';
import { LoggerService } from '../../services/logger.service';
import { LocalService } from '../../services/local-service.service';

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
  public selectedType;
  public severity;
  public description = "";
  public count = 0;//to serve as ID of alerts
  public theme: boolean = true;

  constructor(private logger: LoggerService,private localService: LocalService) { }
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
    this.severity = 1;
    this.remarkTypes = ["Market type variation", "Port Closure", "Port Congestion", "Strike in Port"]
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
    this.otherPorts = [
      {
        detail: 'Pretest Available',
        value: '1'
      },
      {
        detail: 'ECA Region',
        value: '1',
        subdetail: 'Baltic Region'
      },
      {
        detail: 'Mandatory LSDIS port',
        value: '0'
      },
      {
        detail: 'Use of scrubber allowed',
        value: '1'
      }
    ]
    this.agentsInfo = [
      {
        name: 'Bernard Ingstmann',
        initials: 'BI',
        address: '99 Meadow City, Aden',
        tele: '+140-9048776333',
        email: 'b.stmann@stbunkers.com'
      },
      {
        name: 'Chris Kristen',
        initials: 'CK',
        address: '99 Meadow City, Aden',
        tele: '+140-9039088574',
        email: 'c.kristen@stbunkers.com'
      }
    ]
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
      //enableSorting: false,
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
        this.gridOptions.api.setRowData(this.rowData);

      },
    };
  }
  ngAfterViewInit() {
    this.logger.logInfo('PortPopupComponent-ngAfterViewInit()', new Date());
  }
  public changeDefault() {
    // if (this.second.expanded && !this.third.expanded && !this.fourth.expanded && !this.fifth.expanded && !this.sixth.expanded) {
    //   this.defaultView = true;
    // }
    // else
    //   this.defaultView = false;
  }

  private columnDefs = [

    { headerName: 'Product ID', field: 'productid', headerTooltip: 'Product ID', width: 55, cellRendererFramework: AGGridCellRendererComponent, cellClass: ['font-bold aggrid-content-c '] },
    { headerName: 'Max Pump.Rate', field: 'maxpumprate', headerTooltip: 'Max Pump.Rate', width: 70, cellClass: ['aggrid-text-align-r '], cellRendererFramework: AGGridCellRendererComponent },
    { headerName: 'Min Supply Qty', field: 'minsupqty', headerTooltip: 'Min Supply Qty', width: 55, cellClass: ['aggrid-text-align-r '], cellRendererFramework: AGGridCellRendererComponent },
    { headerName: 'Max Supply Qty', field: 'maxsupqty', headerTooltip: 'Max Supply Qty', width: 70, cellClass: ['aggrid-text-align-r '], cellRendererFramework: AGGridCellRendererComponent },
    { headerName: 'Lowest Grade', field: 'lowestgrade', headerTooltip: 'Lowest Grade', width: 55, cellRendererFramework: AGGridCellRendererComponent, cellClass: ['aggrid-content-c'] }
  ];

  private rowData = [
    {
      productid: 'HSFO', maxpumprate: '1500 mt/h', minsupqty: '100 mt', maxsupqty: '12000 mt', lowestgrade: 'RMK850'
    },
    {
      productid: 'ULSFO', maxpumprate: '1500 mt/h', minsupqty: '30 mt', maxsupqty: '12000 mt', lowestgrade: 'RMD8001'
    },
    {
      productid: 'LSDIS', maxpumprate: '1500 mt/h', minsupqty: '30 mt', maxsupqty: '12000 mt', lowestgrade: 'DMA01'
    },
    {
      productid: 'HSFO 0.5', maxpumprate: '1500 mt/h', minsupqty: '100 mt', maxsupqty: '12000 mt', lowestgrade: 'RMK85005'
    },


  ];

  saveRemark() {
    this.alerts.push(
      {
        id: this.count++,
        alert: this.selectedType,
        priority: this.severity,
        status: 'No Action Taken',
        description: this.description,
        comments: "",
        changeLog: []

      },
    )
    this.selectedType = "";
    this.description = "";
    this.severity = 1;
    this.selectionChange = false;
  }
  closeMenu() {
    this.newRemarksMenuTrigger.closeMenu();
    this.selectedType = "";
    this.description = "";
    this.severity = 1;
    this.selectionChange = false;
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
  (mouseenter)="!menuClick && toggleMenu($event);"
  (mouseleave)="!menuClick && toggleMenu2();" (click)="toggleMenu3($event)"
  (menuClosed)="toggleMenu1($event);">more_vert</mat-icon>
<mat-menu #clickalertsmenu="matMenu" class="common" xPosition="after">
<div class="alert-menu" [ngClass]="{'dark-theme':theme,'light-theme':!theme}">
  <div class="warning-header">
    <div style="margin-bottom: 5px;">
      <ng-container [ngSwitch]="item.priority">
        <img *ngSwitchCase="1" class="warning-icon"
          src="../../../assets/customicons/red-warning-o.svg" alt="warning-icon">
        <img *ngSwitchCase="2" class="warning-icon"
          src="../../../assets/customicons/amber-warning-o.svg" alt="warning-icon">
        <img *ngSwitchCase="3" class="warning-icon"
          src="../../../assets/customicons/green-warning-o.svg" alt="warning-icon">
      </ng-container>
    </div>
    <div class="warning-title">
      {{item.alert}}
    </div>
    <div (click)="cancelMenu()" style="position: absolute;top: 8px;right: 0px;">
      <mat-icon class="close">close</mat-icon>
    </div>
  </div>
  <div class="comments">
                            <div>Description</div>
                            <mat-form-field appearance="fill">
                              <textarea matInput disabled [value]="item.description"></textarea>
                            </mat-form-field>
                          </div>
  <div class="status">
    <div>Status</div>
    <mat-form-field appearance="fill">
      <mat-select #statusDropdown [value]="item.status" [panelClass]="{'dark-theme':theme,'light-theme':!theme}"
        (selectionChange)="selectionChange = true" (click)="$event.stopPropagation();">
        <mat-option value="No Action Taken">No Action Taken</mat-option>
        <mat-option value="Pending">Pending</mat-option>
        <mat-option value="Resolved">Resolved</mat-option>
      </mat-select>
    </mat-form-field>
  </div>
  <div *ngIf="item.status == 'Resolved' || statusDropdown.value== 'Resolved'"
    class="comments">
    <div>Comments</div>
    <mat-form-field appearance="fill">
      <textarea matInput [(ngModel)]="item.comments"
        (click)="$event.stopPropagation();"></textarea>
    </mat-form-field>
  </div>
  <div *ngIf="item.status != 'No Action Taken'" class="change-log">
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
      (click)="save(statusDropdown.value)">SAVE</button>
  </div>
  </div>
</mat-menu>
  `
})
export class PortMenuComponent {
  @Input('item') item;
  @Input('alerts') alerts;
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;

  public menuFlag: boolean = false;
  public menuClick: boolean = false;
  public selectionChange: boolean = false;
  public theme: boolean = true;
  constructor(private elem: ElementRef,private localService: LocalService) { }
  ngOnInit(){
    this.localService.themeChange.subscribe(value => this.theme = value);
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

    this.closeMenu();
    var overlay = document.querySelector('.cdk-overlay-container');
    overlay.classList.remove('removeOverlay');

  }
  //onclick
  toggleMenu3(event) {
    var overlay = document.querySelector('.cdk-overlay-container');
    overlay.classList.remove('removeOverlay');
    this.menuClick = true;
    event.target.classList.add('active-class');
    this.openMenu();

  }
  save(status) {
    this.closeMenu();
    setTimeout(() => {
      this.alerts.forEach((element) => {
        if (element.id == this.item.id) {
          element.status = status;
          element.comments = this.item.comments
          var action = "Alert marked as " + status.toLowerCase() + " by Yusuf Hassan";
          element.changeLog.push({
            time: "MAR 12, 2020 12:43PM",
            action: action
          })
        }
      })
    }, 100);
  }
  cancelMenu() {
    this.closeMenu();
  }
}
