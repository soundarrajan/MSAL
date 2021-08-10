import { DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { GridOptions } from 'ag-grid-community';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ShiptechCustomHeaderGroup } from '../../../../../core/ag-grid/shiptech-custom-header-group';
import { AGGridCellRendererV2Component } from '../../../../../core/ag-grid/ag-grid-cell-rendererv2.component';
import { AGGridCellActionsComponent } from '../../../../../core/ag-grid/ag-grid-cell-actions.component';
import { LocalService } from '../../../../../services/local-service.service';

@Component({
  selector: 'app-spot-negotiation-details',
  templateUrl: './spot-negotiation-details.component.html',
  styleUrls: ['./spot-negotiation-details.component.css']
})
export class SpotNegotiationDetailsComponent implements OnInit {
  @ViewChild('inputSection') inputSection: ElementRef;
  today = new FormControl(new Date());
  public ETASelect: any;
  public gridOptions_counterparty: GridOptions;
  public gridOptions_details: GridOptions;
  public rowSelection;
  public rowCount: Number;
  public counterpartyHeaderWidth;
  public expandGridHeaderWidth;
  public totalOfferHeaderWidth;
  public fullHeaderWidth;
  public frameworkComponents;
  private context: any;
  rowData_aggrid = [];
  public grid1Width = {
    width: '100%'
  };
  menuOptions = [{ label: 'ETA' }, { label: 'ETB' }, { label: 'ETD' }];
  // public grid2Width = {
  //   width: '50%'
  // }
  ngOnInit(): void {}

  //   ngAfterViewInit() {
  //     setTimeout(()=>{
  //         this.inputSection.nativeElement.focus();
  //       },3000);
  // }

  constructor(
    @Inject(DOCUMENT) private _document: HTMLDocument,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private localService: LocalService
  ) {
    this.context = { componentParent: this };
    this.rowSelection = 'single';
    this.gridOptions_counterparty = <GridOptions>{
      enableColResize: true,
      defaultColDef: {
        resizable: true,
        filter: true,
        sortable: false
      },
      columnDefs: this.columnDef_aggrid,
      suppressCellSelection: true,
      headerHeight: 30,
      groupHeaderHeight: 80,
      rowHeight: 35,
      animateRows: false,
      onFirstDataRendered(params) {
        params.api.sizeColumnsToFit();
      },
      rowSelection: 'single',
      onGridReady: params => {
        this.gridOptions_counterparty.api = params.api;
        this.gridOptions_counterparty.columnApi = params.columnApi;
        this.gridOptions_counterparty.api.setRowData(this.rowData_aggrid);
        this.gridOptions_counterparty.api.sizeColumnsToFit();
        this.rowCount = this.gridOptions_counterparty.api.getDisplayedRowCount();
        params.api.sizeColumnsToFit();
        this.counterpartyHeaderWidth =
          params.columnApi.getColumn('check').getActualWidth() +
          params.columnApi.getColumn('name').getActualWidth() +
          params.columnApi.getColumn('genRating').getActualWidth() +
          params.columnApi.getColumn('portRating').getActualWidth() +
          params.columnApi.getColumn('phySupplier').getActualWidth();
        this.expandGridHeaderWidth =
          params.columnApi.getColumn('check1').getActualWidth() +
          params.columnApi.getColumn('offPrice1').getActualWidth() +
          params.columnApi.getColumn('offPrice2').getActualWidth() +
          params.columnApi.getColumn('offPrice3').getActualWidth() +
          params.columnApi.getColumn('tPr').getActualWidth() +
          params.columnApi.getColumn('diff').getActualWidth() +
          //params.columnApi.getColumn("mj").getActualWidth()+
          //params.columnApi.getColumn("tco").getActualWidth()+
          //params.columnApi.getColumn("ediff").getActualWidth()+
          params.columnApi.getColumn('amt').getActualWidth();
        this.totalOfferHeaderWidth = params.columnApi
          .getColumn('totalOffer')
          .getActualWidth();
        //this.groupHeaderCheck();
      },

      onColumnResized: function(params) {
        //params.api.sizeColumnsToFit();
        //alert("");
        //this.resizeGrid();
        // if (params.columnApi.getAllDisplayedColumns().length <= 8 && params.type === 'columnResized' && params.finished === true && params.source === 'uiColumnDragged') {
        //   //params.api.sizeColumnsToFit();
        // }
      },
      onColumnVisible: function(params) {
        if (params.columnApi.getAllDisplayedColumns().length <= 8) {
          params.api.sizeColumnsToFit();
        }
        params.api.sizeColumnsToFit();
      },
      frameworkComponents: {
        customHeaderGroupComponent: ShiptechCustomHeaderGroup
      }
    };

    this.localService.getSpotDataJSON().subscribe((res: any) => {
      this.rowData_aggrid = res;
      this.gridOptions_counterparty.api.setRowData(this.rowData_aggrid);
    });
  }

  private rowClassRules = {
    customRowClass: function(params) {
      var offPrice = params.data.offPrice1;
      return offPrice == 100;
    },
    'display-no-quote': function(params) {
      var offPrice = params.data.isQuote;
      return offPrice == 'No quote';
    }
  };

  private columnDef_aggrid = [
    {
      headerName: 'counterparty',
      headerTooltip: '',
      resizable: false,
      marryChildren: true,
      headerClass: 'plain-header-fullwidth',
      headerGroupComponent: 'customHeaderGroupComponent',
      headerGroupComponentParams: {
        type: 'plain-header'
      },
      children: [
        {
          headerName: '',
          field: 'check',
          filter: true,
          suppressMenu: true,
          maxWidth: 35,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          resizable: false,
          // suppressMovable: true,
          suppressNavigable: true,
          lockPosition: true,
          pinned: 'left',
          headerClass: 'header-checkbox-center checkbox-center ag-checkbox-v2',
          cellClass: 'p-1 checkbox-center ag-checkbox-v2',
          cellRendererFramework: AGGridCellActionsComponent,
          cellRendererParams: { type: 'row-remove-icon-cell-hover' }
          //pinned: 'left'
        },
        {
          headerName: 'Name',
          headerTooltip: 'Name',
          field: 'name',
          width: 520,
          cellClass: 'suppress-movable-col remove-option hoverCell',
          pinned: 'left',
          headerClass: 'm-l-7',
          suppressNavigable: true,
          lockPosition: true,
          cellStyle: { overflow: 'visible' },
          cellRendererFramework: AGGridCellRendererV2Component,
          cellRendererParams: {
            label: 'hover-cell-lookup',
            type: 'hover-cell-lookup',
            cellClass: ''
          }
        },
        {
          headerName: 'Gen. Rating',
          headerTooltip: 'Gen. Rating',
          suppressNavigable: true,
          lockPosition: true,
          pinned: 'left',
          field: 'genRating',
          width: 200,
          cellClass: 'aggridtextalign-center',
          cellRendererFramework: AGGridCellRendererV2Component,
          cellRendererParams: {
            label: 'gen-rating',
            type: 'rating-chip',
            cellClass: 'rating-chip'
          }
        },
        {
          headerName: 'Port Rating',
          headerTooltip: 'Port Rating',
          suppressNavigable: true,
          lockPosition: true,
          pinned: 'left',
          field: 'portRating',
          width: 200,
          cellClass: 'aggridtextalign-center',
          cellRendererFramework: AGGridCellRendererV2Component,
          cellRendererParams: {
            label: 'port-rating',
            type: 'rating-chip',
            cellClass: 'rating-chip'
          }
        },
        {
          headerName: 'Phy. Supplier',
          headerTooltip: 'Phy. Supplier',
          suppressNavigable: true,
          lockPosition: true,
          pinned: 'left',
          headerClass: 'border-right',
          field: 'phySupplier',
          width: 200,
          cellClass: 'line-seperator-pinned',
          cellRendererFramework: AGGridCellRendererV2Component,
          cellRendererParams: { type: 'phy-supplier' }
        }
      ]
    },
    {
      headerName: '',
      headerTooltip: '',
      resizable: false,
      marryChildren: true,
      headerGroupComponent: 'customHeaderGroupComponent',
      headerGroupComponentParams: {
        type: 'single-bg-header'
      },
      children: [
        {
          headerName: '',
          headerTooltip: '',
          field: 'totalOffer',
          tooltipField: '',
          width: 150,
          headerClass: 'border-right',
          cellClass: 'line-seperator',
          cellRendererFramework: AGGridCellRendererV2Component,
          cellRendererParams: { type: 'totalOffer', cellClass: '' }
          //suppressNavigable: true,lockPosition: true, pinned:'left',
        }
      ]
    },
    {
      headerName: '',
      headerTooltip: '',
      headerGroupComponent: 'customHeaderGroupComponent',
      headerGroupComponentParams: {
        type: 'bg-header'
      },
      marryChildren: true,
      resizable: false,
      name: 'grid1',
      groupId: 'grid1',

      children: [
        {
          headerName: '',
          field: 'check1',
          filter: true,
          suppressMenu: true,
          width: 35,
          //headerComponentParams: { template: '<input type="checkbox" class="groupHeaderCheckBox">' },
          //   headerCheckboxSelection: function(params) {
          //     // var displayedColumns = params.columnApi.getAllDisplayedColumns();
          //     // var thisIsFirstColumn = displayedColumns[0] === params.column;
          //     // return thisIsFirstColumn;
          //     alert("");
          // },
          //checkboxSelection: true,
          resizable: false,
          suppressMovable: true,
          headerClass: 'header-checkbox-center checkbox-center ag-checkbox-v2',
          cellClass:
            'p-1 checkbox-center ag-checkbox-v2 grey-opacity-cell pad-lr-0 mat-check-center',

          cellRendererFramework: AGGridCellRendererV2Component,
          cellRendererParams: { type: 'mat-check-box' }

          //pinned: 'left'
        },
        {
          headerName: 'Offer price',
          headerTooltip: 'Offer price',
          field: 'offPrice1',
          width: 260,
          cellClass: 'hoverCell grey-opacity-cell pad-lr-0',
          cellRendererFramework: AGGridCellRendererV2Component,
          cellRendererParams: {
            label: 'price-calc',
            type: 'price-calc',
            cellClass: ''
          }
        },
        {
          headerName: 'T.Pr.($)',
          headerTooltip: 'T.Pr.($)',
          field: 'tPr',
          width: 150,
          cellClass: 'grey-opacity-cell pad-lr-0',
          cellRendererFramework: AGGridCellRendererV2Component,
          cellRendererParams: { type: 'addTpr', cellClass: '' }
        },
        {
          headerName: 'Amt ($)',
          headerTooltip: 'Amt ($)',
          field: 'amt',
          width: 150,
          cellClass: 'grey-opacity-cell pad-lr-0'
        },
        {
          headerName: 'Tar. diff',
          headerTooltip: 'Tar. diff',
          field: 'diff',
          width: 150,
          headerClass: 'border-right',
          cellClass: 'line-seperator grey-opacity-cell pad-lr-0'
        },
        {
          headerName: 'MJ/KJ',
          headerTooltip: 'MJ/KJ',
          field: 'mj',
          width: 150,
          columnGroupShow: 'open',
          cellClass: 'grey-opacity-cell pad-lr-0'
        },
        {
          headerName: 'TCO ($)',
          headerTooltip: 'TCO ($)',
          field: 'tco',
          width: 150,
          columnGroupShow: 'open',
          cellClass: 'grey-opacity-cell pad-lr-0'
        },
        {
          headerName: 'E. diff',
          headerTooltip: 'E. diff',
          field: 'ediff',
          width: 150,
          columnGroupShow: 'open',
          headerClass: 'border-right',
          cellClass: 'line-seperator grey-opacity-cell pad-lr-5'
        }
      ]
    },
    {
      headerName: '',
      headerTooltip: '',
      headerGroupComponent: 'customHeaderGroupComponent',
      headerGroupComponentParams: {
        type: 'bg-header'
      },
      marryChildren: true,
      resizable: false,
      name: 'grid2',
      groupId: 'grid2',

      children: [
        {
          headerName: '',
          field: 'check2',
          filter: true,
          suppressMenu: true,
          width: 35,
          //headerCheckboxSelection: true,
          //checkboxSelection: true,
          resizable: false,
          suppressMovable: true,
          headerClass: 'header-checkbox-center checkbox-center ag-checkbox-v2',
          cellClass:
            'p-1 checkbox-center ag-checkbox-v2 pad-lr-0 mat-check-center',

          cellRendererFramework: AGGridCellRendererV2Component,
          cellRendererParams: { type: 'mat-check-box' }
          //  cellRendererFramework: AGGridCellRendererV2Component,
          // cellRendererParams: { type: 'mat-check-box'},
          // valueGetter: function(params) {
          //   if(params.check1== true){

          //   params.check2 == params.check1;
          //   return params.check1;

          //   }
          // },

          //pinned: 'left'
        },
        {
          headerName: 'Offer price',
          headerTooltip: 'Offer price',
          field: 'offPrice2',
          width: 260,
          cellClass: 'hoverCell',
          cellRendererFramework: AGGridCellRendererV2Component,
          cellRendererParams: {
            label: 'price-calc',
            type: 'price-calc',
            cellClass: ''
          }
        },
        //  {
        //   headerName: 'Operator',
        //   checkboxSelection: false,
        //   headerCheckboxSelection: false,
        //   filter: false,
        //   sortable: false,
        //   field: 'operator',
        //   cellRenderer: function(params) {
        //     let operatorValue = params.value;
        //     const input = document.createElement('input');
        //     input.type = 'checkbox';
        //     if (operatorValue) {
        //         input.checked = true;
        //         params.data.operator = true;
        //         params.data.check1 = true;
        //     } else {
        //         input.checked = false;
        //         params.data.operator = false;
        //     }
        //     input.addEventListener('click', function (event) {
        //       input.checked != input.checked;
        //       params.data.operator  = input.checked;
        //       params.data.check1 = input.checked;
        //     });
        //     return input;
        // }
        // },

        {
          headerName: 'T.Pr.($)',
          headerTooltip: 'T.Pr.($)',
          field: 'tPr',
          width: 150
        },
        {
          headerName: 'Amt ($)',
          headerTooltip: 'Amt ($)',
          field: 'amt',
          width: 150
        },
        {
          headerName: 'Tar. diff',
          headerTooltip: 'Tar. diff',
          field: 'diff',
          width: 150,
          headerClass: 'border-right',
          cellClass: 'line-seperator'
        },
        {
          headerName: 'MJ/KJ',
          headerTooltip: 'MJ/KJ',
          field: 'mj1',
          width: 150,
          columnGroupShow: 'open'
        },
        {
          headerName: 'TCO ($)',
          headerTooltip: 'TCO ($)',
          field: 'tco1',
          width: 150,
          columnGroupShow: 'open'
        },
        {
          headerName: 'E. diff',
          headerTooltip: 'E. diff',
          field: 'ediff1',
          width: 150,
          columnGroupShow: 'open',
          headerClass: 'border-right',
          cellClass: 'line-seperator'
        }
      ]
    },
    {
      headerName: '',
      headerTooltip: '',
      headerGroupComponent: 'customHeaderGroupComponent',
      headerGroupComponentParams: {
        type: 'bg-header'
      },
      marryChildren: true,
      resizable: false,
      name: 'grid3',
      groupId: 'grid3',
      children: [
        {
          headerName: '',
          field: 'check3',
          filter: true,
          suppressMenu: true,
          width: 35,
          //headerCheckboxSelection: true,
          //checkboxSelection: true,
          resizable: false,
          suppressMovable: true,
          headerClass: 'header-checkbox-center checkbox-center ag-checkbox-v2',
          cellClass:
            'p-1 checkbox-center ag-checkbox-v2 pad-lr-0 mat-check-center',

          cellRendererFramework: AGGridCellRendererV2Component,
          cellRendererParams: { type: 'mat-check-box' }
          //  cellRendererFramework: AGGridCellRendererV2Component,
          // cellRendererParams: { type: 'mat-check-box'}

          //pinned: 'left'
        },
        {
          headerName: 'Offer price',
          headerTooltip: 'Offer price',
          field: 'offPrice3',
          width: 260,
          cellClass: 'hoverCell',
          cellRendererFramework: AGGridCellRendererV2Component,
          cellRendererParams: {
            label: 'price-calc',
            type: 'price-calc',
            cellClass: ''
          }
        },
        {
          headerName: 'T.Pr.($)',
          headerTooltip: 'T.Pr.($)',
          field: 'tPr',
          width: 150
        },
        {
          headerName: 'Amt ($)',
          headerTooltip: 'Amt ($)',
          field: 'amt',
          width: 150
        },
        {
          headerName: 'Tar. diff',
          headerTooltip: 'Tar. diff',
          field: 'diff',
          width: 150,
          headerClass: 'border-right',
          cellClass: 'line-seperator'
        },
        {
          headerName: 'MJ/KJ',
          headerTooltip: 'MJ/KJ',
          field: 'mj1',
          width: 150,
          columnGroupShow: 'open'
        },
        {
          headerName: 'TCO ($)',
          headerTooltip: 'TCO ($)',
          field: 'tco1',
          width: 150,
          columnGroupShow: 'open'
        },
        {
          headerName: 'E. diff',
          headerTooltip: 'E. diff',
          field: 'ediff2',
          width: 150,
          columnGroupShow: 'open',
          headerClass: 'border-right',
          cellClass: 'line-seperator'
        }
      ]
    }
  ];
  //  private columnDef_details = [
  //   {
  //     headerName: '', headerTooltip: '', field: 'totalOffer',  tooltipField: '',width:150,pinned: 'left'
  //   },
  //   {
  //     headerName: '',
  //     field: '',
  //     filter: true,
  //     suppressMenu: true,
  //     width: 35,
  //     //headerCheckboxSelection: true,
  //     checkboxSelection: true,
  //     resizable: false,
  //     suppressMovable: true,
  //     headerClass: 'header-checkbox-center checkbox-center ag-checkbox-v2',
  //     cellClass: 'p-1 checkbox-center ag-checkbox-v2',
  //     pinned: 'left'
  //   },
  //   {
  //     headerName: 'Offer price', headerTooltip: 'Offer price', field: 'offPrice',width:150
  //    },
  //    {
  //     headerName: 'T.Pr.($)', headerTooltip: 'T.Pr.($)', field: 'tPr',width:150
  //    },
  //    {
  //     headerName: 'Amt ($)', headerTooltip: 'Amt ($)', field: 'amt',width:150
  //    },
  //    {
  //     headerName: 'Tar. diff', headerTooltip: 'Tar. diff', field: 'diff',width:150
  //    },

  //  ];

  //    public rowData_aggrid = [
  //      {name:'Total Marine Fuel',counterpartytype:'seller',operator:'',mail:'mail-active',genRating:'4.2',genPrice:'$9.4',portRating:'4.2',portPrice:'$9.8',phySupplier:'Add P. supplier',totalOffer:'$500.00',offPrice1:'100.00',offPrice2: '-', offPrice3: '-', tPr:'-',amt:'-',diff:'-',check:'',check1:'',check2:'',check3:'',mj:'41',mj1:'41',tco:'4,48,152.00',ediff:'1.19',tco1:'4,48,152.00',ediff1:'1.19',infoIcon:'Yes', commentIcon:'Yes'},
  //      {name:'Mitsui & co petroleum',counterpartytype:'broker',mail:'mail-inactive',genRating:'4.2',genPrice:'$9.4',portRating:'4.2',portPrice:'$9.8',phySupplier:'Add P. supplier',totalOffer:'-',offPrice1:'550.00',offPrice2: '-', offPrice3: '-', tPr:'-',amt:'-',diff:'-',check:'',check1:'',check2:'',check3:'',mj:'41',mj1:'41',tco:'4,48,152.00',ediff:'1.19',tco1:'4,48,152.00',ediff1:'1.19',infoIcon:'Yes', commentIcon:''},
  //      {name:'Phillip 66',counterpartytype:'physicalsupplier',mail:'mail-none',genRating:'4.2',genPrice:'$9.4',portRating:'4.2',portPrice:'$9.8',phySupplier:'Add P. supplier',totalOffer:'-',offPrice1:'0',offPrice2: '', offPrice3: '',tPr:'',amt:'',diff:'',check:'',check1:'',check2:'',check3:'',mj:'',mj1:'',tco:'',ediff:'',tco1:'',ediff1:'',infoIcon:'Yes', commentIcon:'No',isQuote: 'No quote'},
  //      {name:'Total Marine Fuel',counterpartytype:'seller',mail:'mail-active',genRating:'4.2',genPrice:'$9.4',portRating:'4.2',portPrice:'$9.8',phySupplier:'Add P. supplier',totalOffer:'-',offPrice1:'-',offPrice2: '-', offPrice3: '-',tPr:'-',amt:'-',diff:'-',check:'',check1:'',check2:'',check3:'',mj:'41',mj1:'41',tco:'4,48,152.00',ediff:'1.19',tco1:'4,48,152.00',ediff1:'1.19',infoIcon:'No', commentIcon:'Yes'},
  //      {name:'Total Marine Fuel',counterpartytype:'broker',mail:'mail-inactive',genRating:'4.2',genPrice:'$9.4',portRating:'4.2',portPrice:'$9.8',phySupplier:'Add P. supplier',totalOffer:'-',offPrice1:'-',offPrice2: '-', offPrice3: '-',tPr:'-',amt:'-',diff:'-',check:'',check1:'preferred',check2:'',check3:'',preferred:true,mj:'41',mj1:'41',tco:'4,48,152.00',ediff:'1.19',tco1:'4,48,152.00',ediff1:'1.19',infoIcon:'No', commentIcon:'No'},
  //      {name:'Total Marine Fuel',counterpartytype:'physicalsupplier',mail:'mail-active',genRating:'4.2',genPrice:'$9.4',portRating:'4.2',portPrice:'$9.8',phySupplier:'Add P. supplier',totalOffer:'-',offPrice1:'-',offPrice2: '-', offPrice3: '-',tPr:'-',amt:'-',diff:'-',check:'',check1:'',check2:'preferred',check3:'',mj:'41',mj1:'41',tco:'4,48,152.00',ediff:'1.19',tco1:'4,48,152.00',ediff1:'1.19',infoIcon:'No', commentIcon:'No'},
  //      {name:'Total Marine Fuel',counterpartytype:'seller',mail:'mail-inactive',genRating:'4.2',genPrice:'$9.4',portRating:'4.2',portPrice:'$9.8',phySupplier:'Add P. supplier',totalOffer:'-',offPrice1:'-',offPrice2: '-', offPrice3: '-',tPr:'-',amt:'-',diff:'-',check:'',check1:'',check2:'',check3:'preferred',mj:'41',mj1:'41',tco:'4,48,152.00',ediff:'1.19',tco1:'4,48,152.00',ediff1:'1.19',infoIcon:'No', commentIcon:'Yes'},
  //      {name:'Total Marine Fuel',counterpartytype:'physicalsupplier',mail:'mail-active',genRating:'4.2',genPrice:'$9.4',portRating:'4.2',portPrice:'$9.8',phySupplier:'Add P. supplier',totalOffer:'-',offPrice1:'-',offPrice2: '-', offPrice3: '-',tPr:'-',amt:'-',diff:'-',check:'',check1:'',check2:'',check3:'',mj:'41',mj1:'41',tco:'4,48,152.00',ediff:'1.19',tco1:'4,48,152.00',ediff1:'1.19',infoIcon:'No', commentIcon:'None'},
  //      {name:'Total Marine Fuel',counterpartytype:'broker',mail:'mail-inactive',genRating:'4.2',genPrice:'$9.4',portRating:'4.2',portPrice:'$9.8',phySupplier:'Add P. supplier',totalOffer:'-',offPrice1:'-',offPrice2: '-', offPrice3: '-',tPr:'-',amt:'-',diff:'-',check:'',check1:'',check2:'',check3:'',mj:'41',mj1:'41',tco:'4,48,152.00',ediff:'1.19',tco1:'4,48,152.00',ediff1:'1.19',infoIcon:'No', commentIcon:'Yes'},
  //      {name:'Total Marine Fuel',counterpartytype:'seller',mail:'mail-none',genRating:'4.2',genPrice:'$9.4',portRating:'4.2',portPrice:'$9.8',phySupplier:'Add P. supplier',totalOffer:'-',offPrice1:'-',offPrice2: '-', offPrice3: '-',tPr:'-',amt:'-',diff:'-',check:'',check1:'',check2:'',check3:'',mj:'41',mj1:'41',tco:'4,48,152.00',ediff:'1.19',tco1:'4,48,152.00',ediff1:'1.19',infoIcon:'No', commentIcon:'No'},
  //      {name:'Total Marine Fuel',counterpartytype:'physicalsupplier',mail:'mail-active',genRating:'4.2',genPrice:'$9.4',portRating:'4.2',portPrice:'$9.8',phySupplier:'Add P. supplier',totalOffer:'-',offPrice1:'-',offPrice2: '-', offPrice3: '-',tPr:'-',amt:'-',diff:'-',check:'',check1:'',check2:'',check3:'',mj:'41',mj1:'41',tco:'4,48,152.00',ediff:'1.19',tco1:'4,48,152.00',ediff1:'1.19',infoIcon:'No', commentIcon:'Yes'},
  //      {name:'Total Marine Fuel',counterpartytype:'broker',mail:'mail-inactive',genRating:'4.2',genPrice:'$9.4',portRating:'4.2',portPrice:'$9.8',phySupplier:'Add P. supplier',totalOffer:'-',offPrice1:'-',offPrice2: '-', offPrice3: '-',tPr:'-',amt:'-',diff:'-',check:'',check1:'',check2:'',check3:'',mj:'41',mj1:'41',tco:'4,48,152.00',ediff:'1.19',tco1:'4,48,152.00',ediff1:'1.19',infoIcon:'No', commentIcon:'Yes'},
  //      {name:'Total Marine Fuel',counterpartytype:'seller',mail:'mail-none',genRating:'4.2',genPrice:'$9.4',portRating:'4.2',portPrice:'$9.8',phySupplier:'Add P. supplier',totalOffer:'-',offPrice1:'-',offPrice2: '-', offPrice3: '-',tPr:'-',amt:'-',diff:'-',check:'',check1:'',check2:'',check3:'',mj:'41',mj1:'41',tco:'4,48,152.00',ediff:'1.19',tco1:'4,48,152.00',ediff1:'1.19',infoIcon:'No', commentIcon:'No'},
  //      {name:'Total Marine Fuel',counterpartytype:'physicalsupplier',mail:'mail-active',genRating:'4.2',genPrice:'$9.4',portRating:'4.2',portPrice:'$9.8',phySupplier:'Add P. supplier',totalOffer:'-',offPrice1:'-',offPrice2: '-', offPrice3: '-',tPr:'-',amt:'-',diff:'-',check:'',check1:'',check2:'',check3:'',mj:'41',mj1:'41',tco:'4,48,152.00',ediff:'1.19',tco1:'4,48,152.00',ediff1:'1.19',infoIcon:'No', commentIcon:''},
  //      {name:'Total Marine Fuel',counterpartytype:'broker',mail:'mail-none',genRating:'4.2',genPrice:'$9.4',portRating:'4.2',portPrice:'$9.8',phySupplier:'Add P. supplier',totalOffer:'-',offPrice1:'-',offPrice2: '-', offPrice3: '-',tPr:'-',amt:'-',diff:'-',check:'',check1:'',check2:'',check3:'',mj:'41',mj1:'41',tco:'4,48,152.00',ediff:'1.19',tco1:'4,48,152.00',ediff1:'1.19',infoIcon:'No', commentIcon:'No'},
  //      {name:'Total Marine Fuel',counterpartytype:'physicalsupplier',mail:'mail-inactive',genRating:'4.2',genPrice:'$9.4',portRating:'4.2',portPrice:'$9.8',phySupplier:'Add P. supplier',totalOffer:'-',offPrice1:'-',offPrice2: '-', offPrice3: '-',tPr:'-',amt:'-',diff:'-',check:'',check1:'',check2:'',check3:'',mj:'41',mj1:'41',tco:'4,48,152.00',ediff:'1.19',tco1:'4,48,152.00',ediff1:'1.19',infoIcon:'No', commentIcon:'Yes'},
  //      {name:'Total Marine Fuel',counterpartytype:'seller',mail:'mail-active',genRating:'4.2',genPrice:'$9.4',portRating:'4.2',portPrice:'$9.8',phySupplier:'Add P. supplier',totalOffer:'-',offPrice1:'-',offPrice2: '-', offPrice3: '-',tPr:'-',amt:'-',diff:'-',check:'',check1:'',check2:'',check3:'',mj:'41',mj1:'41',tco:'4,48,152.00',ediff:'1.19',tco1:'4,48,152.00',ediff1:'1.19',infoIcon:'No', commentIcon:'Yes'}
  // ]
  //  public rowData_details = [
  //   {offPrice:'-',tPr:'-',amt:'-',diff:'-',totalOffer:'-'},
  //   {offPrice:'2',tPr:'-',amt:'-',diff:'-',totalOffer:'-'},
  //   {offPrice:'3',tPr:'-',amt:'-',diff:'-',totalOffer:'-'},
  //   {offPrice:'-',tPr:'-',amt:'-',diff:'-',totalOffer:'-'},
  //   {offPrice:'-',tPr:'-',amt:'-',diff:'-',totalOffer:'-'},
  //   {offPrice:'-',tPr:'-',amt:'-',diff:'-',totalOffer:'-'},
  //   {offPrice:'-',tPr:'-',amt:'-',diff:'-',totalOffer:'-'},
  //   {offPrice:'-',tPr:'-',amt:'-',diff:'-',totalOffer:'-'},
  //   {offPrice:'-',tPr:'-',amt:'-',diff:'-',totalOffer:'-'},
  //   {offPrice:'-',tPr:'-',amt:'-',diff:'-',totalOffer:'-'},
  //   {offPrice:'-',tPr:'-',amt:'-',diff:'-',totalOffer:'-'},
  //   {offPrice:'-',tPr:'-',amt:'-',diff:'-',totalOffer:'-'},
  //   {offPrice:'-',tPr:'-',amt:'-',diff:'-',totalOffer:'-'},
  //   {offPrice:'-',tPr:'-',amt:'-',diff:'-',totalOffer:'-'},
  //   {offPrice:'-',tPr:'-',amt:'-',diff:'-',totalOffer:'-'},
  //   {offPrice:'-',tPr:'-',amt:'-',diff:'-',totalOffer:'-'},

  // ]

  // delete(){
  //   let rowData = [];
  //       // this.gridOptions_counterparty.api.forEachNode(node => rowData.push(node.data));
  //       // let indexb = this.gridOptions_counterparty.api.node.rowIndex;
  //       this.gridOptions_counterparty.api.forEachNode(node => rowData.push(node.data));
  //       let index = 1;
  //       let newData = [];
  //       newData = rowData.splice(index, 1);
  //       this.gridOptions_counterparty.api.applyTransaction({ remove: newData });

  //       let rowData1 = [];
  //       this.gridOptions_details.api.forEachNode(node => rowData1.push(node.data));
  //       let index1 = 1;
  //       let newData1 = [];
  //       newData1 = rowData1.splice(index1, 1);
  //       this.gridOptions_details.api.applyTransaction({ remove: newData1 });
  // }
  resizeGrid() {
    //   this._document.querySelectorAll('.resizeIcons').forEach(function(el) {
    //     el.classList.toggle('expand');
    //  });
    // setTimeout(()=>{
    // this.gridOptions_counterparty.api.sizeColumnsToFit();
    //  },10);
    //setTimeout(()=>{
    //         this.inputSection.nativeElement.focus();
    //       },3000);
    //alert("");
    //console.log(this.gridOptions_counterparty.columnApi);
    // var columnDefs = this.columnDef_aggrid;
    // columnDefs.forEach(function (colDef) {
    //   console.log(colDef);
    //   if (colDef.field === 'mj') {
    //     //colDef.hide = false;
    //     //this.gridOptions_counterparty.columnApi.setColumnVisible('mj',true);
    //   }
    // });
    // this.gridOptions_counterparty.api.setColumnDefs(columnDefs);

    // const group = this.gridOptions_counterparty.columnApi.getColumnGroup('grid1');
    // console.log(group);
    // let children = group.getChildren();
    // console.log(children);
    // children.forEach((child) =>{

    //   this.gridOptions_counterparty.columnApi.setColumnVisible('mj',true);
    // });

    // const group1 = this.gridOptions_counterparty.columnApi.getColumnGroup('grid2');
    // console.log(group);
    // let children1 = group1.getChildren();
    // console.log(children1);
    // children1.forEach((child) =>{

    //   this.gridOptions_counterparty.columnApi.setColumnVisible('mj',true);
    // });

    // for (let idx = 0; idx < children.length; idx++) {
    //   this.gridOptions_counterparty.columnApi.setColumnVisible('mj',true);
    // }
    //group.children.forEach(child => this.gridOptions_counterparty.columnApi.setColumnsVisible('mj', false));

    this.gridOptions_counterparty.columnApi.setColumnVisible('mj', true);
    this.gridOptions_counterparty.columnApi.setColumnVisible('mj1', true);
    this.gridOptions_counterparty.columnApi.setColumnVisible('mj2', true);
    this.gridOptions_counterparty.columnApi.setColumnVisible('tco', true);
    this.gridOptions_counterparty.columnApi.setColumnVisible('tco1', true);
    this.gridOptions_counterparty.columnApi.setColumnVisible('tco2', true);
    this.gridOptions_counterparty.columnApi.setColumnVisible('ediff', true);
    this.gridOptions_counterparty.columnApi.setColumnVisible('ediff1', true);
    this.gridOptions_counterparty.columnApi.setColumnVisible('ediff2', true);
    this.expandGridHeaderWidth =
      this.gridOptions_counterparty.columnApi
        .getColumn('check1')
        .getActualWidth() +
      this.gridOptions_counterparty.columnApi
        .getColumn('offPrice')
        .getActualWidth() +
      this.gridOptions_counterparty.columnApi
        .getColumn('tPr')
        .getActualWidth() +
      this.gridOptions_counterparty.columnApi
        .getColumn('diff')
        .getActualWidth() +
      this.gridOptions_counterparty.columnApi.getColumn('mj').getActualWidth() +
      this.gridOptions_counterparty.columnApi
        .getColumn('tco')
        .getActualWidth() +
      this.gridOptions_counterparty.columnApi
        .getColumn('ediff')
        .getActualWidth() +
      this.gridOptions_counterparty.columnApi.getColumn('amt').getActualWidth();

    this.counterpartyHeaderWidth =
      this.gridOptions_counterparty.columnApi
        .getColumn('check')
        .getActualWidth() +
      this.gridOptions_counterparty.columnApi
        .getColumn('name')
        .getActualWidth() +
      this.gridOptions_counterparty.columnApi
        .getColumn('genRating')
        .getActualWidth() +
      this.gridOptions_counterparty.columnApi
        .getColumn('portRating')
        .getActualWidth() +
      this.gridOptions_counterparty.columnApi
        .getColumn('phySupplier')
        .getActualWidth();

    this.fullHeaderWidth =
      this.counterpartyHeaderWidth +
      this.totalOfferHeaderWidth +
      this.expandGridHeaderWidth * 3 +
      7;
  }

  groupHeaderCheck() {
    let addButtonElement = document.getElementsByClassName(
      'groupHeaderCheckBox'
    );
    addButtonElement[0].addEventListener('click', event => {
      //alert("");
      // this.gridOptions_counterparty.api.forEachNode((rowNode, index) => {
      //   rowNode.data.check = true;
      // });
    });
  }
  onRowSelected(e) {
    var itemsToUpdate = [];
    this.gridOptions_counterparty.api.forEachNode((rowNode, index) => {
      rowNode.data.check = false;
    });
    this.gridOptions_counterparty.api.forEachNodeAfterFilterAndSort(function(
      rowNode,
      index
    ) {
      if (!rowNode.isSelected() === true) {
        return;
      }
      var data = rowNode.data;
      data.check = true;
      // data.check1 = true;
      // data.check2 = true;
      // data.check3 = true;
      itemsToUpdate.push(data);
    });
    var res = this.gridOptions_counterparty.api.applyTransaction({
      update: itemsToUpdate
    });
    //this.gridOptions_counterparty.api.deselectAll();//optional
    //console.log(e);
    // console.log("eeeeeeeeeeee");
    // console.log(this.gridOptions_counterparty);
  }
  onSelectionChanged(e) {
    // console.log("selectchange");
    //console.log(e);
  }
}
