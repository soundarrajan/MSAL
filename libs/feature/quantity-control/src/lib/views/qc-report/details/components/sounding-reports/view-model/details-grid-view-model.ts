import { Injectable } from '@angular/core';
import { ColDef, GridOptions } from 'ag-grid-community';
import { RowModelType } from '@shiptech/core/ui/components/ag-grid/type.definition';
import { QcSoundingReportDetailsColumns, QcSoundingReportDetailsColumnsLabels } from './grid-columns';
import { QcSoundingReportDetailsItemModel } from '../../../../../../services/models/qc-sounding-report-details-item.model';
import { QcSoundingReportItemModel } from '../../../../../../services/models/qc-sounding-report-item.model';
import { getShiptechFormatPagination } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-paging';
import { getShiptechFormatSorts } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-sorts';
import { getShiptechFormatFilters } from '@shiptech/core/grid/server-grid/mappers/shiptech-grid-filters';
import { QcReportDetailsService } from '../../../../../../services/qc-report-details.service';

function model(prop: keyof QcSoundingReportDetailsItemModel): string {
  return prop;
}

@Injectable()
export class QcSoundingReportDetailsGridViewModel {

  gridOptions: GridOptions = {
    groupHeaderHeight: 20,
    headerHeight: 40,
    rowHeight: 35,

    rowModelType: RowModelType.ServerSide,
    pagination: true,

    animateRows: true,

    deltaRowDataMode: false,
    suppressPaginationPanel: false,
    suppressColumnVirtualisation: true,
    rowDragManaged: true,
    suppressRowClickSelection: true,

    multiSortKey: 'ctrl',

    enableBrowserTooltips: true,
    singleClickEdit: true,
    getRowNodeId: () => Math.random().toString(),

    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      width: 150
    },

    columnDefs: []
  };

  reportIdCol: ColDef = {
    headerName: QcSoundingReportDetailsColumnsLabels.reportId,
    colId: QcSoundingReportDetailsColumns.reportId,
    field: model('reportId')
  };

  tankIdCol: ColDef = {
    headerName: QcSoundingReportDetailsColumnsLabels.tankId,
    colId: QcSoundingReportDetailsColumns.tankId,
    field: model('tankId')
  };

  tankNameCol: ColDef = {
    headerName: QcSoundingReportDetailsColumnsLabels.tankName,
    colId: QcSoundingReportDetailsColumns.tankName,
    field: model('tankName')
  };

  fuelDescriptionCol: ColDef = {
    headerName: QcSoundingReportDetailsColumnsLabels.fuelDescription,
    colId: QcSoundingReportDetailsColumns.fuelDescription,
    field: model('fuelDescription')
  };

  fuelVolumeCol: ColDef = {
    headerName: QcSoundingReportDetailsColumnsLabels.fuelVolume,
    colId: QcSoundingReportDetailsColumns.fuelVolume,
    field: model('fuelVolume')
  };

  tankCapacityCol: ColDef = {
    headerName: QcSoundingReportDetailsColumnsLabels.tankCapacity,
    colId: QcSoundingReportDetailsColumns.tankCapacity,
    field: model('tankCapacity')
  };

  fuelTempCol: ColDef = {
    headerName: QcSoundingReportDetailsColumnsLabels.fuelTemp,
    colId: QcSoundingReportDetailsColumns.fuelTemp,
    field: model('fuelTemp')
  };

  tankUnpumpableVolumeCol: ColDef = {
    headerName: QcSoundingReportDetailsColumnsLabels.tankUnpumpableVolume,
    colId: QcSoundingReportDetailsColumns.tankUnpumpableVolume,
    field: model('tankUnpumpableVolume')
  };

  fuelMassCol: ColDef = {
    headerName: QcSoundingReportDetailsColumnsLabels.fuelMass,
    colId: QcSoundingReportDetailsColumns.fuelMass,
    field: model('fuelMass')
  };

  constructor(private quantityControlService: QcReportDetailsService) {
    this.gridOptions.columnDefs = this.getColumnsDefs();
  }

  getColumnsDefs(): ColDef[] {
    return [
      this.reportIdCol,
      this.tankIdCol,
      this.tankNameCol,
      this.fuelDescriptionCol,
      this.fuelVolumeCol,
      this.tankCapacityCol,
      this.fuelTempCol,
      this.tankUnpumpableVolumeCol,
      this.fuelMassCol
    ];
  }

  public detailServerSideGetRows(params: any): void {
    this.quantityControlService.getSoundingReportListItemDetails((<QcSoundingReportItemModel>params.data).reportId, {}).subscribe(
      response => params.successCallback(response.items, response.totalItems),
      () =>{
        // TODO: master detail has no failcallback for detail grid
       // params.failCallback()
      });
  }
}

