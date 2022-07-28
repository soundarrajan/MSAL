import {
  Component,
  OnInit,
  ViewChild,
  Input,
  ElementRef,
  Output,
  EventEmitter,
  ViewEncapsulation,
  HostListener
} from '@angular/core';
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
import { UserProfileState } from '@shiptech/core/store/states/user-profile/user-profile.state';
import { Store } from '@ngxs/store';

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
  public myDefaultView: boolean = false;
  public menuClick: boolean = false;
  public changeLog;
  public menuData;
  public theme: boolean = true;
  public shiptechUrl: string = '';
  FutureRequest: any = [];
  scheduleDashboardLabelConfiguration: any;
  public scheduleList: any = [];
  public scheduleCount: number = 0;
  public vesselList: any[];
  VesselAlertList: any;
  VesselAlertLogs: any;
  myDefaultViewPayload: any = [];
  EnableFutureView: boolean;
  viewFutureRequest: boolean = false;
  viewVesselRedelivery: boolean = false;
  viewVesselSchedule: boolean = false;
  viewVesselAlerts: boolean = false;
  APImyDefaultView: any = [];
  public popup_data: any = [];
  constructor(
    private store: Store,
    private elem: ElementRef,
    private route: ActivatedRoute,
    private localService: LocalService,
    private logger: LoggerService,
    private vesselService: VesselPopupService
  ) {
    this.shiptechUrl = new URL(window.location.href).origin;
  }
  @Input() status: string = 'standard-view';
  @Input('vesselData')
  public set vesselData(v: any) {
    this.popup_data = v;
  }
  @Output() showBPlan = new EventEmitter();
  @Output() showRoutes = new EventEmitter();
  @Output() closePopup = new EventEmitter();
  @ViewChild('second') second: MatExpansionPanel;
  @ViewChild('third') third: MatExpansionPanel;
  @ViewChild('fourth') fourth: MatExpansionPanel;
  @ViewChild('fifth') fifth: MatExpansionPanel;

  ngOnInit() {
    if (this.vesselService.myDefaultViewPayload) {
      if (this.vesselService.myDefaultViewPayload.vessel == 1) {
        this.vesselService.myDefaultViewPayload.defaultView = 1;
        this.myDefaultView = true;
        if (this.vesselService.myDefaultViewPayload.futureRequest == 1) {
          this.viewFutureRequest = true;
        } else if (
          this.vesselService.myDefaultViewPayload.vesselRedelivery == 1
        ) {
          this.viewVesselRedelivery = true;
        } else if (
          this.vesselService.myDefaultViewPayload.vesselSchedule == 1
        ) {
          this.viewVesselSchedule = true;
        } else if (this.vesselService.myDefaultViewPayload.vesselAlerts == 1) {
          this.viewVesselAlerts = true;
        }
      }
      this.vesselService.myDefaultViewPayload.vessel = 1;
      this.vesselService.myDefaultViewPayload.port = 0;
      this.vesselService.myDefaultViewPayload.bunkerPlan = 0;
    }

    this.route.data.subscribe(data => {
      this.scheduleDashboardLabelConfiguration =
        data.scheduleDashboardLabelConfiguration;
    });
    this.route.data.subscribe(data => {
      this.vesselList = data?.vesselListWithImono;
    });
    this.loadVesselBasicInfo(this.popup_data.vesselId);
    //this.getDefaultView();
    this.loadFutureRequestData();
    this.loadRedeliveryInfo(this.popup_data.vesselId);
    this.loadVesselScheduleList(this.popup_data.vesselId);
    this.loadVesselAlertList();

    this.localService.themeChange.subscribe(value => (this.theme = value));
    this.alerts = [
      {
        alert: 'ULSFO stock is Low',
        priority: '1',
        status: 'Resolved',
        comments:
          'Discussed with the operations team for change in route as the port will be closed in the ETA',
        changeLog: [
          {
            time: 'MAR 12, 2020 12:43PM',
            action: 'Alert marked as resolved by John Smith'
          },
          {
            time: 'MAR 12, 2020 12:43PM',
            action: 'Alert marked as pending by John Smith'
          }
        ]
      },
      {
        alert: 'Nearing redelivery date',
        priority: '1',
        status: 'Pending',
        comments: '',
        changeLog: [
          {
            time: 'MAR 12, 2020 12:43PM',
            action: 'Alert marked as pending by John Smith'
          }
        ]
      },
      {
        alert: 'VLSFO stock is Medium',
        priority: '2',
        status: 'No Action Taken',
        comments: '',
        changeLog: []
      },
      {
        alert: 'Stock below Reserves Rule',
        priority: '2',
        status: 'No Action Taken',
        comments: '',
        changeLog: []
      },
      {
        alert: 'Unmanageable Vessel',
        priority: '2',
        status: 'No Action Taken',
        comments: '',
        changeLog: []
      }
    ];

    this.gridOptions = <GridOptions>{
      columnDefs: this.columnDefs,
      // enableColResize: false,
      enableSorting: false,
      enableFilter: false,
      animateRows: false,
      headerHeight: 0,
      rowHeight: 30,
      defaultColDef: {
        filter: false,
        sortable: false,
        resizable: false
      },
      rowSelection: 'single',
      onGridReady: params => {
        this.gridOptions.api = params.api;
        this.gridOptions.columnApi = params.columnApi;
        if (this.FutureRequest?.payload) {
          let futureRequestData = this.FutureRequest.payload.length
            ? this.FutureRequest.payload
            : [];
          this.gridOptions.api.setRowData(futureRequestData);
          this.triggerClickEvent();
        }
      },
      onGridSizeChanged: function(params) {
        // params.columnApi.autoSizeAllColumns();
      }
    };
  }
  ngAfterViewInit() {
    this.logger.logInfo('VesselPopupComponent-ngAfterViewInit()', new Date());
  }

  loadVesselBasicInfo(vesselId) {
    if (vesselId != null) {
      let req = { VesselId: vesselId };
      this.vesselService.getVesselBasicInfo(req).subscribe(res => {
        if (res.payload.length > 0) {
          //this.popup_data.serviceId = res.payload[0].serviceId;
          this.popup_data.serviceCode = res.payload[0].serviceCode;
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
          this.popup_data.routeAvailable = res.payload[0].isRouteAvailable;

          this.triggerClickEvent();
        }
      });
    }
  }

  CheckDefaultView(event) {
    if (event) {
      this.myDefaultView = true;
      this.vesselService.myDefaultViewPayload.defaultView = 1;
      if (this.viewFutureRequest) {
        this.vesselService.myDefaultViewPayload.futureRequest = 1;
        this.vesselService.myDefaultViewPayload.vesselRedelivery = 0;
        this.vesselService.myDefaultViewPayload.vesselSchedule = 0;
        this.vesselService.myDefaultViewPayload.vesselAlerts = 0;
      } else if (this.viewVesselRedelivery) {
        this.vesselService.myDefaultViewPayload.vesselRedelivery = 1;
        this.vesselService.myDefaultViewPayload.futureRequest = 0;
        this.vesselService.myDefaultViewPayload.vesselSchedule = 0;
        this.vesselService.myDefaultViewPayload.vesselAlerts = 0;
      } else if (this.viewVesselSchedule) {
        this.vesselService.myDefaultViewPayload.vesselSchedule = 1;
        this.vesselService.myDefaultViewPayload.futureRequest = 0;
        this.vesselService.myDefaultViewPayload.vesselRedelivery = 0;
        this.vesselService.myDefaultViewPayload.vesselAlerts = 0;
      } else if (this.viewVesselAlerts) {
        this.vesselService.myDefaultViewPayload.vesselAlerts = 1;
        this.vesselService.myDefaultViewPayload.futureRequest = 0;
        this.vesselService.myDefaultViewPayload.vesselRedelivery = 0;
        this.vesselService.myDefaultViewPayload.vesselSchedule = 0;
      }
      this.vesselService.myDefaultViewPayload.vessel = 1;
    } else {
      this.myDefaultView = false;
      this.viewFutureRequest = false;
      this.viewVesselRedelivery = false;
      this.viewVesselSchedule = false;
      this.viewVesselAlerts = false;
      this.vesselService.myDefaultViewPayload.vesselRedelivery = 0;
      this.vesselService.myDefaultViewPayload.vesselAlerts = 0;
      this.vesselService.myDefaultViewPayload.futureRequest = 0;
      this.vesselService.myDefaultViewPayload.vesselSchedule = 0;
      this.vesselService.myDefaultViewPayload.defaultView = 0;
      this.vesselService.myDefaultViewPayload.vessel = 0;
    }
  }

  public changeDefault(expandRef?: any) {
    if (this.second?.expanded || expandRef == 'second') {
      this.loadVesselAlertList();
    }
    switch (expandRef) {
      case 'VRClose':
        this.viewVesselRedelivery = false;
        this.vesselService.myDefaultViewPayload.vesselRedelivery = 0;
        break;
      case 'VROpen':
        this.viewVesselRedelivery = true;
        if (this.myDefaultView) {
          this.vesselService.myDefaultViewPayload.vesselRedelivery = 1;
        }
        break;
      case 'VAClose':
        this.viewVesselAlerts = false;
        this.vesselService.myDefaultViewPayload.vesselAlerts = 0;
        break;
      case 'VAOpen':
        this.viewVesselAlerts = true;
        if (this.myDefaultView) {
          this.vesselService.myDefaultViewPayload.vesselAlerts = 1;
        }
        break;
      case 'FROpen':
        this.viewFutureRequest = true;
        if (this.myDefaultView) {
          this.vesselService.myDefaultViewPayload.futureRequest = 1;
        }
        break;
      case 'FRClose':
        this.viewFutureRequest = false;
        this.vesselService.myDefaultViewPayload.futureRequest = 0;
        break;
      case 'VSClose':
        this.viewVesselSchedule = false;
        this.vesselService.myDefaultViewPayload.vesselSchedule = 0;
        break;
      case 'VSOpen':
        this.viewVesselSchedule = true;
        if (this.myDefaultView) {
          this.vesselService.myDefaultViewPayload.vesselSchedule = 1;
        }
        break;
    }
  }
  loadFutureRequestData() {
    let currentDate = moment(new Date()).format('YYYY-MM-DD');
    currentDate = currentDate + 'T00:00';
    let requestPayload = {
      Payload: {
        Order: null,
        PageFilters: {
          Filters: [
            {
              columnValue: 'RequestStatus_DisplayName',
              ColumnType: 'Text',
              isComputedColumn: false,
              ConditionValue: '!=',
              Values: ['cancelled'],
              FilterOperator: 0
            },
            {
              columnValue: 'ProductStatus_DisplayName',
              ColumnType: 'Text',
              isComputedColumn: false,
              ConditionValue: '!=',
              Values: ['cancelled'],
              FilterOperator: 0
            },
            {
              columnValue: 'vesselId',
              ColumnType: 'Text',
              isComputedColumn: false,
              ConditionValue: '=',
              Values: [this.popup_data?.vesselId],
              FilterOperator: 0
            },
            {
              columnValue: 'Eta',
              ColumnType: 'Date',
              isComputedColumn: false,
              ConditionValue: '>=',
              Values: [currentDate],
              FilterOperator: 0
            }
          ]
        },
        SortList: {
          SortList: [
            {
              columnValue: 'eta',
              sortIndex: 0,
              sortParameter: 1
            }
          ]
        },
        Filters: [],
        SearchText: null,
        Pagination: {
          Skip: 0,
          Take: 5
        }
      }
    };
    this.localService
      .getOutstandRequestData(
        requestPayload,
        this.scheduleDashboardLabelConfiguration
      )
      .subscribe(response => {
        this.FutureRequest = [];
        if (response.payload) {
          this.FutureRequest = response;
          if (this.gridOptions?.api) {
            let futureRequestData = this.FutureRequest?.payload?.length
              ? this.FutureRequest.payload
              : [];
            this.gridOptions.api.setRowData(futureRequestData);
          }
          this.triggerClickEvent();
        }
      });
  }

  loadRedeliveryInfo(vesselId) {
    if (vesselId != null) {
      let req = { VesselId: vesselId }; //VesselId : 2805
      this.vesselService.getVesselRedeliveryInfo(req).subscribe(res => {
        if (res.payload.length > 0) {
          // Object.defineProperties to resolve "Uncaught TypeError: Cannot assign to read only property 'vesselExpDate' of object '[object Object]'"
          Object.defineProperties(this.popup_data, {
            vesselExpDate: {
              value: res.payload[0].expiryDate,
              writable: true
            },
            redeliveryDays: {
              value: res.payload[0].redeliveryDays
                ? res.payload[0].redeliveryDays + ' Days'
                : '',
              writable: true
            },
            hfo: {
              value: res.payload[0].hsfoRedeliveryQty,
              writable: true
            },
            lshfo: {
              value: res.payload[0].lsfoRedeliveryQty,
              writable: true
            },
            lsmdo: {
              value: res.payload[0].lsmdoRedeliveryQty,
              writable: true
            },
            mdo: {
              value: res.payload[0].mdoRedeliveryQty,
              writable: true
            },
            mgo: {
              value: res.payload[0].mgoRedeliveryQty,
              writable: true
            },
            lsmgo: {
              value: res.payload[0].lsmgoRedeliveryQty,
              writable: true
            }
          });

          this.triggerClickEvent();
        }
      });
    }
  }

  loadVesselScheduleList(vesselId) {
    if (vesselId != null) {
      let selectedVessel = this.vesselList.find(
        vessel => vessel.id == vesselId
      );
      if (!selectedVessel?.imono) {
        this.triggerClickEvent();
        return;
      }
      let req = { VesselImo: selectedVessel?.imono }; //'SDMLG1014' };
      this.vesselService.getVesselSchedule(req).subscribe(res => {
        if (res.payload.length > 0) {
          this.scheduleCount = res.payload[0].count;
          this.scheduleList = res.payload;
          this.triggerClickEvent();
        }
      });
    }
  }

  triggerClickEvent() {
    let titleEle = document.getElementsByClassName(
      'page-title'
    )[0] as HTMLElement;
    titleEle.click();
  }

  dateFormatter(params, type?) {
    if (params == null) return '';
    else {
      if (type == '/') return moment(params).format('DD/MM/YYYY');
      else return moment(params).format('YYYY-MM-DD HH:MM');
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
      VesselId: this.popup_data?.vesselId
    };
    this.vesselService.loadVesselAlertList(requestPayload).subscribe(data => {
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
    this.localService.portPopUpDetails.subscribe(res => (portPopupData = res));
    this.localService.isRouteOpen.subscribe(flag => (routeOpen = flag));
    if (
      routeOpen ||
      (!routeOpen &&
        !(
          portPopupData.filter(
            port => port.name.toLowerCase() == portName.toLowerCase()
          ).length > 0
        ))
    ) {
      data = {
        locationId: portId,
        position: 1,
        port_view: 'standard-view', //pData.flag,
        name: portName, //selectedPort[0].locationName,
        earliestTradingTime: '',
        latestTradingTime: '',
        avlProdCategory: [],
        notificationsCount: 6,
        messagesCount: 2,
        latitude: 0, //selectedPort[0].locationLatitude,
        longitude: 0 //selectedPort[0].locationLongitude,
      };
      if (!routeOpen) {
        if (portPopupData.length >= 2) {
          portPopupData.splice(0, 1);
          portPopupData.push(data);
        } else {
          portPopupData.push(data);
        }
        if (portPopupData.length == 1) {
          portPopupData[0].position = 0;
        } else if (portPopupData.length == 2) {
          portPopupData[0].position = 0;
          portPopupData[1].position = 0;
        }
      } else {
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
      headerName: 'Request ID',
      headerTooltip: 'Request ID',
      field: 'requestId',
      width: 65,
      // rowSpan: this.rowSpan,
      cellRendererFramework: AGGridCellDataComponent,
      cellRendererParams: {
        cellClass: ['cell-ellipsis'],
        type: 'request-link',
        redirectUrl: `${this.shiptechUrl}/#/edit-request`
      },
      headerClass: ['aggrid-columgroup-dark-splitter'],
      cellClass: ['aggrid-content-center aggrid-link fs-11'],
      cellClassRules: {
        'cell-span': 'value !== undefined'
      }
    },
    {
      headerName: 'Port',
      headerTooltip: 'Port',
      field: 'locationName',
      width: 100,
      cellRendererFramework: AGGridCellDataComponent,
      cellRendererParams: {
        type: 'info-with-popup-multiple-values',
        cellClass: 'aggrid-cell-color white',
        context: { componentParent: this }
      },
      cellClass: ['aggrid-blue-editable-cell editable'],
      headerClass: ['aggrid-colum-splitter-left']
    },
    {
      headerName: 'Fuel Grade',
      headerTooltip: 'Fuel Grade',
      field: 'productName',
      width: 70,
      cellRendererFramework: AGGridCellDataComponent,
      cellRendererParams: { type: 'popup-multiple-values' },
      cellClass: ['aggrid-content-center fs-10'],
      valueGetter: function(params) {
        if (params?.data?.productName) {
          return [params.data.productName];
        } else {
          return [];
        }
      }
    },
    {
      headerName: 'Status',
      field: 'requestStatus.displayName',
      headerTooltip: 'Status',
      width: 65,
      cellRendererFramework: AGGridCellRendererComponent,
      headerClass: ['aggrid-text-align-c'],
      cellClass: ['aggrid-content-center fs-8'],
      cellRendererParams: function(params) {
        var classArray: string[] = [];
        let cellStyle = {};
        let status = params?.data?.requestStatus?.displayName;
        classArray.push('aggrid-content-center cell-ellipsis');
        classArray.push('custom-chip small-chip');

        let colorCode = params?.data?.requestStatus?.colorCode;
        if (colorCode?.code) {
          cellStyle = { background: colorCode.code };
        }
        return {
          cellClass: classArray.length > 0 ? classArray : null,
          cellStyle: cellStyle
        };
      }
    }
  ];

  rowSpan(params) {
    if (params.data.merge === '1') {
      return 1;
    } else {
      return 2;
    }
  }
}

@Component({
  selector: 'vessel-menu',
  template: `
    <mat-icon
      class="dropdown-icon"
      [ngClass]="{ active: !menuClick }"
      style="z-index: 1050;"
      [matMenuTriggerFor]="clickalertsmenu"
      #menuTrigger="matMenuTrigger"
      (mouseenter)="menuClick && toggleMenu($event)"
      (mouseleave)="!menuClick && toggleMenu2()"
      (click)="toggleMenu3($event)"
      (menuClosed)="toggleMenu1($event)"
      >more_vert</mat-icon
    >
    <mat-menu #clickalertsmenu="matMenu" class="common" xPosition="after">
      <div (click)="$event.stopPropagation()">
        <div
          cdkDrag
          class="alert-menu"
          [ngClass]="{ 'dark-theme': theme, 'light-theme': !theme }"
        >
          <div class="warning-header">
            <div style="margin-bottom: 5px;">
              <ng-container [ngSwitch]="item.alertColorFlag_Name">
                <img
                  *ngSwitchCase="'Red'"
                  class="warning-icon"
                  src="./assets/customicons/red-warning-o.svg"
                  alt="warning-icon"
                />
                <img
                  *ngSwitchCase="'Amber'"
                  class="warning-icon"
                  src="./assets/customicons/amber-warning-o.svg"
                  alt="warning-icon"
                />
                <img
                  *ngSwitchDefault
                  class="warning-icon"
                  src="./assets/customicons/green-warning-o.svg"
                  alt="warning-icon"
                />
              </ng-container>
            </div>
            <div class="warning-title">
              {{ item?.alertTypes?.name }}
            </div>
            <div
              (click)="cancelMenu()"
              style="position: absolute;top: 8px;right: 0px;"
            >
              <mat-icon class="close">close</mat-icon>
            </div>
          </div>
          <div
            class="alert-desc"
            *ngIf="item.alertTypes.name == 'Unmanageable Vessel'"
          >
            <div class="header">ALERT DESCRIPTION</div>
            No GSIS data input available for this vessel
          </div>
          <div class="status">
            <div>Status</div>
            <mat-form-field appearance="fill">
              <mat-select
                #statusDropdown
                [value]="item?.alertStatus?.name"
                [panelClass]="{ 'dark-theme': theme, 'light-theme': !theme }"
                (selectionChange)="selectionChange = true"
                (click)="$event.stopPropagation()"
              >
                <mat-option
                  *ngFor="let status of VesselAlertStatus"
                  [value]="status.name"
                  >{{ status.displayName }}</mat-option
                >
              </mat-select>
            </mat-form-field>
          </div>
          <div
            *ngIf="
              item.alertStatus.name == 'Resolved' ||
              statusDropdown.value == 'Resolved'
            "
            class="comments"
          >
            <div>Comments</div>
            <mat-form-field appearance="fill">
              <textarea
                style="caret-color:#fff !important;"
                matInput
                [(ngModel)]="item.alertComments"
                (click)="$event.stopPropagation()"
              ></textarea>
            </mat-form-field>
          </div>
          <div *ngIf="changeLogs?.length" class="change-log">
            <div>Change Log</div>
            <div style="height:70px;max-height: 100px;overflow-y: scroll;">
              <div *ngFor="let data of changeLogs" style="margin:5px 0px">
                <div style="display: flex;align-items: center;">
                  <div class="circle-blue"></div>
                  <div class="log-date">
                    {{ data?.createdOn | date: 'MMM d, y hh:mm a' }}
                  </div>
                </div>
                <div class="log-action">
                  Alert marked as {{ data?.alertStatus?.name }} by
                  {{ data?.createdBy?.name }}
                </div>
              </div>
            </div>
          </div>
          <div class="actions">
            <button
              mat-button
              class="cancel"
              (click)="cancelMenu(); $event.stopPropagation()"
            >
              CANCEL
            </button>
            <button
              mat-raised-button
              [ngClass]="{ active: selectionChange }"
              class="save"
              (click)="save(statusDropdown?.value); $event.stopPropagation()"
            >
              SAVE
            </button>
          </div>
        </div>
      </div>
    </mat-menu>
  `
})
export class VesselMenuComponent {
  @Input('item') item;
  @Input('alerts') alerts;
  @Input('changeLog') changeLog;
  @Output() refreshVesselAlert = new EventEmitter();
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  @ViewChild('statusDropdown') statusDropdown;

  public menuFlag: boolean = false;
  public menuClick: boolean = false;
  public selectionChange: boolean = false;
  public theme: boolean = true;
  VesselAlertStatus = [];
  changeLogs = [];
  VesselAlertStatusTemp: string = '';
  constructor(
    private elem: ElementRef,
    private localService: LocalService,
    private vesselPopupService: VesselPopupService,
    private legacyLookupsDatabase: LegacyLookupsDatabase,
    private dialog: MatDialog
  ) {}
  ngOnInit() {
    this.localService.themeChange.subscribe(value => (this.theme = value));

    this.VesselAlertStatusTemp = this.item?.alertStatus?.name;
    this.loadMasterLookupData();
  }
  async loadMasterLookupData() {
    let alertTypes = this.item?.alertTypes?.name;
    let groupChangeLog = await this.groupByAlertChangeLogs();
    this.changeLogs = groupChangeLog[alertTypes]?.length
      ? groupChangeLog[alertTypes]
      : [];
    if (groupChangeLog[alertTypes]?.length) {
      let groupAlertLogData = groupChangeLog[alertTypes];
      //sort change log in desc based on log created time
      this.changeLogs = groupAlertLogData.sort((val1, val2) => {
        return (
          new Date(val2.createdOn).valueOf() -
          new Date(val1.createdOn).valueOf()
        );
      });
    } else {
      this.changeLogs = [];
    }

    this.VesselAlertStatus = await this.legacyLookupsDatabase.getPortStatuses();
  }
  groupByAlertChangeLogs() {
    var groupAlertType = [];
    var groupChangeLog = {};
    return new Promise(resolve => {
      // return with empty object if alert doesn't contain any changelog
      if (!this.changeLog?.length) {
        resolve(groupChangeLog);
      }
      this.changeLog.map((logs, index) => {
        let type = logs.alertTypes?.name;
        if (!groupAlertType.includes(type)) {
          groupAlertType.push(type);
          groupChangeLog[type] = [logs];
        } else {
          groupChangeLog[type].push(logs);
        }
        if (this.changeLog.length == index + 1) {
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
    this.item.AlertStatus = this.VesselAlertStatus.find(
      item => item.name == this.VesselAlertStatusTemp
    );
    this.statusDropdown.value = this.item.AlertStatus?.name;
    this.menuTrigger.closeMenu();
    this.selectionChange = false;
    this.menuClick = false;
    let panels = this.elem.nativeElement.querySelectorAll('.dropdown-icon');
    panels.forEach(element => {
      element.classList.remove('active-class');
    });
  }

  toggleMenu1(event) {
    //onmenuclose
    this.selectionChange = false;
    let panels = this.elem.nativeElement.querySelectorAll('.dropdown-icon');
    panels.forEach(element => {
      element.classList.remove('active-class');
    });
    this.closeMenu();
  }
  toggleMenu(event) {
    //onenter

    this.openMenu();
    var overlay = document.querySelector('.cdk-overlay-container');
    overlay?.classList.add('removeOverlay');
  }

  toggleMenu2() {
    //onleave
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
    if (
      status == 'Resolved' &&
      (!this.item?.alertComments || this.item?.alertComments.trim() == '')
    ) {
      let warnCommentMsg = 'please enter a comment';
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        panelClass: 'confirmation-popup-operator',
        data: { message: warnCommentMsg, source: 'hardWarning' }
      });
      return;
    }
    let vesselAlertId = this.item?.alertTypes?.id;
    let vesselAlertName = this.item?.alertTypes?.name;
    let selectedAlertStatus = this.VesselAlertStatus.find(
      item => item.name == status
    );
    let requestPayload = {
      VesselId: this.item?.vesselId,
      VesselAlerts: [
        {
          Id: vesselAlertId,
          VesselId: this.item?.vesselId,
          AlertTypes: {
            id: vesselAlertId,
            name: vesselAlertName
          },
          AlertStatus: {
            id: selectedAlertStatus?.id,
            name: selectedAlertStatus?.name
          },
          AlertColorFlag_Name: '',
          AlertComments: this.item?.alertComments,
          IsDeleted: 0
        }
      ]
    };
    this.selectionChange = false;
    this.vesselPopupService
      .updateVesselAlertList(requestPayload)
      .subscribe(data => {
        this.closeMenu();
        this.refreshVesselAlert.emit(data);
      });
  }
  cancelMenu() {
    this.closeMenu();
  }
}
