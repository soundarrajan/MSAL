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
import { ToastrService } from 'ngx-toastr';
import { AGGridCellActionsComponent } from '../../../../../core/ag-grid/ag-grid-cell-actions.component';
import { AGGridCellRendererV2Component } from '../../../../../core/ag-grid/ag-grid-cell-rendererv2.component';
import { ShiptechCustomHeaderGroup } from '../../../../../core/ag-grid/shiptech-custom-header-group';
import { SpotNegotiationService } from '../../../../../services/spot-negotiation.service';
import {
  EditLocationRow,
  SetCounterpartyList,
  SetLocationsRows,
  SetStaticLists,
  SelectCounterparty
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
  locationsRows: any = [];
  currentRequestSmallInfo = {};
  agGridLoaded = false;
  public grid1Width = {
    width: '100%'
  };

  // highlightedCells = {
  //   12: { <- Location id
  //     totalOffer: 612,
  //     123: { <- Product id
  //       totalPrice: 152,
  //     }
  //   }
  // };
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
          field: 'isSelected',
          filter: true,
          suppressMenu: true,
          maxWidth: 35,
          headerCheckboxSelection: true,
          resizable: false,
          // suppressMovable: true,
          suppressNavigable: true,
          lockPosition: true,
          pinned: 'left',
          headerClass: 'header-checkbox-center checkbox-center ag-checkbox-v2',
          cellClass: 'p-1 checkbox-center ag-checkbox-v2',
          cellRendererFramework: AGGridCellActionsComponent,
          cellRendererParams: { type: 'checkbox-selection' }
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
            if (
              this.highlightedCells[params.data.locationId] &&
              params.data.id ==
                this.highlightedCells[params.data.locationId].totalOffer
            ) {
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
    private changeDetector: ChangeDetectorRef,
    private toastr: ToastrService
  ) {
    this.context = { componentParent: this };
    this.rowSelection = 'multiple';
    this.gridOptions_counterparty = <GridOptions>{
      enableColResize: true,
      defaultColDef: {
        flex: 1,
        resizable: true,
        filter: true,
        sortable: false,
        valueSetter: ({ colDef, data, newValue }) => {
          let updatedRow = { ...data };
          updatedRow[colDef.field] = newValue;

          // Do calculation here;
          updatedRow = this.formatRowData(updatedRow, colDef['product']);

          // Update the store
          this.store.dispatch(new EditLocationRow(updatedRow));

          // Save to the cloud
          this.saveRowToCloud(updatedRow, colDef['product']);

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

  saveRowToCloud(updatedRow, product) {
    const payload = {
      Offers: [
        {
          id: updatedRow.id,
          totalOffer: 1250,
          requestOffers: [
            {
              Id: product.id,
              totalPrice: 120,
              amount: 12000,
              targetDifference: 15,
              price: 125
            }
          ]
        }
      ]
    };

    const response = this.spotNegotiationService.updatePrices(payload);
    response.subscribe((res: any) => {
      if (res.status) {
        this.toastr.success(res.message);
      } else {
        this.toastr.error(res.message);
        return;
      }
    });
  }
  // Calculate row fields and return new row;
  formatRowData(row, product) {
    // Total Price = Offer Price + Additional cost(Rate/MT of the product + Rate/MT of  applicable for 'All')
    row[`tPr${product.id}`] = Number(row[`offPrice${product.id}`]) + 0;
    // Amount = Total Price * Max. Quantity
    row[`amt${product.id}`] = row[`tPr${product.id}`] * product.maxQuantity;

    // Target Difference = Total Price - Target Price
    row[`diff${product.id}`] =
      row[`tPr${product.id}`] -
      (product.requestGroupProducts
        ? product.requestGroupProducts.targetPrice
        : 0);

    // Total Offer(provided Offer Price is captured for all the products in the request) = Sum of Amount of all the products in the request
    const currentLocation = this.locations.filter(
      e => e.locationId === row.locationId
    );
    const currentLocationAllProductsIds = currentLocation[0].requestProducts.map(
      e => e.id
    );

    let totalOffer = 0;
    currentLocationAllProductsIds.map(id => {
      totalOffer += row[`offPrice${id}`] ? Number(row[`offPrice${id}`]) : 0;
    });
    row.totalOffer = totalOffer;

    return row;
  }

  getRowNodeId(data) {
    return data.id;
  }

  createProductHeader(product,requestLocationId,index) {
    var checkprodindex = index + 1;
    return {
      headerName: '',
      headerTooltip: '',
      headerGroupComponent: 'customHeaderGroupComponent',
      headerGroupComponentParams: {
        type: 'bg-header',
        product: product,
        requestLocationId:requestLocationId
      },
      marryChildren: true,
      resizable: false,
      name: 'grid1',
      groupId: 'grid1',

      children: [
        {
          headerName: '',
          field: 'checkProd' + checkprodindex,
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
          product: product,
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
            if (
              this.highlightedCells[params.data.locationId] &&
              this.highlightedCells[params.data.locationId][product.id] &&
              params.data.id ==
                this.highlightedCells[params.data.locationId][product.id]
                  .totalPrice
            ) {
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
          cellClass: 'grey-opacity-cell pad-lr-0',
          cellRendererFramework: AGGridCellRendererV2Component,
          cellRendererParams: { type: 'amt', cellClass: '' }
        },
        {
          headerName: 'Tar. diff',
          headerTooltip: 'Tar. diff',
          field: `diff${product.id}`,
          width: 150,
          headerClass: 'border-right',
          cellClass: 'line-seperator grey-opacity-cell pad-lr-0',
          cellRendererFramework: AGGridCellRendererV2Component,
          cellRendererParams: { type: 'diff', cellClass: '' }
        },
        {
          headerName: 'MJ/KJ',
          headerTooltip: 'MJ/KJ',
          field: `mj${product.id}`,
          width: 150,
          columnGroupShow: 'open',
          cellClass: 'grey-opacity-cell pad-lr-0'
        },
        {
          headerName: 'TCO ($)',
          headerTooltip: 'TCO ($)',
          field: `tco${product.id}`,
          width: 150,
          columnGroupShow: 'open',
          cellClass: 'grey-opacity-cell pad-lr-0'
        },
        {
          headerName: 'E. diff',
          headerTooltip: 'E. diff',
          field: `ediff${product.id}`,
          width: 150,
          columnGroupShow: 'open',
          headerClass: 'border-right',
          cellClass: 'line-seperator grey-opacity-cell pad-lr-5'
        }
      ]
    };
  }

  checkHighlight({ product }) {
    var smallestTotalPrice = Infinity;
    var smallesOffer = Infinity;

    this.locationsRows.map(row => {
      // Create key with id if dosen't exists;
      if (!this.highlightedCells[row.locationId]) {
        this.highlightedCells[row.locationId] = {};
      }

      if (!this.highlightedCells[row.locationId][product.id]) {
        this.highlightedCells[row.locationId][product.id] = {};
      }

      if (!this.highlightedCells[row.locationId]) {
        this.highlightedCells[row.locationId] = {};
      }

      // Set smallest total price
      if (
        row[`tPr${product.id}`] &&
        Number(smallestTotalPrice) > Number(row[`tPr${product.id}`])
      ) {
        smallestTotalPrice = row[`tPr${product.id}`];
        this.highlightedCells[row.locationId][product.id].totalPrice = row.id;
      }

      // Set smallest offer price
      if (
        row.totalOffer &&
        Number(smallesOffer) > Number(row.totalOffer)
      ) {
        smallesOffer = row.totalOffer;
        // Create key with id if dosen't exists;

        this.highlightedCells[row.locationId].totalOffer = row.id;
      }
    });
  }

  ngOnInit(): void {
    const self = this;
    // Set Counterparty list;
    this.route.data.subscribe(data => {
      this.store.dispatch(new SetCounterpartyList(data.counterpartyList));
    });

    this.store.subscribe(({ spotNegotiation }) => {
      if (spotNegotiation.currentRequestSmallInfo?.length > 0) {
        this.currentRequestSmallInfo =
          spotNegotiation.currentRequestSmallInfo[0];
      }

      // Set locations;
      if (
        !spotNegotiation.locations.length ||
        !spotNegotiation.locationsRows.length
      ) {
        return null;
      }

      this.locationsRows = spotNegotiation.locationsRows;
      this.locations = spotNegotiation.locations;

      // Set rows inside ag grid
      this.rowData_aggrid = spotNegotiation.locationsRows;
      this.currentRequestData = spotNegotiation.locations;

      // Spot function if we don't have any requests available
      if (!this.currentRequestData || this.currentRequestData.length <= 0) {
        return null;
      }

      this.columnDef_aggrid[1].headerGroupComponentParams.currentReqProdcutsLength = this.locations[0].requestProducts.length;

      // Set headers of products;
      this.columnDef_aggridObj = [];

      this.currentRequestData.map((currentRequest, i) => {
        // Separate rows for each location;
        // Sord data

        const filterobj = this.rowData_aggrid.filter(row => {
          if (row.locationId !== currentRequest.locationId) {
            return false;
          }
          return true;
        });

        const locationId = currentRequest.locationId;
        this.rowData_aggridObj[i] = filterobj;

        // Assign ColumnDef_aggrid with dynamic location id
        this.columnDef_aggridObj[i] = _.cloneDeep(this.columnDef_aggrid);

        this.columnDef_aggridObj[
          i
        ][0].headerGroupComponentParams.locationId = locationId;

        // These are locations!!
        currentRequest.requestProducts.map(product => {
          this.checkHighlight({ product: product });
          this.columnDef_aggridObj[i].push(this.createProductHeader(product, currentRequest.id,i));
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
  onCellClick(event: any) {
      let rowsSelection = this.gridOptions_counterparty.api.getSelectedRows();

      let payload = {
        selectedCounterparties: rowsSelection
      };

      this.store.dispatch(
        new SelectCounterparty(payload.selectedCounterparties)
      );
   }
}
