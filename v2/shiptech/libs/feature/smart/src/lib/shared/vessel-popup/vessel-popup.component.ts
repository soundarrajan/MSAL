import { Component, OnInit, ViewChild, Input, ElementRef, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatExpansionPanel } from '@angular/material/expansion';
import { GridOptions } from '@ag-grid-community/core';
import { AGGridCellRendererComponent } from '../ag-grid/ag-grid-cell-renderer.component';
import { AGGridCellDataComponent } from '../ag-grid/ag-grid-celldata.component';
import { LocalService } from '../../services/local-service.service';
import { LoggerService } from '../../services/logger.service';
import { ActivatedRoute } from '@angular/router';
import { VesselPopupService } from '../../services/vessel-popup.service';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import moment from 'moment';

@Component({
  selector: 'app-vessel-popup',
  templateUrl: './vessel-popup.component.html',
  styleUrls: ['./vessel-popup.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VesselPopupComponent implements OnInit {

  public alerts;
  public gridOptions: GridOptions;
  public selectionChange: boolean = false;
  public defaultView: boolean = true;
  public menuClick: boolean = false;
  public changeLog;
  public menuData;
  public theme:boolean = true;
  public shiptechUrl : string = '';
  FutureRequest: any = [];
  scheduleDashboardLabelConfiguration: any;
  public scheduleList : any = [];
  public  scheduleCount : number = 0;
  public vesselList : any[];
  VesselAlertList: any;
  VesselAlertLogs: any;
  constructor(private elem: ElementRef, private route: ActivatedRoute, private localService: LocalService, private logger: LoggerService, private vesselService : VesselPopupService) { 
    this.shiptechUrl =  new URL(window.location.href).origin;
  }
  @Input() status: string = "standard-view";
  @Input('vesselData') popup_data;
  @Output() showBPlan = new EventEmitter();
  @Output() showRoutes = new EventEmitter();
  @Output() closePopup = new EventEmitter();
  @ViewChild('second') second: MatExpansionPanel;
  @ViewChild('third') third: MatExpansionPanel;
  @ViewChild('fourth') fourth: MatExpansionPanel;
  @ViewChild('fifth') fifth: MatExpansionPanel;
  
  ngOnInit() {
    this.route.data.subscribe(data => {
      console.log(data);
      this.scheduleDashboardLabelConfiguration = data.scheduleDashboardLabelConfiguration;
    });
    this.route.data.subscribe(data => {
      console.log(data);
      this.vesselList = data?.vesselListWithImono;
    });
    this.loadVesselBasicInfo(this.popup_data.vesselId);
    this.loadFutureRequestData();
    this.loadRedeliveryInfo(this.popup_data.vesselId);
    this.loadVesselScheduleList(this.popup_data.vesselId);
    this.loadVesselAlertList();
    this.localService.themeChange.subscribe(value => this.theme = value);
    this.alerts = [
      {
        alert: 'ULSFO stock is Low',
        priority: '1',
        status: 'Resolved',
        comments: "Discussed with the operations team for change in route as the port will be closed in the ETA",
        changeLog: [{
          time: "MAR 12, 2020 12:43PM",
          action: "Alert marked as resolved by John Smith"
        },
        {
          time: "MAR 12, 2020 12:43PM",
          action: "Alert marked as pending by John Smith"
        }]

      },
      {
        alert: 'Nearing redelivery date',
        priority: '1',
        status: 'Pending',
        comments: "",
        changeLog: [
          {
            time: "MAR 12, 2020 12:43PM",
            action: "Alert marked as pending by John Smith"
          }]

      },
      {
        alert: 'VLSFO stock is Medium',
        priority: '2',
        status: 'No Action Taken',
        comments: "",
        changeLog: []

      },
      {
        alert: 'Stock below Reserves Rule',
        priority: '2',
        status: 'No Action Taken',
        comments: "",
        changeLog: []

      },
      {
        alert: 'Unmanageable Vessel',
        priority: '2',
        status: 'No Action Taken',
        comments: "",
        changeLog: []

      }
    ]

    this.gridOptions = <GridOptions>{
      columnDefs: this.columnDefs,
      //enableColResize: false,
      // enableSorting: false,
      animateRows: false,
      headerHeight: 0,
      rowHeight: 38,
      defaultColDef: {
        filter: false,
        sortable: false,
        resizable: true
      },
      rowSelection: 'single',
      onGridReady: (params) => {
        this.gridOptions.api = params.api;
        this.gridOptions.columnApi = params.columnApi;
        if(this.FutureRequest?.payload) {
          let futureRequestData = (this.FutureRequest.payload.length)? this.FutureRequest.payload: [];
          this.gridOptions.api.setRowData(futureRequestData);
          this.triggerClickEvent();
        }
      },
      onGridSizeChanged: function (params) {
        params.columnApi.autoSizeAllColumns();
      },
    };
  }
  ngAfterViewInit() {
    this.logger.logInfo('VesselPopupComponent-ngAfterViewInit()', new Date());
  }

  loadVesselBasicInfo(vesselId){
    if(vesselId != null){
      let req = { VesselId : vesselId};
      this.vesselService.getVesselBasicInfo(req).subscribe((res)=>{
        if(res.payload.length > 0){
          this.popup_data.serviceId = res.payload[0].serviceId;
          this.popup_data.deptId = res.payload[0].deptId;
          this.popup_data.ownership = res.payload[0].ownership;
          this.popup_data.destination = res.payload[0].destination;
          this.popup_data.next_destination = res.payload[0].nextDestination;
          this.popup_data.eta1 = res.payload[0].destinationEta;
          this.popup_data.eta2 = res.payload[0].nextDestinationEta;
          this.popup_data.hsfo = res.payload[0].hsfo_current_stock;
          this.popup_data.ulsfo = res.payload[0].ulsfo_current_stock;
          this.popup_data.vlsfo = res.payload[0].vlsfo_current_stock;
          this.popup_data.lsdis = res.payload[0].lsdis_current_stock;
          this.popup_data.dis = res.payload[0].hsdis_current_stock;  

          this.triggerClickEvent();     
        }
      })
    }
  }

 
  loadFutureRequestData() {
    let requestPayload = {
      "Payload": {
        "Order": null,
        "PageFilters": {
          "Filters": [
            {
              "columnValue": "RequestStatus_DisplayName",
              "ColumnType": "Text",
              "isComputedColumn": false,
              "ConditionValue": "!=",
              "Values": [
                  "cancelled"
              ],
              "FilterOperator": 0
            },
            {
              "columnValue": "ProductStatus_DisplayName",
              "ColumnType": "Text",
              "isComputedColumn": false,
              "ConditionValue": "!=",
              "Values": [
                  "cancelled"
              ],
              "FilterOperator": 0
            },
            {
                "columnValue": "vesselId",
                "ColumnType": "Text",
                "isComputedColumn": false,
                "ConditionValue": "=",
                "Values": [
                    this.popup_data?.vesselId
                ],
                "FilterOperator": 0
            }
          ]
        },
        "SortList": {
          "SortList": [
            {
              "columnValue": "eta",
              "sortIndex": 0,
              "sortParameter": 2
            }
          ]
        },
        "Filters": [],
        "SearchText": null,
        "Pagination": {
          "Skip": 0,
          "Take": 5
        }
      }
    }
    this.localService.getOutstandRequestData(requestPayload, this.scheduleDashboardLabelConfiguration).subscribe(response => {
      console.log(response.payload);
      this.FutureRequest = [];
      if(response.payload) {
        this.FutureRequest = response;
        if(this.gridOptions?.api) {
          let futureRequestData = (this.FutureRequest?.payload?.length)? this.FutureRequest.payload: [];
          this.gridOptions.api.setRowData(futureRequestData);
        }
        this.triggerClickEvent();
      }
    })
  }

  loadRedeliveryInfo(vesselId){
    if(vesselId != null){
      let req = { VesselId : vesselId}; //VesselId : 2805
      this.vesselService.getVesselRedeliveryInfo(req).subscribe((res)=>{
        if(res.payload.length > 0){
          this.popup_data.vesselExpDate = res.payload[0].expiryDate;
          this.popup_data.redeliveryDays = res.payload[0].redeliveryDays ? res.payload[0].redeliveryDays + ' Days' : "";
          this.popup_data.hfo = res.payload[0].hsfoRedeliveryQty;
          this.popup_data.lshfo = res.payload[0].lsfoRedeliveryQty;
          this.popup_data.lsmdo = res.payload[0].lsmdoRedeliveryQty;
          this.popup_data.mdo = res.payload[0].mdoRedeliveryQty;
          this.popup_data.mgo = res.payload[0].mgoRedeliveryQty;
          this.popup_data.lsmgo = res.payload[0].lsmgoRedeliveryQty;   

          this.triggerClickEvent();     
        }
      })
    }
  }

  loadVesselScheduleList(vesselId){
    if(vesselId != null){
      let selectedVessel = this.vesselList.find(vessel => vessel.id == vesselId)
      if(!(selectedVessel?.imono)) {
          this.triggerClickEvent();     
          return;
      };
      let req = { VesselImo : selectedVessel?.imono};//'SDMLG1014' };
      this.vesselService.getVesselSchedule(req).subscribe((res)=>{
        if(res.payload.length > 0){
          this.scheduleCount = res.payload[0].count;
          this.scheduleList = res.payload;
          this.triggerClickEvent();     
        }
      })
    }
  }

  triggerClickEvent() {
    let titleEle = document.getElementsByClassName('page-title')[0] as HTMLElement;
      titleEle.click();
  }

  dateFormatter(params, type?) {
    if(params == null)
    return "";
    else{
      if(type == '/')
        return moment(params).format('DD/MM/YYYY');
      else
        return moment(params).format('YYYY-MM-DD HH:MM');
    }
  }

  public changeDefault(expandRef?:any) {
    if(this.second?.expanded || expandRef=='second') {
      this.loadVesselAlertList();
    }
  }
  refreshVesselAlert(data) {
    // this.loadVesselAlertList();
    // refresh alert list with updated payload
      let VesselAlertData = data?.payload;
      this.VesselAlertList = VesselAlertData?.vesselAlertDetails;
      this.VesselAlertLogs = VesselAlertData?.vesselAlertLogs;
      this.triggerClickEvent();
  }
  loadVesselAlertList() {
    let requestPayload = {
      "VesselId": this.popup_data?.vesselId
    }
    // let VesselAlertList = {
    //   "payload": {
    //     "vesselAlertDetails": [
    //       {
    //         "vesselId": 91,
    //         "alertColorFlag_Name": "Red",
    //         "alertTypes": {
    //           "id": 6,
    //           "name": "TestAlert7",
    //           "internalName": null,
    //           "displayName": null,
    //           "code": null,
    //           "collectionName": null,
    //           "customNonMandatoryAttribute1": null,
    //           "isDeleted": false,
    //           "modulePathUrl": null,
    //           "clientIpAddress": null,
    //           "userAction": null
    //         },
    //         "alertStatus": {
    //           "id": 1,
    //           "name": "No Action Taken",
    //           "internalName": null,
    //           "displayName": null,
    //           "code": null,
    //           "collectionName": null,
    //           "customNonMandatoryAttribute1": null,
    //           "isDeleted": false,
    //           "modulePathUrl": null,
    //           "clientIpAddress": null,
    //           "userAction": null
    //         },
    //         "alertComments": "testing alert",
    //         "createdBy": {
    //           "id": 0,
    //           "name": "RM",
    //           "internalName": null,
    //           "displayName": null,
    //           "code": null,
    //           "collectionName": null,
    //           "customNonMandatoryAttribute1": null,
    //           "isDeleted": false,
    //           "modulePathUrl": null,
    //           "clientIpAddress": null,
    //           "userAction": null
    //         },
    //         "createdOn": "2021-06-17T12:56:07.727Z",
    //         "lastModifiedBy": {
    //           "id": 0,
    //           "name": "RM",
    //           "internalName": null,
    //           "displayName": null,
    //           "code": null,
    //           "collectionName": null,
    //           "customNonMandatoryAttribute1": null,
    //           "isDeleted": false,
    //           "modulePathUrl": null,
    //           "clientIpAddress": null,
    //           "userAction": null
    //         },
    //         "lastModifiedOn": "2021-06-17T12:56:07.727Z",
    //         "id": 10,
    //         "isDeleted": false,
    //         "modulePathUrl": null,
    //         "clientIpAddress": null,
    //         "userAction": null
    //       },
    //       {
    //         "vesselId": 91,
    //         "alertColorFlag_Name": "Red",
    //         "alertTypes": {
    //           "id": 6,
    //           "name": "TestAlert7",
    //           "internalName": null,
    //           "displayName": null,
    //           "code": null,
    //           "collectionName": null,
    //           "customNonMandatoryAttribute1": null,
    //           "isDeleted": false,
    //           "modulePathUrl": null,
    //           "clientIpAddress": null,
    //           "userAction": null
    //         },
    //         "alertStatus": {
    //           "id": 1,
    //           "name": "No Action Taken",
    //           "internalName": null,
    //           "displayName": null,
    //           "code": null,
    //           "collectionName": null,
    //           "customNonMandatoryAttribute1": null,
    //           "isDeleted": false,
    //           "modulePathUrl": null,
    //           "clientIpAddress": null,
    //           "userAction": null
    //         },
    //         "alertComments": "testing alert",
    //         "createdBy": {
    //           "id": 0,
    //           "name": "RM",
    //           "internalName": null,
    //           "displayName": null,
    //           "code": null,
    //           "collectionName": null,
    //           "customNonMandatoryAttribute1": null,
    //           "isDeleted": false,
    //           "modulePathUrl": null,
    //           "clientIpAddress": null,
    //           "userAction": null
    //         },
    //         "createdOn": "2021-06-17T12:56:07.727Z",
    //         "lastModifiedBy": {
    //           "id": 0,
    //           "name": "RM",
    //           "internalName": null,
    //           "displayName": null,
    //           "code": null,
    //           "collectionName": null,
    //           "customNonMandatoryAttribute1": null,
    //           "isDeleted": false,
    //           "modulePathUrl": null,
    //           "clientIpAddress": null,
    //           "userAction": null
    //         },
    //         "lastModifiedOn": "2021-06-17T12:56:07.727Z",
    //         "id": 10,
    //         "isDeleted": false,
    //         "modulePathUrl": null,
    //         "clientIpAddress": null,
    //         "userAction": null
    //       },
    //       {
    //         "vesselId": 91,
    //         "alertColorFlag_Name": "Amber",
    //         "alertTypes": {
    //           "id": 6,
    //           "name": "TestAlert7",
    //           "internalName": null,
    //           "displayName": null,
    //           "code": null,
    //           "collectionName": null,
    //           "customNonMandatoryAttribute1": null,
    //           "isDeleted": false,
    //           "modulePathUrl": null,
    //           "clientIpAddress": null,
    //           "userAction": null
    //         },
    //         "alertStatus": {
    //           "id": 1,
    //           "name": "No Action Taken",
    //           "internalName": null,
    //           "displayName": null,
    //           "code": null,
    //           "collectionName": null,
    //           "customNonMandatoryAttribute1": null,
    //           "isDeleted": false,
    //           "modulePathUrl": null,
    //           "clientIpAddress": null,
    //           "userAction": null
    //         },
    //         "alertComments": "testing alert",
    //         "createdBy": {
    //           "id": 0,
    //           "name": "RM",
    //           "internalName": null,
    //           "displayName": null,
    //           "code": null,
    //           "collectionName": null,
    //           "customNonMandatoryAttribute1": null,
    //           "isDeleted": false,
    //           "modulePathUrl": null,
    //           "clientIpAddress": null,
    //           "userAction": null
    //         },
    //         "createdOn": "2021-06-17T12:56:07.727Z",
    //         "lastModifiedBy": {
    //           "id": 0,
    //           "name": "RM",
    //           "internalName": null,
    //           "displayName": null,
    //           "code": null,
    //           "collectionName": null,
    //           "customNonMandatoryAttribute1": null,
    //           "isDeleted": false,
    //           "modulePathUrl": null,
    //           "clientIpAddress": null,
    //           "userAction": null
    //         },
    //         "lastModifiedOn": "2021-06-17T12:56:07.727Z",
    //         "id": 10,
    //         "isDeleted": false,
    //         "modulePathUrl": null,
    //         "clientIpAddress": null,
    //         "userAction": null
    //       }
    //     ],
    //     "vesselAlertLogs": [
    //       {
    //         "vesselId": 91,
    //         "alertTypes": {
    //           "id": 6,
    //           "name": "TestAlert7",
    //           "internalName": null,
    //           "displayName": null,
    //           "code": null,
    //           "collectionName": null,
    //           "customNonMandatoryAttribute1": null,
    //           "isDeleted": false,
    //           "modulePathUrl": null,
    //           "clientIpAddress": null,
    //           "userAction": null
    //         },
    //         "alertStatus": {
    //           "id": 1,
    //           "name": "No Action Taken",
    //           "internalName": null,
    //           "displayName": null,
    //           "code": null,
    //           "collectionName": null,
    //           "customNonMandatoryAttribute1": null,
    //           "isDeleted": false,
    //           "modulePathUrl": null,
    //           "clientIpAddress": null,
    //           "userAction": null
    //         },
    //         "createdBy": {
    //           "id": 0,
    //           "name": "RM",
    //           "internalName": null,
    //           "displayName": null,
    //           "code": null,
    //           "collectionName": null,
    //           "customNonMandatoryAttribute1": null,
    //           "isDeleted": false,
    //           "modulePathUrl": null,
    //           "clientIpAddress": null,
    //           "userAction": null
    //         },
    //         "createdOn": "2021-06-17T12:56:07.727Z",
    //         "lastModifiedBy": {
    //           "id": 0,
    //           "name": "RM",
    //           "internalName": null,
    //           "displayName": null,
    //           "code": null,
    //           "collectionName": null,
    //           "customNonMandatoryAttribute1": null,
    //           "isDeleted": false,
    //           "modulePathUrl": null,
    //           "clientIpAddress": null,
    //           "userAction": null
    //         },
    //         "lastModifiedOn": "2021-06-17T12:56:07.727Z",
    //         "id": 1,
    //         "isDeleted": false,
    //         "modulePathUrl": null,
    //         "clientIpAddress": null,
    //         "userAction": null
    //       },
    //       {
    //         "vesselId": 91,
    //         "alertTypes": {
    //           "id": 6,
    //           "name": "TestAlert7",
    //           "internalName": null,
    //           "displayName": null,
    //           "code": null,
    //           "collectionName": null,
    //           "customNonMandatoryAttribute1": null,
    //           "isDeleted": false,
    //           "modulePathUrl": null,
    //           "clientIpAddress": null,
    //           "userAction": null
    //         },
    //         "alertStatus": {
    //           "id": 1,
    //           "name": "No Action Taken",
    //           "internalName": null,
    //           "displayName": null,
    //           "code": null,
    //           "collectionName": null,
    //           "customNonMandatoryAttribute1": null,
    //           "isDeleted": false,
    //           "modulePathUrl": null,
    //           "clientIpAddress": null,
    //           "userAction": null
    //         },
    //         "createdBy": {
    //           "id": 0,
    //           "name": "RM",
    //           "internalName": null,
    //           "displayName": null,
    //           "code": null,
    //           "collectionName": null,
    //           "customNonMandatoryAttribute1": null,
    //           "isDeleted": false,
    //           "modulePathUrl": null,
    //           "clientIpAddress": null,
    //           "userAction": null
    //         },
    //         "createdOn": "2021-06-17T12:56:07.727Z",
    //         "lastModifiedBy": {
    //           "id": 0,
    //           "name": "RM",
    //           "internalName": null,
    //           "displayName": null,
    //           "code": null,
    //           "collectionName": null,
    //           "customNonMandatoryAttribute1": null,
    //           "isDeleted": false,
    //           "modulePathUrl": null,
    //           "clientIpAddress": null,
    //           "userAction": null
    //         },
    //         "lastModifiedOn": "2021-06-17T12:56:07.727Z",
    //         "id": 2,
    //         "isDeleted": false,
    //         "modulePathUrl": null,
    //         "clientIpAddress": null,
    //         "userAction": null
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
    // let VesselAlertData = VesselAlertList?.payload;
    // this.VesselAlertList = VesselAlertData?.vesselAlertDetails;
    // this.VesselAlertLogs = VesselAlertData?.vesselAlertLogs;
    this.vesselService.loadVesselAlertList(requestPayload).subscribe(data=> {
      console.log(data);
      let VesselAlertData = data?.payload;
      this.VesselAlertList = VesselAlertData?.vesselAlertDetails;
      this.VesselAlertLogs = VesselAlertData?.vesselAlertLogs;
      this.triggerClickEvent();
    });
  }

  public openPort(portName, portId) {
    let portPopupData;
    let selectedPort;
    let data;
    let routeOpen = false;
    this.localService.portPopUpDetails.subscribe(res => portPopupData = res);
    this.localService.isRouteOpen.subscribe(flag => routeOpen = flag);
    if (routeOpen || (!routeOpen && !((portPopupData.filter(port => port.name.toLowerCase() == portName.toLowerCase())).length > 0))) {
      // this.mapService.getLocationsListForMap("").subscribe(res => {
      //  selectedPort = res.payload.filter(item => item.locationName.toLowerCase() == portName.toLowerCase());
        data = {
          locationId: portId,
          position: 1,
          port_view: "standard-view",//pData.flag,
          name: portName,//selectedPort[0].locationName,
          earliestTradingTime: '',
          latestTradingTime: '',
          avlProdCategory: [],
          //notavlProdCategory: ['DIS'],
          // destination: 'Marseille',
          // eta1: '2020-04-13 10:00',
          // eta2: '2020-04-14 10:00',
          // next_destination: 'Catania',
          // voyageStatus: 'Laden',
          // vesselId: '1YM',
          // vesselExpDate: '12/06/2020',
          // vesselType: 'LR1',
          // bunkeringStatus: 'Created',
          // serviceId: '271',
          // deptId: 'MLAS',
          // ownership: 'Chartered',
          // hsfo: '468',
          // dogo: '600',
          // ulsfo: '120',
          // vlsfo: '364',
          // hfo: '58',
          // lshfo: '120',
          // mdo: '10',
          // lsmdo: '20',
          // mso: '10',
          // lsmgo: '10',
          notificationsCount: 6,
          messagesCount: 2,
          latitude: 0,//selectedPort[0].locationLatitude,
          longitude: 0,//selectedPort[0].locationLongitude,
        }
        if (!routeOpen) {
          if (portPopupData.length >= 2) {
            portPopupData.splice(0, 1);
            portPopupData.push(data);
          }
          else {
            portPopupData.push(data);
          }
          if (portPopupData.length == 1) {
            portPopupData[0].position = 0;
          }
          else if (portPopupData.length == 2) {
            portPopupData[0].position = 1;
            portPopupData[1].position = 0;
          }
        }
        else {
          portPopupData = [];
          portPopupData.push(data);
        }
        this.localService.setPortPopupData(portPopupData);
        this.localService.setOpenPortPopupCount(portPopupData.length);
      // });
    }
  }
  private columnDefs = [
    {
      headerName: 'Request ID', headerTooltip: 'Request ID', field: 'requestId', width: 80, 
      cellRendererFramework: AGGridCellDataComponent, 
      cellRendererParams: { type: 'request-link', redirectUrl: `${this.shiptechUrl}/#/edit-request` },
      headerClass: ['aggrid-columgroup-dark-splitter'], 
      cellClass: ['aggrid-content-center aggrid-link fs-11'],
    },
    { 
      headerName: 'Port', headerTooltip: 'Port', field: 'locationName', width: 85,
      cellRendererFramework: AGGridCellDataComponent, 
      cellRendererParams: { type: 'info-with-popup-multiple-values', cellClass: 'aggrid-cell-color white', 
         context: { componentParent: this } }, 
         cellClass: ['aggrid-blue-editable-cell editable'],
          headerClass: ['aggrid-colum-splitter-left']
    },
    {
      headerName: 'Fuel Grade', headerTooltip: 'Fuel Grade', field: 'productName', width: 80,
      cellRendererFramework: AGGridCellDataComponent, 
      cellRendererParams: { type: 'popup-multiple-values' }, 
      cellClass: ['aggrid-content-center fs-10'],
      valueGetter: function (params) {
        if(params?.data?.productName) {
          return [params.data.productName];
        } else {
          return []
        }
      }
    },
    {
      headerName: 'Status', field: 'requestStatus.displayName', headerTooltip: 'Status', width: 65,
      cellRendererFramework: AGGridCellRendererComponent, headerClass: ['aggrid-text-align-c'], cellClass: ['aggrid-content-center fs-8'],
      cellRendererParams: function (params) {
        var classArray: string[] = [];
        let cellStyle = {};
        let status = params?.data?.requestStatus?.displayName;
        classArray.push('aggrid-content-center');
        classArray.push('custom-chip small-chip w-100-important');

        let colorCode = params?.data?.requestStatus?.colorCode;
        if(colorCode?.code) {
          cellStyle = {'background': colorCode.code};
        }
        // let newClass = status === 'Stemmed' ? 'custom-chip small-chip darkgreen' :
        // status === 'Validated' ? 'custom-chip small-chip amber' :
        // status === 'PartiallyInquired' ? 'custom-chip small-chip purple' :
        // status === 'Inquired' ? 'custom-chip small-chip purple' :
        // status === 'PartiallyQuoted' ? 'custom-chip small-chip purple' :
        // status === 'Quoted' ? 'custom-chip small-chip purple' :
        // status === 'Amended' ? 'custom-chip small-chip purple' :
        // status === 'PartiallyStemmed' ? 'custom-chip small-chip purple' :
        // status === 'Cancelled' ? 'custom-chip small-chip purple' :
        //       'custom-chip small-chip dark';
        // classArray.push(newClass);
        return { cellClass: classArray.length > 0 ? classArray : null, cellStyle: cellStyle }
      }
    }
  ];

  // private rowData = [
  //   {
  //     requestid: '12819ED', port: 'Marseille', fuelgrade: ['RMK850', 'RMK5005'], trader: 'BOPs', status: 'Stemmed'
  //   },
  //   {
  //     requestid: '13587ED', port: 'Catania', fuelgrade: ['RMK850', 'RMK5005'], trader: 'Operator', status: 'Inquired'
  //   },
  //   {
  //     requestid: '13587ED', port: 'Aden', fuelgrade: ['RMK850', 'RMK5005'], trader: 'BOPs', status: 'New'
  //   },
  //   {
  //     requestid: '56900GA', port: 'Kish', fuelgrade: ['RMK850', 'RMK5005'], trader: 'BOPs', status: 'New'
  //   }

  // ];
}

@Component({
  selector: 'vessel-menu',
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
      <ng-container [ngSwitch]="item.alertColorFlag_Name">
        <img *ngSwitchCase="'Red'" class="warning-icon"
          src="./assets/customicons/red-warning-o.svg" alt="warning-icon">
        <img *ngSwitchCase="'Amber'" class="warning-icon"
          src="./assets/customicons/amber-warning-o.svg" alt="warning-icon">
        <img *ngSwitchDefault class="warning-icon"
          src="./assets/customicons/green-warning-o.svg" alt="warning-icon">
      </ng-container>
    </div>
    <div class="warning-title">
      {{item?.alertTypes?.name}}
    </div>
    <div (click)="cancelMenu()" style="position: absolute;top: 8px;right: 0px;">
      <mat-icon class="close">close</mat-icon>
    </div>
  </div>
  <div class="alert-desc" *ngIf="item.alertTypes.name=='Unmanageable Vessel'">
  <div class="header" >ALERT DESCRIPTION</div>
  No GSIS data input available for  this vessel
  </div>
  <div class="status">
    <div>Status</div>
    <mat-form-field appearance="fill">
      <mat-select #statusDropdown [value]="item?.alertStatus?.name" [panelClass]="{'dark-theme':theme,'light-theme':!theme}"
        (selectionChange)="selectionChange = true" (click)="$event.stopPropagation();">
        <mat-option *ngFor="let status of VesselAlertStatus" [value]="status.name">{{status.displayName}}</mat-option>
      </mat-select>
    </mat-form-field>
  </div>
  <div *ngIf="item.alertStatus.name == 'Resolved' || statusDropdown.value== 'Resolved'"
    class="comments">
    <div>Comments</div>
    <mat-form-field appearance="fill">
      <textarea style="caret-color:#fff !important;" matInput [(ngModel)]="item.alertComments"
        (click)="$event.stopPropagation();"></textarea>
    </mat-form-field>
  </div>
  <div *ngIf="item.alertStatus.name != 'No Action Taken'" class="change-log">
    <div>Change Log</div>
    <div style="height:70px;max-height: 100px;overflow-y: scroll;">
      <div *ngFor="let data of changeLogs" style="margin:5px 0px">
        <div style="display: flex;align-items: center;">
          <div class="circle-blue"></div>
          <div class="log-date">{{data?.createdOn | date: 'MMM d, y hh:mm a'}}</div>
          </div>
          <div class="log-action">Alert marked as {{data?.alertStatus?.name}} by {{data?.createdBy?.name}}</div>
        </div>
      </div>
  </div>
  <div class="actions">
    <button mat-button class="cancel" (click)="cancelMenu();$event.stopPropagation();">CANCEL</button>
    <button mat-raised-button [ngClass]="{'active':selectionChange}" class="save"
      (click)="save(statusDropdown?.value);$event.stopPropagation();">SAVE</button>
  </div>
  </div>
</mat-menu>
  `
})
export class VesselMenuComponent {
  @Input('item') item;
  @Input('alerts') alerts;
  @Input('changeLog') changeLog;
  @Output() refreshVesselAlert= new EventEmitter(); 
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  @ViewChild('statusDropdown') statusDropdown;

  public menuFlag: boolean = false;
  public menuClick: boolean = false;
  public selectionChange: boolean = false;
  public theme: boolean = true;
  VesselAlertStatus = [];
  changeLogs = [];
  VesselAlertStatusTemp:string = '';
  constructor(private elem: ElementRef, private localService: LocalService, private vesselPopupService: VesselPopupService, private legacyLookupsDatabase: LegacyLookupsDatabase,  private dialog: MatDialog) { }
  ngOnInit(){
    this.localService.themeChange.subscribe(value => this.theme = value);
    
    this.VesselAlertStatusTemp = this.item?.alertStatus?.name;
    this.loadMasterLookupData();
  }
  async loadMasterLookupData() {
    let alertTypes = this.item?.alertTypes?.name;
    let groupChangeLog = await this.groupByAlertChangeLogs();
    this.changeLogs = (groupChangeLog[alertTypes]?.length)? groupChangeLog[alertTypes]: [];

    this.VesselAlertStatus = await this.legacyLookupsDatabase.getPortStatuses();
  }
  groupByAlertChangeLogs() {
    var groupAlertType = [];
    var groupChangeLog = {}
    return new Promise(resolve=> {
      // return with empty object if alert doesn't contain any changelog
      if(!(this.changeLog?.length)) { resolve(groupChangeLog); }
      this.changeLog.map((logs, index)=>{
        let type = logs.alertTypes?.name;
        if(!(groupAlertType.includes(type))) {
            groupAlertType.push(type);
            groupChangeLog[type] = [logs];
        } else {
            groupChangeLog[type].push(logs);
        }
        if(this.changeLog.length == index+1) {
          resolve(groupChangeLog);
        }
      });
    });
  }
  openMenu() {
    this.menuTrigger.openMenu();
    this.selectionChange = false;

  }
  closeMenu() {
    this.item.alertComments = '';
    this.item.AlertStatus = this.VesselAlertStatus.find(item=>item.name==this.VesselAlertStatusTemp);
    this.statusDropdown.value = this.item.AlertStatus?.name;
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
    overlay?.classList.add('removeOverlay');

  }

  toggleMenu2() {//onleave
    this.closeMenu();
    var overlay = document.querySelector('.cdk-overlay-container');
    overlay?.classList.remove('removeOverlay');
  }
  //onclick
  toggleMenu3(event) {
    var overlay = document.querySelector('.cdk-overlay-container');
    overlay.classList.remove('removeOverlay');
    this.menuClick = true;
    this.openMenu();
    event.target.classList.add('active-class');

  }
  save(status) {
    if((status=='Resolved') && (!(this.item?.alertComments) || (this.item?.alertComments.trim()==''))) {
      let warnCommentMsg = "please enter a comment";
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        panelClass: 'confirmation-popup-operator',
        data:  { message: warnCommentMsg, source: 'hardWarning' }
      });
      return;
    }
      let vesselAlertId = this.item?.alertTypes?.id;
      let vesselAlertName = this.item?.alertTypes?.name;
      let selectedAlertStatus = this.VesselAlertStatus.find(item=>item.name==status);
      let requestPayload = {
        "VesselId": this.item?.vesselId,
        "VesselAlerts": [
          {
            "Id": vesselAlertId,
            "VesselId": this.item?.vesselId,
            "AlertTypes": {
              "id": vesselAlertId,
              "name": vesselAlertName
            },
            "AlertStatus": {
              "id": selectedAlertStatus?.id,
              "name": selectedAlertStatus?.name
            },
            "AlertColorFlag_Name": "",
            "AlertComments": this.item?.alertComments,
            "IsDeleted": 0
          }
        ]
      }
      this.selectionChange = false;
      this.vesselPopupService.updateVesselAlertList(requestPayload).subscribe(data=> {
        console.log(data);
        this.closeMenu();
        this.refreshVesselAlert.emit(data);
      })
  }
  cancelMenu() {
    this.closeMenu();
  }

}
