import { DatePipe, DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { GridOptions } from 'ag-grid-community';
import { AGGridCellActionsComponent } from '../../../../../core/ag-grid/ag-grid-cell-actions.component';
import { AGGridCellRendererV2Component } from '../../../../../core/ag-grid/ag-grid-cell-rendererv2.component';
import { ShiptechCustomHeaderGroup } from '../../../../../core/ag-grid/shiptech-custom-header-group';
import { SpotNegotiationService } from '../../../../../services/spot-negotiation.service';
import { SetStaticLists } from '../../../../../store/actions/ag-grid-row.action';

@Component({
  selector: 'app-spot-negotiation-details',
  templateUrl: './spot-negotiation-details.component.html',
  styleUrls: ['./spot-negotiation-details.component.css']
})
export class SpotNegotiationDetailsComponent implements OnInit {
  @ViewChild('inputSection') inputSection: ElementRef;
  today = new FormControl(new Date());
  @Input() locations;
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
  rowData_aggrid = [];

  public grid1Width = {
    width: '100%'
  };

  private context: any;

  menuOptions = [{ label: 'ETA' }, { label: 'ETB' }, { label: 'ETD' }];
  // public grid2Width = {
  //   width: '50%'
  // }
  ngOnInit(): void {
    // Set static lists;
    this.route.data.subscribe(data => {
      this.store.dispatch(new SetStaticLists(data.staticLists));
    });
  }

  //   ngAfterViewInit() {
  //     setTimeout(()=>{
  //         this.inputSection.nativeElement.focus();
  //       },3000);
  // }

  constructor(
    @Inject(DOCUMENT) private _document: HTMLDocument,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private store: Store,
    private spotNegotiationService: SpotNegotiationService
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
        //  this.gridOptions_counterparty.api.setRowData(this.rowData_aggrid);
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
  }

  dataManupulation() {}

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
          headerName: 'Total Offer($)',
          headerTooltip: 'Total Offer($)',
          field: 'totalOffer',
          tooltipField: '',
          width: 200,
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
          cellStyle: params =>
            params.value == '518.50' ? { background: '#C5DCCF' } : null,
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
            'p-1 checkbox-center ag-checkbox-v2 pad-lr-0 mat-check-center grey-opacity-cell',

          cellRendererFramework: AGGridCellRendererV2Component,
          cellRendererParams: { type: 'mat-check-box' }
        },
        {
          headerName: 'Offer price',
          headerTooltip: 'Offer price',
          field: 'offPrice2',
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
          cellClass: 'grey-opacity-cell pad-lr-0'
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
          field: 'mj1',
          width: 150,
          columnGroupShow: 'open',
          cellClass: 'grey-opacity-cell pad-lr-0'
        },
        {
          headerName: 'TCO ($)',
          headerTooltip: 'TCO ($)',
          field: 'tco1',
          width: 150,
          columnGroupShow: 'open',
          cellClass: 'grey-opacity-cell pad-lr-0'
        },
        {
          headerName: 'E. diff',
          headerTooltip: 'E. diff',
          field: 'ediff1',
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
            'p-1 checkbox-center ag-checkbox-v2 grey-opacity-cell pad-lr-0 mat-check-center',

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
          cellClass: 'grey-opacity-cell pad-lr-0'
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
          field: 'mj1',
          width: 150,
          columnGroupShow: 'open',
          cellClass: 'grey-opacity-cell pad-lr-0'
        },
        {
          headerName: 'TCO ($)',
          headerTooltip: 'TCO ($)',
          field: 'tco1',
          width: 150,
          columnGroupShow: 'open',
          cellClass: 'grey-opacity-cell pad-lr-0'
        },
        {
          headerName: 'E. diff',
          headerTooltip: 'E. diff',
          field: 'ediff2',
          width: 150,
          columnGroupShow: 'open',
          headerClass: 'border-right',
          cellClass: 'line-seperator grey-opacity-cell pad-lr-5'
        }
      ]
    }
  ];

  resizeGrid() {
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
    const addButtonElement = document.getElementsByClassName(
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
      const data = rowNode.data;
      data.check = TextTrackCueList;
      itemsToUpdate.push(data);
    });
    var res = this.gridOptions_counterparty.api.applyTransaction({
      update: itemsToUpdate
    });
  }
  onSelectionChanged(e) {}
}
