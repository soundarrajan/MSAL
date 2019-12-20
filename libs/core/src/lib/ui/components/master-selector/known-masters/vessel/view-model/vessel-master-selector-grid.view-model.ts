import { BaseGridViewModel } from '@shiptech/core/ui/components/ag-grid/base.grid-view-model';
import { ChangeDetectorRef, Inject, Injectable } from '@angular/core';
import { GridOptions, IServerSideGetRowsParams } from 'ag-grid-community';
import { RowModelType, RowSelection, TypedColDef } from '@shiptech/core/ui/components/ag-grid/type.definition';
import { AgColumnPreferencesService } from '@shiptech/core/ui/components/ag-grid/ag-column-preferences/ag-column-preferences.service';
import { LoggerFactory } from '@shiptech/core/logging/logger-factory.service';
import { IVesselMasterDto } from '@shiptech/core/services/masters-api/dtos/vessel';
import {
  VesselMasterListColumns,
  VesselMasterListColumnServerKeys,
  VesselMasterListColumnsLabels
} from '@shiptech/core/ui/components/master-selector/known-masters/vessel/view-model/vessel-master-list.columns';
import { IDisplayLookupDto } from '@shiptech/core/lookups/display-lookup-dto.interface';
import { IVesselMastersApi, VESSEL_MASTERS_API_SERVICE } from '@shiptech/core/services/masters-api/vessel-masters-api.service.interface';
import { transformLocalToServeGridInfo } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';

function model(prop: keyof IVesselMasterDto): keyof IVesselMasterDto {
  return prop;
}

@Injectable()
export class VesselMasterSelectorGridViewModel extends BaseGridViewModel {
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

  nameCol: TypedColDef<IVesselMasterDto, string> = {
    headerName: VesselMasterListColumnsLabels.name,
    colId: VesselMasterListColumns.name,
    field: model('name')
  };

  displayNameCol: TypedColDef<IVesselMasterDto, string> = {
    headerName: VesselMasterListColumnsLabels.displayName,
    colId: VesselMasterListColumns.displayName,
    field: model('displayName')
  };

  codeCol: TypedColDef<IVesselMasterDto, string> = {
    headerName: VesselMasterListColumnsLabels.code,
    colId: VesselMasterListColumns.code,
    field: model('code')
  };

  imoNoCol: TypedColDef<IVesselMasterDto, string> = {
    headerName: VesselMasterListColumnsLabels.imoNo,
    colId: VesselMasterListColumns.imoNo,
    field: model('imoNo')
  };

  vesselFlagCol: TypedColDef<IVesselMasterDto, string> = {
    headerName: VesselMasterListColumnsLabels.vesselFlag,
    colId: VesselMasterListColumns.vesselFlag,
    field: model('vesselFlag')
  };

  buyerCol: TypedColDef<IVesselMasterDto, string> = {
    headerName: VesselMasterListColumnsLabels.buyer,
    colId: VesselMasterListColumns.buyer,
    field: model('buyer')
  };

  operatingCompanyCol: TypedColDef<IVesselMasterDto, string> = {
    headerName: VesselMasterListColumnsLabels.operatingCompany,
    colId: VesselMasterListColumns.operatingCompany,
    field: model('operatingCompany')
  };

  emailCol: TypedColDef<IVesselMasterDto, string> = {
    headerName: VesselMasterListColumnsLabels.email,
    colId: VesselMasterListColumns.email,
    field: model('email')
  };

  defaultHfoCol: TypedColDef<IVesselMasterDto, IDisplayLookupDto> = {
    headerName: VesselMasterListColumnsLabels.defaultHfo,
    colId: VesselMasterListColumns.defaultHfo,
    field: model('fuel'),
    valueFormatter: params => params.value?.name ?? params.value?.displayName
  };

  hfoSpecsCol: TypedColDef<IVesselMasterDto, IDisplayLookupDto> = {
    headerName: VesselMasterListColumnsLabels.hfoSpecs,
    colId: VesselMasterListColumns.hfoSpecs,
    field: model('fuelSpecGroup'),
    valueFormatter: params => params.value?.name ?? params.value?.displayName
  };

  defaultMgoCol: TypedColDef<IVesselMasterDto, IDisplayLookupDto> = {
    headerName: VesselMasterListColumnsLabels.defaultMgo,
    colId: VesselMasterListColumns.defaultMgo,
    field: model('distillate'),
    valueFormatter: params => params.value?.name ?? params.value?.displayName
  };

  mgoSpecsCol: TypedColDef<IVesselMasterDto, IDisplayLookupDto> = {
    headerName: VesselMasterListColumnsLabels.mgoSpecs,
    colId: VesselMasterListColumns.mgoSpecs,
    field: model('distillateSpecGroup'),
    valueFormatter: params => params.value?.name ?? params.value?.displayName
  };

  defaultUlsfoCol: TypedColDef<IVesselMasterDto, IDisplayLookupDto> = {
    headerName: VesselMasterListColumnsLabels.defaultUlsfo,
    colId: VesselMasterListColumns.defaultUlsfo,
    field: model('lsfo'),
    valueFormatter: params => params.value?.name ?? params.value?.displayName
  };

  ulsfoSpecsCol: TypedColDef<IVesselMasterDto, IDisplayLookupDto> = {
    headerName: VesselMasterListColumnsLabels.ulsfoSpecs,
    colId: VesselMasterListColumns.ulsfoSpecs,
    field: model('lsfoSpecsGroup'),
    valueFormatter: params => params.value?.name ?? params.value?.displayName
  };

  serviceCol: TypedColDef<IVesselMasterDto, string> = {
    headerName: VesselMasterListColumnsLabels.service,
    colId: VesselMasterListColumns.service,
    field: model('service')
  };

  labCol: TypedColDef<IVesselMasterDto, string> = {
    headerName: VesselMasterListColumnsLabels.lab,
    colId: VesselMasterListColumns.lab,
    field: model('lab')
  };

  commentsCol: TypedColDef<IVesselMasterDto, string> = {
    headerName: VesselMasterListColumnsLabels.comments,
    colId: VesselMasterListColumns.comments,
    field: model('comments')
  };

  charteredVesselCol: TypedColDef<IVesselMasterDto, string> = {
    headerName: VesselMasterListColumnsLabels.charteredVessel,
    colId: VesselMasterListColumns.charteredVessel,
    field: model('charteredVessel')
  };

  chartererNameCol: TypedColDef<IVesselMasterDto, string> = {
    headerName: VesselMasterListColumnsLabels.chartererName,
    colId: VesselMasterListColumns.chartererName,
    field: model('chartererName')
  };

  deliveryDateCol: TypedColDef<IVesselMasterDto, string> = {
    headerName: VesselMasterListColumnsLabels.deliveryDate,
    colId: VesselMasterListColumns.deliveryDate,
    field: model('deliveryDate'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value)
  };

  expiryDateCol: TypedColDef<IVesselMasterDto, string> = {
    headerName: VesselMasterListColumnsLabels.expiryDate,
    colId: VesselMasterListColumns.expiryDate,
    field: model('expiryDate'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value)
  };

  earliestRedeliveryDateCol: TypedColDef<IVesselMasterDto, string> = {
    headerName: VesselMasterListColumnsLabels.earliestRedeliveryDate,
    colId: VesselMasterListColumns.earliestRedeliveryDate,
    field: model('earliestRedeliveryDate'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value)
  };

  estimatedRedeliveryDateCol: TypedColDef<IVesselMasterDto, string> = {
    headerName: VesselMasterListColumnsLabels.estimatedRedeliveryDate,
    colId: VesselMasterListColumns.estimatedRedeliveryDate,
    field: model('estimatedRedeliveryDate'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value)
  };

  latestRedeliveryDateCol: TypedColDef<IVesselMasterDto, string> = {
    headerName: VesselMasterListColumnsLabels.latestRedeliveryDate,
    colId: VesselMasterListColumns.latestRedeliveryDate,
    field: model('latestRedeliveryDate'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value)
  };

  redeliveryPortCol: TypedColDef<IVesselMasterDto, string> = {
    headerName: VesselMasterListColumnsLabels.redeliveryPort,
    colId: VesselMasterListColumns.redeliveryPort,
    field: model('redeliveryPort')
  };

  robHsfoOnDeliveryCol: TypedColDef<IVesselMasterDto, number> = {
    headerName: VesselMasterListColumnsLabels.robHsfoOnDelivery,
    colId: VesselMasterListColumns.robHsfoOnDelivery,
    field: model('robHsfoDeliveryQuantity'),
    filter: 'agNumberColumnFilter'
  };

  robLsfoOnDeliveryCol: TypedColDef<IVesselMasterDto, number> = {
    headerName: VesselMasterListColumnsLabels.robLsfoOnDelivery,
    colId: VesselMasterListColumns.robLsfoOnDelivery,
    field: model('robLsfoDeliveryQuantity'),
    filter: 'agNumberColumnFilter'
  };

  robDogoOnDeliveryCol: TypedColDef<IVesselMasterDto, number> = {
    headerName: VesselMasterListColumnsLabels.robDogoOnDelivery,
    colId: VesselMasterListColumns.robDogoOnDelivery,
    field: model('robDoGoDeliveryQuantity'),
    filter: 'agNumberColumnFilter'
  };

  robHsfoOnRedeliveryCol: TypedColDef<IVesselMasterDto, number> = {
    headerName: VesselMasterListColumnsLabels.robHsfoOnRedelivery,
    colId: VesselMasterListColumns.robHsfoOnRedelivery,
    field: model('robHsfoRedeliveryQuantity'),
    filter: 'agNumberColumnFilter'
  };

  robLsfoOnRedeliveryCol: TypedColDef<IVesselMasterDto, number> = {
    headerName: VesselMasterListColumnsLabels.robLsfoOnRedelivery,
    colId: VesselMasterListColumns.robLsfoOnRedelivery,
    field: model('robLsfoRedeliveryQuantity'),
    filter: 'agNumberColumnFilter'
  };

  robDogoOnRedeliveryCol: TypedColDef<IVesselMasterDto, number> = {
    headerName: VesselMasterListColumnsLabels.robDogoOnRedelivery,
    colId: VesselMasterListColumns.robDogoOnRedelivery,
    field: model('robDoGoRedeliveryQuantity'),
    filter: 'agNumberColumnFilter'
  };

  mainEngineCol: TypedColDef<IVesselMasterDto, string> = {
    headerName: VesselMasterListColumnsLabels.mainEngine,
    colId: VesselMasterListColumns.mainEngine,
    field: model('mainEngine')
  };

  teuNominalCol: TypedColDef<IVesselMasterDto, number> = {
    headerName: VesselMasterListColumnsLabels.teuNominal,
    colId: VesselMasterListColumns.teuNominal,
    field: model('teuNominal'),
    filter: 'agNumberColumnFilter'
  };

  vesselTypeCol: TypedColDef<IVesselMasterDto, string> = {
    headerName: VesselMasterListColumnsLabels.vesselType,
    colId: VesselMasterListColumns.vesselType,
    field: model('vesselType')
  };

  flowMeterAvailableCol: TypedColDef<IVesselMasterDto, boolean> = {
    headerName: VesselMasterListColumnsLabels.flowMeterAvailable,
    colId: VesselMasterListColumns.flowMeterAvailable,
    field: model('isFlowMeterAvailable'),
    valueFormatter: params => params.value ? 'YES' : 'NO',  // TODO hardcoded values
    cellClass: 'cell-background',
    cellClassRules: {
      'bad': params => !(params.data?.isFlowMeterAvailable ?? false)
    }
  };

  pumpingRateMtPerHourCol: TypedColDef<IVesselMasterDto, number> = {
    headerName: VesselMasterListColumnsLabels.pumpingRateMtPerHour,
    colId: VesselMasterListColumns.pumpingRateMtPerHour,
    field: model('pumpingRate'),
    filter: 'agNumberColumnFilter'
  };

  averageSpeedNmPerHourCol: TypedColDef<IVesselMasterDto, number> = {
    headerName: VesselMasterListColumnsLabels.averageSpeedNmPerHour,
    colId: VesselMasterListColumns.averageSpeedNmPerHour,
    field: model('averageSpeed'),
    filter: 'agNumberColumnFilter'
  };

  manifoldPressureCol: TypedColDef<IVesselMasterDto, number> = {
    headerName: VesselMasterListColumnsLabels.manifoldPressure,
    colId: VesselMasterListColumns.manifoldPressure,
    field: model('manifoldPressure'),
    filter: 'agNumberColumnFilter'
  };

  voyageUpdatedDateCol: TypedColDef<IVesselMasterDto, string> = {
    headerName: VesselMasterListColumnsLabels.voyageUpdatedDate,
    colId: VesselMasterListColumns.voyageUpdatedDate,
    field: model('updatedDate'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value)
  };

  statusCol: TypedColDef<IVesselMasterDto, boolean> = {
    headerName: VesselMasterListColumnsLabels.status,
    colId: VesselMasterListColumns.status,
    field: model('isDeleted'),
    valueFormatter: params => params.value ? 'ACTIVE' : 'INACTIVE', // TODO hardcoded values
    cellClass: 'cell-background',
    cellClassRules: {
      'active': params => params.data?.isDeleted ?? false,
      'inactive': params => !(params.data?.isDeleted ?? false)
    }
  };

  createdOnCol: TypedColDef<IVesselMasterDto, string> = {
    headerName: VesselMasterListColumnsLabels.createdOn,
    colId: VesselMasterListColumns.createdOn,
    field: model('createdOn'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value)
  };

  createdByCol: TypedColDef<IVesselMasterDto, IDisplayLookupDto> = {
    headerName: VesselMasterListColumnsLabels.createdBy,
    colId: VesselMasterListColumns.createdBy,
    field: model('createdBy'),
    valueFormatter: params => params.value?.name ?? params.value?.displayName
  };

  lastModifiedOnCol: TypedColDef<IVesselMasterDto, string> = {
    headerName: VesselMasterListColumnsLabels.lastModifiedOn,
    colId: VesselMasterListColumns.lastModifiedOn,
    field: model('lastModifiedOn'),
    filter: 'agDateColumnFilter',
    valueFormatter: params => this.format.date(params.value)
  };

  lastModifiedByCol: TypedColDef<IVesselMasterDto, IDisplayLookupDto> = {
    headerName: VesselMasterListColumnsLabels.lastModifiedBy,
    colId: VesselMasterListColumns.lastModifiedBy,
    field: model('lastModifiedBy'),
    valueFormatter: params => params.value?.name ?? params.value?.displayName
  };

  constructor(
    columnPreferences: AgColumnPreferencesService,
    changeDetector: ChangeDetectorRef,
    loggerFactory: LoggerFactory,
    private format: TenantFormattingService,
    @Inject(VESSEL_MASTERS_API_SERVICE) private mastersApi: IVesselMastersApi
  ) {
    super('vessel-master-selector-grid', columnPreferences, changeDetector, loggerFactory.createLogger(VesselMasterSelectorGridViewModel.name));
    this.initOptions(this.gridOptions);
  }

  getColumnsDefs(): TypedColDef[] {
    return [
      this.selectCol,
      this.nameCol,
      this.displayNameCol,
      this.codeCol,
      this.imoNoCol,
      this.vesselFlagCol,
      this.operatingCompanyCol,
      this.emailCol,
      this.defaultHfoCol,
      this.defaultMgoCol,
      this.mgoSpecsCol,
      this.defaultUlsfoCol,
      this.ulsfoSpecsCol,
      this.serviceCol,
      this.labCol,
      this.commentsCol,
      this.charteredVesselCol,
      this.chartererNameCol,
      this.buyerCol,
      this.deliveryDateCol,
      this.expiryDateCol,
      this.earliestRedeliveryDateCol,
      this.estimatedRedeliveryDateCol,
      this.latestRedeliveryDateCol,
      this.redeliveryPortCol,
      this.robHsfoOnDeliveryCol,
      this.robLsfoOnDeliveryCol,
      this.robDogoOnDeliveryCol,
      this.robHsfoOnRedeliveryCol,
      this.robLsfoOnRedeliveryCol,
      this.robDogoOnRedeliveryCol,
      this.mainEngineCol,
      this.teuNominalCol,
      this.vesselTypeCol,
      this.flowMeterAvailableCol,
      this.pumpingRateMtPerHourCol,
      this.averageSpeedNmPerHourCol,
      this.manifoldPressureCol,
      this.voyageUpdatedDateCol,
      this.statusCol,
      this.createdOnCol,
      this.createdByCol,
      this.lastModifiedOnCol,
      this.lastModifiedByCol,
      this.hfoSpecsCol
    ];
  }

  public onSearch(value: string): void {
    this.searchText = value;
    this.gridApi.purgeServerSideCache();
  }

  public serverSideGetRows(params: IServerSideGetRowsParams): void {
    this.mastersApi.getVessels(transformLocalToServeGridInfo(params, VesselMasterListColumnServerKeys, this.searchText)).subscribe(
      response => params.successCallback(response.items, response.totalCount),
      () => params.failCallback());
  }
}
