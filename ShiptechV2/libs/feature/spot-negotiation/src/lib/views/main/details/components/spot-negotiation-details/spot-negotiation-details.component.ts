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
  SetStaticLists
} from '../../../../../store/actions/ag-grid-row.action';
import { SpotNegotiationStore } from '../../../../../store/spot-negotiation.store';
import { iif, Observable } from 'rxjs';

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
          headerCellRenderer: this.selectAllRenderer,
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
          field: 'physicalSupplierCounterpartyName',
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
          // Do calculation here;
          updatedRow = this.formatRowData(updatedRow, colDef['product'], colDef.field, newValue);

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
    const productDetails = this.getRowProductDetails(updatedRow, product.id);
    if (productDetails.id == null || productDetails.price == null) {
      return;
    }
    const payload = {
      Offers: [
        {
          id: productDetails.offerId,
          totalOffer: updatedRow.totalOffer,
          requestOffers: [
            {
              id: productDetails.id,
              totalPrice: productDetails.totalPrice,
              amount: productDetails.amount,
              targetDifference: productDetails.targetDifference,
              price: productDetails.price
            }
          ]
        }
      ]
    };
    console.log (updatedRow);
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
  formatRowData(row, product, field, newValue) {
    const productDetails = this.getRowProductDetails(row, product.id);

    //Change with new value
    switch (field) {
      case "offPrice":
        productDetails.price = Number(newValue)
        break;

      default:
        break;
    }

    // Total Price = Offer Price + Additional cost(Rate/MT of the product + Rate/MT of  applicable for 'All')
    productDetails.totalPrice = Number(productDetails.price) + 0;
    // Amount = Total Price * Max. Quantity
    productDetails.amount = productDetails.totalPrice * product.maxQuantity;

    // Target Difference = Total Price - Target Price
    productDetails.targetDifference =
      productDetails.totalPrice -
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

    let totalOffer = productDetails.price;
    currentLocationAllProductsIds.map(id => {
      totalOffer += Number(this.getRowProductDetails(row, id).price)
    });
    row.totalOffer = totalOffer;

    let futureRow = this.setRowProductDetails(row, productDetails, product.id);

    return futureRow;
  }

  selectAllRenderer(params){
  }
  getRowNodeId(data) {
    return data.id;
  }

  getRowProductDetails(row, productId) {
    let futureRow = JSON.parse(JSON.stringify(row));

    const emptyPriceDetails = {
      amount: null,
      contactCounterpartyId: null,
      currencyId: null,
      id: null,
      offerId: null,
      price: null,
      priceQuantityUomId: null,
      quotedProductId: null,
      requestProductId: null,
      targetDifference: null,
      totalPrice: null
    };

    if (!futureRow.requestOffers) {
      return emptyPriceDetails;
    }

    const priceDetails = futureRow.requestOffers.find(
      item => item.requestProductId === productId
    );

    if (priceDetails) {
      return priceDetails;
    }

    return emptyPriceDetails;
  }

  setRowProductDetails(row, details, productId) {
    // returns a row;
    let futureRow = JSON.parse(JSON.stringify(row));

    if (!futureRow.requestOffers) {
      return futureRow;
    }

    for (let i = 0; i < futureRow.requestOffers.length; i++) {
      if (futureRow.requestOffers[i].requestProductId == productId) {
        futureRow.requestOffers[i] = details;
        break;
      }
    }
    return futureRow;
  }
  createProductHeader(product, requestLocationId, index) {
    var checkprodindex = index + 1;
    return {
      headerName: '',
      headerTooltip: '',
      headerGroupComponent: 'customHeaderGroupComponent',
      headerGroupComponentParams: {
        type: 'bg-header',
        product: product,
        requestLocationId: requestLocationId
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
          field: `offPrice`,
          product: product,
          width: 260,
          cellClass: 'hoverCell grey-opacity-cell pad-lr-0',
          cellRendererFramework: AGGridCellRendererV2Component,
          valueGetter: params => {
            const details = this.getRowProductDetails(params.data, product.id);
            return details.price;
          },
          cellRendererParams: {
            label: 'price-calc',
            type: 'price-calc',
            cellClass: ''
          }
        },
        {
          headerName: 'T.Pr.($)',
          headerTooltip: 'T.Pr.($)',
          field: `tPr`,
          valueGetter: params => {
            const details = this.getRowProductDetails(params.data, product.id);
            return details.totalPrice;
          },
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
          field: `amt`,
          valueGetter: params => {
            const details = this.getRowProductDetails(params.data, product.id);
            return details.amount;
          },
          width: 150,
          cellClass: 'grey-opacity-cell pad-lr-0',
          cellRendererFramework: AGGridCellRendererV2Component,
          cellRendererParams: { type: 'amt', cellClass: '' }
        },
        {
          headerName: 'Tar. diff',
          headerTooltip: 'Tar. diff',
          field: `diff`,
          width: 150,
          valueGetter: params => {
            const details = this.getRowProductDetails(params.data, product.id);
            return details.targetDifference;
          },
          headerClass: 'border-right',
          cellClass: 'line-seperator grey-opacity-cell pad-lr-0',
          cellRendererFramework: AGGridCellRendererV2Component,
          cellRendererParams: { type: 'diff', cellClass: '' }
        },
        {
          headerName: 'MJ/KJ',
          headerTooltip: 'MJ/KJ',
          field: `mj$`,
          width: 150,
          columnGroupShow: 'open',
          cellClass: 'grey-opacity-cell pad-lr-0'
        },
        {
          headerName: 'TCO ($)',
          headerTooltip: 'TCO ($)',
          field: `tco$`,
          width: 150,
          columnGroupShow: 'open',
          cellClass: 'grey-opacity-cell pad-lr-0'
        },
        {
          headerName: 'E. diff',
          headerTooltip: 'E. diff',
          field: `ediff`,
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
      const productDetails = this.getRowProductDetails(row, product.id)

      if (
        productDetails.totalPrice &&
        Number(smallestTotalPrice) > Number(productDetails.totalPrice)
      ) {
        smallestTotalPrice = productDetails.totalPrice;
        this.highlightedCells[row.locationId][product.id].totalPrice = row.id;
      }

      // Set smallest offer price
      if (row.totalOffer && Number(smallesOffer) > Number(row.totalOffer)) {
        smallesOffer = row.totalOffer;
        // Create key with id if dosen't exists;

        this.highlightedCells[row.locationId].totalOffer = row.id;
      }
    });
  }

  shouldUpdate({ spotNegotiation }): boolean {
    // Stop function if not necessary
    // TODO make a function to stop the update if not necessary;
    return true;

    // Function is not good;

    if (
      spotNegotiation.currentRequestSmallInfo &&
      Object.keys(spotNegotiation.currentRequestSmallInfo).length > 0 &&
      JSON.stringify(spotNegotiation.currentRequestSmallInfo) ===
        JSON.stringify(this.currentRequestSmallInfo)
    ) {
      return false;
    }

    if (
      this.locationsRows.length > 0 &&
      JSON.stringify(spotNegotiation.locationsRows) ===
        JSON.stringify(this.locationsRows)
    ) {
      return false;
    }
    if (
      this.locations.length > 0 &&
      JSON.stringify(spotNegotiation.locations) ===
        JSON.stringify(this.locations)
    ) {
      return false;
    }

    return true;
  }
  ngOnInit(): void {
    const self = this;
    // Set Counterparty list;
    this.route.data.subscribe(data => {
      this.store.dispatch(new SetCounterpartyList(data.counterpartyList));
    });

    this.store.subscribe(({ spotNegotiation, ...props }) => {

      if (!this.shouldUpdate({ spotNegotiation })) {
        return null;
      }

      if (spotNegotiation.currentRequestSmallInfo) {
        this.currentRequestSmallInfo = spotNegotiation.currentRequestSmallInfo;
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
          this.columnDef_aggridObj[i].push(
            this.createProductHeader(product, currentRequest.id, i)
          );
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
    // const itemsToUpdate = [];
    // this.gridOptions_counterparty.api.forEachNode((rowNode, index) => {
    //   rowNode.data.isSelected isSelected = false;
    //   console.log("-------------&&&&&&&-- rowNode", rowNode);
    // });
    // this.gridOptions_counterparty.api.forEachNodeAfterFilterAndSort(function(
    //   rowNode,
    //   index
    // ) {
    //   if (!rowNode.isSelected() === true) {
    //     return;
    //   }
    //   const data = rowNode.data;
    //   data.isSelected = TextTrackCueList;
    //   itemsToUpdate.push(data);
    // });
    // const res = this.gridOptions_counterparty.api.applyTransaction({
    //   update: itemsToUpdate
    // });
    let updatedRow = { ...e.data };
      updatedRow = this.formatRowselected(updatedRow, e.data.isSelected);
      // Update the store
      this.store.dispatch(new EditLocationRow(updatedRow));
      if(e.data.isSelected){
        return false
      }
      else{
        return true
      }
  }

  formatRowselected(row, value) {
    if(value){
      row.isSelected = false;
      row.checkProd1 =false;
      row.checkProd2 = false;
      row.checkProd3 =false;
      row.checkProd4 = false;
      row.checkProd5 =false;
    }else{
      row.isSelected = true;
      row.checkProd1 =true;
      row.checkProd2 = true;
      row.checkProd3 =true;
      row.checkProd4 = true;
      row.checkProd5 =true;
    }
    return row;
}
  onSelectionChanged(e) {}

}
