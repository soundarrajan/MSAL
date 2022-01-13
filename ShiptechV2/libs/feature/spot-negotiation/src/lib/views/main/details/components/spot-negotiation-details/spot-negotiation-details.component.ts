import { SpotNegotiationStoreModel } from './../../../../../store/spot-negotiation.store';
import { map, filter } from 'rxjs/operators';
import { DatePipe, DOCUMENT } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import _, { cloneDeep } from 'lodash';
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
  DeleteSeller,
  EditLocationRow,
  RemoveCounterparty,
  SetCounterpartyList,
  SetLocationsRows
} from '../../../../../store/actions/ag-grid-row.action';
import { SpotNegotiationStore } from '../../../../../store/spot-negotiation.store';
import { Observable } from 'rxjs';
import { RemoveCounterpartyComponent } from '../remove-counterparty-confirmation/remove-counterparty-confirmation';

@Component({
  selector: 'app-spot-negotiation-details',
  templateUrl: './spot-negotiation-details.component.html',
  styleUrls: ['./spot-negotiation-details.component.css']
})
export class SpotNegotiationDetailsComponent implements OnInit {
  locations = [];

  public gridOptions_counterparty: GridOptions;
  public rowCount: Number;
  public counterpartyHeaderWidth;
  public expandGridHeaderWidth;
  public totalOfferHeaderWidth;
  public fullHeaderWidth;
  public frameworkComponents;
  rowData_aggrid: any = [];
  locationsRows: any = [];
  currentRequestSmallInfo: any;
  highlightedCells = {};
  uomsMap: any;

  context: any;

  menuOptions = [{ label: 'ETA' }, { label: 'ETB' }, { label: 'ETD' }];
  isEnabledView: boolean = false;
  currentRequestData: any[];
  columnDef_aggridObj: any[];
  @Select(SpotNegotiationStore.locationRows) rowData_aggridObj: Observable<
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
          width: 30,
          minWidth: 30,
          maxWidth: 30,
          // checkboxSelection: true,
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
          width: 250,
          minWidth: 150,
          cellClass: 'suppress-movable-col remove-option hoverCell',
          pinned: 'left',
          headerClass: 'm-l-7',
          suppressNavigable: true,
          suppressSizeToFit: true,
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
          width: 95,
          minWidth: 85,
          suppressSizeToFit: true,
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
          width: 95,
          minWidth: 85,
          suppressSizeToFit: true,
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
          width: 150,
          minWidth: 100,
          suppressSizeToFit: true,
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
      width: 100,
      suppressSizeToFit: true,
      children: [
        {
          headerName: 'Total Offer($)',
          headerTooltip: 'Total Offer($)',
          field: 'totalOffer',
          flex: 1,
          width: 100,
          minWidth: 90,
          headerClass: 'border-right',
          cellClass: 'line-seperator',
          cellStyle: params => {
            if (
              this.highlightedCells['lowestTotalOfferRowId'] &&
              params.data.id == this.highlightedCells['lowestTotalOfferRowId']
            ) {
              return { background: '#C5DCCF' };
            }
            return null;
          },
          cellRendererFramework: AGGridCellRendererV2Component,
          cellRendererParams: { type: 'totalOffer', cellClass: '' },
          suppressNavigable: true,
          lockPosition: true
          //, pinned:'left',
        }
      ]
    }
  ];
  rowSelection: string;
  Isspotgridrefresh: boolean;
  CurrentRequestLocationsData: any[];

  constructor(
    @Inject(DOCUMENT) private _document: HTMLDocument,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private store: Store,
    private spotNegotiationService: SpotNegotiationService,
    private changeDetector: ChangeDetectorRef,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.context = { componentParent: this };
    this.gridOptions_counterparty = <GridOptions>{
      // resizable: true,
      rowSelection: 'multiple',
      defaultColDef: {
        flex: 1,
        resizable: true,
        filter: true,
        sortable: false,
        suppressMenu: true
      },

      columnDefs: this.columnDef_aggrid,
      suppressCellSelection: true,
      suppressMovable: true,
      suppressDragLeaveHidesColumns: true,
      lockPosition: true,
      headerHeight: 30,
      groupHeaderHeight: 80,
      rowHeight: 35,
      animateRows: false,
      onFirstDataRendered(params) {
        if (params.columnApi.getAllDisplayedColumns().length <= 20) {
          params.api.sizeColumnsToFit();
        }
        params.api.hideOverlay();
      },
      onGridReady: params => {
        // Ng init for AG GRID;
        this.Isspotgridrefresh = true;

        this.gridOptions_counterparty.api = params.api;
        this.gridOptions_counterparty.columnApi = params.columnApi;
        if (params.columnApi.getAllDisplayedColumns().length <= 20) {
          params.api.sizeColumnsToFit();
        }
        //this.gridOptions_counterparty.api.sizeColumnsToFit();
        //  this.gridOptions_counterparty.api.selectAll();
        // this.gridOptions_counterparty.api.setRowData(this.rowData_aggrid);
        this.rowCount = this.gridOptions_counterparty.api.getDisplayedRowCount();
        this.totalOfferHeaderWidth = params.columnApi
          .getColumn('totalOffer')
          .getActualWidth();
        // this.gridOptions_counterparty.api.showLoadingOverlay();
      },

      onColumnResized: function(params) {
        //params.api.sizeColumnsToFit();
        //alert("");
        //this.resizeGrid();
        // if (params.columnApi.getAllDisplayedColumns().length <= 8 && params.type === 'columnResized' && params.finished === true && params.source === 'uiColumnDragged') {
        //   //params.api.sizeColumnsToFit();
        // }
        // params.api.hideOverlay();
      },
      onColumnVisible: function(params) {
        if (params.columnApi.getAllDisplayedColumns().length <= 20) {
          params.api.sizeColumnsToFit();
        }
        // params.api.sizeColumnsToFit();
        // params.api.hideOverlay();
      },
      frameworkComponents: {
        customHeaderGroupComponent: ShiptechCustomHeaderGroup
      }
    };
  }
  isselectedrowfun(row, isSelected) {
    if (isSelected) {
      row.isSelected = true;
      row.checkProd1 = true;
      row.checkProd2 = true;
      row.checkProd3 = true;
    } else {
      row.isSelected = false;
      row.checkProd1 = false;
      row.checkProd2 = false;
      row.checkProd3 = false;
    }
    return row;
  }

  rowSelected(event) {
    let displayRowCount = this.gridOptions_counterparty.api.getDisplayedRowCount();
    let selectedNodes = this.gridOptions_counterparty.api.getSelectedNodes();
    let Selecteddata = selectedNodes.map(node => node.data);
    if (Selecteddata.length != 0 && Selecteddata.length != displayRowCount) {
      let rowdata = Object.assign({}, event.data);
      let updatedRow = { ...rowdata };
      updatedRow = this.isselectedrowfun(updatedRow, event.node.selected);
      this.store.dispatch(new EditLocationRow(updatedRow));
      event.node.setData(updatedRow);
    }
  }

  saveRowToCloud(updatedRow, product) {
    const productDetails = this.getRowProductDetails(updatedRow, product.id);

    if (productDetails.id == null || productDetails.price == null) {
      return;
    }
    const payload = {
      RequestLocationSellerId: updatedRow.id,
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
              price: productDetails.price,
              maxQuantity: product.maxQuantity,
              maxQuantityUomId: product.uomId,
              targetPrice: product.requestGroupProducts?.targetPrice
            }
          ]
        }
      ]
    };
    // console.log (updatedRow);
    const response = this.spotNegotiationService.updatePrices(payload);
    response.subscribe((res: any) => {
      if (res.status) {
        this.toastr.success('Price update successful.');
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
      case 'offPrice':
        productDetails.price = Number(newValue.toString().replace(/,/g, ''));
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
    productDetails.targetDifference =
      product.requestGroupProducts.targetPrice == 0
        ? 0
        : productDetails.targetDifference;

    // Total Offer(provided Offer Price is captured for all the products in the request) = Sum of Amount of all the products in the request
    const currentLocation = this.locations.filter(
      e => e.locationId === row.locationId
    );
    const currentLocationAllProductsIds = currentLocation[0].requestProducts.map(
      e => e.id
    );

    let futureRow = this.setRowProductDetails(row, productDetails, product.id);

    let calcTotalOffer = 0;
    currentLocationAllProductsIds.map(id => {
      calcTotalOffer += Number(this.getRowProductDetails(futureRow, id).amount);
    });
    futureRow.totalOffer = calcTotalOffer;

    return futureRow;
  }

  selectAllRenderer(params) {}
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
      requestProductId: productId,
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
    var productData = cloneDeep(product);
    productData.uomName = this.uomsMap.get(product.uomId);
    return {
      headerName: '',
      headerTooltip: '',
      headerGroupComponent: 'customHeaderGroupComponent',
      headerGroupComponentParams: {
        type: 'bg-header',
        product: productData,
        requestLocationId: requestLocationId
      },
      marryChildren: true,
      resizable: false,
      groupId: 'grid1',
      suppressMovable: true,
      lockPosition: true,

      children: [
        {
          headerName: '',
          field: 'checkProd' + checkprodindex,
          filter: true,
          suppressMenu: true,
          flex: 1,
          width: 30,
          minWidth: 30,
          maxWidth: 30,
          // checkboxSelection: true,
          resizable: false,
          headerClass: 'header-checkbox-center checkbox-center ag-checkbox-v2',
          cellClass:
            'p-1 checkbox-center ag-checkbox-v2 grey-opacity-cell pad-lr-0 mat-check-center',
          cellRendererFramework: AGGridCellRendererV2Component,
          cellRendererParams: {
            type: 'mat-check-box',
            productId: product.productId,
            status: product.status
          },
          lockPosition: true
        },
        {
          headerName: 'Offer price',
          headerTooltip: 'Offer price',
          field: `offPrice`,
          tooltipField: 'offerPrice',
          product: product,
          flex: 2,
          width: 200,
          minWidth: 125,
          cellClass: 'hoverCell grey-opacity-cell pad-lr-0',
          cellRendererFramework: AGGridCellRendererV2Component,
          valueSetter: ({ colDef, data, newValue, event }) => {
            let updatedRow = { ...data };
            let _this = this;

            //avoid calculation based on physical supplier mandatory configurations.
            const tenantConfig = this.store.selectSnapshot(
              (state: SpotNegotiationStoreModel) => {
                return state['spotNegotiation'].tenantConfigurations;
              }
            );

            if (
              tenantConfig['isPhysicalSupplierMandatoryForQuoting'] &&
              !updatedRow.physicalSupplierCounterpartyId
            ) {
              this.toastr.error(
                'Physical supplier is mandatory for quoting the price.'
              );
              event.target.value = '';
              event.target.focus();
              return false;
            }

            // Do calculation here;
            updatedRow = this.formatRowData(
              updatedRow,
              colDef['product'],
              colDef.field,
              newValue
            );
            // Update the store
            this.store.dispatch(new EditLocationRow(updatedRow));
            // Save to the cloud
            this.saveRowToCloud(updatedRow, colDef['product']);
            // setTimeout(() => {
            // //  alert(1)
            //   _this.gridOptions_counterparty.api.selectAll();
            // }, 100);

            return false;
          },
          valueGetter: params => {
            const details = this.getRowProductDetails(params.data, product.id);
            return details.price;
          },
          tooltipValueGetter: params => {
            const details = this.getRowProductDetails(params.data, product.id);
            return details.price;
          },
          cellRendererParams: {
            label: 'price-calc',
            type: 'price-calc',
            index: index,
            product: product,
            cellClass: ''
          },
          suppressSizeToFit: true,
          lockPosition: true
        },
        {
          headerName: 'T.Pr.($)',
          headerTooltip: 'T.Pr.($)',
          field: `tPr`,
          valueGetter: params => {
            const details = this.getRowProductDetails(params.data, product.id);
            return details.totalPrice;
          },
          flex: 3,
          minWidth: 95,
          cellClass: 'grey-opacity-cell pad-lr-0',
          cellStyle: params => {
            if (
              this.highlightedCells[product.productId] &&
              params.data.id ===
                this.highlightedCells[product.productId].rowId &&
              product.id ===
                this.highlightedCells[product.productId].requestProductId
            ) {
              return { background: '#C5DCCF' };
            }

            return null;
          },
          cellRendererFramework: AGGridCellRendererV2Component,
          cellRendererParams: { type: 'addTpr', cellClass: '' },
          lockPosition: true
        },
        {
          headerName: 'Amt ($)',
          headerTooltip: 'Amt ($)',
          field: `amt`,
          valueGetter: params => {
            const details = this.getRowProductDetails(params.data, product.id);
            return details.amount;
          },
          flex: 4,
          minWidth: 95,
          cellClass: 'grey-opacity-cell pad-lr-0',
          cellRendererFramework: AGGridCellRendererV2Component,
          cellRendererParams: { type: 'amt', cellClass: '' },
          lockPosition: true
        },
        {
          headerName: 'Tar. diff',
          headerTooltip: 'Tar. diff',
          field: `diff`,
          flex: 5,
          minWidth: 94,
          valueGetter: params => {
            const details = this.getRowProductDetails(params.data, product.id);
            return product.requestGroupProducts.targetPrice == null || 0
              ? 0
              : details.targetDifference;
          },
          headerClass: 'border-right',
          cellClass: 'line-seperator grey-opacity-cell pad-lr-0',
          cellRendererFramework: AGGridCellRendererV2Component,
          cellRendererParams: { type: 'diff', cellClass: '' },
          lockPosition: true
        },
        {
          headerName: 'MJ/KJ',
          headerTooltip: 'MJ/KJ',
          field: `mj$`,
          columnGroupShow: 'open',
          cellClass: 'grey-opacity-cell pad-lr-0',
          lockPosition: true
        },
        {
          headerName: 'TCO ($)',
          headerTooltip: 'TCO ($)',
          field: `tco$`,
          columnGroupShow: 'open',
          cellClass: 'grey-opacity-cell pad-lr-0',
          lockPosition: true
        },
        {
          headerName: 'E. diff',
          headerTooltip: 'E. diff',
          field: `ediff`,
          columnGroupShow: 'open',
          headerClass: 'border-right',
          cellClass: 'line-seperator grey-opacity-cell pad-lr-5',
          lockPosition: true
        }
      ]
    };
  }

  checkHighlight({ product }, requestProductsLength) {
    var smallestTotalPrice = Infinity;
    var smallestOffer = Infinity;

    if (this.locationsRows && this.locationsRows.length > 0) {
      if (this.highlightedCells[product.productId]) {
        const smallestRow = this.locationsRows.find(
          x => x.id === this.highlightedCells[product.productId].rowId
        );
        const offerDetails = smallestRow?.requestOffers?.find(
          x =>
            x.requestProductId ===
            this.highlightedCells[product.productId].requestProductId
        );
        if (offerDetails) smallestTotalPrice = offerDetails.totalPrice;
      }

      if (this.highlightedCells['lowestTotalOfferRowId']) {
        const lowestTotalOfferRow = this.locationsRows.find(
          x => x.id === this.highlightedCells['lowestTotalOfferRowId']
        );
        if (lowestTotalOfferRow.totalOffer)
          smallestOffer = lowestTotalOfferRow.totalOffer;
      }

      this.locationsRows.map(row => {
        // Create key with id if dosen't exists;
        if (!this.highlightedCells[product.productId]) {
          this.highlightedCells[product.productId] = {};
        }

        // Set smallest total price
        const productDetails = this.getRowProductDetails(row, product.id);

        if (
          productDetails.totalPrice &&
          Number(productDetails.totalPrice) > 0 &&
          Number(smallestTotalPrice) > Number(productDetails.totalPrice)
        ) {
          smallestTotalPrice = productDetails.totalPrice;
          this.highlightedCells[product.productId].rowId = row.id;
          this.highlightedCells[product.productId].requestProductId =
            product.id;
        }

        // Set smallest offer price
        const quotedProductsLength = row.requestOffers?.filter(x => x.price)
          .length;
        if (
          row.totalOffer &&
          quotedProductsLength === requestProductsLength &&
          Number(smallestOffer) > Number(row.totalOffer) &&
          Number(row.totalOffer) > 0
        ) {
          smallestOffer = row.totalOffer;
          // Create key with id if dosen't exists;

          this.highlightedCells['lowestTotalOfferRowId'] = row.id;
        }
      });
    }
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

      this.uomsMap = new Map(data.uoms.map(key => [key.id, key.name]));
    });

    this.store.subscribe(({ spotNegotiation, ...props }) => {
      if (!this.shouldUpdate({ spotNegotiation })) {
        return null;
      }

      if (spotNegotiation.currentRequestSmallInfo) {
        this.currentRequestSmallInfo = spotNegotiation.currentRequestSmallInfo;
      }

      // Set locations;
      if (!spotNegotiation.locations.length) {
        // || !spotNegotiation.locationsRows.length
        return null;
      }

      this.locationsRows = spotNegotiation.locationsRows;
      this.locations = spotNegotiation.locations;
      // setTimeout(() => {
      //   if(spotNegotiation.locationsRows.length > 0){
      //     this. locationsRows = this.EnabledPhysupplier(spotNegotiation.locationsRows);
      //   }
      // }, 500);

      // Set rows inside ag grid
      this.rowData_aggrid = spotNegotiation.locationsRows;
      // this.currentRequestData = spotNegotiation.locations;

      // Spot function if we don't have any requests available
      if (!this.locations || this.locations.length <= 0) {
        return null;
      }

      if (
        spotNegotiation.tenantConfigurations &&
        spotNegotiation.tenantConfigurations['isDisplaySellerRating'] === false
      ) {
        this.columnDef_aggrid[0].children = this.columnDef_aggrid[0].children.filter(
          col => col.field != 'genRating' && col.field != 'portRating'
        );
      }
      // Set headers of products;
      this.columnDef_aggridObj = [];
      this.highlightedCells = {};

      this.locations.forEach((reqLocation, i) => {
        // Separate rows for each location;
        // Sord data

        const filterobj = this.rowData_aggrid.filter(
          row => row.requestLocationId === reqLocation.id
        );
        this.rowData_aggridObj[i] = filterobj;

        // Assign ColumnDef_aggrid with dynamic location id
        this.columnDef_aggridObj.push(_.cloneDeep(this.columnDef_aggrid)); //;

        this.columnDef_aggridObj[
          i
        ][0].headerGroupComponentParams.reqLocationId = reqLocation.id;
        this.columnDef_aggridObj[
          i
        ][0].headerGroupComponentParams.selectedSellersCount = filterobj.filter(
          row => row.isSelected
        ).length;
        this.columnDef_aggridObj[i][1].headerGroupComponentParams.noOfProducts =
          reqLocation.requestProducts.length;

        // These are locations!!
        const requestProductsLength = reqLocation.requestProducts.length;
        reqLocation.requestProducts.map((reqProduct, index) => {
          this.checkHighlight({ product: reqProduct }, requestProductsLength);
          this.columnDef_aggridObj[i].push(
            this.createProductHeader(reqProduct, reqLocation.id, index)
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

  formatRowselected(row, value) {
    if (value) {
      row.isSelected = false;
      row.checkProd1 = false;
      row.checkProd2 = false;
      row.checkProd3 = false;
      row.checkProd4 = false;
      row.checkProd5 = false;
    } else {
      row.isSelected = true;
      row.checkProd1 = true;
      row.checkProd2 = true;
      row.checkProd3 = true;
      row.checkProd4 = true;
      row.checkProd5 = true;
    }
    return row;
  }

  removeCounterpartyRowClicked(rowData: any, rowIndex: number, gridApi: any) {
    const dialogRef = this.dialog.open(RemoveCounterpartyComponent, {
      width: '600px',
      data: {
        sellerName: rowData.sellerCounterpartyName,
        isRFQSent:
          rowData.requestOffers?.filter(ro => !ro.isRfqskipped).length > 0
            ? true
            : false
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinner.show();
        this.spotNegotiationService
          .RemoveCounterparty(rowData.id)
          .subscribe((res: any) => {
            this.spinner.hide();
            if (res.status) {
              let dataRows = [];
              gridApi.forEachNode(node => dataRows.push(node.data));
              dataRows = dataRows.splice(rowIndex, 1);
              //gridApi.applyTransaction({ remove: dataRows });
              gridApi.updateRowData({ remove: dataRows });
              this.toastr.success(
                'Counterparty has been removed from negotiation succesfully.'
              );
              this.store.dispatch(
                new RemoveCounterparty({ rowId: rowData.id })
              );
              if (res['requestLocationSellers'] && res['sellerOffers']) {
                const futureLocationsRows = this.getLocationRowsWithPriceDetails(
                  res['requestLocationSellers'],
                  res['sellerOffers']
                );
                this.store.dispatch(new SetLocationsRows(futureLocationsRows));
              }
              if (res.isGroupDeleted) {
                const baseOrigin = new URL(window.location.href).origin;
                window.open(
                  `${baseOrigin}/#/edit-request/${rowData.requestId}`,
                  '_self'
                );
              }
            } else {
              if (res.isRequestStemmed) {
                this.toastr.warning(
                  'Counterparty has a stemmed order and cannot be removed from negotiation.'
                );
              } else if (res.message && res.message.length > 0) {
                this.toastr.warning(res.message);
              } else {
                this.toastr.error(res);
              }
            }
          });
      }
    });
  }

  getLocationRowsWithPriceDetails(rowsArray, priceDetailsArray) {
    let currentRequestData: any;
    let counterpartyList: any;
    this.store.subscribe(({ spotNegotiation, ...props }) => {
      currentRequestData = spotNegotiation.locations;
      counterpartyList = spotNegotiation.counterpartyList;
    });

    rowsArray.forEach((row, index) => {
      let currentLocProd = currentRequestData.filter(
        row1 => row1.locationId == row.locationId
      );

      // Optimize: Check first in the same index from priceDetailsArray; if it's not the same row, we will do the map bind
      if (
        index < priceDetailsArray.length &&
        row.id === priceDetailsArray[index]?.requestLocationSellerId
      ) {
        row.requestOffers = priceDetailsArray[index].requestOffers;
        row.isSelected = priceDetailsArray[index].isSelected;
        row.physicalSupplierCounterpartyId =
          priceDetailsArray[index].physicalSupplierCounterpartyId;
        if (priceDetailsArray[index].physicalSupplierCounterpartyId) {
          row.physicalSupplierCounterpartyName = counterpartyList.find(
            x => x.id == priceDetailsArray[index].physicalSupplierCounterpartyId
          ).displayName;
        }
        this.UpdateProductsSelection(currentLocProd, row);

        return row;
      }

      // Else if not in the same index
      const detailsForCurrentRow = priceDetailsArray.filter(
        e => e.requestLocationSellerId === row.id
      );

      // We found something
      if (detailsForCurrentRow.length > 0) {
        row.requestOffers = detailsForCurrentRow[0].requestOffers;
        row.isSelected = detailsForCurrentRow[0].isSelected;
        row.physicalSupplierCounterpartyId =
          detailsForCurrentRow[0].physicalSupplierCounterpartyId;
        if (detailsForCurrentRow[0].physicalSupplierCounterpartyId) {
          row.physicalSupplierCounterpartyName = counterpartyList.find(
            x => x.id == detailsForCurrentRow[0].physicalSupplierCounterpartyId
          ).displayName;
        }
        this.UpdateProductsSelection(currentLocProd, row);
      }
      return row;
    });

    return rowsArray;
  }

  UpdateProductsSelection(currentLocProd, row) {
    if (currentLocProd.length != 0) {
      let currentLocProdCount = currentLocProd[0].requestProducts.length;
      for (let index = 0; index < currentLocProdCount; index++) {
        let indx = index + 1;
        let val = 'checkProd' + indx;
        const status = currentLocProd[0].requestProducts[index].status;
        row[val] =
          status === 'Stemmed' || status === 'Confirmed'
            ? false
            : row.isSelected;
        //row[val] = row.isSelected;
      }
    }
  }
}
