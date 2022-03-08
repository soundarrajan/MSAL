import { SpotNegotiationStoreModel } from './../../../../../store/spot-negotiation.store';
import { map, filter, finalize } from 'rxjs/operators';
import { DatePipe, DOCUMENT } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit
} from '@angular/core';
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
  RemoveLocationsRowsOriData,
  SetCounterpartyList,
  SetLocationsRows,
  UpdateAdditionalCostList,
  UpdateRequest
} from '../../../../../store/actions/ag-grid-row.action';
import { SpotNegotiationStore } from '../../../../../store/spot-negotiation.store';
import { Observable } from 'rxjs';
import { RemoveCounterpartyComponent } from '../remove-counterparty-confirmation/remove-counterparty-confirmation';
import { AdditionalCostViewModel } from 'libs/feature/spot-negotiation/src/lib/core/models/additional-costs-model';

export const COMPONENT_TYPE_IDS = {
  TAX_COMPONENT: 1,
  PRODUCT_COMPONENT: 2
};

export const COST_TYPE_IDS = {
  FLAT: 1,
  UNIT: 2,
  PERCENT: 3,
  RANGE: 4,
  TOTAL: 5
};

@Component({
  selector: 'app-spot-negotiation-details',
  templateUrl: './spot-negotiation-details.component.html',
  styleUrls: ['./spot-negotiation-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
  requestOptions: any;

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
              this.highlightedCells[params.data.requestLocationId] &&
              params.data.id ==
                this.highlightedCells[params.data.requestLocationId]
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
  applicableForItems: any = [];
  additionalCostList: any = [];
  additionalCostTypes: any = [];
  endpointCount: number = 0;
  notAllSelectedCostRows: any[];
  notPercentageLocationCostRows: any[];

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
    const productDetails = this.spotNegotiationService.getRowProductDetails(
      updatedRow,
      product.id
    );

    if (productDetails.id == null || productDetails.price == null) {
      return;
    }

    let reqs = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.requests;
    });

    const payload = {
      RequestLocationSellerId: updatedRow.id,
      Offers: [
        {
          id: productDetails.offerId,
          totalOffer: updatedRow.totalOffer,
          totalCost: updatedRow.totalCost,
          requestOffers: [
            {
              id: productDetails.id,
              totalPrice: productDetails.totalPrice,
              amount: productDetails.amount,
              targetDifference: productDetails.targetDifference,
              price: productDetails.price,
              currencyId: productDetails.currencyId,
              cost: productDetails.cost,
              isOfferPriceCopied: productDetails.isOfferPriceCopied
            }
          ]
        }
      ]
    };
    const response = this.spotNegotiationService.updatePrices(payload);
    response.subscribe((res: any) => {
      if (res?.message == 'Unauthorized') {
        return;
      }
      if (res.status) {
        this.toastr.success('Price update successful.');
        reqs = reqs.map(e => {
          let requestLocations = e.requestLocations.map(reqLoc => {
            let requestProducts = reqLoc.requestProducts.map(reqPro =>
              productDetails.requestProductId == reqPro.id &&
              reqPro.status.toLowerCase() == 'inquired'
                ? { ...reqPro, status: 'Quoted' }
                : reqPro
            );

            return { ...reqLoc, requestProducts };
          });
          return { ...e, requestLocations };
        });
        this.store.dispatch(new UpdateRequest(reqs));
      } else {
        this.toastr.error(res.message);
        return;
      }
    });
  }

  formatRowDataPrice(row, product, field, newValue) {
    const productDetails = this.spotNegotiationService.getRowProductDetails(
      row,
      product.id
    );

    //Change with new value
    switch (field) {
      case 'offPrice':
        productDetails.price = Number(newValue.toString().replace(/,/g, ''));
        break;

      default:
        break;
    }
    let futureRow = this.spotNegotiationService.setRowProductDetails(
      row,
      productDetails,
      product.id
    );
    return futureRow;
  }
  // Calculate row fields and return new row;

  selectAllRenderer(params) {}
  getRowNodeId(data) {
    return data.id;
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
          cellClass: params => {
            const details = this.spotNegotiationService.getRowProductDetails(
              params.data,
              product.id
            );
            if (details.hasNoQuote) {
              return 'display-no-quote p-1 checkbox-center ag-checkbox-v2 grey-opacity-cell pad-lr-0 mat-check-center';
            }
            return 'p-1 checkbox-center ag-checkbox-v2 grey-opacity-cell pad-lr-0 mat-check-center';
          },
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
          cellClass: params => {
            const details = this.spotNegotiationService.getRowProductDetails(
              params.data,
              product.id
            );
            if (details.hasNoQuote) {
              return 'display-no-quote hoverCell grey-opacity-cell pad-lr-0';
            }
            return 'hoverCell grey-opacity-cell pad-lr-0';
          },
          cellRendererFramework: AGGridCellRendererV2Component,
          valueSetter: ({ colDef, data, newValue, event, elementidValue }) => {
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
              setTimeout(() => {
                event.target.focus();
              }, 300);
              return false;
            }

            this.endpointCount = 0;

            // Do calculation here;
            updatedRow = this.formatRowDataPrice(
              updatedRow,
              colDef['product'],
              colDef.field,
              newValue
            );

            this.checkAdditionalCost(updatedRow, updatedRow, colDef, newValue);

            setTimeout(() => {
              let element = document.getElementById(elementidValue);
              if (element) {
                element.focus();
              }
            }, 300);

            // setTimeout(() => {
            // //  alert(1)
            //   _this.gridOptions_counterparty.api.selectAll();
            // }, 100);

            return false;
          },
          valueGetter: params => {
            const details = this.spotNegotiationService.getRowProductDetails(
              params.data,
              product.id
            );
            return details.price;
          },
          tooltipValueGetter: params => {
            const details = this.spotNegotiationService.getRowProductDetails(
              params.data,
              product.id
            );
            return details.price;
          },
          cellRendererParams: params => {
            return {
              label: 'price-calc',
              type: 'price-calc',
              index: index,
              product: product
            };
          },
          suppressSizeToFit: true,
          lockPosition: true
        },
        {
          headerName: 'T.Pr.($)',
          headerTooltip: 'T.Pr.($)',
          field: `tPr`,
          valueGetter: params => {
            const details = this.spotNegotiationService.getRowProductDetails(
              params.data,
              product.id
            );
            return details.totalPrice;
          },
          flex: 3,
          minWidth: 95,
          cellClass: params => {
            const details = this.spotNegotiationService.getRowProductDetails(
              params.data,
              product.id
            );
            if (details.hasNoQuote) {
              return 'display-no-quote grey-opacity-cell pad-lr-0';
            }
            return 'grey-opacity-cell pad-lr-0';
          },
          cellStyle: params => {
            if (
              this.highlightedCells[product.id] &&
              params.data.id === this.highlightedCells[product.id].rowId &&
              product.id === this.highlightedCells[product.id].requestProductId
            ) {
              return { background: '#C5DCCF' };
            }

            return null;
          },
          cellRendererFramework: AGGridCellRendererV2Component,
          cellRendererParams: { type: 'addTpr', cellClass: '', index: index },
          lockPosition: true
        },
        {
          headerName: 'Amt ($)',
          headerTooltip: 'Amt ($)',
          field: `amt`,
          valueGetter: params => {
            const details = this.spotNegotiationService.getRowProductDetails(
              params.data,
              product.id
            );
            return details.amount;
          },
          flex: 4,
          minWidth: 95,
          cellClass: params => {
            const details = this.spotNegotiationService.getRowProductDetails(
              params.data,
              product.id
            );
            if (details.hasNoQuote) {
              return 'display-no-quote grey-opacity-cell pad-lr-0';
            }
            return 'grey-opacity-cell pad-lr-0';
          },
          cellRendererFramework: AGGridCellRendererV2Component,
          cellRendererParams: { type: 'amt', cellClass: '', index: index },
          lockPosition: true
        },
        {
          headerName: 'Tar. diff',
          headerTooltip: 'Tar. diff',
          field: `diff`,
          flex: 5,
          minWidth: 94,
          valueGetter: params => {
            const details = this.spotNegotiationService.getRowProductDetails(
              params.data,
              product.id
            );
            return !product.requestGroupProducts.targetPrice
              ? 0
              : details.targetDifference;
          },
          headerClass: 'border-right',
          cellClass: params => {
            const details = this.spotNegotiationService.getRowProductDetails(
              params.data,
              product.id
            );
            if (details.hasNoQuote) {
              return 'display-no-quote line-seperator grey-opacity-cell pad-lr-0';
            }
            return 'line-seperator grey-opacity-cell pad-lr-0';
          },
          cellRendererFramework: AGGridCellRendererV2Component,
          cellRendererParams: { type: 'diff', cellClass: '', index: index },
          lockPosition: true
        },
        {
          headerName: 'MJ/KJ',
          headerTooltip: 'MJ/KJ',
          field: `mj$`,
          columnGroupShow: 'open',
          cellClass: params => {
            const details = this.spotNegotiationService.getRowProductDetails(
              params.data,
              product.id
            );
            if (details.hasNoQuote) {
              return 'display-no-quote grey-opacity-cell pad-lr-0';
            }
            return 'grey-opacity-cell pad-lr-0';
          },
          lockPosition: true
        },
        {
          headerName: 'TCO ($)',
          headerTooltip: 'TCO ($)',
          field: `tco$`,
          columnGroupShow: 'open',
          cellClass: params => {
            const details = this.spotNegotiationService.getRowProductDetails(
              params.data,
              product.id
            );
            if (details.hasNoQuote) {
              return 'display-no-quote grey-opacity-cell pad-lr-0';
            }
            return 'grey-opacity-cell pad-lr-0';
          },
          lockPosition: true
        },
        {
          headerName: 'E. diff',
          headerTooltip: 'E. diff',
          field: `ediff`,
          columnGroupShow: 'open',
          headerClass: 'border-right',
          cellClass: params => {
            const details = this.spotNegotiationService.getRowProductDetails(
              params.data,
              product.id
            );
            if (details.hasNoQuote) {
              return 'display-no-quote line-seperator grey-opacity-cell pad-lr-5';
            }
            return 'line-seperator grey-opacity-cell pad-lr-5';
          },
          lockPosition: true
        }
      ]
    };
  }

  saveAdditionalCosts(
    offerAdditionalCostList,
    locationAdditionalCostsList,
    updatedRow,
    colDef,
    newValue
  ) {
    let payload = {
      additionalCosts: offerAdditionalCostList
        .concat(this.notAllSelectedCostRows)
        .concat(
          locationAdditionalCostsList.concat(this.notPercentageLocationCostRows)
        )
    };
    this.spotNegotiationService
      .saveOfferAdditionalCosts(payload)
      .subscribe((res: any) => {
        if (res?.message == 'Unauthorized') {
          return;
        }
        if (res.status) {
          this.getSellerLine(updatedRow, colDef, newValue);
        } else this.toastr.error('Please try again later.');
      });
  }

  getSellerLine(sellerOffers, colDef, newValue) {
    const groupId = parseFloat(this.route.snapshot.params.spotNegotiationId);
    const requestLocationSellerId = sellerOffers.id;
    this.spotNegotiationService
      .getPriceDetailsById(groupId, requestLocationSellerId)
      .subscribe((priceDetailsRes: any) => {
        this.spinner.hide();
        if (priceDetailsRes?.message == 'Unauthorized') {
          return;
        }
        let updatedRow = { ...sellerOffers };
        updatedRow.totalOffer = priceDetailsRes.sellerOffers[0].totalOffer;
        updatedRow.totalCost = priceDetailsRes.sellerOffers[0].totalCost;
        for (
          let i = 0;
          i < priceDetailsRes.sellerOffers[0].requestOffers.length;
          i++
        ) {
          let offerLine = priceDetailsRes.sellerOffers[0].requestOffers[i];
          let findElementIndex = _.findIndex(
            sellerOffers.requestOffers,
            function(object: any) {
              return object.id == offerLine.id;
            }
          );
          if (findElementIndex != -1) {
            updatedRow.requestOffers[findElementIndex].cost = offerLine.cost;
            updatedRow.requestOffers[findElementIndex].price = offerLine.price;
            updatedRow.requestOffers[findElementIndex].totalPrice =
              offerLine.totalPrice;
            updatedRow.requestOffers[findElementIndex].amount =
              offerLine.amount;
            updatedRow.requestOffers[findElementIndex].targetDifference =
              offerLine.targetDifference;
          }
        }
        const currentLocation = this.locations.find(
          e => e.locationId === updatedRow.locationId
        );

        //Do the calculation here
        updatedRow = this.spotNegotiationService.formatRowData(
          updatedRow,
          colDef['product'],
          colDef.field,
          newValue,
          currentLocation,
          false,
          null
        );

        // Update the store
        this.store.dispatch(new EditLocationRow(updatedRow));

        // Save to the cloud
        this.saveRowToCloud(updatedRow, colDef['product']);
      });
  }

  checkAdditionalCost(sellerOffers, updatedRow, colDef, newValue) {
    this.store.subscribe(({ spotNegotiation, ...props }) => {
      this.currentRequestSmallInfo = spotNegotiation.currentRequestSmallInfo;
    });
    let requestLocationId = sellerOffers.requestLocationId;
    let findRequestLocationIndex = _.findIndex(
      this.currentRequestSmallInfo?.requestLocations,
      function(object: any) {
        return object.id == requestLocationId;
      }
    );
    if (findRequestLocationIndex != -1) {
      let requestLocation = this.currentRequestSmallInfo?.requestLocations[
        findRequestLocationIndex
      ];
      const payload = {
        offerId: sellerOffers.requestOffers[0].offerId,
        requestLocationId: sellerOffers.requestLocationId,
        isLocationBased: false
      };
      this.notPercentageLocationCostRows = [];
      this.notAllSelectedCostRows = [];
      this.spinner.show();
      this.spotNegotiationService
        .getAdditionalCosts(payload)
        .subscribe((response: any) => {
          if (response?.message == 'Unauthorized') {
            return;
          }
          if (typeof response === 'string') {
            this.getSellerLine(updatedRow, colDef, newValue);
            return;
          } else {
            let offerAdditionalCostList = _.cloneDeep(
              _.filter(response.offerAdditionalCosts, function(
                offerAdditionalCost
              ) {
                return (
                  offerAdditionalCost.isAllProductsCost ||
                  offerAdditionalCost.costTypeId == COST_TYPE_IDS.PERCENT
                );
              })
            ) as AdditionalCostViewModel[];
            this.notAllSelectedCostRows = _.cloneDeep(
              _.filter(response.offerAdditionalCosts, function(
                offerAdditionalCost
              ) {
                return !(
                  offerAdditionalCost.isAllProductsCost ||
                  offerAdditionalCost.costTypeId == COST_TYPE_IDS.PERCENT
                );
              })
            ) as AdditionalCostViewModel[];

            let locationAdditionalCostList = _.cloneDeep(
              _.filter(response.locationAdditionalCosts, function(
                locationAdditionalCost
              ) {
                return (
                  locationAdditionalCost.costTypeId == COST_TYPE_IDS.PERCENT
                );
              })
            ) as AdditionalCostViewModel[];
            this.notPercentageLocationCostRows = _.cloneDeep(
              _.filter(response.locationAdditionalCosts, function(
                locationAdditionalCost
              ) {
                return (
                  locationAdditionalCost.costTypeId != COST_TYPE_IDS.PERCENT
                );
              })
            ) as AdditionalCostViewModel[];

            if (
              offerAdditionalCostList.length == 0 &&
              locationAdditionalCostList.length == 0
            ) {
              this.getSellerLine(updatedRow, colDef, newValue);
              return;
            }

            let {
              productList,
              applicableForItems,
              totalMaxQuantity,
              maxQuantityUomId
            } = this.buildApplicableForItems(requestLocation, sellerOffers);

            this.recalculateLocationAdditionalCosts(
              locationAdditionalCostList,
              true,
              productList,
              offerAdditionalCostList,
              sellerOffers,
              locationAdditionalCostList,
              updatedRow,
              colDef,
              newValue,
              -1
            );

            this.recalculateLocationAdditionalCosts(
              offerAdditionalCostList,
              false,
              productList,
              offerAdditionalCostList,
              sellerOffers,
              locationAdditionalCostList,
              updatedRow,
              colDef,
              newValue,
              -1
            );

            for (let i = 0; i < offerAdditionalCostList.length; i++) {
              if (offerAdditionalCostList[i].isAllProductsCost) {
                let cost = offerAdditionalCostList[i];
                this.onApplicableForChange(
                  cost,
                  sellerOffers,
                  totalMaxQuantity,
                  maxQuantityUomId
                );

                this.additionalCostNameChanged(
                  cost,
                  offerAdditionalCostList,
                  productList,
                  sellerOffers,
                  locationAdditionalCostList,
                  updatedRow,
                  colDef,
                  newValue,
                  i
                );
              }
            }
          }
        });
    }
  }

  recalculateLocationAdditionalCosts(
    additionalCostList,
    locationAdditionalCostFlag,
    productList,
    offerAdditionalCostList,
    rowData,
    locationAdditionalCostsList,
    updatedRow,
    colDef,
    newValue,
    index
  ) {
    for (let i = 0; i < additionalCostList.length; i++) {
      if (!additionalCostList[i].isDeleted) {
        if (additionalCostList[i].costTypeId == COST_TYPE_IDS.PERCENT) {
          additionalCostList[i].totalAmount = 0;
          this.calculateAdditionalCostAmounts(
            additionalCostList[i],
            locationAdditionalCostFlag,
            productList,
            offerAdditionalCostList,
            rowData,
            locationAdditionalCostsList,
            updatedRow,
            colDef,
            newValue,
            i
          );
        }
      }
    }
  }

  additionalCostNameChanged(
    additionalCost,
    offerAdditionalCostList,
    productList,
    rowData,
    locationAdditionalCostsList,
    updatedRow,
    colDef,
    newValue,
    index
  ) {
    if (additionalCost.costTypeId == 2) {
      this.addPriceUomChanged(
        additionalCost,
        productList,
        offerAdditionalCostList,
        rowData,
        locationAdditionalCostsList,
        updatedRow,
        colDef,
        newValue,
        index
      );
    } else {
      this.calculateAdditionalCostAmounts(
        additionalCost,
        false,
        productList,
        offerAdditionalCostList,
        rowData,
        locationAdditionalCostsList,
        updatedRow,
        colDef,
        newValue,
        index
      );
    }
  }

  addPriceUomChanged(
    additionalCost,
    productList,
    offerAdditionalCostList,
    rowData,
    locationAdditionalCostsList,
    updatedRow,
    colDef,
    newValue,
    index
  ) {
    if (!additionalCost.priceUomId) {
      return;
    }
    additionalCost.prodConv = _.cloneDeep([]);

    for (let i = 0; i < productList.length; i++) {
      let prod = productList[i];
      this.setConvertedAddCost(
        prod,
        additionalCost,
        i,
        productList,
        offerAdditionalCostList,
        rowData,
        locationAdditionalCostsList,
        updatedRow,
        colDef,
        newValue,
        index
      );
    }
  }

  setConvertedAddCost(
    prod,
    additionalCost,
    i,
    productList,
    offerAdditionalCostList,
    rowData,
    locationAdditionalCostsList,
    updatedRow,
    colDef,
    newValue,
    index
  ) {
    this.getConvertedUOM(
      prod.productId,
      1,
      prod.uomId,
      additionalCost.priceUomId,
      additionalCost,
      i,
      productList,
      offerAdditionalCostList,
      rowData,
      locationAdditionalCostsList,
      updatedRow,
      colDef,
      newValue,
      index
    );
  }

  getConvertedUOM(
    productId,
    quantity,
    fromUomId,
    toUomId,
    additionalCost,
    i,
    productList,
    offerAdditionalCostList,
    rowData,
    locationAdditionalCostsList,
    updatedRow,
    colDef,
    newValue,
    index
  ) {
    let payload = {
      Payload: {
        ProductId: productId,
        Quantity: quantity,
        FromUomId: fromUomId,
        ToUomId: toUomId
      }
    };

    if (toUomId == fromUomId) {
      additionalCost.prodConv[i] = 1;
      if (
        additionalCost.priceUomId &&
        additionalCost.prodConv &&
        additionalCost.prodConv.length == productList.length
      ) {
        this.calculateAdditionalCostAmounts(
          additionalCost,
          false,
          productList,
          offerAdditionalCostList,
          rowData,
          locationAdditionalCostsList,
          updatedRow,
          colDef,
          newValue,
          index
        );
      }
    } else {
      this.endpointCount += 1;
      this.spotNegotiationService
        .getUomConversionFactor(payload)
        .pipe(finalize(() => {}))
        .subscribe((result: any) => {
          this.endpointCount -= 1;
          if (result?.message == 'Unauthorized') {
            return;
          }
          if (typeof result == 'string') {
            this.toastr.error(result);
          } else {
            additionalCost.prodConv[i] = _.cloneDeep(result);
            if (
              additionalCost.priceUomId &&
              additionalCost.prodConv &&
              additionalCost.prodConv.length == productList.length
            ) {
              this.calculateAdditionalCostAmounts(
                additionalCost,
                false,
                productList,
                offerAdditionalCostList,
                rowData,
                locationAdditionalCostsList,
                updatedRow,
                colDef,
                newValue,
                index
              );
            }
          }
        });
    }
  }

  /**
   * Calculates the amount-related fields of an additional cost, as per FSD p. 139: Amount, Extras Amount, Total Amount.
   */
  calculateAdditionalCostAmounts(
    additionalCost,
    locationAdditionalCostFlag,
    productList,
    offerAdditionalCostList,
    rowData,
    locationAdditionalCostsList,
    updatedRow,
    colDef,
    newValue,
    index
  ) {
    let totalAmount, productComponent;
    if (!additionalCost.costTypeId) {
      return additionalCost;
    }
    switch (additionalCost.costTypeId) {
      case COST_TYPE_IDS.FLAT:
        additionalCost.amount = parseFloat(additionalCost.price);
        productComponent = this.isProductComponent(additionalCost);
        if (!locationAdditionalCostFlag) {
          offerAdditionalCostList[index].amountIsCalculated = true;
        }
        break;

      case COST_TYPE_IDS.UNIT:
        additionalCost.amount = 0;
        productComponent = this.isProductComponent(additionalCost);
        if (
          additionalCost.priceUomId &&
          additionalCost.prodConv &&
          additionalCost.prodConv.length == productList.length
        ) {
          for (let i = 0; i < productList.length; i++) {
            let product = productList[i];
            if (
              additionalCost.isAllProductsCost ||
              product.id == additionalCost.requestProductId
            ) {
              additionalCost.amount =
                additionalCost.amount +
                product.maxQuantity *
                  additionalCost.prodConv[i] *
                  parseFloat(additionalCost.price);
            }
          }
          if (!locationAdditionalCostFlag) {
            offerAdditionalCostList[index].amountIsCalculated = true;
          }
        }
        break;

      case COST_TYPE_IDS.PERCENT:
        productComponent = this.isProductComponent(additionalCost);
        if (additionalCost.isAllProductsCost || !productComponent) {
          totalAmount = this.sumProductAmounts(
            rowData.requestOffers,
            productList
          );
        } else {
          let findProductIndex = _.findIndex(rowData.requestOffers, function(
            object: any
          ) {
            return object.requestProductId == additionalCost.requestProductId;
          });

          if (findProductIndex != -1) {
            let product = _.cloneDeep(rowData.requestOffers[findProductIndex]);
            let currentPrice = Number(product.price);
            let findProduct = _.find(productList, function(item) {
              return item.id == product.requestProductId;
            });
            if (findProduct) {
              totalAmount = Number(currentPrice * findProduct.maxQuantity);
            }
          }
        }
        if (productComponent) {
          additionalCost.amount = (totalAmount * additionalCost.price) / 100;
        } else {
          if (!locationAdditionalCostFlag) {
            totalAmount =
              totalAmount +
              this.sumProductComponentAdditionalCostAmounts(
                offerAdditionalCostList
              );
          }

          additionalCost.amount =
            (totalAmount * parseFloat(additionalCost.price)) / 100;
        }
        if (!locationAdditionalCostFlag) {
          offerAdditionalCostList[index].amountIsCalculated = true;
        } else {
          locationAdditionalCostsList[index].amountIsCalculated = true;
        }
        break;
      case COST_TYPE_IDS.RANGE:
      case COST_TYPE_IDS.TOTAL:
        additionalCost.amount = parseFloat(additionalCost.price) || 0;
        if (!locationAdditionalCostFlag) {
          offerAdditionalCostList[index].amountIsCalculated = true;
        }
        break;
    }

    if (isNaN(additionalCost.amount)) {
      additionalCost.amount = null;
    }

    additionalCost.extraAmount =
      (additionalCost.extras / 100) * additionalCost.amount;

    if (isNaN(additionalCost.extraAmount)) {
      additionalCost.extraAmount = null;
    }

    additionalCost.totalAmount =
      additionalCost.amount + additionalCost.extraAmount || 0;
    if (isNaN(additionalCost.totalAmount)) {
      additionalCost.totalAmount = null;
    }

    additionalCost.ratePerUom =
      additionalCost.totalAmount / additionalCost.maxQuantity;
    if (isNaN(additionalCost.ratePerUom)) {
      additionalCost.ratePerUom = null;
    }
    let checkAdditionalCostRowIndex = _.findIndex(
      offerAdditionalCostList,
      function(obj: any) {
        return (
          !obj.amountIsCalculated &&
          (obj.isAllProductsCost || obj.costTypeId == COST_TYPE_IDS.PERCENT)
        );
      }
    );
    let checkLocationCostRowIndex = _.findIndex(
      locationAdditionalCostsList,
      function(obj: any) {
        return (
          !obj.amountIsCalculated && obj.costTypeId == COST_TYPE_IDS.PERCENT
        );
      }
    );

    if (
      this.endpointCount == 0 &&
      checkAdditionalCostRowIndex == -1 &&
      checkLocationCostRowIndex == -1
    ) {
      this.saveAdditionalCosts(
        offerAdditionalCostList,
        locationAdditionalCostsList,
        updatedRow,
        colDef,
        newValue
      );
    }
  }

  /**
   * Sum the Amount field of all products.
   */
  sumProductAmounts(products, productList) {
    let result = 0;
    let newProducts = _.cloneDeep(products);
    for (let i = 0; i < newProducts.length; i++) {
      let currentPrice = Number(newProducts[i].price);
      let findProduct = _.find(productList, function(item) {
        return item.id == newProducts[i].requestProductId;
      });
      if (findProduct) {
        result += Number(currentPrice * findProduct.maxQuantity);
      }
    }
    return result;
  }
  /**
   * Sum the amounts of all additional costs that are NOT tax component additional costs.
   */
  sumProductComponentAdditionalCostAmounts(additionalCostList) {
    let result = 0;
    if (!additionalCostList.length) {
      return;
    }
    for (let i = 0; i < additionalCostList.length; i++) {
      if (!additionalCostList[i].isDeleted) {
        if (
          this.isProductComponent(additionalCostList[i]) ||
          additionalCostList[i].costTypeId !== COST_TYPE_IDS.PERCENT
        ) {
          result = result + additionalCostList[i].totalAmount;
        }
      }
    }
    return result;
  }

  /**
   * Checks if the given additional cost belongs
   * to the ProductComponent category.
   */
  isProductComponent(additionalCost) {
    if (!additionalCost.additionalCostId) {
      return false;
    }
    additionalCost.isTaxComponent = false;
    if (
      this.additionalCostTypes[additionalCost.additionalCostId].componentType
    ) {
      additionalCost.isTaxComponent = !(
        this.additionalCostTypes[additionalCost.additionalCostId].componentType
          .id === COMPONENT_TYPE_IDS.PRODUCT_COMPONENT
      );
      if (additionalCost.isTaxComponent) {
      } else {
        additionalCost.isTaxComponent = false;
      }
      return (
        this.additionalCostTypes[additionalCost.additionalCostId].componentType
          .id === COMPONENT_TYPE_IDS.PRODUCT_COMPONENT
      );
    }

    return null;
  }

  onApplicableForChange(cost, rowData, totalMaxQuantity, maxQuantityUomId) {
    cost.requestOfferIds = this.getRequestOfferIds(rowData);
    cost.currencyId = this.getCurrencyId(rowData);

    cost.maxQuantity = totalMaxQuantity;
    cost.maxQuantityUomId = maxQuantityUomId;
  }

  getRequestOfferIds(rowData) {
    let requestOfferIds = [];
    for (let i = 0; i < rowData.requestOffers.length; i++) {
      requestOfferIds.push(rowData.requestOffers[i].id);
    }

    return requestOfferIds.join(',');
  }

  getRequestProductIds(rowData) {
    let requestProductsIds = [];

    for (let i = 0; i < rowData.requestOffers.length; i++) {
      requestProductsIds.push(rowData.requestOffers[i].requestProductId);
    }

    return requestProductsIds;
  }

  getCurrencyId(rowData) {
    return rowData.requestOffers[0].currencyId;
  }

  /**
   * Create Applicable For dropdown values
   */

  buildApplicableForItems(requestLocation, rowData) {
    let applicableForItems = [];
    let productList = [];
    let applicableForItemsArray = [];
    let totalMaxQuantity = 0;
    let maxQuantityUomId = null;
    requestLocation.requestProducts.forEach((product: any, index) => {
      if (product.status != 'Stemmed') {
        let findRowDataOfferIndex = _.findIndex(rowData.requestOffers, function(
          object: any
        ) {
          return object.requestProductId == product.id && object.price;
        });
        if (findRowDataOfferIndex != -1) {
          applicableForItemsArray.push({
            id: product.id,
            name: product.productName,
            productId: product.productId
          });

          totalMaxQuantity = totalMaxQuantity + product.maxQuantity;
          maxQuantityUomId = product.uomId;

          productList.push(product);
        }
      }
    });
    if (applicableForItemsArray.length > 1) {
      const allElement = { id: 0, name: 'All' };
      applicableForItems = _.cloneDeep(
        [allElement].concat(applicableForItemsArray)
      );
    } else {
      this.applicableForItems = _.cloneDeep(applicableForItemsArray);
    }

    return {
      productList: productList,
      applicableForItems: applicableForItems,
      totalMaxQuantity,
      maxQuantityUomId
    };
  }

  checkHighlight({ product }, requestProductsLength, reqLocationId) {
    var smallestTotalPrice = Infinity;
    var smallestOffer = Infinity;

    if (this.locationsRows && this.locationsRows.length > 0) {
      if (this.highlightedCells[product.id]) {
        const smallestRow = this.locationsRows.find(
          x => x.id === this.highlightedCells[product.id].rowId
        );
        const offerDetails = smallestRow?.requestOffers?.find(
          x =>
            x.requestProductId ===
            this.highlightedCells[product.id].requestProductId
        );
        if (offerDetails) smallestTotalPrice = offerDetails.totalPrice;
      }

      if (this.highlightedCells[reqLocationId]) {
        const lowestTotalOfferRow = this.locationsRows.find(
          x => x.id === this.highlightedCells[reqLocationId]
        );
        if (lowestTotalOfferRow.totalOffer)
          smallestOffer = lowestTotalOfferRow.totalOffer;
      }

      this.locationsRows.map(row => {
        // Create key with id if dosen't exists;
        if (!this.highlightedCells[product.id]) {
          this.highlightedCells[product.id] = {};
        }

        // Set smallest total price
        const productDetails = this.spotNegotiationService.getRowProductDetails(
          row,
          product.id
        );

        if (
          productDetails.totalPrice &&
          Number(productDetails.totalPrice) > 0 &&
          Number(smallestTotalPrice) > Number(productDetails.totalPrice)
        ) {
          smallestTotalPrice = productDetails.totalPrice;
          this.highlightedCells[product.id].rowId = row.id;
          this.highlightedCells[product.id].requestProductId = product.id;
        }

        if (!this.highlightedCells[reqLocationId]) {
          this.highlightedCells[reqLocationId] = 0;
        }
        // Set smallest offer price
        const quotedProductsLength = row.requestOffers?.filter(x => x.price)
          .length;
        if (
          row.totalOffer &&
          quotedProductsLength === requestProductsLength &&
          row.requestLocationId == reqLocationId &&
          Number(row.totalOffer) > 0 &&
          Number(smallestOffer) > Number(row.totalOffer)
        ) {
          smallestOffer = row.totalOffer;
          // Create key with id if dosen't exists;

          this.highlightedCells[reqLocationId] = row.id;
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

    this.getAdditionalCosts();

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
      this.requestOptions = spotNegotiation.requests;

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
          this.checkHighlight(
            { product: reqProduct },
            requestProductsLength,
            reqLocation.id
          );
          this.columnDef_aggridObj[i].push(
            this.createProductHeader(reqProduct, reqLocation.id, index)
          );
        });
      });

      // Detect change and update the ui
      if (!this.changeDetector['destroyed']) {
        this.changeDetector.detectChanges();
      }
    });
    this.isEnabledView = true;
  }

  getAdditionalCosts() {
    this.spotNegotiationService
      .getMasterAdditionalCosts({})
      .subscribe((response: any) => {
        if (response?.message == 'Unauthorized') {
          return;
        }
        if (typeof response === 'string') {
          this.spinner.hide();
          this.toastr.error(response);
        } else {
          this.additionalCostList = _.cloneDeep(
            response.payload.filter(e => e.isDeleted == false)
          );
          this.store.dispatch(
            new UpdateAdditionalCostList(this.additionalCostList)
          );
          this.createAdditionalCostTypes();
        }
      });
  }

  createAdditionalCostTypes() {
    for (let i = 0; i < this.additionalCostList.length; i++) {
      if (
        typeof this.additionalCostTypes[this.additionalCostList[i].id] ==
        'undefined'
      ) {
        this.additionalCostTypes[this.additionalCostList[i].id] = [];
      }
      this.additionalCostTypes[
        this.additionalCostList[i].id
      ] = this.additionalCostList[i];
    }
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

  removeCounterpartyAPI(
    rowData: any,
    rowIndex: number,
    gridApi: any,
    rfqId: any,
    requestProductIds: any
  ) {
    this.spinner.show();
    this.spotNegotiationService
      .RemoveCounterparty(rowData.id)
      .subscribe((res: any) => {
        this.spinner.hide();
        if (res?.message == 'Unauthorized') {
          return;
        }
        if (res.status) {
          let dataRows = [];
          gridApi.forEachNode(node => dataRows.push(node.data));
          dataRows = dataRows.splice(rowIndex, 1);
          //gridApi.applyTransaction({ remove: dataRows });
          gridApi.updateRowData({ remove: dataRows });
          this.toastr.success(
            'Counterparty has been removed from negotiation succesfully.'
          );
          this.store.dispatch(new RemoveCounterparty({ rowId: rowData.id }));
          this.store.dispatch(
            new RemoveLocationsRowsOriData({ rowId: rowData.id })
          );
          if (res['requestLocationSellers'] && res['sellerOffers']) {
            const futureLocationsRows = this.getLocationRowsWithPriceDetails(
              res['requestLocationSellers'],
              res['sellerOffers']
            );
            if (rfqId) {
              this.requestOptions = this.requestOptions.map(e => {
                let requestLocations = e.requestLocations.map(reqLoc => {
                  let requestProducts = null;
                  if (
                    futureLocationsRows.filter(
                      lr =>
                        lr.requestLocationId == reqLoc.id && lr.requestOffers
                    ).length == 0 ||
                    futureLocationsRows.filter(
                      lr =>
                        lr.requestLocationId == reqLoc.id &&
                        lr.requestOffers?.find(x => !x.isRfqskipped)
                    ).length == 0
                  ) {
                    requestProducts = reqLoc.requestProducts.map(reqPro =>
                      requestProductIds.some(x => x.includes(reqPro.id))
                        ? { ...reqPro, status: 'ReOpen' }
                        : reqPro
                    );
                  }

                  return requestProducts
                    ? { ...reqLoc, requestProducts }
                    : reqLoc;
                });
                return requestLocations ? { ...e, requestLocations } : e;
              });
              this.store.dispatch(new UpdateRequest(this.requestOptions));
            }
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

  isStemmedproduct(rowData) {
    const locations = this.store.selectSnapshot(
      (state: SpotNegotiationStoreModel) => {
        return state['spotNegotiation'].locations;
      }
    );
    for (let index = 0; index < rowData.requestOffers.length; index++) {
      let selectedlocations = locations.filter(
        row => row.locationId == rowData.locationId
      );
      if (
        selectedlocations.length != 0 &&
        selectedlocations[0].requestProducts
      ) {
        let locationsprod = selectedlocations[0].requestProducts.filter(
          row1 => row1.id == rowData.requestOffers[index].requestProductId
        );
        if (locationsprod.length != 0) {
          if (
            locationsprod[0].status &&
            locationsprod[0].status == 'Stemmed' &&
            rowData.requestOffers[index].price != null
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }
  removeCounterpartyRowClicked(rowData: any, rowIndex: number, gridApi: any) {
    if (rowData.requestOffers != undefined) {
      if (this.isStemmedproduct(rowData)) {
        this.toastr.warning(
          'Counterparty has a stemmed order and cannot be removed from negotiation.'
        );
        return;
      } else {
        let rfqId = [...new Set(rowData.requestOffers?.map(ro => ro.rfqId))][0];
        let requestProductIds = this.locationsRows
          .filter(
            r =>
              r.requestOffers &&
              r.requestOffers.find(ro => ro.rfqId == rfqId && !ro.isRfqskipped)
          )
          .map(x =>
            x.requestOffers
              .filter(r => !r.isRfqskipped)
              .map(r => r.requestProductId)
          );
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
            this.removeCounterpartyAPI(
              rowData,
              rowIndex,
              gridApi,
              rfqId,
              requestProductIds
            );
          }
        });
      }
    } else {
      this.removeCounterpartyAPI(rowData, rowIndex, gridApi, null, null);
    }
  }

  onCostChanged(locationRows: any) {
    // Get current id from url and make a request with that data.

    const groupId = this.route.snapshot.params.spotNegotiationId;
    let rows = _.cloneDeep(locationRows);
    this.spotNegotiationService
      .getPriceDetails(groupId)
      .subscribe((res: any) => {
        if (res?.message == 'Unauthorized') {
          return;
        }
        if (res['sellerOffers']) {
          const futureLocationsRows = this.getLocationRowsWithPriceDetails(
            rows,
            res['sellerOffers']
          );
          this.store.dispatch(new SetLocationsRows(futureLocationsRows));
        }
      });
  }

  getLocationRowsWithPriceDetails(rowsArray, priceDetailsArray) {
    let currentRequestData: any;
    //let counterpartyList: any;
    this.store.subscribe(({ spotNegotiation, ...props }) => {
      currentRequestData = spotNegotiation.locations;
      //counterpartyList = spotNegotiation.counterparties;
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
        // row.physicalSupplierCounterpartyId =
        //   priceDetailsArray[index].physicalSupplierCounterpartyId;
        // if (priceDetailsArray[index].physicalSupplierCounterpartyId) {
        //   row.physicalSupplierCounterpartyName = counterpartyList.find(
        //     x => x.id == priceDetailsArray[index].physicalSupplierCounterpartyId
        //   ).displayName;
        // }
        // row.requestOffers = priceDetailsArray[
        //   index
        // ].requestOffers?.sort((a, b) =>
        //   a.requestProductId > b.requestProductId ? 1 : -1
        // );
        row.totalOffer = priceDetailsArray[index].totalOffer;
        row.totalCost = priceDetailsArray[index].totalCost;
        this.UpdateProductsSelection(currentLocProd, row);
        row.requestOffers = row.requestOffers?.sort((a, b) =>
          a.requestProductTypeId === b.requestProductTypeId
            ? a.requestProductId > b.requestProductId
              ? 1
              : -1
            : a.requestProductTypeId > b.requestProductTypeId
            ? 1
            : -1
        );
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
        // row.physicalSupplierCounterpartyId =
        //   detailsForCurrentRow[0].physicalSupplierCounterpartyId;
        // if (detailsForCurrentRow[0].physicalSupplierCounterpartyId) {
        //   row.physicalSupplierCounterpartyName = counterpartyList.find(
        //     x => x.id == detailsForCurrentRow[0].physicalSupplierCounterpartyId
        //   ).displayName;
        // }
        row.totalOffer = detailsForCurrentRow[0].totalOffer;
        row.totalCost = detailsForCurrentRow[0].totalCost;
        this.UpdateProductsSelection(currentLocProd, row);
        row.requestOffers = row.requestOffers?.sort((a, b) =>
          a.requestProductTypeId === b.requestProductTypeId
            ? a.requestProductId > b.requestProductId
              ? 1
              : -1
            : a.requestProductTypeId > b.requestProductTypeId
            ? 1
            : -1
        );
      }
      return row;
    });

    return rowsArray;
  }

  UpdateProductsSelection(currentLocProd, row) {
    if (currentLocProd.length != 0) {
      let currentLocProdCount = currentLocProd[0].requestProducts.length;
      row.requestOffers.forEach(element1 => {
        let FilterProdut = currentLocProd[0].requestProducts.filter(
          col => col.id == element1.requestProductId
        );
        element1.requestProductTypeId = FilterProdut[0]?.productTypeId;
      });
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
