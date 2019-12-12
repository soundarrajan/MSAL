import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { ChangeDetectorRef, Inject, Injectable } from '@angular/core';
import { GridOptions, IServerSideGetRowsParams } from 'ag-grid-community';
import { RowModelType, RowSelection, TypedColDef } from '@shiptech/core/ui/components/ag-grid/type.definition';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { LoggerFactory } from '@shiptech/core/logging/logger-factory.service';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import dateTimeAdapter from '@shiptech/core/utils/dotnet-moment-format-adapter';
import moment from 'moment';
import { IVesselMastersApi, VESSEL_MASTERS_API_SERVICE } from '@shiptech/core/services/masters-api/vessel-masters-api.service.interface';
import { transformLocalToServeGridInfo } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters';
import {
  VesselPortCallsMasterListColumns,
  VesselPortCallsMasterListColumnServerKeys,
  VesselPortCallsMasterListColumnsLabels
} from '@shiptech/core/ui/components/master-selector/known-masters/vessel-port-calls/view-model/vessel-port-calls-master-list.columns';
import { IVesselPortCallMasterDto } from '@shiptech/core/services/masters-api/dtos/vessel-port-call';

function model(prop: keyof IVesselPortCallMasterDto): keyof IVesselPortCallMasterDto {
  return prop;
}

@Injectable()
export class VesselPortCallsMasterSelectorGridViewModel extends BaseGridViewModel {
  private readonly dateFormat: string = 'DDD dd/MM/yyyy HH:mm';
  private readonly quantityPrecision: number = 3;


  private defaultColFilterParams = {
    clearButton: true,
    applyButton: true,
    precision: () => this.quantityPrecision
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

  selectCol: TypedColDef = {
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

  locationPortCol: TypedColDef<IVesselPortCallMasterDto, IDisplayLookupDto> = {
    headerName: VesselPortCallsMasterListColumnsLabels.locationPort,
    colId: VesselPortCallsMasterListColumns.locationPort,
    field: model('location'),
    valueFormatter: params => params.value?.name ?? params.value?.displayName
  };

  voyageIdCol: TypedColDef<IVesselPortCallMasterDto, IDisplayLookupDto> = {
    headerName: VesselPortCallsMasterListColumnsLabels.voyageId,
    colId: VesselPortCallsMasterListColumns.voyageId,
    field: model('voyageId'),
    valueFormatter: params => params.value?.name ?? params.value?.displayName
  };

  etaCol: TypedColDef<IVesselPortCallMasterDto, Date | string> = {
    headerName: VesselPortCallsMasterListColumnsLabels.eta,
    colId: VesselPortCallsMasterListColumns.eta,
    field: model('eta'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => params.value ? moment(params.value).format(dateTimeAdapter.fromDotNet(this.dateFormat)) : undefined
  };

  etbCol: TypedColDef<IVesselPortCallMasterDto, Date | string> = {
    headerName: VesselPortCallsMasterListColumnsLabels.etb,
    colId: VesselPortCallsMasterListColumns.etb,
    field: model('etb'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => params.value ? moment(params.value).format(dateTimeAdapter.fromDotNet(this.dateFormat)) : undefined
  };

  etdCol: TypedColDef<IVesselPortCallMasterDto, Date | string> = {
    headerName: VesselPortCallsMasterListColumnsLabels.etd,
    colId: VesselPortCallsMasterListColumns.etd,
    field: model('etd'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => params.value ? moment(params.value).format(dateTimeAdapter.fromDotNet(this.dateFormat)) : undefined
  };

  portCallIdCol: TypedColDef<IVesselPortCallMasterDto, string> = {
    headerName: VesselPortCallsMasterListColumnsLabels.portCallId,
    colId: VesselPortCallsMasterListColumns.portCallId,
    field: model('portCallId')
  };

  serviceCol: TypedColDef<IVesselPortCallMasterDto, IDisplayLookupDto> = {
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
    tenantSettings: TenantSettingsService,
    @Inject(VESSEL_MASTERS_API_SERVICE) private mastersApi: IVesselMastersApi
  ) {
    super('vessel-port-calls-master-selector-grid', columnPreferences, changeDetector, loggerFactory.createLogger(VesselPortCallsMasterSelectorGridViewModel.name));
    this.initOptions(this.gridOptions);

    const generalTenantSettings = tenantSettings.getGeneralTenantSettings();

    this.dateFormat = generalTenantSettings.tenantFormats.dateFormat.name;
    this.quantityPrecision = generalTenantSettings.defaultValues.quantityPrecision;
  }

  getColumnsDefs(): TypedColDef[] {
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
      response => params.successCallback(response.items, response.totalItems),
      () => params.failCallback());
  }
}
