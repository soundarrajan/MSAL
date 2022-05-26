import { SpotNegotiationStoreModel } from './../../../../../store/spot-negotiation.store';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import _, { cloneDeep } from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { GridOptions} from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { AGGridCellActionsComponent } from '../../../../../core/ag-grid/ag-grid-cell-actions.component';
import { AGGridCellRendererV2Component } from '../../../../../core/ag-grid/ag-grid-cell-rendererv2.component';
import { ShiptechCustomHeaderGroup } from '../../../../../core/ag-grid/shiptech-custom-header-group';
import { SpotNegotiationService } from '../../../../../services/spot-negotiation.service';
import {
  EditLocationRow,
  RemoveCounterparty,
  RemoveLocationsRowsOriData,
  SetLocationsRows,
  UpdateAdditionalCostList,
  UpdateRequest
} from '../../../../../store/actions/ag-grid-row.action';
import { SpotNegotiationStore } from '../../../../../store/spot-negotiation.store';
import { Observable } from 'rxjs';
import { RemoveCounterpartyComponent } from '../remove-counterparty-confirmation/remove-counterparty-confirmation';
import { CustomHeader } from 'libs/feature/spot-negotiation/src/lib/core/ag-grid/custom-header.component';
import { CustomHeaderSelectAll } from 'libs/feature/spot-negotiation/src/lib/core/ag-grid/custom-header-select-all.component';
import { SpotNegotiationPriceCalcService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation-price-calc.service';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';

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
  interval: any = 0;
  intervalAll: any = 0;
  rowData_aggrid: any = [];
  locationsRows: any = [];
  currentRequestSmallInfo: any;
  highlightedCells = [];
  uomsMap: any;
  requestOptions: any;
  Index: number;
  reqLocId: number;



  @Input('location') set _setlocation(location) {
    this.reqLocId = location.id;
  }
  @Input('locationIndex') set _setlocationIndex(locationIndex) {
    this.Index = locationIndex;
  }

  public overlayLoadingTemplate =
    '<div class="bootstrap-loading"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>';
  public overlayNoRowsTemplate = '<span>No rows to show</span>';
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
    // 'display-no-quote': function(params) {
    //   const offPrice = params.data.isQuote;
    //   return offPrice == 'No quote';
    // }
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
          width: 20,
          minWidth: 20,
          maxWidth: 30,
          // checkboxSelection: true,
          // headerCheckboxSelection: true,
          resizable: false,
          suppressMovableColumns: true,
          suppressNavigable: true,
          lockVisible: true,
          pinned: 'left',
          headerClass: 'header-checkbox-center checkbox-center ag-checkbox-v2',

          cellClass:
            'p-1 checkbox-center ag-checkbox-v2 grey-opacity-cell pad-lr-0 mat-check-center',
          cellRendererFramework: AGGridCellActionsComponent,

          cellRendererParams: { type: 'checkbox-selection' },

          headerComponentFramework: CustomHeaderSelectAll

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
          lockVisible: true,
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
          lockVisible: true,
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
          lockVisible: true,
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
          headerTooltip: 'Physical Supplier',
          suppressNavigable: true,
          lockVisible: true,
          pinned: 'left',
          headerClass: 'border-right',
          field: 'physicalSupplierCounterpartyName',
          width: 150,
          minWidth: 100,
          suppressSizeToFit: true,
          cellClass: 'line-seperator-pinned',
          cellRendererFramework: AGGridCellRendererV2Component,
          cellRendererParams: { type: 'phy-supplier' },
          valueGetter: params => {
            return this.tenantService.htmlDecode(params.data.physicalSupplierCounterpartyName);
          }
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
          minWidth: 125,
          headerClass: 'border-right',
          cellClass: params =>{
            if (
              this.highlightedCells[params.data.requestId] &&
              params.data.id == this.highlightedCells[params.data.requestId]
            ) {
              return "line-seperator offerPriceHighLight "+'tf_'+params.data.id;
            }
            return 'line-seperator '+'tf_'+params.data.id;
          },
          cellRendererFramework: AGGridCellRendererV2Component,
          cellRendererParams: { type: 'totalOffer', cellClass: '' },
          suppressNavigable: true,
          lockVisible: true,
          valueGetter: params => {
            let totalOfferVal = null;
            params.data.requestOffers?.forEach(element => {
              totalOfferVal += element.amount;
            });
            return this.tenantService.amount(totalOfferVal);
          }
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
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private store: Store,
    private spotNegotiationService: SpotNegotiationService,
    private changeDetector: ChangeDetectorRef,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private spotNegotiationPriceCalcService: SpotNegotiationPriceCalcService,
    private tenantService: TenantFormattingService
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
      tooltipShowDelay:0,
      columnDefs: this.columnDef_aggrid,
      suppressCellSelection: true,
      // suppressMovable: true,
      suppressMovableColumns: true,
      suppressDragLeaveHidesColumns: true,
      // lockVisible: true,
      headerHeight: 30,
      groupHeaderHeight: 80,
      rowHeight: 35,
      animateRows: false,
      onFirstDataRendered(params) {
        if (params.columnApi.getAllDisplayedColumns().length <= 20) {
          params.api.sizeColumnsToFit();
        }
        params.api?.hideOverlay();
      },
      onGridReady: params => {
        // Ng init for AG GRID;
        this.Isspotgridrefresh = true;
        params.api.showLoadingOverlay();
        this.gridOptions_counterparty.api = params.api;
        this.gridOptions_counterparty.columnApi = params.columnApi;
        if (params.columnApi.getAllDisplayedColumns().length <= 20) {
          params.api.sizeColumnsToFit();
        }
        this.rowCount = this.gridOptions_counterparty.api.getDisplayedRowCount();
        this.totalOfferHeaderWidth = params.columnApi
          .getColumn('totalOffer')
          .getActualWidth();
        if(this.rowData_aggrid?.filter(x => x.requestLocationId == this.reqLocId).length == 0)
          params.api.showNoRowsOverlay();
      },
      onColumnVisible: function(params) {
        if (params.columnApi.getAllDisplayedColumns().length <= 20) {
          params.api.sizeColumnsToFit();
        }
      },
      frameworkComponents: {
        customHeaderGroupComponent: ShiptechCustomHeaderGroup
      }
    };
    this.spotNegotiationService.gridRedrawService$.subscribe(() => {
      this.redrawGridDetails();
    });

    this.spotNegotiationService.gridRefreshService$.subscribe(() => {
      this.refreshGridDetails();
    });

    this.spotNegotiationService.gridRefreshServiceAll$.subscribe(() => {
      this.refreshGridDetailsAll();
    });

  }

  identifyer = (index: number, item: any) => item.name;
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

  saveRowToCloud(updatedRow, product, elementidValue) {
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

    this.store.dispatch([new EditLocationRow(updatedRow), new UpdateRequest(reqs)]);
    let element = document.getElementById(elementidValue);
      if (element) {
        this.moveCursorToEnd(element);
      }
     //this.spotNegotiationService.callGridRefreshServiceAll();
  // let displayElm = document.getElementsByClassName("calculate-icon-btn");
    // displayElm[0].classList.add("calculate-icon-btn-show");

    let x = document.getElementsByClassName("offerPriceHighLight");
    while(x.length > 0) x[0].classList.remove("offerPriceHighLight");

    this.spotNegotiationService.hArray?.forEach((element,key) => {
      if(element.rowId){
        let afterHigh = document.getElementsByClassName(element.rowId+'/'+key);
        afterHigh[0]?.classList?.add("offerPriceHighLight");
      }else{
        let afterHigh = document.getElementsByClassName('tf_'+element);
        afterHigh[0]?.classList?.add("offerPriceHighLight");
      }
    });

    // Update the store
    const response = this.spotNegotiationService.updatePrices(payload);
    response.subscribe((res: any) => {
      if (res?.message == 'Unauthorized') {
        return;
      }
      if (res.status) {
      } else {
        this.toastr.error(res.message);
        return;
      }
    });
  }

  moveCursorToEnd(element) {
    var len = element.value.length;
    if (element.setSelectionRange) {
      element.focus();
      element.setSelectionRange(len, len);
    } else if (element.createTextRange) {
      var t = element.createTextRange();
      t.collapse(true);
      t.moveEnd('character', len);
      t.moveStart('character', len);
      t.select();
    }
    element.parentNode.classList.add("focus-price-highlight");
  }

  redrawGridDetails() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setTimeout(() => {
      this.gridOptions_counterparty.api?.redrawRows();
    }, 100);
  }

  refreshGridDetails() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setTimeout(() => {
      var params = { force: true };
      this.gridOptions_counterparty.api?.refreshCells(params);
    }, 100);
  }

  refreshGridDetailsAll() {
      var params = { force: true };
      this.gridOptions_counterparty.api?.refreshCells(params);
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
    productDetails.isOfferPriceCopied = false;
    let futureRow = this.spotNegotiationService.setRowProductDetails(
      row,
      productDetails,
      product.id
    );
    return futureRow;
  }

  // Calculate row fields and return new row;
  getRowNodeId(data) {
    const d = new Date();
   let ms = d.valueOf();
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
      lockVisible: true,

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
          // headerClass: 'header-checkbox-center checkbox-center ag-checkbox-v2',
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
            status: product.status,
            productName: product.productName,
            requestLocationId: requestLocationId,
            requestProductId: product.id,
            productData: productData
          },
          lockVisible: true,
          headerComponentFramework: CustomHeader
        },
        {
          headerName: 'Offer price',
          headerTooltip: 'Offer price',
          field: `offPrice`,
          tooltipField: 'offerPrice',
          product: product,
          flex: 2,
          width: 200,
          minWidth: 150,
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
          valueSetter: async ({ colDef, data, newValue, event, elementidValue }) => {

            //avoid calculation based on physical supplier mandatory configurations.
            const tenantConfig = this.store.selectSnapshot(
              (state: SpotNegotiationStoreModel) => {
                return state['spotNegotiation'].tenantConfigurations;
              }
            );
            let updatedRow = this.store.selectSnapshot<any>((state: any) => {
              return state.spotNegotiation.locationsRows?.find(lr => lr.id == data.id);
            });

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
            var data = await this.spotNegotiationPriceCalcService.checkAdditionalCost(
              updatedRow,
              updatedRow);

              this.updateSellerLine(data, colDef, newValue, elementidValue);
          //});
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
          lockVisible: true
        },
        {
          headerName: 'T.Pr.($)',
          headerTooltip: 'Total Price($)',
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
            if (
              this.highlightedCells[product.productId] &&
              params.data.id ===
                this.highlightedCells[product.productId].rowId &&
              product.id ===
                this.highlightedCells[product.productId].requestProductId
            ) {
              return 'grey-opacity-cell pad-lr-0 offerPriceHighLight '+ params.data.id+'/'+product.productId;
            }
            return 'grey-opacity-cell pad-lr-0 ' + params.data.id+'/'+product.productId;
          },
          cellRendererFramework: AGGridCellRendererV2Component,
          cellRendererParams: { type: 'addTpr', cellClass: '', index: index },
          lockVisible: true
        },
        {
          headerName: 'Amt ($)',
          headerTooltip: 'Amount ($)',
          field: `amt`,
          valueGetter: params => {
            const details = this.spotNegotiationService.getRowProductDetails(
              params.data,
              product.id
            );
            return  this.tenantService.amount(details.amount);
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
          lockVisible: true
        },
        {
          headerName: 'Tar. diff',
          headerTooltip: 'Target difference',
          field: `diff`,
          flex: 5,
          minWidth: 94,
          valueGetter: params => {
            const details = this.spotNegotiationService.getRowProductDetails(
              params.data,
              product.id
            );
            return !product.requestGroupProducts.targetPrice
              ? null
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
          lockVisible: true
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
          lockVisible: true
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
          lockVisible: true
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
          lockVisible: true
        }
      ]
    };
  }
  storeExpansionState(data,index){
    let requestList = [];
    let requestId : number;
    this.store.selectSnapshot<any>((state: any) => {
      requestId = state.spotNegotiation.currentRequestSmallInfo.id;
      requestList = state.spotNegotiation.requests;
    });
    let expandArray = requestList.map(e => {
      if(e.id == requestId){
        var requestLocations = e.requestLocations.map(innerArray =>{
          if(innerArray.id == data.id){
            if(innerArray.expand != undefined){
              return {...innerArray, expand : !innerArray.expand}
            }else{
              return {...innerArray, expand : index == 0 ? false : true}
            }
          }else{
            return innerArray;
          }
        });
        return {...e, requestLocations};
      }else{
        return e;
      }      
    });
    this.store.dispatch(new UpdateRequest(expandArray));
  }
  saveAdditionalCosts(
    offerAdditionalCostList,
    locationAdditionalCostsList,
    updatedRow,
    colDef,
    newValue,
    elementidValue
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
          this.getSellerLine(updatedRow, colDef, newValue, elementidValue);
        } else this.toastr.error('Please try again later.');
      });
  }

  updateSellerLine(sellerOffers, colDef, newValue, elementidValue) {
    let updatedRow = { ...sellerOffers };
    this.saveRowToCloud(updatedRow, colDef['product'], elementidValue);
  }

  getSellerLine(sellerOffers, colDef, newValue, elementidValue) {
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
        updatedRow.requestAdditionalCosts = priceDetailsRes.sellerOffers[0].requestAdditionalCosts;
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

        // Save to the cloud
        this.saveRowToCloud(updatedRow, colDef['product'], elementidValue);

      });
  }

  getRequestOfferIdsForLocationBasedCost(
    rowData,
    selectedApplicableForId
  ) {
    let requestOfferIds = [];

    if (selectedApplicableForId > 0) {
      let findIndex = _.findIndex(rowData.requestOffers, function(object: any) {
        return object.requestProductId == selectedApplicableForId;
      });
      if (findIndex !== -1) {
        requestOfferIds.push(rowData.requestOffers[findIndex].id);
      }
    } else {
      for (let i = 0; i < rowData.requestOffers.length; i++) {
        requestOfferIds.push(rowData.requestOffers[i].id);
      }
    }
    return requestOfferIds.join(',');
  }

  getCurrencyId(rowData) {
    return rowData.requestOffers[0].currencyId;
  }


  checkHighlight({ product }, requestProductsLength, requestId) {
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

      if (this.highlightedCells[requestId]) {
        const lowestTotalOfferRow = this.locationsRows.find(
          x => x.id === this.highlightedCells[requestId]
        );
        if (lowestTotalOfferRow.totalOffer)
          smallestOffer = lowestTotalOfferRow.totalOffer;
      }

      this.locationsRows.map(row => {
        // Create key with id if dosen't exists;
        if (!this.highlightedCells[product.productId]) {
          this.highlightedCells[product.productId] = [];
        }
        // Set smallest total price
        const productDetails = this.getRowProductDetails(
          row,
          product.productId
        );
        if (
          productDetails &&
          productDetails.totalPrice &&
          row.requestId == requestId &&
          Number(productDetails.totalPrice) > 0 &&
          Number(smallestTotalPrice) > Number(productDetails.totalPrice)
        ) {
          smallestTotalPrice = productDetails.totalPrice;
          this.highlightedCells[product.productId].rowId = row.id;
          this.highlightedCells[product.productId].requestProductId =
            product.id;
        }

        if (!this.highlightedCells[requestId]) {
          this.highlightedCells[requestId] = 0;
        }
        // Set smallest offer price
        const quotedProductsLength = row.requestOffers?.filter(x => x.price)
          .length;
        if (
          row.totalOffer &&
          quotedProductsLength === requestProductsLength &&
          row.requestId == requestId &&
          Number(row.totalOffer) > 0 &&
          Number(smallestOffer) > Number(row.totalOffer)
        ) {
          smallestOffer = row.totalOffer;
          // Create key with id if dosen't exists;

          this.highlightedCells[requestId] = row.id;
        }
      });
    }
  }

  getRowProductDetails(row, productId) {
    let futureRow = JSON.parse(JSON.stringify(row));

    const priceDetails = futureRow?.requestOffers?.find(
      item => item.productId === productId
    );

    if (priceDetails) {
      return priceDetails;
    }
    return null;
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

    this.route.data.subscribe(data => {
      //this.store.dispatch(new SetCounterpartyList(data.counterpartyList));
      this.uomsMap = new Map(data.uoms.map(key => [key.id, key.name]));
    });

    this.store.subscribe(({ spotNegotiation, ...props }) => {
      if (!this.shouldUpdate({ spotNegotiation })) {
        return null;
      }

        if (spotNegotiation.currentRequestSmallInfo) {
          this.currentRequestSmallInfo = spotNegotiation.currentRequestSmallInfo;
        }
        if (!spotNegotiation.locations.length && spotNegotiation.staticLists) {
          return null;
        }
          this.locations = spotNegotiation.locations.filter(
          req => req.id == this.reqLocId
        );
        this.locationsRows = spotNegotiation?.locationsRows?.map(e => {
          let reqProdOffers = e?.requestOffers?.map(reqProd => {
            let reqProOffers = spotNegotiation.locations
              .find(req => req.id == e.requestLocationId)
              ?.requestProducts?.find(rp => rp.id === reqProd.requestProductId)
              ?.productId;
            return { ...reqProd, productId: reqProOffers };
          });
          return { ...e, requestOffers: reqProdOffers };
        });
        this.requestOptions = spotNegotiation.requests;

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
        this.highlightedCells = [];

        this.locations.forEach((reqLocation, i) => {
          // Separate rows for each location;
          // Sord data

          const filterobj = this.rowData_aggrid?.filter(
            row => row.requestLocationId === reqLocation.id
          );
          this.rowData_aggridObj[i] = filterobj;

          // Assign ColumnDef_aggrid with dynamic location id
          this.columnDef_aggridObj.push(_.cloneDeep(this.columnDef_aggrid)); //;

          this.columnDef_aggridObj[i][0].headerGroupComponentParams.reqLocationId = reqLocation.id;
          this.columnDef_aggridObj[i][0].headerGroupComponentParams.selectedSellersCount = filterobj.length;
          this.columnDef_aggridObj[i][1].headerGroupComponentParams.noOfProducts = reqLocation.requestProducts.length;
          this.columnDef_aggridObj[i][0].children[0].cellRendererParams.requestLocationId = reqLocation.id;

          // These are locations!!
          const requestProductsLength = reqLocation.requestProducts.filter(rp => !rp.isContract).length;
          reqLocation.requestProducts.map((reqProduct, index) => {
            this.checkHighlight(
              { product: reqProduct },
              requestProductsLength,
              this.currentRequestSmallInfo.id
            );
            if(this.highlightedCells.length > 0){
              this.spotNegotiationService.highlihtArrayIni(this.highlightedCells,reqLocation.locationId);
            }
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
      .subscribe(async (res: any) => {
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
            'Counterparty has been removed from negotiation succesfully.','',{timeOut: 800}
          );
          this.spotNegotiationService.callGridRedrawService();
          this.store.dispatch([new RemoveCounterparty({ rowId: rowData.id }), new RemoveLocationsRowsOriData({ rowId: rowData.id })]);

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
            let reqLocationRows : any =[];
            for (const locRow of futureLocationsRows) {
              var data = await this.spotNegotiationPriceCalcService.checkAdditionalCost(
                locRow,
                locRow);
                reqLocationRows.push(data);
            }
            this.store.dispatch(new SetLocationsRows(reqLocationRows));
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
          this.spotNegotiationService.callGridRefreshService();
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
      .subscribe(async (res: any) => {
        if (res?.message == 'Unauthorized') {
          return;
        }
        if (res['sellerOffers']) {
          const futureLocationsRows = this.getLocationRowsWithPriceDetails(
            rows,
            res['sellerOffers']
          );
          let reqLocationRows : any =[];
            for (const locRow of futureLocationsRows) {
              var data = await this.spotNegotiationPriceCalcService.checkAdditionalCost(
                locRow,
                locRow);
                reqLocationRows.push(data);
            }
          this.store.dispatch(new SetLocationsRows(reqLocationRows));
          this.spotNegotiationService.callGridRefreshService();
        }
      });
  }

  getLocationRowsWithPriceDetails(rowsArray, priceDetailsArray) {
    let currentRequestData: any;
    //let currencyList: any;
    currentRequestData = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locations;
    });
    // currencyList = this.store.selectSnapshot<any>((state: any) => {
    //   return state.spotNegotiation.staticLists['currency'];
    // });
    let requests = this.store.selectSnapshot<any>((state: any) => {
      return state['spotNegotiation'].requests;
    });

    rowsArray.forEach((row, index) => {
      let currentLocProd = currentRequestData.filter(
        row1 => row1.locationId == row.locationId
      );
      let requestProducts = requests?.find(x => x.id == row.requestId)?.requestLocations?.find(l => l.id ==row.requestLocationId)?.requestProducts;
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
        row.requestAdditionalCosts = priceDetailsArray[index].requestAdditionalCosts;
        this.UpdateProductsSelection(currentLocProd, row);
        row.isRfqSend = row.requestOffers?.some(off => off.isRfqskipped === false);
        row.requestOffers = row.requestOffers.map(e => {
          let isStemmed = requestProducts?.find(rp => rp.id == e.requestProductId)?.status;
           return { ...e, reqProdStatus: isStemmed };
        });
        row.hasAnyProductStemmed = row.requestOffers?.some(off => off.reqProdStatus == 'Stemmed');
        row.isOfferConfirmed = row.requestOffers?.some(off => off.orderProducts && off.orderProducts.length > 0);
        row.requestOffers = row.requestOffers?.sort((a, b) =>
          a.requestProductTypeOrderBy === b.requestProductTypeOrderBy
            ? a.requestProductId > b.requestProductId
              ? 1
              : -1
            : a.requestProductTypeOrderBy > b.requestProductTypeOrderBy
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
        row.requestAdditionalCosts = detailsForCurrentRow[0].requestAdditionalCosts;
        this.UpdateProductsSelection(currentLocProd, row);
        row.isRfqSend = row.requestOffers?.some(off => off.isRfqskipped === false);
        row.requestOffers = row.requestOffers.map(e => {
          let isStemmed = requestProducts?.find(rp => rp.id == e.requestProductId)?.status;
           return { ...e, reqProdStatus: isStemmed };
        });
        row.hasAnyProductStemmed = row.requestOffers?.some(off => off.reqProdStatus == 'Stemmed');
        row.isOfferConfirmed = row.requestOffers?.some(off => off.orderProducts && off.orderProducts.length > 0);
        row.requestOffers = row.requestOffers?.sort((a, b) =>
          a.requestProductTypeOrderBy === b.requestProductTypeOrderBy
            ? a.requestProductId > b.requestProductId
              ? 1
              : -1
            : a.requestProductTypeOrderBy > b.requestProductTypeOrderBy
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
        element1.requestProductTypeOrderBy = FilterProdut[0]?.productTypeOrderBy;
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
