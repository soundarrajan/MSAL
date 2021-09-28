import { DatePipe, DOCUMENT } from '@angular/common';
import {
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
import { Store } from '@ngxs/store';
import { GridOptions } from 'ag-grid-community';
import { AGGridCellActionsComponent } from '../../../../../core/ag-grid/ag-grid-cell-actions.component';
import { AGGridCellRendererV2Component } from '../../../../../core/ag-grid/ag-grid-cell-rendererv2.component';
import { ShiptechCustomHeaderGroup } from '../../../../../core/ag-grid/shiptech-custom-header-group';
import { SpotNegotiationService } from '../../../../../services/spot-negotiation.service';
import {
  SetCounterpartyList,
  SetLocations,
  SetStaticLists
} from '../../../../../store/actions/ag-grid-row.action';

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
  rowData_aggrid: any = [];

  public grid1Width = {
    width: '100%'
  };

  context: any;

  menuOptions = [{ label: 'ETA' }, { label: 'ETB' }, { label: 'ETD' }];
  isEnabledView: boolean = false;
  CurrentRequestData: any[];
  columnDef_aggridObj: any[];
  rowData_aggridobj: any[];
  // public grid2Width = {
  //   width: '50%'
  // }

  ngOnInit(): void {
    const self = this;
    // Set Counterparty list;
    this.route.data.subscribe(data => {
      this.store.dispatch(new SetCounterpartyList(data.counterpartyList));
    });

    this.store.subscribe(({ spotNegotiation }) => {
      // Clone locations object so we can edit (not ideal, i just continue what is done);
      const locationsRowsClone = JSON.parse(
        JSON.stringify(spotNegotiation.locations)
      );

      this.rowData_aggrid = locationsRowsClone;
      this.CurrentRequestData = spotNegotiation.requests;

      // Spot function if we don't have any requests available
      if (!this.CurrentRequestData || this.CurrentRequestData.length <= 0) {
        return null;
      }

      const currentReqDataLength = this.CurrentRequestData[0].requestProducts
        .length;

      this.columnDef_aggrid[1].headerGroupComponentParams.currentReqDataLength = currentReqDataLength;
      this.columnDef_aggridObj = [];
      this.rowData_aggridobj = [];

      this.CurrentRequestData.map((currentRequest, i) => {
        var filterobj = this.rowData_aggrid.filter(
          filter => filter.locationId == currentRequest.locationId
        );
        let locationId = currentRequest.locationId;
        this.rowData_aggridobj[i] = filterobj;

       // Assign ColumnDef_aggrid with dynamic location id	
       this.columnDef_aggridObj[i] = _.cloneDeep(this.columnDef_aggrid);	
       this.columnDef_aggridObj[i][0].headerGroupComponentParams.locationId = locationId

        const productIds = currentRequest.requestProducts.map(e => e.id);
        currentRequest.requestProducts.map(product => {
          this.columnDef_aggridObj[i].push({
            headerName: '',
            headerTooltip: '',
            headerGroupComponent: 'customHeaderGroupComponent',
            headerGroupComponentParams: {
              type: 'bg-header',
              product: product,
              requestLocationId:currentRequest.id
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
                headerClass:
                  'header-checkbox-center checkbox-center ag-checkbox-v2',
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
                onCellValueChanged: function(params) {
                  // TODO: when we have additional cost and multiple requests to finish the calculations.
                  // Destructuring params;
                  const {
                    node: { data: currentCell }
                  } = params;

                  const shouldForceChange = params.newValue !== params.oldValue;

                  currentCell[`offPrice${product.id}`] = params.newValue;

                  // Calculate total price
                  // Total Price = Offer Price + Additional cost(Rate/MT of the product + Rate/MT of  applicable for 'All')
                  currentCell[`tPr${product.id}`] =
                    currentCell[`offPrice${product.id}`];

                  // Calculate ammount
                  // Amount = Total Price * Max. Quantity
                  currentCell[`amt${product.id}`] =
                    currentCell[`tPr${product.id}`] * product.maxQuantity;

                  // Calculate target diference
                  // Target Difference = Total Price - Target Price
                  currentCell[`diff${product.id}`] =
                    currentCell[`tPr${product.id}`] - 0;

                  // Calculate total offer
                  // Total Offer(provided Offer Price is captured for all the products in the request) = Sum of Amount of all the products in the request
                  currentCell.totalOffer = 0;
                  productIds.map(e => {
                    let productOffer = currentCell[`offPrice${e}`];
                    if(productOffer) {
                      currentCell.totalOffer += Number(productOffer);
                    }
                  });

                  if (shouldForceChange) {
                    params.node.setDataValue(
                      `offPrice${product.id}`,
                      params.newValue
                    );
                  }

                  return currentCell;
                },
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
                  if (params.highlight) {
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
          });
        });
      });
    });
    this.isEnabledView = true;
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
      onCellEditingStopped: params => {
        // debugger;
        // const y = self.rowData_aggrid;
        // self.rowData_aggrid[0].amt = '123';
        // const x = params.columnApi.getColumn('tPr')
        // // Highlight Total offer (lowest)
        // // Highlight Total price (lowest)
        // debugger;
      },
      onGridReady: params => {
        // Ng init for AG GRID;

        this.gridOptions_counterparty.api = params.api;
        this.gridOptions_counterparty.columnApi = params.columnApi;
        this.gridOptions_counterparty.api.sizeColumnsToFit();
        // this.gridOptions_counterparty.api.setRowData(this.rowData_aggrid);
        this.rowCount = this.gridOptions_counterparty.api.getDisplayedRowCount();
        params.api.sizeColumnsToFit();
        this.counterpartyHeaderWidth =
          // params.columnApi.getColumn('check').getActualWidth() +
          // params.columnApi.getColumn('sellerCounterpartyName').getActualWidth() +
          // params.columnApi.getColumn('genRating').getActualWidth() +
          // params.columnApi.getColumn('portRating').getActualWidth() +
          // params.columnApi.getColumn('phySupplier').getActualWidth();
          this.expandGridHeaderWidth =
            // params.columnApi.getColumn('check1').getActualWidth() +
            // params.columnApi.getColumn('offPrice').getActualWidth() +
            // params.columnApi.getColumn('offPrice2').getActualWidth() +
            // params.columnApi.getColumn('offPrice3').getActualWidth() +
            // params.columnApi.getColumn('tPr').getActualWidth() +
            // params.columnApi.getColumn('diff').getActualWidth() +
            // params.columnApi.getColumn("mj").getActualWidth()+
            // params.columnApi.getColumn("tco").getActualWidth()+
            // params.columnApi.getColumn("ediff").getActualWidth()+
            // params.columnApi.getColumn('amt').getActualWidth();
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

  public rowClassRules = {
    customRowClass: function(params) {
      var offPrice = params.data.offPrice;
      return offPrice == 100;
    },
    'display-no-quote': function(params) {
      var offPrice = params.data.isQuote;
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
          cellRendererFramework: AGGridCellRendererV2Component,
          cellRendererParams: { type: 'totalOffer', cellClass: '' }
          //suppressNavigable: true,lockPosition: true, pinned:'left',
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
    // Please rewrite this function and comment it
    return;
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
