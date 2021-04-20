import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { GridOptions } from '@ag-grid-community/core';
import { AGGridCellDataComponent } from '../ag-grid/ag-grid-celldata.component';
import { AGGridCellRendererComponent } from '../ag-grid/ag-grid-cell-renderer.component';

@Component({
  selector: 'app-bunker-plan',
  templateUrl: './bunker-plan.component.html',
  styleUrls: ['./bunker-plan.component.scss']
})
export class BunkerPlanComponent implements OnInit {

  public gridOptions: GridOptions;
  public colResizeDefault;
  public rowCount: Number;

  @Input("isExpanded") isExpanded: boolean;
  constructor() {
    this.gridOptions = <GridOptions>{
      columnDefs: this.columnDefs,
      //enableColResize: false,
      //enableSorting: false,
      animateRows: false,
      headerHeight: 50,
      rowHeight: 30,
      groupHeaderHeight: 20,
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
        this.gridOptions.api.sizeColumnsToFit();
        this.rowCount = this.gridOptions.api.getDisplayedRowCount();

      },
      onColumnResized: function (params) {
      },
      onColumnVisible: function (params) {
      },
      onColumnPinned: function (params) {
      },
      onGridSizeChanged: function (params) {
        params.api.sizeColumnsToFit();
      }
    };
  }

  ngOnInit() {
  }

  private columnDefs = [
    {
      headerClass: ['cell-border-bottom'],
      pinned: 'left',
      children: [
        {
          headerName: 'Oper. Ack', headerTooltip: 'Oper. Ack', field: "ack",
          // pinned: 'left',
          suppressMenu: true,
          resizable: false,
          width: 45,
          cellClassRules: {
            'lightgreen': function (params) {
              return params.value == true;
            }
            // 'dark': function(params) {
            //   return params.value ==false;
            // }
          },
          cellClass: ['custom-check-box readonly aggrid-left-ribbon  aggrid-content-center'], headerClass: ['aggrid-text-align-c'],
          cellRendererFramework: AGGridCellDataComponent,
          cellRendererParams: {
            type: 'checkbox', cellClass: ['aggrid-white-checkbox']
          }
        },
        {
          headerName: 'Port', field: 'port', headerTooltip: 'Port', width: 96, cellRendererFramework: AGGridCellDataComponent,
          cellRendererParams: { type: 'port-readOnly', cellClass: ['text-ellipsis'] }, cellClass: ['dark-cell aggrid-content-center'], headerClass: ['aggrid-colum-splitter-left aggrid-text-align-c']
        },
        {
          headerName: 'HSFO',
          headerTooltip: 'HSFO',
          marryChildren: true,
          resizable: false,
          headerClass: ['aggrid-columgroup-splitter-left aggrid-text-align-c'],
          children: [
            {
              headerName: 'Max Lift', field: 'hsfo_max_lift', headerTooltip: 'Max Lift', width: 50, cellRendererFramework: AGGridCellDataComponent, cellClass: ['aggrid-green-editable-cell'], headerClass: ['aggrid-colum-splitter-left'],
              cellRendererParams: function (params) {
                var classArray: string[] = [];
                let newClass = 'aggrid-cell-color mediumred'
                classArray.push(newClass);
                return { type: 'edit-disabled', cellClass: classArray.length > 0 ? classArray : null }
              }
            },
            { headerName: 'Estd. SOA', headerTooltip: 'Estd. SOA', field: 'hsfo_estd_soa', width: 50, headerClass: ['aggrid-colum-splitter-left'], cellClass: ['aggrid-content-right'] },
            {
              headerName: 'Estd. Cons', headerTooltip: 'Estd. Cons', field: 'hsfo_estd_cons', width: 50, cellRendererFramework: AGGridCellDataComponent, headerClass: ['aggrid-colum-splitter-left'], cellClass: ['aggrid-green-editable-cell'],
              cellRendererParams: function (params) {
                var classArray: string[] = [];
                let newClass = 'aggrid-cell-color lightgreen'
                classArray.push(newClass);
                return { type: 'edit-disabled', cellClass: classArray.length > 0 ? classArray : null }
              }
            },
            {
              headerName: 'Conf/ Plan Lift', headerTooltip: 'Conf/Plan Lift', field: 'hasfo_plan_lift', width: 50, cellRendererFramework: AGGridCellDataComponent, cellClass: 'pd-1 aggrid-content-right', headerClass: ['aggrid-colum-splitter-left'],
              cellRendererParams: function (params) {
                var classArray: string[] = ['pd-6'];
                let newClass = 'aggrid-link-bplan aggrid-blue-cell'
                if (params.data.req_created)
                  classArray.push(newClass);
                return { type: 'link', cellClass: classArray.length > 0 ? classArray : null }
              }
            },
            {
              headerName: 'Safe Port', headerTooltip: 'Safe Port', field: 'hsfo_safe_port', width: 50, cellClass: ['aggrid-columgroup-splitter aggrid-green-editable-cell'], headerClass: ['aggrid-columgroup-splitter aggrid-colum-splitter-left'],
              cellRendererFramework: AGGridCellDataComponent,
              cellRendererParams: function (params) {
                var classArray: string[] = [];
                let newClass = 'aggrid-cell-color lightgreen'
                classArray.push(newClass);
                return { type: 'edit-disabled', cellClass: classArray.length > 0 ? classArray : null }
              }
            },
          ]
        },
      ]
    },
    {
      headerName: 'SECA COMPLIANT',
      headerClass: ['aggrid-grey-cell aggrid-columgroup-splitter-left whiteText'],
      children: [
        {
          headerName: 'SECA',
          headerTooltip: 'SECA',
          marryChildren: true,
          resizable: false,
          headerClass: ['aggrid-columgroup-splitter'],
          children: [
            {
              headerName: 'Estd. Cons', headerTooltip: 'Estd. Cons', field: 'seca_estd_cons', width: 50, cellClass: ['aggrid-green-editable-cell '], cellRendererFramework: AGGridCellDataComponent,
              cellRendererParams: function (params) {
                var classArray: string[] = [];
                let newClass = 'aggrid-cell-color lightgreen'
                classArray.push(newClass);
                return { type: 'edit-disabled', cellClass: classArray.length > 0 ? classArray : null }
              }
            },
            {
              headerName: 'Safe Port', headerTooltip: 'Safe Port', field: 'seca_safe_port', width: 50, headerClass: ['aggrid-columgroup-splitter aggrid-colum-splitter-left'], cellClass: ['splitter-dual aggrid-colum-splitter-left aggrid-green-editable-cell'], cellRendererFramework: AGGridCellDataComponent,
              cellRendererParams: function (params) {
                var classArray: string[] = [];
                let newClass = 'aggrid-cell-color lightgreen'
                classArray.push(newClass);
                return { type: 'edit-disabled', cellClass: classArray.length > 0 ? classArray : null }
              }
            }
          ]
        },
        {
          headerName: 'ULSFO',
          headerTooltip: 'ULSFO',
          marryChildren: true,
          resizable: false,
          headerClass: ['aggrid-columgroup-splitter'],
          children: [
            {
              headerName: 'Max Lift', field: 'ulsfo_max_lift_wo', headerTooltip: 'Max Lift', width: 50, cellClass: ['aggrid-green-editable-cell'], cellRendererFramework: AGGridCellDataComponent,
              cellRendererParams: function (params) {
                var classArray: string[] = [];
                let newClass = 'aggrid-cell-color lightgreen'
                classArray.push(newClass);
                return { type: 'edit-disabled', cellClass: classArray.length > 0 ? classArray : null }
              }
            },
            // {
            //   headerName: 'Max Lift W Mix', field: 'ulsfo_max_lift_w', headerTooltip: 'Max Lift W Mix', width: 50, cellClass: ['aggrid-green-editable-cell aggrid-columwhite-splitter-left'], cellRendererFramework: AGGridCellDataComponent, headerClass: ['aggrid-colum-splitter-left'],
            //   cellRendererParams: function (params) {
            //     var classArray: string[] = [];
            //     let newClass = 'aggrid-cell-color lightgreen'
            //     classArray.push(newClass);
            //     return { type: 'edit-disabled', cellClass: classArray.length > 0 ? classArray : null }
            //   }
            // },
            { headerName: 'Estd. SOA', headerTooltip: 'Estd. SOA', field: 'ulsfo_estd_soa', width: 40, headerClass: ['aggrid-colum-splitter-left'], cellClass: ['aggrid-content-right'] },
            {
              headerName: 'Conf/ Plan Lift', headerTooltip: 'Conf/Plan Lift', field: 'ulsfo_plan_lift', width: 45, headerClass: ['aggrid-columgroup-splitter aggrid-colum-splitter-left'], cellRendererFramework: AGGridCellDataComponent, cellClass: ['aggrid-columgroup-splitter pd-1 aggrid-content-right'],
              cellRendererParams: function (params) {
                var classArray: string[] = ['pd-6'];
                let newClass = 'aggrid-link-bplan aggrid-blue-cell'
                if (params.data.ulsfo_plan_lift != '0')
                  classArray.push(newClass);
                return { type: 'link', cellClass: classArray.length > 0 ? classArray : null }
              }
            }
          ]
        },
        {
          headerName: 'LSDIS',
          headerTooltip: 'LSDIS',
          marryChildren: true,
          resizable: false,
          headerClass: ['aggrid-columgroup-splitter '],
          children: [
            {
              headerName: 'Max Lift', field: 'lsdis_max_lift', headerTooltip: 'Max Lift', width: 50, cellClass: ['aggrid-green-editable-cell'], cellRendererFramework: AGGridCellDataComponent,
              cellRendererParams: function (params) {
                var classArray: string[] = [];
                let newClass = params.data.confirmed_by_box ? 'aggrid-cell-color mediumred' : 'aggrid-cell-color lightgreen'
                classArray.push(newClass);
                return { type: 'edit-disabled', cellClass: classArray.length > 0 ? classArray : null }
              }
            },
            { headerName: 'Estd. SOA', headerTooltip: 'Estd. SOA', field: 'lsdis_estd_soa', width: 50, headerClass: ['aggrid-colum-splitter-left'], cellClass: ['aggrid-content-right'] },
            {
              headerName: 'Estd. Cons', headerTooltip: 'Estd. Cons', field: 'lsdis_estd_cons', width: 50, cellClass: ['aggrid-green-editable-cell'], cellRendererFramework: AGGridCellDataComponent, headerClass: ['aggrid-colum-splitter-left aggrid-colum-splitter-left'],
              cellRendererParams: function (params) {
                var classArray: string[] = [];
                let newClass = 'aggrid-cell-color lightgreen'
                classArray.push(newClass);
                return { type: 'edit-disabled', cellClass: classArray.length > 0 ? classArray : null }
              }
            },
            {
              headerName: 'Conf/ Plan Lift', headerTooltip: 'Conf/Plan Lift', field: 'lsdis_plan_lift', width: 45, cellRendererFramework: AGGridCellDataComponent, cellClass: 'pd-1 aggrid-content-right', headerClass: ['aggrid-colum-splitter-left'],
              cellRendererParams: function (params) {
                var classArray: string[] = ['pd-6'];
                let newClass = 'aggrid-link-bplan aggrid-blue-cell'
                if (params.data.req_created)
                  classArray.push(newClass);
                return { type: 'link', cellClass: classArray.length > 0 ? classArray : null }
              }
            },
            { headerName: 'LSDIS Safe Port', headerTooltip: 'LSDIS Safe Port', field: 'lsdis_safe_port', width: 40, headerClass: ['aggrid-columgroup-splitter aggrid-colum-splitter-left'], cellClass: ['aggrid-blue-cell aggrid-columgroup-splitter  aggrid-content-right'] },
          ]
        },
      ]
    },
    {
      headerClass: ['cell-border-bottom'],
      children: [
        { headerName: 'Total Min SOD', headerTooltip: 'Total Min SOD', field: 'total_min_sod', width: 50, cellRendererFramework: AGGridCellDataComponent, cellClass: ['aggrid-blue-editable-cell'], cellRendererParams: { type: 'disable-with-popup', cellClass: 'aggrid-cell-color white' } },
        { headerName: 'Min HSFO SOD', headerTooltip: 'Min HSFO SOD', field: 'min_hsfo_sod', width: 50, cellRendererFramework: AGGridCellDataComponent, cellRendererParams: { type: 'disable-with-popup', cellClass: 'aggrid-cell-color white' }, cellClass: ['aggrid-blue-editable-cell aggrid-columwhite-splitter-left'], headerClass: ['aggrid-colum-splitter-left'] },
        { headerName: 'Min ECA Bunker SOD', headerTooltip: 'Min ECA Bunker SOD', field: 'min_eca_bunker_sod', width: 50, cellRendererFramework: AGGridCellDataComponent, cellRendererParams: { type: 'disable-with-popup', cellClass: 'aggrid-cell-color white' }, cellClass: ['aggrid-blue-editable-cell aggrid-columwhite-splitter-left'], headerClass: ['aggrid-colum-splitter-left'] },
        { headerName: 'Total Max SOD', headerTooltip: 'Total Max SOD', field: 'total_max_sod', width: 50, cellRendererFramework: AGGridCellDataComponent, cellRendererParams: { type: 'disable-with-popup', cellClass: 'aggrid-cell-color white' }, cellClass: ['aggrid-blue-editable-cell aggrid-columwhite-splitter-left'], headerClass: ['aggrid-colum-splitter-left'] },
        { headerName: 'HSDIS Conf/ Req Lift', headerTooltip: 'HSDIS Conf/Req Lift', field: 'req_lift', width: 50, headerClass: ['aggrid-colum-splitter-left'], cellClass: ['aggrid-content-right'] },
        { headerName: 'Email', field: 'email', headerTooltip: 'Email', width: 60, cellRendererFramework: AGGridCellRendererComponent, cellRendererParams: { cellClass: ['text-ellipsis'] }, headerClass: ['aggrid-colum-splitter-left'] },

        {
          headerName: 'Min SOA', headerTooltip: 'Min SOA', field: "min_soa",
          suppressMenu: true,
          resizable: false,
          width: 40,
          cellClass: 'checkbox-center aggrid-content-center',
          cellRendererFramework: AGGridCellDataComponent, cellRendererParams: { type: 'checkbox-disabled', cellClass: ['aggrid-dark-checkbox'] }, headerClass: ['aggrid-colum-splitter-left']
        }
      ]
    }

  ];
  private rowData = [
    {
      ack: true,
      port: 'ESALR',
      hsfo_max_lift: '4206',
      hsfo_estd_soa: '1193',
      hsfo_estd_cons: '571',
      hasfo_plan_lift: '100',
      hsfo_safe_port: '',
      seca_estd_cons: '66',
      seca_safe_port: '40',
      ulsfo_max_lift_wo: '0',
      ulsfo_max_lift_w: '1201',
      ulsfo_estd_soa: '300',
      ulsfo_plan_lift: '0',
      lsdis_max_lift: '200',
      lsdis_estd_soa: '50',
      lsdis_estd_cons: '0',
      lsdis_plan_lift: '200',
      lsdis_safe_port: '40',
      total_min_sod: { port: 'ESALR', value: '188', comments: '' },
      min_hsfo_sod: { port: 'ESALR', value: '90', comments: '' },
      min_eca_bunker_sod: { port: 'ESALR', value: '', comments: '' },
      total_max_sod: { port: 'ESALR', value: '', comments: '' },
      req_lift: '0',
      email: 'rmaersk@maersk.com',
      req_created: true,
      confirmed_by_vessel: false,
      confirmed_by_box: true,
      min_soa: { port: 'ESALR', value: true, comments: '' }
    },
    {
      ack: true,
      port: 'USNWK',
      hsfo_max_lift: '4934',
      hsfo_estd_soa: '465',
      hsfo_estd_cons: '828',
      hasfo_plan_lift: '0',
      hsfo_safe_port: '',
      seca_estd_cons: '61',
      seca_safe_port: '',
      ulsfo_max_lift_wo: '147',
      ulsfo_max_lift_w: '1258',
      ulsfo_estd_soa: '300',
      ulsfo_plan_lift: '260',
      lsdis_max_lift: '95',
      lsdis_estd_soa: '103',
      lsdis_estd_cons: '5',
      lsdis_plan_lift: '200',
      lsdis_safe_port: '',
      total_min_sod: { port: 'USNWK', value: '188', comments: '' },
      min_hsfo_sod: { port: 'USNWK', value: '90', comments: 'After discussing with the offshore team at teh port, min SOD value has been updated.' },
      min_eca_bunker_sod: { port: 'USNWK', value: '', comments: '' },
      total_max_sod: { port: 'USNWK', value: '', comments: '' },
      req_lift: '0',
      email: 'rmaersk@maersk.com',
      req_created: false,
      confirmed_by_vessel: false,
      confirmed_by_box: false,
      min_soa: { port: 'USNWK', value: true, comments: 'After discussing with the offshore team at teh port, min SOA value has been updated.' }
    },
    {
      ack: false,
      port: 'USNCA',
      hsfo_max_lift: '4934',
      hsfo_estd_soa: '465',
      hsfo_estd_cons: '0',
      hasfo_plan_lift: '0',
      hsfo_safe_port: '',
      seca_estd_cons: '44',
      seca_safe_port: '',
      ulsfo_max_lift_wo: '90',
      ulsfo_max_lift_w: '1053',
      ulsfo_estd_soa: '505',
      ulsfo_plan_lift: '0',
      lsdis_max_lift: '130',
      lsdis_estd_soa: '68',
      lsdis_estd_cons: '0',
      lsdis_plan_lift: '200',
      lsdis_safe_port: '',
      total_min_sod: { port: 'USNCA', value: '4000', comments: '' },
      min_hsfo_sod: { port: 'USNCA', value: '', comments: '' },
      min_eca_bunker_sod: { port: 'USNCA', value: '', comments: '' },
      total_max_sod: { port: 'USNCA', value: '', comments: '' },
      req_lift: '0',
      email: 'rmaersk@maersk.com',
      req_created: false,
      confirmed_by_vessel: false,
      confirmed_by_box: false,
      min_soa: { port: 'USNCA', value: true, comments: '' }
    },
    {
      ack: true,
      port: 'USSAV',
      hsfo_max_lift: '4934',
      hsfo_estd_soa: '465',
      hsfo_estd_cons: '0',
      hasfo_plan_lift: '0',
      hsfo_safe_port: '',
      seca_estd_cons: '58',
      seca_safe_port: '',
      ulsfo_max_lift_wo: '16',
      ulsfo_max_lift_w: '1069',
      ulsfo_estd_soa: '489',
      ulsfo_plan_lift: '0',
      lsdis_max_lift: '130',
      lsdis_estd_soa: '68',
      lsdis_estd_cons: '0',
      lsdis_plan_lift: '200',
      lsdis_safe_port: '',
      total_min_sod: { port: 'USSAV', value: '', comments: '' },
      min_hsfo_sod: { port: 'USSAV', value: '', comments: '' },
      min_eca_bunker_sod: { port: 'USSAV', value: '', comments: '' },
      total_max_sod: { port: 'USSAV', value: '', comments: '' },
      req_lift: '0',
      email: 'rmaersk@maersk.com',
      req_created: false,
      confirmed_by_vessel: false,
      confirmed_by_box: false,
      min_soa: { port: 'USSAV', value: true, comments: '' }
    },
    {
      ack: true,
      port: 'USHOU',
      hsfo_max_lift: '4934',
      hsfo_estd_soa: '465',
      hsfo_estd_cons: '0',
      hasfo_plan_lift: '0',
      hsfo_safe_port: '',
      seca_estd_cons: '187',
      seca_safe_port: '',
      ulsfo_max_lift_wo: '249',
      ulsfo_max_lift_w: '1318',
      ulsfo_estd_soa: '240',
      ulsfo_plan_lift: '295',
      lsdis_max_lift: '130',
      lsdis_estd_soa: '68',
      lsdis_estd_cons: '0',
      lsdis_plan_lift: '200',
      lsdis_safe_port: '',
      total_min_sod: { port: 'USHOU', value: '', comments: '' },
      min_hsfo_sod: { port: 'USHOU', value: '', comments: '' },
      min_eca_bunker_sod: { port: 'USHOU', value: '', comments: '' },
      total_max_sod: { port: 'USHOU', value: '', comments: '' },
      req_lift: '0',
      email: 'rmaersk@maersk.com',
      req_created: false,
      confirmed_by_vessel: false,
      confirmed_by_box: false,
      min_soa: { port: 'USHOU', value: true, comments: '' }
    },
    {
      ack: false,
      port: 'USNFK',
      hsfo_max_lift: '4934',
      hsfo_estd_soa: '465',
      hsfo_estd_cons: '0',
      hasfo_plan_lift: '0',
      hsfo_safe_port: '',
      seca_estd_cons: '78',
      seca_safe_port: '',
      ulsfo_max_lift_wo: '252',
      ulsfo_max_lift_w: '1275',
      ulsfo_estd_soa: '283',
      ulsfo_plan_lift: '0',
      lsdis_max_lift: '130',
      lsdis_estd_soa: '68',
      lsdis_estd_cons: '0',
      lsdis_plan_lift: '200',
      lsdis_safe_port: '',
      total_min_sod: { port: 'USNFK', value: '', comments: '' },
      min_hsfo_sod: { port: 'USNFK', value: '', comments: '' },
      min_eca_bunker_sod: { port: 'USNFK', value: '', comments: '' },
      total_max_sod: { port: 'USNFK', value: '', comments: '' },
      req_lift: '0',
      email: 'rmaersk@maersk.com',
      req_created: false,
      confirmed_by_vessel: false,
      confirmed_by_box: false,
      min_soa: { port: 'USNFK', value: true, comments: '' }
    },
    {
      ack: true,
      port: 'USNWK',
      hsfo_max_lift: '4934',
      hsfo_estd_soa: '465',
      hsfo_estd_cons: '0',
      hasfo_plan_lift: '3809',
      hsfo_safe_port: '',
      seca_estd_cons: '0',
      seca_safe_port: '',
      ulsfo_max_lift_wo: '252',
      ulsfo_max_lift_w: '1275',
      ulsfo_estd_soa: '283',
      ulsfo_plan_lift: '0',
      lsdis_max_lift: '130',
      lsdis_estd_soa: '68',
      lsdis_estd_cons: '0',
      lsdis_plan_lift: '200',
      lsdis_safe_port: '',
      total_min_sod: { port: 'USNWK', value: '', comments: '' },
      min_hsfo_sod: { port: 'USNWK', value: '', comments: '' },
      min_eca_bunker_sod: { port: 'USNWK', value: '', comments: '' },
      total_max_sod: { port: 'USNWK', value: '', comments: '' },
      req_lift: '0',
      email: 'rmaersk@maersk.com',
      req_created: false,
      confirmed_by_vessel: false,
      confirmed_by_box: false,
      min_soa: { port: 'USNWK', value: true, comments: '' }
    },
    {
      ack: true,
      port: 'ESALR',
      hsfo_max_lift: '1665',
      hsfo_estd_soa: '3734',
      hsfo_estd_cons: '540',
      hasfo_plan_lift: '0',
      hsfo_safe_port: '',
      seca_estd_cons: '72',
      seca_safe_port: '',
      ulsfo_max_lift_wo: '92',
      ulsfo_max_lift_w: '1410',
      ulsfo_estd_soa: '148',
      ulsfo_plan_lift: '0',
      lsdis_max_lift: '130',
      lsdis_estd_soa: '68',
      lsdis_estd_cons: '0',
      lsdis_plan_lift: '200',
      lsdis_safe_port: '',
      total_min_sod: { port: 'ESALR', value: '', comments: '' },
      min_hsfo_sod: { port: 'ESALR', value: '', comments: '' },
      min_eca_bunker_sod: { port: 'ESALR', value: '', comments: '' },
      total_max_sod: { port: 'ESALR', value: '', comments: '' },
      req_lift: '0',
      email: 'rmaersk@maersk.com',
      req_created: false,
      confirmed_by_vessel: false,
      confirmed_by_box: false,
      min_soa: { port: 'ESALR', value: true, comments: '' }
    },
    {
      ack: false,
      port: 'EGPSD',
      hsfo_max_lift: '2807',
      hsfo_estd_soa: '3347',
      hsfo_estd_cons: '387',
      hasfo_plan_lift: '0',
      hsfo_safe_port: '',
      seca_estd_cons: '63',
      seca_safe_port: '',
      ulsfo_max_lift_wo: '5',
      ulsfo_max_lift_w: '1764',
      ulsfo_estd_soa: '148',
      ulsfo_plan_lift: '0',
      lsdis_max_lift: '313',
      lsdis_estd_soa: '63',
      lsdis_estd_cons: '5',
      lsdis_plan_lift: '200',
      lsdis_safe_port: '',
      total_min_sod: { port: 'EGPSD', value: '', comments: '' },
      min_hsfo_sod: { port: 'EGPSD', value: '', comments: '' },
      min_eca_bunker_sod: { port: 'EGPSD', value: '', comments: '' },
      total_max_sod: { port: 'EGPSD', value: '', comments: '' },
      req_lift: '0',
      email: 'rmaersk@maersk.com',
      req_created: false,
      confirmed_by_vessel: false,
      confirmed_by_box: false,
      min_soa: { port: 'EGPSD', value: true, comments: '' }
    },
    {
      ack: true,
      port: 'USHOU',
      hsfo_max_lift: '4934',
      hsfo_estd_soa: '465',
      hsfo_estd_cons: '0',
      hasfo_plan_lift: '0',
      hsfo_safe_port: '',
      seca_estd_cons: '187',
      seca_safe_port: '',
      ulsfo_max_lift_wo: '249',
      ulsfo_max_lift_w: '1318',
      ulsfo_estd_soa: '240',
      ulsfo_plan_lift: '295',
      lsdis_max_lift: '130',
      lsdis_estd_soa: '68',
      lsdis_estd_cons: '0',
      lsdis_plan_lift: '200',
      lsdis_safe_port: '',
      total_min_sod: { port: 'USHOU', value: '', comments: '' },
      min_hsfo_sod: { port: 'USHOU', value: '', comments: '' },
      min_eca_bunker_sod: { port: 'USHOU', value: '', comments: '' },
      total_max_sod: { port: 'USHOU', value: '', comments: '' },
      req_lift: '0',
      email: 'rmaersk@maersk.com',
      req_created: false,
      confirmed_by_vessel: false,
      confirmed_by_box: false,
      min_soa: { port: 'USHOU', value: true, comments: '' }
    },
    {
      ack: false,
      port: 'USNFK',
      hsfo_max_lift: '4934',
      hsfo_estd_soa: '465',
      hsfo_estd_cons: '0',
      hasfo_plan_lift: '0',
      hsfo_safe_port: '',
      seca_estd_cons: '78',
      seca_safe_port: '',
      ulsfo_max_lift_wo: '252',
      ulsfo_max_lift_w: '1275',
      ulsfo_estd_soa: '283',
      ulsfo_plan_lift: '0',
      lsdis_max_lift: '130',
      lsdis_estd_soa: '68',
      lsdis_estd_cons: '0',
      lsdis_plan_lift: '200',
      lsdis_safe_port: '',
      total_min_sod: { port: 'USNFK', value: '', comments: '' },
      min_hsfo_sod: { port: 'USNFK', value: '', comments: '' },
      min_eca_bunker_sod: { port: 'USNFK', value: '', comments: '' },
      total_max_sod: { port: 'USNFK', value: '', comments: '' },
      req_lift: '0',
      email: 'rmaersk@maersk.com',
      req_created: false,
      confirmed_by_vessel: false,
      confirmed_by_box: false,
      min_soa: { port: 'USNFK', value: true, comments: '' }
    },
    {
      ack: true,
      port: 'USNWK',
      hsfo_max_lift: '4934',
      hsfo_estd_soa: '465',
      hsfo_estd_cons: '0',
      hasfo_plan_lift: '3809',
      hsfo_safe_port: '',
      seca_estd_cons: '0',
      seca_safe_port: '',
      ulsfo_max_lift_wo: '252',
      ulsfo_max_lift_w: '1275',
      ulsfo_estd_soa: '283',
      ulsfo_plan_lift: '0',
      lsdis_max_lift: '130',
      lsdis_estd_soa: '68',
      lsdis_estd_cons: '0',
      lsdis_plan_lift: '200',
      lsdis_safe_port: '',
      total_min_sod: { port: 'USNWK', value: '', comments: '' },
      min_hsfo_sod: { port: 'USNWK', value: '', comments: '' },
      min_eca_bunker_sod: { port: 'USNWK', value: '', comments: '' },
      total_max_sod: { port: 'USNWK', value: '', comments: '' },
      req_lift: '0',
      email: 'rmaersk@maersk.com',
      req_created: false,
      confirmed_by_vessel: false,
      confirmed_by_box: false,
      min_soa: { port: 'USNWK', value: true, comments: '' }
    },
    {
      ack: true,
      port: 'ESALR',
      hsfo_max_lift: '1665',
      hsfo_estd_soa: '3734',
      hsfo_estd_cons: '540',
      hasfo_plan_lift: '0',
      hsfo_safe_port: '',
      seca_estd_cons: '72',
      seca_safe_port: '',
      ulsfo_max_lift_wo: '92',
      ulsfo_max_lift_w: '1410',
      ulsfo_estd_soa: '148',
      ulsfo_plan_lift: '0',
      lsdis_max_lift: '130',
      lsdis_estd_soa: '68',
      lsdis_estd_cons: '0',
      lsdis_plan_lift: '200',
      lsdis_safe_port: '',
      total_min_sod: { port: 'ESALR', value: '', comments: '' },
      min_hsfo_sod: { port: 'ESALR', value: '', comments: '' },
      min_eca_bunker_sod: { port: 'ESALR', value: '', comments: '' },
      total_max_sod: { port: 'ESALR', value: '', comments: '' },
      req_lift: '0',
      email: 'rmaersk@maersk.com',
      req_created: false,
      confirmed_by_vessel: false,
      confirmed_by_box: false,
      min_soa: { port: 'ESALR', value: true, comments: '' }
    },
    {
      ack: false,
      port: 'EGPSD',
      hsfo_max_lift: '2807',
      hsfo_estd_soa: '3347',
      hsfo_estd_cons: '387',
      hasfo_plan_lift: '0',
      hsfo_safe_port: '',
      seca_estd_cons: '63',
      seca_safe_port: '',
      ulsfo_max_lift_wo: '5',
      ulsfo_max_lift_w: '1764',
      ulsfo_estd_soa: '148',
      ulsfo_plan_lift: '0',
      lsdis_max_lift: '313',
      lsdis_estd_soa: '63',
      lsdis_estd_cons: '5',
      lsdis_plan_lift: '200',
      lsdis_safe_port: '',
      total_min_sod: { port: 'EGPSD', value: '', comments: '' },
      min_hsfo_sod: { port: 'EGPSD', value: '', comments: '' },
      min_eca_bunker_sod: { port: 'EGPSD', value: '', comments: '' },
      total_max_sod: { port: 'EGPSD', value: '', comments: '' },
      req_lift: '0',
      email: 'rmaersk@maersk.com',
      req_created: false,
      confirmed_by_vessel: false,
      confirmed_by_box: false,
      min_soa: { port: 'EGPSD', value: true, comments: '' }
    }
  ];
  // private rowData = [
  //   {
  //     ack: true,
  //     port: 'ESALR',
  //     hsfo_max_lift: '4206',
  //     hsfo_estd_soa: '1193',
  //     hsfo_estd_cons: '571',
  //     hasfo_plan_lift: '100',
  //     hsfo_safe_port: '',
  //     seca_estd_cons: '66',
  //     seca_safe_port: '40',
  //     ulsfo_max_lift_wo: '0',
  //     ulsfo_max_lift_w: '1201',
  //     ulsfo_estd_soa: '300',
  //     ulsfo_plan_lift: '0',
  //     lsdis_max_lift: '200',
  //     lsdis_estd_soa: '50',
  //     lsdis_estd_cons: '0',
  //     lsdis_plan_lift: '200',
  //     lsdis_safe_port: '40',
  //     total_min_sod: '188',
  //     min_hsfo_sod: '90',
  //     min_eca_bunker_sod: '',
  //     total_max_sod: '',
  //     req_lift: '0',
  //     email: 'rmaersk@maersk.com',
  //     req_created: true,
  //     confirmed_by_vessel: false,
  //     confirmed_by_box: true,
  //     min_soa: true
  //   },
  //   {
  //     ack: true,
  //     port: 'USNWK',
  //     hsfo_max_lift: '4934',
  //     hsfo_estd_soa: '465',
  //     hsfo_estd_cons: '828',
  //     hasfo_plan_lift: '0',
  //     hsfo_safe_port: '',
  //     seca_estd_cons: '61',
  //     seca_safe_port: '',
  //     ulsfo_max_lift_wo: '147',
  //     ulsfo_max_lift_w: '1258',
  //     ulsfo_estd_soa: '300',
  //     ulsfo_plan_lift: '260',
  //     lsdis_max_lift: '95',
  //     lsdis_estd_soa: '103',
  //     lsdis_estd_cons: '5',
  //     lsdis_plan_lift: '200',
  //     lsdis_safe_port: '',
  //     total_min_sod: '188',
  //     min_hsfo_sod: '90',
  //     min_eca_bunker_sod: '',
  //     total_max_sod: '',
  //     req_lift: '0',
  //     email: 'rmaersk@maersk.com',
  //     req_created: false,
  //     confirmed_by_vessel: false,
  //     confirmed_by_box: false,
  //     min_soa: true
  //   },
  //   {
  //     ack: false,
  //     port: 'USNCA',
  //     hsfo_max_lift: '4934',
  //     hsfo_estd_soa: '465',
  //     hsfo_estd_cons: '0',
  //     hasfo_plan_lift: '0',
  //     hsfo_safe_port: '',
  //     seca_estd_cons: '44',
  //     seca_safe_port: '',
  //     ulsfo_max_lift_wo: '90',
  //     ulsfo_max_lift_w: '1053',
  //     ulsfo_estd_soa: '505',
  //     ulsfo_plan_lift: '0',
  //     lsdis_max_lift: '130',
  //     lsdis_estd_soa: '68',
  //     lsdis_estd_cons: '0',
  //     lsdis_plan_lift: '200',
  //     lsdis_safe_port: '',
  //     total_min_sod: '4000',
  //     min_hsfo_sod: '',
  //     min_eca_bunker_sod: '',
  //     total_max_sod: '',
  //     req_lift: '0',
  //     email: 'rmaersk@maersk.com',
  //     req_created: false,
  //     confirmed_by_vessel: false,
  //     confirmed_by_box: false,
  //     min_soa: true
  //   },
  //   {
  //     ack: true,
  //     port: 'USSAV',
  //     hsfo_max_lift: '4934',
  //     hsfo_estd_soa: '465',
  //     hsfo_estd_cons: '0',
  //     hasfo_plan_lift: '0',
  //     hsfo_safe_port: '',
  //     seca_estd_cons: '58',
  //     seca_safe_port: '',
  //     ulsfo_max_lift_wo: '16',
  //     ulsfo_max_lift_w: '1069',
  //     ulsfo_estd_soa: '489',
  //     ulsfo_plan_lift: '0',
  //     lsdis_max_lift: '130',
  //     lsdis_estd_soa: '68',
  //     lsdis_estd_cons: '0',
  //     lsdis_plan_lift: '200',
  //     lsdis_safe_port: '',
  //     total_min_sod: '',
  //     min_hsfo_sod: '',
  //     min_eca_bunker_sod: '',
  //     total_max_sod: '',
  //     req_lift: '0',
  //     email: 'rmaersk@maersk.com',
  //     req_created: false,
  //     confirmed_by_vessel: false,
  //     confirmed_by_box: false,
  //     min_soa: true
  //   },
  //   {
  //     ack: true,
  //     port: 'USHOU',
  //     hsfo_max_lift: '4934',
  //     hsfo_estd_soa: '465',
  //     hsfo_estd_cons: '0',
  //     hasfo_plan_lift: '0',
  //     hsfo_safe_port: '',
  //     seca_estd_cons: '187',
  //     seca_safe_port: '',
  //     ulsfo_max_lift_wo: '249',
  //     ulsfo_max_lift_w: '1318',
  //     ulsfo_estd_soa: '240',
  //     ulsfo_plan_lift: '295',
  //     lsdis_max_lift: '130',
  //     lsdis_estd_soa: '68',
  //     lsdis_estd_cons: '0',
  //     lsdis_plan_lift: '200',
  //     lsdis_safe_port: '',
  //     total_min_sod: '',
  //     min_hsfo_sod: '',
  //     min_eca_bunker_sod: '',
  //     total_max_sod: '',
  //     req_lift: '0',
  //     email: 'rmaersk@maersk.com',
  //     req_created: false,
  //     confirmed_by_vessel: false,
  //     confirmed_by_box: false,
  //     min_soa: true
  //   },
  //   {
  //     ack: false,
  //     port: 'USNFK',
  //     hsfo_max_lift: '4934',
  //     hsfo_estd_soa: '465',
  //     hsfo_estd_cons: '0',
  //     hasfo_plan_lift: '0',
  //     hsfo_safe_port: '',
  //     seca_estd_cons: '78',
  //     seca_safe_port: '',
  //     ulsfo_max_lift_wo: '252',
  //     ulsfo_max_lift_w: '1275',
  //     ulsfo_estd_soa: '283',
  //     ulsfo_plan_lift: '0',
  //     lsdis_max_lift: '130',
  //     lsdis_estd_soa: '68',
  //     lsdis_estd_cons: '0',
  //     lsdis_plan_lift: '200',
  //     lsdis_safe_port: '',
  //     total_min_sod: '',
  //     min_hsfo_sod: '',
  //     min_eca_bunker_sod: '',
  //     total_max_sod: '',
  //     req_lift: '0',
  //     email: 'rmaersk@maersk.com',
  //     req_created: false,
  //     confirmed_by_vessel: false,
  //     confirmed_by_box: false,
  //     min_soa: true
  //   },
  //   {
  //     ack: true,
  //     port: 'USNWK',
  //     hsfo_max_lift: '4934',
  //     hsfo_estd_soa: '465',
  //     hsfo_estd_cons: '0',
  //     hasfo_plan_lift: '3809',
  //     hsfo_safe_port: '',
  //     seca_estd_cons: '0',
  //     seca_safe_port: '',
  //     ulsfo_max_lift_wo: '252',
  //     ulsfo_max_lift_w: '1275',
  //     ulsfo_estd_soa: '283',
  //     ulsfo_plan_lift: '0',
  //     lsdis_max_lift: '130',
  //     lsdis_estd_soa: '68',
  //     lsdis_estd_cons: '0',
  //     lsdis_plan_lift: '200',
  //     lsdis_safe_port: '',
  //     total_min_sod: '',
  //     min_hsfo_sod: '',
  //     min_eca_bunker_sod: '',
  //     total_max_sod: '',
  //     req_lift: '0',
  //     email: 'rmaersk@maersk.com',
  //     req_created: false,
  //     confirmed_by_vessel: false,
  //     confirmed_by_box: false,
  //     min_soa: true
  //   },
  //   {
  //     ack: true,
  //     port: 'ESALR',
  //     hsfo_max_lift: '1665',
  //     hsfo_estd_soa: '3734',
  //     hsfo_estd_cons: '540',
  //     hasfo_plan_lift: '0',
  //     hsfo_safe_port: '',
  //     seca_estd_cons: '72',
  //     seca_safe_port: '',
  //     ulsfo_max_lift_wo: '92',
  //     ulsfo_max_lift_w: '1410',
  //     ulsfo_estd_soa: '148',
  //     ulsfo_plan_lift: '0',
  //     lsdis_max_lift: '130',
  //     lsdis_estd_soa: '68',
  //     lsdis_estd_cons: '0',
  //     lsdis_plan_lift: '200',
  //     lsdis_safe_port: '',
  //     total_min_sod: '',
  //     min_hsfo_sod: '',
  //     min_eca_bunker_sod: '',
  //     total_max_sod: '',
  //     req_lift: '0',
  //     email: 'rmaersk@maersk.com',
  //     req_created: false,
  //     confirmed_by_vessel: false,
  //     confirmed_by_box: false,
  //     min_soa: true
  //   },
  //   {
  //     ack: false,
  //     port: 'EGPSD',
  //     hsfo_max_lift: '2807',
  //     hsfo_estd_soa: '3347',
  //     hsfo_estd_cons: '387',
  //     hasfo_plan_lift: '0',
  //     hsfo_safe_port: '',
  //     seca_estd_cons: '63',
  //     seca_safe_port: '',
  //     ulsfo_max_lift_wo: '5',
  //     ulsfo_max_lift_w: '1764',
  //     ulsfo_estd_soa: '148',
  //     ulsfo_plan_lift: '0',
  //     lsdis_max_lift: '313',
  //     lsdis_estd_soa: '63',
  //     lsdis_estd_cons: '5',
  //     lsdis_plan_lift: '200',
  //     lsdis_safe_port: '',
  //     total_min_sod: '',
  //     min_hsfo_sod: '',
  //     min_eca_bunker_sod: '',
  //     total_max_sod: '',
  //     req_lift: '0',
  //     email: 'rmaersk@maersk.com',
  //     req_created: false,
  //     confirmed_by_vessel: false,
  //     confirmed_by_box: false,
  //     min_soa: true
  //   },
  //   {
  //     ack: true,
  //     port: 'USHOU',
  //     hsfo_max_lift: '4934',
  //     hsfo_estd_soa: '465',
  //     hsfo_estd_cons: '0',
  //     hasfo_plan_lift: '0',
  //     hsfo_safe_port: '',
  //     seca_estd_cons: '187',
  //     seca_safe_port: '',
  //     ulsfo_max_lift_wo: '249',
  //     ulsfo_max_lift_w: '1318',
  //     ulsfo_estd_soa: '240',
  //     ulsfo_plan_lift: '295',
  //     lsdis_max_lift: '130',
  //     lsdis_estd_soa: '68',
  //     lsdis_estd_cons: '0',
  //     lsdis_plan_lift: '200',
  //     lsdis_safe_port: '',
  //     total_min_sod: '',
  //     min_hsfo_sod: '',
  //     min_eca_bunker_sod: '',
  //     total_max_sod: '',
  //     req_lift: '0',
  //     email: 'rmaersk@maersk.com',
  //     req_created: false,
  //     confirmed_by_vessel: false,
  //     confirmed_by_box: false,
  //     min_soa: true
  //   },
  //   {
  //     ack: false,
  //     port: 'USNFK',
  //     hsfo_max_lift: '4934',
  //     hsfo_estd_soa: '465',
  //     hsfo_estd_cons: '0',
  //     hasfo_plan_lift: '0',
  //     hsfo_safe_port: '',
  //     seca_estd_cons: '78',
  //     seca_safe_port: '',
  //     ulsfo_max_lift_wo: '252',
  //     ulsfo_max_lift_w: '1275',
  //     ulsfo_estd_soa: '283',
  //     ulsfo_plan_lift: '0',
  //     lsdis_max_lift: '130',
  //     lsdis_estd_soa: '68',
  //     lsdis_estd_cons: '0',
  //     lsdis_plan_lift: '200',
  //     lsdis_safe_port: '',
  //     total_min_sod: '',
  //     min_hsfo_sod: '',
  //     min_eca_bunker_sod: '',
  //     total_max_sod: '',
  //     req_lift: '0',
  //     email: 'rmaersk@maersk.com',
  //     req_created: false,
  //     confirmed_by_vessel: false,
  //     confirmed_by_box: false,
  //     min_soa: true
  //   },
  //   {
  //     ack: true,
  //     port: 'USNWK',
  //     hsfo_max_lift: '4934',
  //     hsfo_estd_soa: '465',
  //     hsfo_estd_cons: '0',
  //     hasfo_plan_lift: '3809',
  //     hsfo_safe_port: '',
  //     seca_estd_cons: '0',
  //     seca_safe_port: '',
  //     ulsfo_max_lift_wo: '252',
  //     ulsfo_max_lift_w: '1275',
  //     ulsfo_estd_soa: '283',
  //     ulsfo_plan_lift: '0',
  //     lsdis_max_lift: '130',
  //     lsdis_estd_soa: '68',
  //     lsdis_estd_cons: '0',
  //     lsdis_plan_lift: '200',
  //     lsdis_safe_port: '',
  //     total_min_sod: '',
  //     min_hsfo_sod: '',
  //     min_eca_bunker_sod: '',
  //     total_max_sod: '',
  //     req_lift: '0',
  //     email: 'rmaersk@maersk.com',
  //     req_created: false,
  //     confirmed_by_vessel: false,
  //     confirmed_by_box: false,
  //     min_soa: true
  //   },
  //   {
  //     ack: true,
  //     port: 'ESALR',
  //     hsfo_max_lift: '1665',
  //     hsfo_estd_soa: '3734',
  //     hsfo_estd_cons: '540',
  //     hasfo_plan_lift: '0',
  //     hsfo_safe_port: '',
  //     seca_estd_cons: '72',
  //     seca_safe_port: '',
  //     ulsfo_max_lift_wo: '92',
  //     ulsfo_max_lift_w: '1410',
  //     ulsfo_estd_soa: '148',
  //     ulsfo_plan_lift: '0',
  //     lsdis_max_lift: '130',
  //     lsdis_estd_soa: '68',
  //     lsdis_estd_cons: '0',
  //     lsdis_plan_lift: '200',
  //     lsdis_safe_port: '',
  //     total_min_sod: '',
  //     min_hsfo_sod: '',
  //     min_eca_bunker_sod: '',
  //     total_max_sod: '',
  //     req_lift: '0',
  //     email: 'rmaersk@maersk.com',
  //     req_created: false,
  //     confirmed_by_vessel: false,
  //     confirmed_by_box: false,
  //     min_soa: true
  //   },
  //   {
  //     ack: false,
  //     port: 'EGPSD',
  //     hsfo_max_lift: '2807',
  //     hsfo_estd_soa: '3347',
  //     hsfo_estd_cons: '387',
  //     hasfo_plan_lift: '0',
  //     hsfo_safe_port: '',
  //     seca_estd_cons: '63',
  //     seca_safe_port: '',
  //     ulsfo_max_lift_wo: '5',
  //     ulsfo_max_lift_w: '1764',
  //     ulsfo_estd_soa: '148',
  //     ulsfo_plan_lift: '0',
  //     lsdis_max_lift: '313',
  //     lsdis_estd_soa: '63',
  //     lsdis_estd_cons: '5',
  //     lsdis_plan_lift: '200',
  //     lsdis_safe_port: '',
  //     total_min_sod: '',
  //     min_hsfo_sod: '',
  //     min_eca_bunker_sod: '',
  //     total_max_sod: '',
  //     req_lift: '0',
  //     email: 'rmaersk@maersk.com',
  //     req_created: false,
  //     confirmed_by_vessel: false,
  //     confirmed_by_box: false,
  //     min_soa: true
  //   }
  // ];

}

