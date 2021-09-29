import { DatePipe, DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import _ from 'lodash';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { GridOptions } from 'ag-grid-community';
import { AGGridCellActionsComponent } from '../../../../../core/ag-grid/ag-grid-cell-actions.component';
import { AGGridCellRendererV2Component } from '../../../../../core/ag-grid/ag-grid-cell-rendererv2.component';
import { ShiptechCustomHeaderGroup } from '../../../../../core/ag-grid/shiptech-custom-header-group';
import { SpotNegotiationService } from '../../../../../services/spot-negotiation.service';
import {
  EditLocationRow,
  SetCounterpartyList,
  SetLocationsRows,
  SetStaticLists
} from '../../../../../store/actions/ag-grid-row.action';
import { SpotNegotiationStore } from '../../../../../store/spot-negotiation.store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-spot-negotiation-details',
  templateUrl: './spot-negotiation-details.component.html',
  styleUrls: ['./spot-negotiation-details.component.css']
})
export class SpotNegotiationDetailsComponent implements OnInit {
  @ViewChild('inputSection') inputSection: ElementRef;
  today = new FormControl(new Date());
  locations = [];

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
  rowData_aggrid: any = [];
  productsIds: any = [];
  agGridLoaded = false;
  public grid1Width = {
    width: '100%'
  };

  // highlightedCells
  // {
  //   location-> 12: {totalPrice: 152   <- row id
  //   totalOffer:  612}
  // }
  // }

  highlightedCells = {};

  context: any;

  menuOptions = [{ label: 'ETA' }, { label: 'ETB' }, { label: 'ETD' }];
  isEnabledView: boolean = false;
  currentRequestData: any[];
  columnDef_aggridObj: any[];
  @Select(SpotNegotiationStore.getLocations) rowData_aggridObj: Observable<
    any[]
  >;

  public rowClassRules = {
    customRowClass: function(params) {
      const offPrice = params.data.offPrice;
      return offPrice == 100;
    },
    'display-no-quote': function(params) {
      const offPrice = params.data.isQuote;
      return offPrice == 'No quote';
    }
  };

  public columnDef_aggrid: any = [
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
          field: 'sellerCounterpartyName',
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
          cellStyle: params => {
            if (params.highlight) {
              return { background: '#C5DCCF' };
            }

            return null;
          },
          cellRendererFramework: AGGridCellRendererV2Component,
          cellRendererParams: { type: 'totalOffer', cellClass: '' }
          //suppressNavigable: true,lockPosition: true, pinned:'left',
        }
      ]
    }
  ];

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
    private spotNegotiationService: SpotNegotiationService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.context = { componentParent: this };
    this.rowSelection = 'single';
    this.gridOptions_counterparty = <GridOptions>{
      enableColResize: true,
      defaultColDef: {
        flex: 1,
        resizable: true,
        filter: true,
        sortable: false,
        valueSetter: ({ colDef, data, newValue }) => {
          const updatedRow = { ...data };
          updatedRow[colDef.field] = newValue;

          this.store.dispatch(new EditLocationRow(updatedRow));
          return false;
        }
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
      onCellEditingStopped: params => {
        const xv = this.getProductsIds();
        console.log(this.productsIds);

        this.productsIds.map(productID => {
          const x = params.columnApi.getColumn(`tPr${productID}`);
        });

        // For each location make a object containing key (location ID) value (smalles value with for that id)

        // Highlight Total offer (lowest)

        // Highlight Total price (lowest)
      },
      onGridReady: params => {
        // Ng init for AG GRID;

        this.gridOptions_counterparty.api = params.api;
        this.gridOptions_counterparty.columnApi = params.columnApi;
        this.gridOptions_counterparty.api.sizeColumnsToFit();
        // this.gridOptions_counterparty.api.setRowData(this.rowData_aggrid);
        this.rowCount = this.gridOptions_counterparty.api.getDisplayedRowCount();
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

  getRowNodeId(data) {
    return data.id;
  }

  getProductsIds(): any[] {
    return this.productsIds;
  }

  createProductHeader(product) {
    return {
      headerName: '',
      headerTooltip: '',
      headerGroupComponent: 'customHeaderGroupComponent',
      headerGroupComponentParams: {
        type: 'bg-header',
        product: product
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
          field: `offPrice${product.id}`,
          editable: true,
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
          field: `tPr${product.id}`,
          width: 150,
          cellClass: 'grey-opacity-cell pad-lr-0',
          cellStyle: params => {
            if (this.highlightedCells[params.data.locationId] && params.data.id == this.highlightedCells[params.data.locationId].totalPrice) {
              return { background: '#C5DCCF' };
            }

            return null;
          },
          cellRendererFramework: AGGridCellRendererV2Component,
          cellRendererParams: { type: 'addTpr', cellClass: '' }
        },
        {
          headerName: 'Amt ($)',
          headerTooltip: 'Amt ($)',
          field: `amt${product.id}`,
          width: 150,
          cellClass: 'grey-opacity-cell pad-lr-0'
        },
        {
          headerName: 'Tar. diff',
          headerTooltip: 'Tar. diff',
          field: `diff${product.id}`,
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
    };
  }

  // Make calculation here;
  formatRow(rowData){

    rowData.diff = "123";
    return rowData;
  }
  ngOnInit(): void {
    const self = this;
    // Set Counterparty list;
    this.route.data.subscribe(data => {
      this.store.dispatch(new SetCounterpartyList(data.counterpartyList));
    });

    this.store.subscribe(({ spotNegotiation }) => {
      // this.currentRequestData = spotNegotiation.currentRequestSmallInfo[0];

      // Set locations
      if (
        spotNegotiation.currentRequestSmallInfo &&
        spotNegotiation.currentRequestSmallInfo[0] &&
        this.locations.length == 0
      ) {
        this.locations =
          spotNegotiation.currentRequestSmallInfo[0].requestLocations;
      }

      // Optimize renders;
      if (
        !spotNegotiation.requests.length ||
        !spotNegotiation.locationsRows.length
      ) {
        return null;
      }

      // Set rows inside ag grid
      this.rowData_aggrid = spotNegotiation.locationsRows;
      this.currentRequestData = spotNegotiation.requests;

      // Spot function if we don't have any requests available
      if (!this.currentRequestData || this.currentRequestData.length <= 0) {
        return null;
      }

      // Get and set lenght of products in total products field
      const currentReqProdcutsLength = this.currentRequestData[0]
        .requestProducts.length;
      this.columnDef_aggrid[1].headerGroupComponentParams.currentReqProdcutsLength = currentReqProdcutsLength;

      // Set headers of products;
      this.columnDef_aggridObj = [];

      this.currentRequestData.map((currentRequest, i) => {
        // Separate rows for each location;
        // Sord data

        var smallestTotalPrice = Infinity;
        const filterobj = this.rowData_aggrid.filter(row => {

          if(row.locationId !== currentRequest.locationId){
            return false
          }
          // Set smallest total price
          if (smallestTotalPrice > row.tPr) {
            smallestTotalPrice = row.tPr;

            // Create key with id if dosen't exists;
            if(!self.highlightedCells[row.locationId]) {
              self.highlightedCells[row.locationId] = {};
            }
            self.highlightedCells[row.locationId].totalPrice = row.id;
          }

          row = this.formatRow(JSON.parse(JSON.stringify(row)));

          return true;
        });

        const locationId = currentRequest.locationId;
        this.rowData_aggridObj[i] = filterobj;

        // Assign ColumnDef_aggrid with dynamic location id
        this.columnDef_aggridObj[i] = _.cloneDeep(this.columnDef_aggrid);
        this.columnDef_aggridObj[
          i
        ][0].headerGroupComponentParams.locationId = locationId;

        self.productsIds = currentRequest.requestProducts.map(e => e.id);

        currentRequest.requestProducts.map(product => {
          this.columnDef_aggridObj[i].push(this.createProductHeader(product));
        });
      });

      // Detect change and update the ui
      this.changeDetector.detectChanges();
    });
    this.isEnabledView = true;
  }

  dataManupulation() {}

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
        .getColumn('sellerCounterpartyName')
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

  onRowSelected(e) {
    // Please rewrite this function and comment it
    return;
    const itemsToUpdate = [];
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
    const res = this.gridOptions_counterparty.api.applyTransaction({
      update: itemsToUpdate
    });
  }
  onSelectionChanged(e) {}
}
