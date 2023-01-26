import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GridOptions } from '@ag-grid-enterprise/all-modules';
import { LocalService } from '../../../services/local-service.service';
import { MatCheckboxHeaderComponent } from '../../../core/ag-grid-renderers/mat-checkbox-header.component';

import { AGGridCellClickRendererComponent } from '../../../core/ag-grid-renderers/ag-grid-cell-click-renderer.component';
import { AGGridCellMenuRenderer } from '../../../core/ag-grid-renderers/ag-grid-cell-menu-renderer.component';
import { AGGridDatepickerRenderer } from '../../../core/ag-grid-renderers/ag-grid-datepicker-renderer.component';
import { AGGridInputSelectRenderer } from '../../../core/ag-grid-renderers/ag-grid-input-select-renderer.component';
import { AGGridRatingChipRenderer } from '../../../core/ag-grid-renderers/ag-grid-rating-chip-renderer.component';
import { fullWidthCellRenderer } from '../../../core/ag-grid-renderers/fullWidthCellRenderer.component';
import { GroupRowInnerRenderer } from '../../../core/ag-grid-renderers/groupRowInnerRenderer';
import { AGGridCheckboxRenderer } from '../../../core/ag-grid-renderers/ag-grid-checkbox-renderer.component';
import { ContractNegotiationStoreModel } from '../../../store/contract-negotiation.store';
import { Store } from '@ngxs/store';
import { ContractNegotiationService } from '../../../services/contract-negotiation.service';
import { CounterpartieNameCellComponent } from '../../../core/ag-grid-renderers/counterpartie-name-cell.component';
import { GetRowNodeIdFunc, IGetRowsParams } from 'ag-grid-community';
import { ContractRequest } from '../../../store/actions/ag-grid-row.action';
import { Router } from '@angular/router';
import { AGGridSpecSelectRenderer } from '../../../core/ag-grid-renderers/ag-grid-spec-select-renderer.component';
import { AGGridMinMaxCellRenderer } from '../../../core/ag-grid-renderers/ag-grid-min-max-cell-renderer.component';
@Component({
  selector: 'app-contract-nego-grid',
  templateUrl: './contract-nego-grid.component.html',
  styleUrls: ['./contract-nego-grid.component.scss']
})
export class ContractNegoGridComponent implements OnInit {

  @Input() contractData;
  @Input() periodicity;
  @Input() locationId;
  @Input() productId;
  //@Input() chipSelected;
  @Input() rfqSent: boolean = true;
  @Input() noQuote;
  @Input() sendToApprove;
  @Output() pinnedColumnsWidth: EventEmitter<any> = new EventEmitter();
  @Output() sendNodeData: EventEmitter<any> = new EventEmitter();
  private context: any;
  public selectedChip: any;
  public selectedPeriodicity: any;
  public gridOptions_forecast: GridOptions;
  public gridOptions_formulaDesc: GridOptions;
  public rowData_aggrid_forecast = [];
  public rowData_aggrid_formulaDesc = [];
  public groupDisplayType = 'multipleColumns';
  public groupDefaultExpanded = 1;
  public rowSelection;
  public rowCount: Number;
  public counterpartyHeaderWidth;
  public expandGridHeaderWidth;
  public totalOfferHeaderWidth;
  public fullHeaderWidth;
  public totalPinnedColWidth; 
  public rowSelected: boolean = false;
  public isCalculated: boolean = false;
  private currentLocationId : number;
  showProgressBar: boolean = false;
  blockHttpCall : boolean = false;
  checkBoxSelectionstatus : boolean;
  sellerIds = [];
  dispalyNoData : boolean = false;
  constructor(private localService: LocalService, public router: Router, private store : Store,private contractService: ContractNegotiationService) {
    this.context = { componentParent: this };
    this.localService.gridRefreshService$.subscribe((rowIndex) => {
      this.redrawRows(rowIndex);
    });
  }
  ngOnInit(): void {
    this.store.subscribe(({ contractNegotiation, ...props }) => {
      this.store.selectSnapshot((state: ContractNegotiationStoreModel) => {
        state['contractNegotiation'].ContractRequest[0].locations.find(el => {
          if(el['location-id'] == this.locationId && el.productId == this.productId){
            this.dispalyNoData = (el.data.length > 0)? false : true;
            this.gridOptions_forecast?.api?.setRowData(el.data);
          } 
          if(el.data && el.data.length > 0){
            el.data.forEach( data => {
              if(data.Status=='Inquired' && !data.isNoQuote){
                this.localService.setNoQuote(true);
                return;
              }
            });
          } 
        })
      });
      if (
        contractNegotiation.tenantConfigurations &&
        contractNegotiation.tenantConfigurations['isDisplaySellerRating'] === false
      ) {       
        this.columnDef_aggrid_forecast[0].children = this.columnDef_aggrid_forecast[0].children.filter(
          col => col.field != 'GenRating' && col.field != 'PortRating'
        );       
      }
    });
    this.localService.sendChipSelected.subscribe((chip: any) => {
      this.selectedChip = chip;
    });
    this.gridOptions_forecast = <GridOptions>{
      suppressRowClickSelection: true,
      defaultColDef: {
        resizable: true,
        filter: true,
        sortable: false
      },
      //columnDefs: this.columnDef_aggrid,
      columnDefs: this.columnDef_aggrid_forecast,
      suppressCellSelection: true,
      headerHeight: 30,
      groupHeaderHeight: 0,
      rowHeight: 35,
      animateRows: true,
      tooltipShowDelay: 0,
      // groupUseEntireRow:true,
      onFirstDataRendered(params) {
        params.api.sizeColumnsToFit();
      },
      rowSelection: 'multiple',
      onGridReady: params => {
        setTimeout(() => this.blockHttpCall = true,3000);
        this.gridOptions_forecast.api = params.api;
        this.gridOptions_forecast.columnApi = params.columnApi;
        this.gridOptions_forecast.api.sizeColumnsToFit();
        this.rowCount = this.gridOptions_forecast.api.getDisplayedRowCount();
        params.api.sizeColumnsToFit();
        this.store.selectSnapshot((state: ContractNegotiationStoreModel) => {
          state['contractNegotiation'].ContractRequest[0].locations.find(el => {
            if(el['location-id'] == this.locationId && el.productId == this.productId){
              this.rowSelected=true;
              this.gridOptions_forecast.api.setRowData(el.data);
            }
          })
        });

        this.gridOptions_forecast.getRowStyle = params => {
          if (params.node.expanded) {
            return { cursor: 'pointer' };
          }
        }
        // this.localService.sendPeriodicity.subscribe((p: any) => {
        //   console.log(this.selectedChip);
        //   this.selectedPeriodicity = p;
        //   if(this.selectedChip=='1'){
        //   if (p == 'M') {
        //     this.gridOptions_forecast.columnApi.setColumnsVisible(['q1', 'Q2', 'Q3', 'Q4'], false)
        //     this.gridOptions_forecast.columnApi.setColumnsVisible(['M1', 'M2', 'M3', 'M4', 'M5', 'M6'], true)
        //   }
        //   else if (p == 'Q') {
        //     this.gridOptions_forecast.columnApi.setColumnsVisible(['q1', 'Q2', 'Q3', 'Q4'], true)
        //     this.gridOptions_forecast.columnApi.setColumnsVisible(['M1', 'M2', 'M3', 'M4', 'M5', 'M6','m1check','m2check','m3check','m4check','m5check','m6check'], false)
        //   }
        // }
        // });
        // this.localService.sendChipSelected.subscribe((chip: any) => {
        //   this.selectedChip = chip;
        //   console.log(this.selectedPeriodicity);
        //   if (chip == '1') {
        //     this.gridOptions_forecast.columnApi.setColumnsVisible(['product','spec', 'MinQuantity', 'MaxQuantity', 'OfferPrice','validity','M1', 'M2', 'M3', 'M4', 'M5', 'M6','m1check','m2check','m3check','m4check','m5check','m6check'], true);
        //     this.gridOptions_forecast.columnApi.setColumnsVisible(['fdTotalContractAmt','fdFomulaDesc','fdSchedule','fdPremium','fdAddCosts','fdRemarks'], false);
        //   }
        //   else if (chip == '2') {
        //     this.gridOptions_forecast.columnApi.setColumnsVisible(['product','spec', 'MinQuantity', 'MaxQuantity', 'OfferPrice','validity','M1', 'M2', 'M3', 'M4', 'M5', 'M6','m1check','m2check','m3check','m4check','m5check','m6check'], false);
        //     this.gridOptions_forecast.columnApi.setColumnsVisible(['fdTotalContractAmt','fdFomulaDesc','fdSchedule','fdPremium','fdAddCosts','fdRemarks'], true);
        //   }
        // });
      },

      onColumnResized: params => {
        this.counterpartyHeaderWidth = params.columnApi.getColumn('check').getActualWidth() + params.columnApi.getColumn('CounterpartyName').getActualWidth();
        this.pinnedColumnsWidth.emit(this.counterpartyHeaderWidth);
      },

      onRowClicked(params) {
        // params.node.setExpanded(!params.node.expanded);
      },

      onColumnVisible: function(params) {
        if (params.columnApi.getAllDisplayedColumns().length <= 11) {
          params.api.sizeColumnsToFit();
        }
        // params.api.sizeColumnsToFit();
      },
      autoGroupColumnDef: {
        headerName: 'Product',
        headerTooltip: 'Product',
        field: 'ProductName',
        minWidth: 200,
        comparator: function(a, b) {
          const statusName = ['Open', 'Inquired', 'AwaitingApproval', 'Approved', 'Rejected', 'Contracted']; //Sort Ag-grid data based on this status order
          return statusName.indexOf(a) - statusName.indexOf(b);
        },
        sort: 'asc',
        cellClass: params => {
          return params.node.level != 0 && params.data.rfqStatus && this.rowSelected && params.node.rowIndex != 3 ? 'editable-cell grey-opacity-cell' : '';
        },
        cellRendererSelector: params => {
          this.sendNodeData.emit(params.node);
          if (params.node.level == 0) {
            return {
              component: 'agGroupCellRenderer',
              params: { label: 'port-rating', cellClass: 'rating-chip-renderer' }
            };
          }else if(!params.node.data.isNoQuote)  {
            return {
              component: 'productSelectRenderer'
            };
          }else {
            return {
              component: 'noQuoteRenderer',
              params: { show: true }
            };
          }
        },
        cellRendererParams: {
          suppressCount: true
        },

        colSpan: params => {
          if (params.node.level == 0 ||params.node.data.isNoQuote ) return 13;
          else return 1;
        }
      },
      frameworkComponents: {
        checkboxHeaderRenderer: MatCheckboxHeaderComponent,
        checkboxRenderer: AGGridCheckboxRenderer,
        ratingChipRenderer: AGGridRatingChipRenderer,
        groupRowRenderer: GroupRowInnerRenderer,
        inputSelectRenderer: AGGridInputSelectRenderer,
        inputSpecSelectRenderer : AGGridSpecSelectRenderer,
        datepickerRenderer: AGGridDatepickerRenderer,
        productSelectRenderer: AGGridCellMenuRenderer,
        noQuoteRenderer: fullWidthCellRenderer,
        AGGridMinMaxCellRenderer : AGGridMinMaxCellRenderer,
      }
    };

    this.localService.sendRFQUpdate.subscribe(data => {
      this.rfqSent = data;
      //this.rfqComplete= true;
      this.localService.isRowSelected.subscribe(data => {
        this.rowSelected = data;
      });
      //alert(this.rowSelected);
      if (data && this.rowSelected && !this.isCalculated) {
        let result = this.rowData_aggrid_forecast.map(data => ({
          id: data.id,
          Status: data.Status,
          check: data.check,
          CounterpartyName: data.CounterpartyName,
          GenRating: data.GenRating,
          PortRating: data.PortRating,
          ProductName: data.ProductName,
          SpecGroupName: data.SpecGroupName,
          MinQuantity: data.MinQuantity,
          MaxQuantity: data.MaxQuantity,
          OfferPrice: data.OfferPrice,
          ValidityDate: data.ValidityDate,
          M1: '',
          M2: '',
          M3: '',
          M4: '',
          M5: '',
          M6: '',
          Q1: '',
          Q2: '',
          Q3: '',
          Q4: '',
          fdTotalContractAmt: data.fdTotalContractAmt,
          fdFomulaDesc: data.fdFomulaDesc,
          fdSchedule: data.fdSchedule,
          fdPremium: data.fdPremium,
          fdAddCosts: data.fdAddCosts,
          fdRemarks: data.fdRemarks
        }));
        //console.log(result);
        this.gridOptions_forecast.api.setRowData(result);
      }
    });
    this.localService.calculatePriceUpdate.subscribe(data => {
      if (data && this.rfqSent && this.rowSelected) {
        this.gridOptions_forecast.api.setRowData(this.rowData_aggrid_forecast);
        this.isCalculated = true;
      }
      //this.localService.updateSendRFQStatus(false);
    });
  }
  ngOnChanges() {
    //this.getGridData();
  }
  ngAfterViewInit() {
    this.localService.sendPeriodicity.subscribe((p: any) => {
      //alert(this.selectedChip);
      this.selectedPeriodicity = p;
      this.columnToggle();
    });
    this.localService.sendChipSelected.subscribe((chip: any) => {
      this.selectedChip = chip;
      this.columnToggle();
    });
  }

  columnToggle() {
    // alert(this.selectedPeriodicity);
    // alert(this.selectedChip);
    if (this.selectedChip == '1' && this.selectedPeriodicity == 'M') {
      this.gridOptions_forecast.columnApi.setColumnsVisible(['ProductName', 'SpecGroupName', 'MinQuantity', 'MaxQuantity', 'QtyUnit', 'OfferPrice', 'ValidityDate', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6'], true);
      this.gridOptions_forecast.columnApi.setColumnsVisible(['Q1', 'Q2', 'Q3', 'Q4', 'fdTotalContractAmt', 'fdFomulaDesc', 'fdSchedule', 'fdPremium', 'fdAddCosts', 'fdRemarks'], false);
    }
    else if (this.selectedChip == '1' && this.selectedPeriodicity == 'Q') {
      this.gridOptions_forecast.columnApi.setColumnsVisible(['ProductName', 'SpecGroupName', 'MinQuantity', 'MaxQuantity', 'QtyUnit', 'OfferPrice', 'ValidityDate', 'Q1', 'Q2', 'Q3', 'Q4'], true);
      this.gridOptions_forecast.columnApi.setColumnsVisible(['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'm5check', 'm6check', 'fdTotalContractAmt', 'fdFomulaDesc', 'fdSchedule', 'fdPremium', 'fdAddCosts', 'fdRemarks'], false);
    } else {
      this.gridOptions_forecast.columnApi.setColumnsVisible(['ProductName', 'SpecGroupName', 'MinQuantity', 'MaxQuantity', 'QtyUnit',  'OfferPrice', 'ValidityDate', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'Q1', 'Q2', 'Q3', 'Q4'], false);
      this.gridOptions_forecast.columnApi.setColumnsVisible(['fdTotalContractAmt', 'fdFomulaDesc', 'fdSchedule', 'fdPremium', 'fdAddCosts', 'fdRemarks'], true);
    }
  }

  /* getGridData() {

    
  } */
  selectAllRows(flag) {}
  toolTipValueGetter(params) {
    if (params.value != '-') return params.value;
  }
  public getRowNodeId: GetRowNodeIdFunc = (params: IGetRowsParams) => {
    return params['id'];
  }

  
  getStatusName(id) {
    let name;
    let className;

    switch (id) {
      case '0': {
        name = 'Offers';
        className = 'offers';
        break;
      }
      case '1': {
        name = 'Awaiting Approval zxc3';
        className = 'await';
        break;
      }
      case '2': {
        name = 'Approved';
        className = 'approved';
        break;
      }
      case '3': {
        name = 'Rejected';
        className = 'rejected';
        break;
      }
      case '4': {
        name = 'Contracted';
        className = 'contracted';
        break;
      }
    }
    return {
      name: name,
      className: className
    };
  }

  public columnDef_aggrid_forecast : any = [
    {
      headerName: '',
      headerTooltip: '',
      resizable: true,
      marryChildren: true,
      children: [
        {
          headerName: '',
          field: 'check',
          filter: true,
          suppressMenu: true,
          maxWidth: 20,
          width: 20,
          headerCheckboxSelection: true,
          checkboxSelection: params => {
             return params.node.level != 0 ? true : false;
          },
          cellRenderer: (params) => {
            params.node.setSelected(params.value);
         },   
          resizable: false,
          suppressNavigable: true,
          lockPosition: true,
          pinned: 'left',
          headerClass: 'header-checkbox-center checkbox-center ag-checkbox-v2 header-selectAll',
          cellClass: 'ag-checkbox-v2',
          suppressSizeToFit: true
        },
        {
          headerName: 'Name',
          headerTooltip: 'Name',
          field: 'CounterpartyName',
          width: 200,
          suppressSizeToFit: true,
          cellClass: 'suppress-movable-col remove-option hoverCell',
          pinned: 'left',
          headerClass: 'm-l-7',
          suppressNavigable: true,
          lockPosition: true,
          cellRendererFramework: CounterpartieNameCellComponent,
          cellRendererParams: {
            label: 'hover-cell-lookup',
            type: 'hover-cell-lookup',
            cellClass: '',
            data: params => {
              return params.data;
            }
          }
        },
        {
          headerName: 'Gen. Rating',
          headerTooltip: 'General Rating',
          headerClass: ['m-l-7'],
          suppressSizeToFit: true,
          suppressNavigable: true,
          lockPosition: true,
          pinned: 'left',
          field: 'GenRating',
          width: 80,
          cellClass: 'aggridtextalign-center no-padding rating-chip-renderer',
          // cellRendererParams: { label: 'gen-rating', cellClass: 'rating-chip-renderer' }
          cellRendererSelector: params => {
            if (params.node.level != 0) {
              return {
                component: 'ratingChipRenderer',
                params: {
                  label: 'gen-rating',
                  cellClass: 'rating-chip-renderer',
                  value: { grating: params.data?.GenRating, gprice: '', prating: params.data?.PortRating, pprice: '' }
                }
              };
            } else {
              return undefined;
            }
          }
        },
        {
          headerName: 'Port Rating',
          headerTooltip: 'Port Rating',
          headerClass: ['m-l-7 border-right'],
          suppressNavigable: true,
          lockPosition: true,
          pinned: 'left',
          suppressSizeToFit: true,
          field: 'PortRating',
          width: 80,
          cellClass: 'aggridtextalign-center no-padding rating-chip rating-chip-renderer',
          // cellRenderer: 'ratingChipRenderer'
          cellRendererSelector: params => {
            if (params.node.level != 0) {
              return {
                component: 'ratingChipRenderer',
                params: {
                  label: 'port-rating',
                  cellClass: 'rating-chip-renderer',
                  value: { grating: params.data?.GenRating, gprice: '', prating: params.data?.PortRating, pprice: '' }
                }
              };
            } else {
              return undefined;
            }
          }
        }
      ]
    },
    {
      headerName: '',
      headerTooltip: '',
      marryChildren: true,
      resizable: false,
      children: [
        {
          field: 'typeStatus',
          resizable: false,
          rowGroup: true,
          cellRenderer: 'agGroupCellRenderer',
          hide: true,
          cellRendererParams: {
            innerRenderer: GroupRowInnerRenderer,
            innerRendererParams: params => {
              return { toggle: params.node.expanded };
            },
            suppressCount: true,
            checkbox: false,
            suppressDoubleClickExpand: true,
            suppressEnterExpand: true
          }
        },
        // {
        //   headerName: 'Product', headerTooltip: 'Product', field: 'product',
        // },
        {
          headerName: 'Spec',
          headerTooltip: 'Spec',
          field: 'SpecGroupName',
          cellClass: params => {
            return params.node.level != 0 && params.data.rfqStatus && this.rowSelected ? 'editable-cell grey-opacity-cell' : '';
          },
          cellRendererSelector: params => {
            if (params.node.level != 0 && params.data.rfqStatus && this.rowSelected) {
              return {
                component: 'inputSpecSelectRenderer',
                params: { value: params.data.SpecGroupName }
              };
            } else {
              return undefined;
            }
          }
        },
        {
          headerName: 'Qty Min',
          headerTooltip: 'Qty Min',
          field: 'MinQuantity',
          minWidth: 40,
          cellRendererFramework: AGGridMinMaxCellRenderer,
          cellClass: params => {
            return params.node.level != 0 && params.data.rfqStatus && this.rowSelected ? 'editable-cell input-select-renderer grey-opacity-cell' : '';
          },
          cellRendererParams: (params) => { return { value: params.data?.MinQuantity, type : 'MinQuantity' } }
        },
        {
          headerName: 'Qty Max',
          headerTooltip: 'Qty Max',
          field: 'MaxQuantity',
          minWidth: 40,
          cellRendererFramework: AGGridMinMaxCellRenderer,
          cellClass: params => {
            return params.node.level != 0 && params.data.rfqStatus && this.rowSelected ? 'editable-cell input-select-renderer grey-opacity-cell' : '';
          },
          cellRendererParams: (params) => { return { value: params.data?.MaxQuantity, type : 'MaxQuantity' } }
          //cellClass: ['editable-cell input-select-renderer'],
          // cellRenderer: 'inputSelectRenderer',
          // cellRendererParams: (params) => { return { value: params.data?.MaxQuantity, unit: params.data?.MaxQuantityUnit } }

          // cellRendererSelector: params => {
          //   if (params.node.level != 0 && params.data.rfqStatus && this.rowSelected) {
          //     return {
          //       component: 'inputSelectRenderer',
          //       params: { value: params.data.MaxQuantity, unit: params.data.MaxQuantityUnit ? params.data.MaxQuantityUnit : 'BBL' }
          //     };
          //   } else {
          //     return undefined;
          //   }
          // }
        },
        {
          headerName: '', width: 130, field: 'QtyUnit',
          cellClass: params => {
            return params.node.level != 0 && params.data.rfqStatus && this.rowSelected ? 'editable-cell input-select-renderer grey-opacity-cell' : '';
          },
          cellRendererSelector: params => {
            if (params.node.level != 0 && params.data.rfqStatus && this.rowSelected) {
              return {
                component: 'inputSelectRenderer',
                params: { value: params.data.MaxQuantity, unit: params.data.MaxQuantityUnit ? params.data.MaxQuantityUnit : 'BBL' }
              };
            } else {
              return undefined;
            }
          }
        },
        {
          headerName: 'Offer Price',
          headerTooltip: 'Offer Price',
          field: 'OfferPrice',
          editable: false,
          type: 'numericColumn',
          cellClass: params => {
            return params.node.level != 0 && params.data.rfqStatus && this.rowSelected ? 'editable-cell grey-opacity-cell' : '';
          },
          cellRendererFramework: AGGridCellClickRendererComponent,
          cellRendererParams: params => {
            return {
              label: 'offerprice-hover-cell',
              type: 'offerprice-hover-cell',
              cellClass: '',
              context: this.context
            };
          }
        },
        {
          headerName: 'Validity',
          headerTooltip: 'Validity',
          field: 'ValidityDate',
          cellClass: params => {
            return params.node.level != 0 && params.data.rfqStatus && this.rowSelected ? 'editable-cell grey-opacity-cell' : '';
          },
          cellRendererSelector: params => {
            if (params.node.level != 0) {
              return {
                component: 'datepickerRenderer'
              };
            } else {
              return undefined;
            }
          }
        },
        {
          headerName: 'M1',
          headerTooltip: 'M1',
          field: 'M1',
          cellClass: 'grey-opacity-cell',
          cellRendererFramework: AGGridCheckboxRenderer,
          cellRendererParams: params => {
            return this.gridCellRenderer(params);
          }
        },
        {
          headerName: 'Q1',
          headerTooltip: 'Q1',
          field: 'Q1',
          cellRendererFramework: AGGridCheckboxRenderer,
          cellRendererParams: params => {
            return this.gridCellRenderer(params);
          }
        },
        {
          headerName: 'M2',
          headerTooltip: 'M2',
          field: 'M2',
          cellClass: 'grey-opacity-cell',
          cellRendererFramework: AGGridCheckboxRenderer,
          cellRendererParams: params => {
            return this.gridCellRenderer(params);
          }
        },
        {
          headerName: 'Q2',
          headerTooltip: 'Q2',
          field: 'Q2',
          cellRendererFramework: AGGridCheckboxRenderer,
          cellRendererParams: params => {
            return this.gridCellRenderer(params);
          }
        },

        {
          headerName: 'M3',
          headerTooltip: 'M3',
          field: 'M3',
          cellClass: 'grey-opacity-cell',
          cellRendererFramework: AGGridCheckboxRenderer,
          cellRendererParams: params => {
            return this.gridCellRenderer(params);
          }
        },
        {
          headerName: 'Q3',
          headerTooltip: 'Q3',
          field: 'Q3',
          cellRendererFramework: AGGridCheckboxRenderer,
          cellRendererParams: params => {
            return this.gridCellRenderer(params);
          }
        },

        {
          headerName: 'M4',
          headerTooltip: 'M4',
          field: 'M4',
          cellClass: 'grey-opacity-cell',
          cellRendererFramework: AGGridCheckboxRenderer,
          cellRendererParams: params => {
            return this.gridCellRenderer(params);
          }
        },
        {
          headerName: 'Q4',
          headerTooltip: 'Q4',
          field: 'Q4',
          cellRendererFramework: AGGridCheckboxRenderer,
          cellRendererParams: params => {
            return this.gridCellRenderer(params);
          }
        },

        {
          headerName: 'M5',
          headerTooltip: 'M5',
          field: 'M5',
          cellClass: 'grey-opacity-cell',
          cellRendererFramework: AGGridCheckboxRenderer,
          cellRendererParams: params => {
            return this.gridCellRenderer(params);
          }
        },

        {
          headerName: 'M6',
          headerTooltip: 'M6',
          field: 'M6',
          cellClass: 'grey-opacity-cell',
          cellRendererFramework: AGGridCheckboxRenderer,
          cellRendererParams: params => {
            return this.gridCellRenderer(params);
          }
        },
        {
          headerName: 'Total Contract Amt.',
          headerTooltip: 'Total Contract Amt.',
          field: 'fdTotalContractAmt'
        },
        {
          headerName: 'Formula Description',
          headerTooltip: 'Formula Description',
          field: 'fdFomulaDesc'
        },
        {
          headerName: 'Schedule',
          headerTooltip: 'Schedule',
          field: 'fdSchedule',
          width: 80
        },
        {
          headerName: 'Premium',
          headerTooltip: 'Premium',
          field: 'fdPremium',
          width: 80
        },
        {
          headerName: 'Add.Costs',
          headerTooltip: 'Add.Costs',
          field: 'fdAddCosts',
          width: 80
        },
        {
          headerName: 'Remarks',
          headerTooltip: 'Remarks',
          field: 'fdRemarks',
          width: 350,
          cellClass: params => {
            return params.node.level != 0 && this.rfqSent && this.rowSelected ? 'editable-cell' : '';
          }
        }
      ]
    }
  ];

  gridCellRenderer(params) {
    {
      var classArray: string[] = [];
      let newClass = '';
      let clickEvent = false;
      let status = params.data ? params.data.Status : '';
      if (status == 'Open') {
        newClass = 'normal-checkbox';
        clickEvent = true;
      } else if (status == 'AwaitingApproval') {
        newClass = 'orange-checkbox';
        clickEvent = true;
      } else if (status == 'Rejected') {
        newClass = 'red-checkbox';
        clickEvent = true;
      } else if (status == 'Approved' || status == 'Contracted') {
        newClass = params.value == 113 || params.value == 106 ? 'tick-mark' : '';
        clickEvent = false;
      }
      classArray.push(newClass);
      return { cellClass: classArray.length > 0 ? classArray : null, isClickable: clickEvent, cellValueClass: params.value == 113 || params.value == 106 ? 'best-price' : '', status: status };
    }
  }
  onRowSelected(e) {   
    debugger; 
    if(e.data && this.blockHttpCall){
      //this.currentLocationId = e.data['locationId'];
      this.sellerIds.push(e.data.id);
      this.checkBoxSelectionstatus = e.node.selected;
    }
    this.localService.sendRFQUpdate.subscribe(r => {
      if (r == true) {
        this.gridOptions_forecast.api.forEachNode((rowNode, index) => {
          if (rowNode.level != 0 && e.rowIndex === rowNode.rowIndex) {
            rowNode.data.rfqStatus = true;
            rowNode.data.check = false;
          }
        });
        //this.localService.updateSendRFQStatus(false);
      }
    });
    let contractReq = JSON.parse(JSON.stringify(this.store.selectSnapshot((state: ContractNegotiationStoreModel) => {
      return state['contractNegotiation'].ContractRequest[0];
    })));
    contractReq.locations.map( prod => {
      if(prod.data.length > 0){
        prod.data.map( data => {
          if(e.data?.id == data?.id) data.check = e.node.selected;
        });
      }
    })
    this.store.dispatch(new ContractRequest([contractReq]));
    //this.rowSelected = true;
    //this.isCalculated = true;
    this.localService.updateRowSelected(true);
    if (this.rfqSent) {
      this.localService.setContractNoQuote(this.gridOptions_forecast.api.getSelectedRows().length > 0);
    }
  }

  onSelectionChanged(event) {
    // let checkRfqSend = this.store.selectSnapshot((state: ContractNegotiationStoreModel) => {
    //   return state['contractNegotiation'].ContractRequest[0].locations
    //   .find(el => el['location-id'] == this.currentLocationId).data.find(inner => inner.Status != 'Open');
    // });
    if(this.blockHttpCall){
        let requestPayload = {
        "contractRequestProductOfferIds" : this.sellerIds,
        "isSelected" : this.checkBoxSelectionstatus
        }
        this.sellerIds = [];
        this.contractService.counterPartSelectionToggle(requestPayload).subscribe();
    }   
  }
  
  redrawRows(rowIndex) {
    if(rowIndex != 'all'){
      let refreshRows = [];
      rowIndex.forEach(rowId => {
        refreshRows.push(this.gridOptions_forecast.api.getRowNode(rowId)!);
      });
      this.gridOptions_forecast.api.redrawRows({ rowNodes: refreshRows });
    }else{
      this.gridOptions_forecast.api.redrawRows();
    }
    //this.gridOptions_forecast.api.refreshCells({ force: true });
  }

  toggleProgressBar(row) {
    this.showProgressBar = !this.showProgressBar;
    row.Status = 'Open';
    row.M1 = '';
    row.M2 = '';
    row.M3 = '';
    row.M4 = '';
    row.M5 = '';
    row.M6 = '';
    row.Q1 = '';
    row.Q2 = '';
    row.Q3 = '';
    row.Q4 = '';

    setTimeout(() => {
      this.gridOptions_forecast.api.applyTransaction({ update: [row] });
      this.showProgressBar = !this.showProgressBar;
    }, 1500);
  }
}
