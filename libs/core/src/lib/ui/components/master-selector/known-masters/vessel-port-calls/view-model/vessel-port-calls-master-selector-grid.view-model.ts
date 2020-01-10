import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { ChangeDetectorRef, Inject, Injectable } from '@angular/core';
import { GridOptions, IServerSideGetRowsParams } from 'ag-grid-community';
import { RowModelType, RowSelection, ITypedColDef } from '@shiptech/core/ui/components/ag-grid/type.definition';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { LoggerFactory } from '@shiptech/core/logging/logger-factory.service';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { IVesselMastersApi, VESSEL_MASTERS_API_SERVICE } from '@shiptech/core/services/masters-api/vessel-masters-api.service.interface';
import { transformLocalToServeGridInfo } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters';
import {
  VesselPortCallsMasterListColumns,
  VesselPortCallsMasterListColumnServerKeys,
  VesselPortCallsMasterListColumnsLabels
} from '@shiptech/core/ui/components/master-selector/known-masters/vessel-port-calls/view-model/vessel-port-calls-master-list.columns';
import { IVesselPortCallMasterDto } from '@shiptech/core/services/masters-api/request-response-dtos/vessel-port-call';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';

function model(prop: keyof IVesselPortCallMasterDto): keyof IVesselPortCallMasterDto {
  return prop;
}

@Injectable()
export class VesselPortCallsMasterSelectorGridViewModel extends BaseGridViewModel {

  private defaultColFilterParams = {
    clearButton: true,
    applyButton: true,
    precision: () => this.format.quantityPrecision
  };

  public searchText: string;

  gridOptions: GridOptions = {
    groupHeaderHeight: 20,
    headerHeight: 40,
    rowHeight: 40,

    rowModelType: RowModelType.ServerSide,
    pagination: true,
    animateRows: true,
    rowSelection: RowSelection.Single,
    multiSortKey: 'ctrl',
    suppressContextMenu: true,

    enableBrowserTooltips: true,
    singleClickEdit: true,
    getRowNodeId: (data: any) => data?.id?.toString() ?? Math.random().toString(),
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      filterParams: this.defaultColFilterParams
    }
  };

  selectCol: ITypedColDef = {
    colId: 'selection',
    width: 50,
    checkboxSelection: true,
    editable: false,
    filter: false,
    sortable: false,
    suppressMenu: true,
    resizable: false,
    suppressAutoSize: true,
    suppressSizeToFit: true,
    suppressMovable: true,
    suppressNavigable: true,
    suppressColumnsToolPanel: true,
    suppressFiltersToolPanel: true,
    suppressCellFlash: true,
    suppressPaste: true,
    lockPosition: true,
    lockVisible: true,
    cellClass: 'cell-border-green'
  };

  locationPortCol: ITypedColDef<IVesselPortCallMasterDto, IDisplayLookupDto> = {
    headerName: VesselPortCallsMasterListColumnsLabels.locationPort,
    colId: VesselPortCallsMasterListColumns.locationPort,
    field: model('location'),
    valueFormatter: params => params.value?.name ?? params.value?.displayName
  };

  voyageIdCol: ITypedColDef<IVesselPortCallMasterDto, IDisplayLookupDto> = {
    headerName: VesselPortCallsMasterListColumnsLabels.voyageId,
    colId: VesselPortCallsMasterListColumns.voyageId,
    field: model('voyageId'),
    valueFormatter: params => params.value?.name ?? params.value?.displayName
  };

  etaCol: ITypedColDef<IVesselPortCallMasterDto, string> = {
    headerName: VesselPortCallsMasterListColumnsLabels.eta,
    colId: VesselPortCallsMasterListColumns.eta,
    field: model('eta'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value)
  };

  etbCol: ITypedColDef<IVesselPortCallMasterDto, string> = {
    headerName: VesselPortCallsMasterListColumnsLabels.etb,
    colId: VesselPortCallsMasterListColumns.etb,
    field: model('etb'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value)
  };

  etdCol: ITypedColDef<IVesselPortCallMasterDto, string> = {
    headerName: VesselPortCallsMasterListColumnsLabels.etd,
    colId: VesselPortCallsMasterListColumns.etd,
    field: model('etd'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value)
  };

  portCallIdCol: ITypedColDef<IVesselPortCallMasterDto, string> = {
    headerName: VesselPortCallsMasterListColumnsLabels.portCallId,
    colId: VesselPortCallsMasterListColumns.portCallId,
    field: model('portCallId')
  };

  serviceCol: ITypedColDef<IVesselPortCallMasterDto, IDisplayLookupDto> = {
    headerName: VesselPortCallsMasterListColumnsLabels.service,
    colId: VesselPortCallsMasterListColumns.service,
    field: model('service'),
    valueFormatter: params => params.value?.name ?? params.value?.displayName
  };

  vesselId: number;

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: LoggerFactory,
    private format: TenantFormattingService,
    @Inject(VESSEL_MASTERS_API_SERVICE) private mastersApi: IVesselMastersApi
  ) {
    super('vessel-port-calls-master-selector-grid', columnPreferences, changeDetector, loggerFactory.createLogger(VesselPortCallsMasterSelectorGridViewModel.name));
    this.init(this.gridOptions, true);
  }

  getColumnsDefs(): ITypedColDef[] {
    return [
      this.selectCol,
      this.locationPortCol,
      this.voyageIdCol,
      this.etaCol,
      this.etbCol,
      this.etdCol,
      this.portCallIdCol,
      this.serviceCol
    ];
  }

  public onSearch(value: string): void {
    this.searchText = value;
    this.gridApi.purgeServerSideCache();
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    this.mastersApi.getVesselPortCalls({ id: this.vesselId, ...transformLocalToServeGridInfo(params, VesselPortCallsMasterListColumnServerKeys, this.searchText) }).subscribe(
      response => params.successCallback(response.items, response.totalCount),
      () => params.failCallback());
  }
}
