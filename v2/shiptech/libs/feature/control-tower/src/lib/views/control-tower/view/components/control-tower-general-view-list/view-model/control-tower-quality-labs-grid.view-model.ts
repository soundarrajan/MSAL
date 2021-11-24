import { ChangeDetectorRef, Injectable } from '@angular/core';
import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { GridOptions, IServerSideGetRowsParams } from '@ag-grid-community/core';
import {
  ITypedColDef,
  RowModelType,
  RowSelection
} from '@shiptech/core/ui/components/ag-grid/type.definition';

import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';

import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { transformLocalToServeGridInfo } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters';
import { takeUntil } from 'rxjs/operators';
import { ILookupDto } from '@shiptech/core/lookups/lookup-dto.interface';
import { AgCellTemplateComponent } from '@shiptech/core/ui/components/ag-grid/ag-cell-template/ag-cell-template.component';

import { DatabaseManipulation } from '@shiptech/core/legacy-cache/database-manipulation.service';
import { IScheduleDashboardLabelConfigurationDto } from '@shiptech/core/lookups/schedule-dashboard-label-configuration.dto.interface';
import { AgAsyncBackgroundFillComponent } from '@shiptech/core/ui/components/ag-grid/ag-async-background-fill/ag-async-background-fill.component';

import { ModuleLoggerFactory } from 'libs/feature/control-tower/src/lib/core/logging/module-logger-factory';
import { ModuleError } from 'libs/feature/control-tower/src/lib/core/error-handling/module-error';
import { AGGridCellActionsComponent } from '@shiptech/core/ui/components/designsystem-v2/ag-grid/ag-grid-cell-actions.component';

import { ControlTowerService } from 'libs/feature/control-tower/src/lib/services/control-tower.service';
import { FormControl } from '@angular/forms';
import moment from 'moment';
import { IControlTowerQualityLabsItemDto } from 'libs/feature/control-tower/src/lib/services/api/dto/control-tower-list-item.dto';
import {
    ControlTowerQualityLabsListColumns,
    ControlTowerQualityLabsListColumnsLabels,
    ControlTowerQualityLabsListColumnServerKeys,
    ControlTowerQualityLabsListExportColumns
} from '../list-columns/control-tower-quality-labs-list.columns';
import { AGGridCellRendererStatusComponent } from '@shiptech/core/ui/components/designsystem-v2/ag-grid/ag-grid-cell-status/ag-grid-cell-status.component';
import { ToastrService } from 'ngx-toastr';

function model(
  prop: keyof IControlTowerQualityLabsItemDto
): keyof IControlTowerQualityLabsItemDto {
  return prop;
}

@Injectable()
export class ControlTowerQualityLabsListGridViewModel extends BaseGridViewModel {
  public toggleNewFilter: boolean = true;
  public toggleMASFilter: boolean = true;
  public toggleResolvedFilter: boolean = true;
  public noOfNew: number;
  public noOfMarkedAsSeen: number;
  public noOfResolved: number;

  public searchText: string;
  public exportUrl: string;
  public newFilterSelected: boolean = false;
  public fromDate = new FormControl(
    moment()
      .subtract(6, 'days')
      .format('YYYY-MM-DD')
  );
  public toDate = new FormControl(moment().format('YYYY-MM-DD'));

  public defaultColFilterParams = {
    resetButton: true,
    applyButton: true,
    precision: () => this.format.quantityPrecision
  };
  gridOptions: GridOptions = {
    enableColResize: true,
    suppressRowClickSelection: true,
    animateRows: true,
    groupHeaderHeight: 20,
    headerHeight: 40,
    rowHeight: 40,
    rowModelType: RowModelType.ServerSide,
    pagination: true,
    rowSelection: RowSelection.Single,
    suppressContextMenu: true,
    multiSortKey: 'ctrl',
    singleClickEdit: true,
    getRowNodeId: (data: IControlTowerQualityLabsItemDto) =>
      data?.id?.toString() ?? Math.random().toString(),
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      filterParams: this.defaultColFilterParams
    },
    onGridReady: params => {
      params.api.sizeColumnsToFit();
    }
  };

  orderNoCol: ITypedColDef<IControlTowerQualityLabsItemDto, ILookupDto> = {
    headerName: ControlTowerQualityLabsListColumnsLabels.order,
    headerTooltip: ControlTowerQualityLabsListColumnsLabels.order,
    colId: ControlTowerQualityLabsListColumns.order,
    field: model('order'),
    dtoForExport: ControlTowerQualityLabsListExportColumns.order,
    cellRenderer: params => {
        if (params.value) {
            const a = document.createElement('a');
            a.innerHTML = params.value?.id;
            a.href = `/#/edit-order/${params.value?.id}`;
            a.setAttribute('target', '_blank');
            return a;
        }
        return null;
    },
    tooltip: params => (params.value ? params.value?.id : ''),
    width: 150
  };

  labIdCol: ITypedColDef<IControlTowerQualityLabsItemDto, ILookupDto> = {
    headerName: ControlTowerQualityLabsListColumnsLabels.lab,
    headerTooltip: ControlTowerQualityLabsListColumnsLabels.lab,
    colId: ControlTowerQualityLabsListColumns.lab,
    field: model('id'),
    dtoForExport: ControlTowerQualityLabsListExportColumns.lab,
    cellRenderer: params => {
        if (params.value) {
            const a = document.createElement('a');
            a.innerHTML = params.value;
            a.href = `/#/labs/labresult/edit/${params.value}`;
            a.setAttribute('target', '_blank');
            return a;
        }
        return null;
    },
    tooltip: params => (params.value ? params.value : ''),
    width: 150
  };

  labcounterpartyCol: ITypedColDef<IControlTowerQualityLabsItemDto, ILookupDto> = {
    headerName: ControlTowerQualityLabsListColumnsLabels.labcounterparty,
    headerTooltip: ControlTowerQualityLabsListColumnsLabels.labcounterparty,
    colId: ControlTowerQualityLabsListColumns.labcounterparty,
    field: model('counterparty'),
    dtoForExport: ControlTowerQualityLabsListExportColumns.labcounterparty,
    valueFormatter: params => this.format.htmlDecode(params.value?.name),
    tooltip: params => ((params.value?.name) ? this.format.htmlDecode(params.value?.name) : ''),
    width: 150
  };

  deliveryNoCol: ITypedColDef<IControlTowerQualityLabsItemDto, string> = {
    headerName: ControlTowerQualityLabsListColumnsLabels.deliveryNo,
    headerTooltip: ControlTowerQualityLabsListColumnsLabels.deliveryNo,
    colId: ControlTowerQualityLabsListColumns.deliveryNo,
    field: model('deliveryId'),
    dtoForExport: ControlTowerQualityLabsListExportColumns.deliveryNo,
    cellRenderer: params => {
        if (params.value) {
            const a = document.createElement('a');
            a.innerHTML = params.value;
            a.href = `/v2/delivery/delivery/${params.value}/details`;
            a.setAttribute('target', '_blank');
            return a;
        }
        return null;
    },
    tooltip: params => (params.value ? params.value : ''),
    width: 200
  };

  vesselCol: ITypedColDef<IControlTowerQualityLabsItemDto, string> = {
    headerName: ControlTowerQualityLabsListColumnsLabels.vessel,
    headerTooltip: ControlTowerQualityLabsListColumnsLabels.vessel,
    colId: ControlTowerQualityLabsListColumns.vessel,
    field: model('vessel'),
    dtoForExport: ControlTowerQualityLabsListExportColumns.vessel,
    valueFormatter: params => this.format.htmlDecode(params.value?.name),
    tooltip: params => ((params.value?.name) ? this.format.htmlDecode(params.value?.name) : ''),
    width: 200
  };

  portCol: ITypedColDef<IControlTowerQualityLabsItemDto, string> = {
    headerName: ControlTowerQualityLabsListColumnsLabels.port,
    headerTooltip: ControlTowerQualityLabsListColumnsLabels.port,
    colId: ControlTowerQualityLabsListColumns.port,
    field: model('port'),
    dtoForExport: ControlTowerQualityLabsListExportColumns.port,
    tooltip: params => (params.value ? params.value : ''),
    width: 200
  };

  etaCol: ITypedColDef<IControlTowerQualityLabsItemDto, string> = {
    headerName: ControlTowerQualityLabsListColumnsLabels.eta,
    headerTooltip: ControlTowerQualityLabsListColumnsLabels.eta,
    colId: ControlTowerQualityLabsListColumns.eta,
    field: model('recentEta'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    dtoForExport: ControlTowerQualityLabsListExportColumns.eta,
    tooltip: params => (params.value ? this.format.date(params.value) : ''),
    width: 200
  };

  productCol: ITypedColDef<IControlTowerQualityLabsItemDto, string> = {
    headerName: ControlTowerQualityLabsListColumnsLabels.product,
    headerTooltip: ControlTowerQualityLabsListColumnsLabels.product,
    colId: ControlTowerQualityLabsListColumns.product,
    field: model('product'),
    dtoForExport: ControlTowerQualityLabsListExportColumns.product,
    valueFormatter: params => ((params.value?.name) ? this.format.htmlDecode(params.value.name) : ''),
    tooltip: params => ((params.value?.name) ? this.format.htmlDecode(params.value.name) : ''),
    width: 200
  };

  labStatusCol: ITypedColDef<IControlTowerQualityLabsItemDto, string> = {
    headerName: ControlTowerQualityLabsListColumnsLabels.labStatus,
    headerTooltip: ControlTowerQualityLabsListColumnsLabels.labStatus,
    colId: ControlTowerQualityLabsListColumns.labStatus,
    field: model('status'),
    valueFormatter: params => ((params.value?.name) ? this.format.htmlDecode(params.value.name) : ''),
    dtoForExport: ControlTowerQualityLabsListExportColumns.labStatus,
    tooltip: params => ((params.value?.name) ? this.format.htmlDecode(params.value.name) : ''),
    width: 200
  };

  claimRaisedCol: ITypedColDef<IControlTowerQualityLabsItemDto, string> = {
    headerName: ControlTowerQualityLabsListColumnsLabels.claimRaised,
    headerTooltip: ControlTowerQualityLabsListColumnsLabels.claimRaised,
    colId: ControlTowerQualityLabsListColumns.claimRaised,
    field: model('claimsRaised'),
    valueFormatter: params => (params.value)? 'Yes': 'No',
    dtoForExport: ControlTowerQualityLabsListExportColumns.claimRaised,
    tooltip: params => (params.value)? 'Yes': 'No',
    width: 150
  };

  createdDateCol: ITypedColDef<IControlTowerQualityLabsItemDto, string> = {
    headerName: ControlTowerQualityLabsListColumnsLabels.createdDate,
    headerTooltip: ControlTowerQualityLabsListColumnsLabels.createdDate,
    colId: ControlTowerQualityLabsListColumns.createdDate,
    field: model('createdDate'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value),
    dtoForExport: ControlTowerQualityLabsListExportColumns.createdDate,
    tooltip: params => (params.value ? this.format.date(params.value) : ''),
    width: 200
  };

  createdByCol: ITypedColDef<IControlTowerQualityLabsItemDto, ILookupDto> = {
    headerName: ControlTowerQualityLabsListColumnsLabels.createdBy,
    headerTooltip: ControlTowerQualityLabsListColumnsLabels.createdBy,
    colId: ControlTowerQualityLabsListColumns.createdBy,
    field: model('createdBy'),
    dtoForExport: ControlTowerQualityLabsListExportColumns.createdBy,
    valueFormatter: params => this.format.htmlDecode(params.value?.name),
    tooltip: params => ((params.value?.name) ? this.format.htmlDecode(params.value?.name) : ''),
    width: 200
  };

  progressCol: ITypedColDef<IControlTowerQualityLabsItemDto, number> = {
    headerName: ControlTowerQualityLabsListColumnsLabels.progress,
    headerTooltip: ControlTowerQualityLabsListColumnsLabels.progress,
    colId: ControlTowerQualityLabsListColumns.progress,
    field: model('progress'),
    valueFormatter: params => params.value?.displayName,
    dtoForExport: ControlTowerQualityLabsListExportColumns.progress,
    cellRendererParams: function(params) {
        if (params.value) {
          var classArray: string[] = [];
          let newClass = '';
          switch (params?.value.displayName) {
            case 'New':
              newClass = 'medium-blue';
              break;
            case 'Marked as Seen':
              newClass = 'medium-yellow';
              break;
            case 'Resolved':
              newClass = 'light-green';
              break;
          }
          classArray.push(newClass);
          return {
            cellClass: classArray.length > 0 ? classArray : null,
            type: 'progress'
          };
        }
    },
    cellRendererFramework: AGGridCellRendererStatusComponent,
    tooltip: params => {
        return params.value?.name;
    },
    width: 150
  };

  actionCol: ITypedColDef<IControlTowerQualityLabsItemDto> = {
    headerName: ControlTowerQualityLabsListColumnsLabels.action,
    headerTooltip: ControlTowerQualityLabsListColumnsLabels.action,
    colId: ControlTowerQualityLabsListColumnsLabels.action,
    headerClass: ['aggrid-text-align-c'],
    cellClass: ['aggridtextalign-center'],
    cellRendererFramework: AGGridCellActionsComponent,
    cellRendererParams: { type: 'actions' },
    resizable: false,
    suppressMovable: false,
    suppressMenu: true,
    suppressSorting: true,
    width: 110
  };
  groupedCounts: { noOfNew: number; noOfMarkedAsSeen: number; noOfResolved: number; };

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: ModuleLoggerFactory,
    private format: TenantFormattingService,
    private controlTowerService: ControlTowerService,
    private appErrorHandler: AppErrorHandler,
    private databaseManipulation: DatabaseManipulation,
    private toastr: ToastrService
  ) {
    super(
      'control-tower-quality-labs-list-grid-7',
      columnPreferences,
      changeDetector,
      loggerFactory.createLogger(
        ControlTowerQualityLabsListGridViewModel.name
      )
    );
    this.init(this.gridOptions, true);
  }

  public systemFilterUpdate(value) {
    let currentFilter = value.filter(o => o.isActive); 
    switch (currentFilter[0].id) {
      case "new":
        this.filterGridNew(currentFilter[0].label);
        break;
      case "marked-as-seen":
        this.filterGridMAS(currentFilter[0].label);
        break;
      case "resolved":
        this.filterGridResolved(currentFilter[0].label);
        break;                
    }
  }

  getColumnsDefs(): any[] {
    return [
        this.labIdCol,
        this.labcounterpartyCol,
        this.deliveryNoCol,
        this.orderNoCol,
        this.vesselCol,
        this.portCol,
        this.etaCol,
        this.productCol,
        this.labStatusCol,
        this.claimRaisedCol,
        this.createdByCol,
        this.createdDateCol,
        this.progressCol,
        this.actionCol
    ];
  }

  public onSearch(value: string): void {
    this.searchText = value;
    this.gridApi.purgeServerSideCache();
  }

  public updateValues(ev, values): void {
    if (values) {
      let payloadData = {
        "controlTowerActionStatusId": values?.status,
        "comments": values?.comments,
        "labResultId": ev.data?.id
      };

      this.controlTowerService
        .saveQualityLabsPopUp(payloadData, payloadData => {
          console.log('labs changes updated..');
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((response: any) => {
          if (typeof response == 'string') {
            this.toastr.error(response);
          } else {
            this.gridApi.purgeServerSideCache();
          }
        });
    }
    return;
  }

  public filterGridNew(statusName: string): void {
    if (this.toggleNewFilter) {
      this.filterByStatus(statusName);
    } else {
      this.filterByStatus('');
    }
  }

  public filterGridMAS(statusName: string): void {
    if (this.toggleMASFilter) {
        //MarkedAsSeen hard coded to avoid other screen MAS filter impact
      this.filterByStatus('MarkedAsSeen');
    } else {
      this.filterByStatus('');
    }
  }

  public filterGridResolved(statusName: string): void {
    if (this.toggleResolvedFilter) {
      this.filterByStatus(statusName);
    } else {
      this.filterByStatus('');
    }
  }

public filterByStatus(statusName: string): void {
    const grid = [];
    grid['progress'] = {
      filterType: 'text',
      type: 'equals',
      filter: statusName
    };
    this.gridApi.setFilterModel(grid);
}

public checkStatusAvailable(): void {
    this.toggleNewFilter = true;
    this.toggleMASFilter = true;
    this.toggleResolvedFilter = true;
    const grid = this.gridApi.getFilterModel();
    for (let [key, value] of Object.entries(grid)) {
      if (key == 'progress') {
        if ((<any>value).type == 'equals') {
          if ((<any>value).filter === 'New') {
            this.toggleNewFilter = !this.toggleNewFilter;
            this.toggleMASFilter = true;
            this.toggleResolvedFilter = true;
          } else if ((<any>value).filter === 'MarkedAsSeen') {
            this.toggleMASFilter = !this.toggleMASFilter;
            this.toggleNewFilter = true;
            this.toggleResolvedFilter = true;
          } else if ((<any>value).filter === 'Resolved') {
            this.toggleResolvedFilter = !this.toggleResolvedFilter;
            this.toggleNewFilter = true;
            this.toggleMASFilter = true;
          }
        }
      }
    }
  }

  public filterByDate(from: string, to: string): void {
    const grid = this.gridApi.getFilterModel();
    grid['createdDate'] = {
      dateFrom: from,
      dateTo: to,
      type: 'inRange',
      filterType: 'date'
    };
    this.gridApi.setFilterModel(grid);
  }
  
  public formatFilterModel(params) {
    let {filterModel} = params?.request;
    // claimsRaised column filter value format
    if (Object.keys(filterModel).indexOf('claimsRaised') !== -1) {
        let claimRaisedFilterVal = filterModel.claimsRaised?.filter;
        if(!claimRaisedFilterVal || !(claimRaisedFilterVal.trim())) { return; }
        claimRaisedFilterVal = claimRaisedFilterVal.trim().toLowerCase();
        let filterClaimCondition = '';
        if(filterModel.claimsRaised?.type == 'equals' || filterModel.claimsRaised?.type == 'notEqual') {
            filterClaimCondition = (claimRaisedFilterVal=='no')? '0': ((claimRaisedFilterVal=='yes')? '1': '2');
        } else if(filterModel.claimsRaised?.type == 'startsWith') {
            filterClaimCondition = ('no'.startsWith(claimRaisedFilterVal))? '0': (('yes'.startsWith(claimRaisedFilterVal))? '1': '2');
        } else if(filterModel.claimsRaised?.type == 'endsWith') {
            filterClaimCondition = ('no'.endsWith(claimRaisedFilterVal))? '0': (('yes'.endsWith(claimRaisedFilterVal))? '1': '2');
        } else {
            filterClaimCondition = (claimRaisedFilterVal)=='no' || (['n','o'].indexOf(claimRaisedFilterVal)!=-1)? '0': 
        ((claimRaisedFilterVal)=='yes' || (['y','e', 's', 'ye', 'es'].indexOf(claimRaisedFilterVal)!=-1)? '1': '2');
        }
        var updatedFilter = {
            ...filterModel,
            claimsRaised: {
                ...filterModel.claimsRaised,
                filter: filterClaimCondition
            }
        }
        params['request']['filterModel'] = updatedFilter;
    }
    console.log(params);
    
  }
  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    const grid1 = this.gridApi.getSortModel();
    // this.gridApi.setSortModel([
    //   {
    //     colId: 'createdDate',
    //     sort: 'asc'
    //   }
    // ]);
    console.log(grid1);
    this.formatFilterModel(params);
    this.checkStatusAvailable();
    this.paramsServerSide = params;
    this.exportUrl = this.controlTowerService.getControlTowerQualityLabsListExportUrl();
    this.controlTowerService
      .getControlTowerQualityLabsList$(
        transformLocalToServeGridInfo(
          this.gridApi,
          params,
          ControlTowerQualityLabsListColumnServerKeys,
          this.searchText
        )
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        response => {
          // this.noOfNew = response.payload.noOfNew;
          // this.noOfMarkedAsSeen = response.payload.noOfMarkedAsSeen;
          // this.noOfResolved = response.payload.noOfResolved;
          // this.groupedCounts = {
          //   noOfNew : this.noOfNew,
          //   noOfMarkedAsSeen : this.noOfMarkedAsSeen,
          //   noOfResolved : this.noOfResolved,
          // }          
          params.successCallback(response.payload.items, response.matchedCount);
        },
        () => {
          this.appErrorHandler.handleError(
            ModuleError.LoadControlTowerQualityLabsFailed
          );
          params.failCallback();
        }
      );
  }
}
