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
  public remarkLogs;
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
  portRemarkLogs: any;
  portBopsPrice: any;

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
    this.severity = this.portSeverities.find(item=>item.id==1);
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
    if(this.fourth?.expanded || expandRef=='fourth') {
      this.loadBopsPrice();
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
      this.portRemarkList = data?.payload?.portRemarkDetails;
      this.portRemarkLogs = data?.payload?.portRemarkLogs;
      this.triggerClickEvent();
    })
  }
  loadPortRemarks() {
    let requestPayload = {
      "PortId": this.popup_data?.locationId
    }
    this.portService.loadPortRemark(requestPayload).subscribe(data=> {
      console.log(data);
      // data.payload = {
      //   "portRemarkDetails": [
      //     {
      //       "portId": 425,
      //       "remarkTypes": {
      //         "id": 1,
      //         "name": "Market price variation",
      //         "internalName": null,
      //         "displayName": null,
      //         "code": null,
      //         "collectionName": null,
      //         "customNonMandatoryAttribute1": null,
      //         "isDeleted": false,
      //         "modulePathUrl": null,
      //         "clientIpAddress": null,
      //         "userAction": null
      //       },
      //       "remarkStatus": {
      //         "id": 2,
      //         "name": "Pending",
      //         "internalName": null,
      //         "displayName": null,
      //         "code": null,
      //         "collectionName": null,
      //         "customNonMandatoryAttribute1": null,
      //         "isDeleted": false,
      //         "modulePathUrl": null,
      //         "clientIpAddress": null,
      //         "userAction": null
      //       },
      //       "remarkSeverity": {
      //         "id": 2,
      //         "name": "Medium",
      //         "internalName": null,
      //         "displayName": null,
      //         "code": null,
      //         "collectionName": null,
      //         "customNonMandatoryAttribute1": null,
      //         "isDeleted": false,
      //         "modulePathUrl": null,
      //         "clientIpAddress": null,
      //         "userAction": null
      //       },
      //       "remarkDescriptions": "Sample Description pending",
      //       "remarkComments": "Sample Comments  pending",
      //       "createdBy": {
      //         "id": 0,
      //         "name": "RM",
      //         "internalName": null,
      //         "displayName": null,
      //         "code": null,
      //         "collectionName": null,
      //         "customNonMandatoryAttribute1": null,
      //         "isDeleted": false,
      //         "modulePathUrl": null,
      //         "clientIpAddress": null,
      //         "userAction": null
      //       },
      //       "createdOn": "2021-06-16T17:07:48.613Z",
      //       "lastModifiedBy": {
      //         "id": 0,
      //         "name": "RM",
      //         "internalName": null,
      //         "displayName": null,
      //         "code": null,
      //         "collectionName": null,
      //         "customNonMandatoryAttribute1": null,
      //         "isDeleted": false,
      //         "modulePathUrl": null,
      //         "clientIpAddress": null,
      //         "userAction": null
      //       },
      //       "lastModifiedOn": "2021-06-16T17:07:48.613Z",
      //       "id": 1,
      //       "isDeleted": false,
      //       "modulePathUrl": null,
      //       "clientIpAddress": null,
      //       "userAction": null
      //     },
      //     {
      //       "portId": 425,
      //       "remarkTypes": {
      //         "id": 2,
      //         "name": "Port closure",
      //         "internalName": null,
      //         "displayName": null,
      //         "code": null,
      //         "collectionName": null,
      //         "customNonMandatoryAttribute1": null,
      //         "isDeleted": false,
      //         "modulePathUrl": null,
      //         "clientIpAddress": null,
      //         "userAction": null
      //       },
      //       "remarkStatus": {
      //         "id": 2,
      //         "name": "Pending",
      //         "internalName": null,
      //         "displayName": null,
      //         "code": null,
      //         "collectionName": null,
      //         "customNonMandatoryAttribute1": null,
      //         "isDeleted": false,
      //         "modulePathUrl": null,
      //         "clientIpAddress": null,
      //         "userAction": null
      //       },
      //       "remarkSeverity": {
      //         "id": 2,
      //         "name": "Medium",
      //         "internalName": null,
      //         "displayName": null,
      //         "code": null,
      //         "collectionName": null,
      //         "customNonMandatoryAttribute1": null,
      //         "isDeleted": false,
      //         "modulePathUrl": null,
      //         "clientIpAddress": null,
      //         "userAction": null
      //       },
      //       "remarkDescriptions": "Sample Description pending",
      //       "remarkComments": "Sample Comments  pending",
      //       "createdBy": {
      //         "id": 0,
      //         "name": "RM",
      //         "internalName": null,
      //         "displayName": null,
      //         "code": null,
      //         "collectionName": null,
      //         "customNonMandatoryAttribute1": null,
      //         "isDeleted": false,
      //         "modulePathUrl": null,
      //         "clientIpAddress": null,
      //         "userAction": null
      //       },
      //       "createdOn": "2021-06-16T17:12:34.837Z",
      //       "lastModifiedBy": {
      //         "id": 0,
      //         "name": "RM",
      //         "internalName": null,
      //         "displayName": null,
      //         "code": null,
      //         "collectionName": null,
      //         "customNonMandatoryAttribute1": null,
      //         "isDeleted": false,
      //         "modulePathUrl": null,
      //         "clientIpAddress": null,
      //         "userAction": null
      //       },
      //       "lastModifiedOn": "2021-06-16T17:12:34.837Z",
      //       "id": 2,
      //       "isDeleted": false,
      //       "modulePathUrl": null,
      //       "clientIpAddress": null,
      //       "userAction": null
      //     }
      //   ],
      //   "portRemarkLogs": [
      //     {
      //       "portId": 425,
      //       "remarkTypes": {
      //         "id": 1,
      //         "name": "Market price variation",
      //         "internalName": null,
      //         "displayName": null,
      //         "code": null,
      //         "collectionName": null,
      //         "customNonMandatoryAttribute1": null,
      //         "isDeleted": false,
      //         "modulePathUrl": null,
      //         "clientIpAddress": null,
      //         "userAction": null
      //       },
      //       "remarkStatus": {
      //         "id": 2,
      //         "name": "Pending",
      //         "internalName": null,
      //         "displayName": null,
      //         "code": null,
      //         "collectionName": null,
      //         "customNonMandatoryAttribute1": null,
      //         "isDeleted": false,
      //         "modulePathUrl": null,
      //         "clientIpAddress": null,
      //         "userAction": null
      //       },
      //       "createdBy": {
      //         "id": 0,
      //         "name": "RM",
      //         "internalName": null,
      //         "displayName": null,
      //         "code": null,
      //         "collectionName": null,
      //         "customNonMandatoryAttribute1": null,
      //         "isDeleted": false,
      //         "modulePathUrl": null,
      //         "clientIpAddress": null,
      //         "userAction": null
      //       },
      //       "createdOn": "2021-06-16T17:07:48.613Z",
      //       "lastModifiedBy": {
      //         "id": 0,
      //         "name": "RM",
      //         "internalName": null,
      //         "displayName": null,
      //         "code": null,
      //         "collectionName": null,
      //         "customNonMandatoryAttribute1": null,
      //         "isDeleted": false,
      //         "modulePathUrl": null,
      //         "clientIpAddress": null,
      //         "userAction": null
      //       },
      //       "lastModifiedOn": "2021-06-16T17:07:48.613Z",
      //       "id": 1,
      //       "isDeleted": false,
      //       "modulePathUrl": null,
      //       "clientIpAddress": null,
      //       "userAction": null
      //     },
      //     {
      //       "portId": 425,
      //       "remarkTypes": {
      //         "id": 2,
      //         "name": "Port closure",
      //         "internalName": null,
      //         "displayName": null,
      //         "code": null,
      //         "collectionName": null,
      //         "customNonMandatoryAttribute1": null,
      //         "isDeleted": false,
      //         "modulePathUrl": null,
      //         "clientIpAddress": null,
      //         "userAction": null
      //       },
      //       "remarkStatus": {
      //         "id": 2,
      //         "name": "Pending",
      //         "internalName": null,
      //         "displayName": null,
      //         "code": null,
      //         "collectionName": null,
      //         "customNonMandatoryAttribute1": null,
      //         "isDeleted": false,
      //         "modulePathUrl": null,
      //         "clientIpAddress": null,
      //         "userAction": null
      //       },
      //       "createdBy": {
      //         "id": 0,
      //         "name": "RM",
      //         "internalName": null,
      //         "displayName": null,
      //         "code": null,
      //         "collectionName": null,
      //         "customNonMandatoryAttribute1": null,
      //         "isDeleted": false,
      //         "modulePathUrl": null,
      //         "clientIpAddress": null,
      //         "userAction": null
      //       },
      //       "createdOn": "2021-06-16T17:08:41.537Z",
      //       "lastModifiedBy": {
      //         "id": 0,
      //         "name": "RM",
      //         "internalName": null,
      //         "displayName": null,
      //         "code": null,
      //         "collectionName": null,
      //         "customNonMandatoryAttribute1": null,
      //         "isDeleted": false,
      //         "modulePathUrl": null,
      //         "clientIpAddress": null,
      //         "userAction": null
      //       },
      //       "lastModifiedOn": "2021-06-16T17:08:41.537Z",
      //       "id": 2,
      //       "isDeleted": false,
      //       "modulePathUrl": null,
      //       "clientIpAddress": null,
      //       "userAction": null
      //     },
      //     {
      //       "portId": 425,
      //       "remarkTypes": {
      //         "id": 2,
      //         "name": "Port closure",
      //         "internalName": null,
      //         "displayName": null,
      //         "code": null,
      //         "collectionName": null,
      //         "customNonMandatoryAttribute1": null,
      //         "isDeleted": false,
      //         "modulePathUrl": null,
      //         "clientIpAddress": null,
      //         "userAction": null
      //       },
      //       "remarkStatus": {
      //         "id": 3,
      //         "name": "Resolved",
      //         "internalName": null,
      //         "displayName": null,
      //         "code": null,
      //         "collectionName": null,
      //         "customNonMandatoryAttribute1": null,
      //         "isDeleted": false,
      //         "modulePathUrl": null,
      //         "clientIpAddress": null,
      //         "userAction": null
      //       },
      //       "createdBy": {
      //         "id": 0,
      //         "name": "RM",
      //         "internalName": null,
      //         "displayName": null,
      //         "code": null,
      //         "collectionName": null,
      //         "customNonMandatoryAttribute1": null,
      //         "isDeleted": false,
      //         "modulePathUrl": null,
      //         "clientIpAddress": null,
      //         "userAction": null
      //       },
      //       "createdOn": "2021-06-16T17:09:22.233Z",
      //       "lastModifiedBy": {
      //         "id": 0,
      //         "name": "RM",
      //         "internalName": null,
      //         "displayName": null,
      //         "code": null,
      //         "collectionName": null,
      //         "customNonMandatoryAttribute1": null,
      //         "isDeleted": false,
      //         "modulePathUrl": null,
      //         "clientIpAddress": null,
      //         "userAction": null
      //       },
      //       "lastModifiedOn": "2021-06-16T17:09:22.233Z",
      //       "id": 3,
      //       "isDeleted": false,
      //       "modulePathUrl": null,
      //       "clientIpAddress": null,
      //       "userAction": null
      //     },
      //     {
      //       "portId": 425,
      //       "remarkTypes": {
      //         "id": 2,
      //         "name": "Port closure",
      //         "internalName": null,
      //         "displayName": null,
      //         "code": null,
      //         "collectionName": null,
      //         "customNonMandatoryAttribute1": null,
      //         "isDeleted": false,
      //         "modulePathUrl": null,
      //         "clientIpAddress": null,
      //         "userAction": null
      //       },
      //       "remarkStatus": {
      //         "id": 2,
      //         "name": "Pending",
      //         "internalName": null,
      //         "displayName": null,
      //         "code": null,
      //         "collectionName": null,
      //         "customNonMandatoryAttribute1": null,
      //         "isDeleted": false,
      //         "modulePathUrl": null,
      //         "clientIpAddress": null,
      //         "userAction": null
      //       },
      //       "createdBy": {
      //         "id": 0,
      //         "name": "RM",
      //         "internalName": null,
      //         "displayName": null,
      //         "code": null,
      //         "collectionName": null,
      //         "customNonMandatoryAttribute1": null,
      //         "isDeleted": false,
      //         "modulePathUrl": null,
      //         "clientIpAddress": null,
      //         "userAction": null
      //       },
      //       "createdOn": "2021-06-16T17:12:34.837Z",
      //       "lastModifiedBy": {
      //         "id": 0,
      //         "name": "RM",
      //         "internalName": null,
      //         "displayName": null,
      //         "code": null,
      //         "collectionName": null,
      //         "customNonMandatoryAttribute1": null,
      //         "isDeleted": false,
      //         "modulePathUrl": null,
      //         "clientIpAddress": null,
      //         "userAction": null
      //       },
      //       "lastModifiedOn": "2021-06-16T17:12:34.837Z",
      //       "id": 4,
      //       "isDeleted": false,
      //       "modulePathUrl": null,
      //       "clientIpAddress": null,
      //       "userAction": null
      //     }
      //   ]
      // };
      this.portRemarkList = data?.payload?.portRemarkDetails;
      this.portRemarkLogs = data?.payload?.portRemarkLogs;
      // this.portRemarkLogs = [
      //   {
      //     "portId": 425,
      //     "remarkTypes": {
      //       "id": 1,
      //       "name": "Market price variation",
      //       "internalName": null,
      //       "displayName": null,
      //       "code": null,
      //       "collectionName": null,
      //       "customNonMandatoryAttribute1": null,
      //       "isDeleted": false,
      //       "modulePathUrl": null,
      //       "clientIpAddress": null,
      //       "userAction": null
      //     },
      //     "remarkStatus": {
      //       "id": 2,
      //       "name": "Pending",
      //       "internalName": null,
      //       "displayName": null,
      //       "code": null,
      //       "collectionName": null,
      //       "customNonMandatoryAttribute1": null,
      //       "isDeleted": false,
      //       "modulePathUrl": null,
      //       "clientIpAddress": null,
      //       "userAction": null
      //     },
      //     "createdBy": {
      //       "id": 0,
      //       "name": "RM",
      //       "internalName": null,
      //       "displayName": null,
      //       "code": null,
      //       "collectionName": null,
      //       "customNonMandatoryAttribute1": null,
      //       "isDeleted": false,
      //       "modulePathUrl": null,
      //       "clientIpAddress": null,
      //       "userAction": null
      //     },
      //     "createdOn": "2021-06-16T17:07:48.613Z",
      //     "lastModifiedBy": {
      //       "id": 0,
      //       "name": "RM",
      //       "internalName": null,
      //       "displayName": null,
      //       "code": null,
      //       "collectionName": null,
      //       "customNonMandatoryAttribute1": null,
      //       "isDeleted": false,
      //       "modulePathUrl": null,
      //       "clientIpAddress": null,
      //       "userAction": null
      //     },
      //     "lastModifiedOn": "2021-06-16T17:07:48.613Z",
      //     "id": 1,
      //     "isDeleted": false,
      //     "modulePathUrl": null,
      //     "clientIpAddress": null,
      //     "userAction": null
      //   },
      //   {
      //     "portId": 425,
      //     "remarkTypes": {
      //       "id": 2,
      //       "name": "Port closure",
      //       "internalName": null,
      //       "displayName": null,
      //       "code": null,
      //       "collectionName": null,
      //       "customNonMandatoryAttribute1": null,
      //       "isDeleted": false,
      //       "modulePathUrl": null,
      //       "clientIpAddress": null,
      //       "userAction": null
      //     },
      //     "remarkStatus": {
      //       "id": 2,
      //       "name": "Pending",
      //       "internalName": null,
      //       "displayName": null,
      //       "code": null,
      //       "collectionName": null,
      //       "customNonMandatoryAttribute1": null,
      //       "isDeleted": false,
      //       "modulePathUrl": null,
      //       "clientIpAddress": null,
      //       "userAction": null
      //     },
      //     "createdBy": {
      //       "id": 0,
      //       "name": "RM",
      //       "internalName": null,
      //       "displayName": null,
      //       "code": null,
      //       "collectionName": null,
      //       "customNonMandatoryAttribute1": null,
      //       "isDeleted": false,
      //       "modulePathUrl": null,
      //       "clientIpAddress": null,
      //       "userAction": null
      //     },
      //     "createdOn": "2021-06-16T17:08:41.537Z",
      //     "lastModifiedBy": {
      //       "id": 0,
      //       "name": "RM",
      //       "internalName": null,
      //       "displayName": null,
      //       "code": null,
      //       "collectionName": null,
      //       "customNonMandatoryAttribute1": null,
      //       "isDeleted": false,
      //       "modulePathUrl": null,
      //       "clientIpAddress": null,
      //       "userAction": null
      //     },
      //     "lastModifiedOn": "2021-06-16T17:08:41.537Z",
      //     "id": 2,
      //     "isDeleted": false,
      //     "modulePathUrl": null,
      //     "clientIpAddress": null,
      //     "userAction": null
      //   },
      //   {
      //     "portId": 425,
      //     "remarkTypes": {
      //       "id": 2,
      //       "name": "Port closure",
      //       "internalName": null,
      //       "displayName": null,
      //       "code": null,
      //       "collectionName": null,
      //       "customNonMandatoryAttribute1": null,
      //       "isDeleted": false,
      //       "modulePathUrl": null,
      //       "clientIpAddress": null,
      //       "userAction": null
      //     },
      //     "remarkStatus": {
      //       "id": 3,
      //       "name": "Resolved",
      //       "internalName": null,
      //       "displayName": null,
      //       "code": null,
      //       "collectionName": null,
      //       "customNonMandatoryAttribute1": null,
      //       "isDeleted": false,
      //       "modulePathUrl": null,
      //       "clientIpAddress": null,
      //       "userAction": null
      //     },
      //     "createdBy": {
      //       "id": 0,
      //       "name": "RM",
      //       "internalName": null,
      //       "displayName": null,
      //       "code": null,
      //       "collectionName": null,
      //       "customNonMandatoryAttribute1": null,
      //       "isDeleted": false,
      //       "modulePathUrl": null,
      //       "clientIpAddress": null,
      //       "userAction": null
      //     },
      //     "createdOn": "2021-06-16T17:09:22.233Z",
      //     "lastModifiedBy": {
      //       "id": 0,
      //       "name": "RM",
      //       "internalName": null,
      //       "displayName": null,
      //       "code": null,
      //       "collectionName": null,
      //       "customNonMandatoryAttribute1": null,
      //       "isDeleted": false,
      //       "modulePathUrl": null,
      //       "clientIpAddress": null,
      //       "userAction": null
      //     },
      //     "lastModifiedOn": "2021-06-16T17:09:22.233Z",
      //     "id": 3,
      //     "isDeleted": false,
      //     "modulePathUrl": null,
      //     "clientIpAddress": null,
      //     "userAction": null
      //   },
      //   {
      //     "portId": 425,
      //     "remarkTypes": {
      //       "id": 2,
      //       "name": "Port closure",
      //       "internalName": null,
      //       "displayName": null,
      //       "code": null,
      //       "collectionName": null,
      //       "customNonMandatoryAttribute1": null,
      //       "isDeleted": false,
      //       "modulePathUrl": null,
      //       "clientIpAddress": null,
      //       "userAction": null
      //     },
      //     "remarkStatus": {
      //       "id": 2,
      //       "name": "Pending",
      //       "internalName": null,
      //       "displayName": null,
      //       "code": null,
      //       "collectionName": null,
      //       "customNonMandatoryAttribute1": null,
      //       "isDeleted": false,
      //       "modulePathUrl": null,
      //       "clientIpAddress": null,
      //       "userAction": null
      //     },
      //     "createdBy": {
      //       "id": 0,
      //       "name": "RM",
      //       "internalName": null,
      //       "displayName": null,
      //       "code": null,
      //       "collectionName": null,
      //       "customNonMandatoryAttribute1": null,
      //       "isDeleted": false,
      //       "modulePathUrl": null,
      //       "clientIpAddress": null,
      //       "userAction": null
      //     },
      //     "createdOn": "2021-06-16T17:12:34.837Z",
      //     "lastModifiedBy": {
      //       "id": 0,
      //       "name": "RM",
      //       "internalName": null,
      //       "displayName": null,
      //       "code": null,
      //       "collectionName": null,
      //       "customNonMandatoryAttribute1": null,
      //       "isDeleted": false,
      //       "modulePathUrl": null,
      //       "clientIpAddress": null,
      //       "userAction": null
      //     },
      //     "lastModifiedOn": "2021-06-16T17:12:34.837Z",
      //     "id": 4,
      //     "isDeleted": false,
      //     "modulePathUrl": null,
      //     "clientIpAddress": null,
      //     "userAction": null
      //   }
      // ];
      this.triggerClickEvent();
    })
  }
  refreshPortRemark(portRemarkRes) {
    this.portRemarkList = (portRemarkRes?.payload?.portRemarkDetails)? portRemarkRes.payload.portRemarkDetails: [];
    this.triggerClickEvent();
  }
  loadBopsPrice() {
    let requestPayload = {
      "PortId": this.popup_data?.locationId
    }
    // let portBopsPrice = {
    //   "payload": {
    //     "hsfo": [
    //       {
    //         "productType": "HSFO",
    //         "productGrade": "DMA01",
    //         "todaysPrice": 518,
    //         "todaysPriceIndex": "Green",
    //         "todaysPriceDiff": 0,
    //         "yesterdayPrice": 518,
    //         "yesterdayPriceIndex": "Green",
    //         "yesterdayPriceDiff": 0
    //       },
    //       {
    //         "productType": "HSFO",
    //         "productGrade": "RMD8005",
    //         "todaysPrice": 482.25,
    //         "todaysPriceIndex": "Green",
    //         "todaysPriceDiff": 0,
    //         "yesterdayPrice": 482.25,
    //         "yesterdayPriceIndex": "Green",
    //         "yesterdayPriceDiff": 0
    //       },
    //       {
    //         "productType": "HSFO",
    //         "productGrade": "RME18005",
    //         "todaysPrice": 482.25,
    //         "todaysPriceIndex": "Green",
    //         "todaysPriceDiff": 0,
    //         "yesterdayPrice": 482.25,
    //         "yesterdayPriceIndex": "Green",
    //         "yesterdayPriceDiff": 0
    //       },
    //       {
    //         "productType": "HSFO",
    //         "productGrade": "RMG38005",
    //         "todaysPrice": 482.25,
    //         "todaysPriceIndex": "Green",
    //         "todaysPriceDiff": 0,
    //         "yesterdayPrice": 482.25,
    //         "yesterdayPriceIndex": "Green",
    //         "yesterdayPriceDiff": 0
    //       },
    //       {
    //         "productType": "HSFO",
    //         "productGrade": "RMG50005",
    //         "todaysPrice": 482.25,
    //         "todaysPriceIndex": "Green",
    //         "todaysPriceDiff": 0,
    //         "yesterdayPrice": 482.25,
    //         "yesterdayPriceIndex": "Green",
    //         "yesterdayPriceDiff": 0
    //       }
    //     ],
    //     "ulsfo": [
    //       {
    //         "productType": "ULSFO",
    //         "productGrade": "RMK1000",
    //         "todaysPrice": 328.25,
    //         "todaysPriceIndex": "Green",
    //         "todaysPriceDiff": 0,
    //         "yesterdayPrice": 328.25,
    //         "yesterdayPriceIndex": "Green",
    //         "yesterdayPriceDiff": 0
    //       }
    //     ],
    //     "lsdis": [],
    //     "hsdis": [
    //       {
    //         "productType": "HSDIS",
    //         "productGrade": "RMK500",
    //         "todaysPrice": 328.25,
    //         "todaysPriceIndex": "Green",
    //         "todaysPriceDiff": 0,
    //         "yesterdayPrice": 328.25,
    //         "yesterdayPriceIndex": "Green",
    //         "yesterdayPriceDiff": 0
    //       }
    //     ],
    //     "quoteDateCost": [
    //       {
    //         "priceAsOn": "2022-05-31T00:00:00Z",
    //         "bargeChargeIncluded": false
    //       }
    //     ]
    //   },
    //   "deletedCount": 0,
    //   "modifiedCount": 0,
    //   "matchedCount": 0,
    //   "isAcknowledged": false,
    //   "isModifiedCountAvailable": false,
    //   "upsertedId": 0,
    //   "status": 0,
    //   "isSuccess": true,
    //   "message": "",
    //   "error": null,
    //   "errorMessage": "Successful"
    // }
    // this.portBopsPrice = portBopsPrice.payload;
    // this.triggerClickEvent();
    this.portService.getPortBopsPrice(requestPayload).subscribe(data=> {
      console.log(data);
      this.portBopsPrice = data?.payload;
      this.triggerClickEvent();
    })

  }
  
  triggerClickEvent() {
    let titleEle = document.getElementsByClassName('page-title')[0] as HTMLElement;
      titleEle.click();
  }
  closeMenu() {
    this.selectedType = "";
    this.description = "";
    // this.severity = "";
    this.severity = this.portSeverities.find(item=>item.id==1);
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
                              <textarea matInput disabled [value]="item?.remarkDescriptions"></textarea>
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
      <textarea style="caret-color:#fff !important;" matInput [(ngModel)]="item.remarkComments"
        (click)="$event.stopPropagation();"></textarea>
    </mat-form-field>
  </div>
  <div *ngIf="item?.remarkStatus?.name != 'No Action Taken'" class="change-log">
    <div>Change Log</div>
    <div style="height:70px;max-height: 100px;overflow-y: scroll;">
      <div *ngFor="let data of portRemarkLogs" style="margin:5px 0px">
        <div style="display: flex;align-items: center;">
          <div class="circle-blue"></div>
          <div class="log-date">{{data?.createdOn | date: 'MMM d, y hh:mm a'}}</div>
        </div>
        <div class="log-action">Alert marked as {{data?.remarkStatus?.name}} by {{data?.createdBy?.name}}</div>
      </div>
    </div>
  </div>
  <div class="actions">
    <button mat-button class="cancel" (click)="cancelMenu();$event.stopPropagation();">CANCEL</button>
    <button mat-raised-button [ngClass]="{'active':selectionChange}" class="save"
      (click)="updatePortRemark(statusDropdown.value)">SAVE</button>
  </div>
  </div>
</mat-menu>
  `
})
export class PortMenuComponent {
  @Input('item') item;
  @Input('remarkLogs') remarkLogs;
  @Output('refreshPortRemark') refreshPortRemark = new EventEmitter();
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  @ViewChild('statusDropdown') statusDropdown;
  portStatuses = [];
  public menuFlag: boolean = false;
  public menuClick: boolean = false;
  public selectionChange: boolean = false;
  public theme: boolean = true;
  portRemarkLogs: any;
  portRemarkStatusTemp: string = '';
  constructor(private elem: ElementRef,private localService: LocalService, private portService : PortPopupService, private legacyLookupsDatabase: LegacyLookupsDatabase, private dialog: MatDialog) { }
  ngOnInit(){
    this.portRemarkStatusTemp = this.item?.remarkStatus?.name;
    this.localService.themeChange.subscribe(value => this.theme = value);
    this.loadMasterLookupData();
  }
  async loadMasterLookupData() {
    let remarkType = this.item?.remarkTypes?.name;
    let groupRemarkLog = await this.groupByRemarkLogs();
    this.portRemarkLogs = (groupRemarkLog[remarkType]?.length)? groupRemarkLog[remarkType]: [];

    this.portStatuses = await this.legacyLookupsDatabase.getPortStatuses();
  }
  groupByRemarkLogs() {
    var groupRemarkType = [];
    var groupRemarkLog = {}
    return new Promise(resolve=> {
      this.remarkLogs.map((logs, index)=>{
        let type = logs.remarkTypes.name;
        if(!(groupRemarkType.includes(type))) {
            groupRemarkType.push(type);
            groupRemarkLog[type] = [logs];
        } else {
            groupRemarkLog[type].push(logs);
        }
        if(this.remarkLogs.length == index+1) {
          resolve(groupRemarkLog);
        }
      });
    });
  }
  openMenu() {
    this.menuTrigger.openMenu();
    this.selectionChange = false;

  }
  closeMenu() {
    this.item.remarkComments = '';
    this.item.remarkStatus = this.portStatuses.find(item=>item.name==this.portRemarkStatusTemp);
    this.statusDropdown.value = this.item.remarkStatus?.name;
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
    if((status=='Resolved') && (!(this.item?.remarkComments) || (this.item?.remarkComments.trim()==''))) {
      let warnCommentMsg = "please enter a comment";
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        panelClass: 'confirmation-popup-operator',
        data:  { message: warnCommentMsg, source: 'hardWarning' }
      });
      return;
    }
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
              "RemarkComments": this.item?.remarkComments,
              "IsDeleted" : 0
            }
          ]
      }
      this.selectionChange = false;
      this.portService.putPortRemark(requestPayload).subscribe(data=> {
        console.log(data);
        this.closeMenu();
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
