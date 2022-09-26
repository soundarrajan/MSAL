import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { LocalService } from '../../../services/local-service.service';
import { MatCheckboxHeaderComponent } from '../../../core/mat-checkbox-header.component';

import { AGGridCellClickRendererComponent } from '../../../core/ag-grid-renderers/ag-grid-cell-click-renderer.component';
import { AGGridCellMenuRenderer } from '../../../core/ag-grid-renderers/ag-grid-cell-menu-renderer.component';
import { AGGridDatepickerRenderer } from '../../../core/ag-grid-renderers/ag-grid-datepicker-renderer.component';
import { AGGridInputSelectRenderer } from '../../../core/ag-grid-renderers/ag-grid-input-select-renderer.component';
import { AGGridRatingChipRenderer } from '../../../core/ag-grid-renderers/ag-grid-rating-chip-renderer.component';
import { fullWidthCellRenderer } from '../../../core/ag-grid-renderers/fullWidthCellRenderer.component';
import { GroupRowInnerRenderer } from '../../../core/ag-grid-renderers/groupRowInnerRenderer';
import { AGGridCheckboxRenderer } from '../../../core/ag-grid-renderers/ag-grid-checkbox-renderer.component';
@Component({
  selector: 'app-contract-nego-grid',
  templateUrl: './contract-nego-grid.component.html',
  styleUrls: ['./contract-nego-grid.component.scss']
})
export class ContractNegoGridComponent implements OnInit {

  @Input() contractData;
  @Input() periodicity;
  @Input() locationId;
  //@Input() chipSelected;
  public rfqSent: boolean = true;
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
  showProgressBar: boolean = false;
  constructor(private localService: LocalService) {
    this.context = { componentParent: this };
  }
  ngOnInit(): void {

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
      animateRows: false,
      tooltipShowDelay: 0,
      // groupUseEntireRow:true,
      onFirstDataRendered(params) {
        params.api.sizeColumnsToFit();
      },
      rowSelection: 'multiple',
      onGridReady: (params) => {
        this.gridOptions_forecast.api = params.api;
        this.gridOptions_forecast.columnApi = params.columnApi;
        this.gridOptions_forecast.api.sizeColumnsToFit();
        this.rowCount = this.gridOptions_forecast.api.getDisplayedRowCount();
        params.api.sizeColumnsToFit();
        this.localService.getContractNegoJSON('10001', '002').subscribe((res: any) => {
          this.rowData_aggrid_forecast = res;
          let result = this.rowData_aggrid_forecast.map(data => ({
            id: data.id, Status: data.Status, check: data.check, CounterpartyName: data.CounterpartyName, GenRating: data.GenRating, PortRating: data.PortRating,
          }));
          this.gridOptions_forecast.api.setRowData(result);
          //this.gridOptions_forecast.api.setRowData(this.rowData_aggrid_forecast);
        });
        this.gridOptions_forecast.getRowStyle = (params) => {
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

      onColumnResized: (params) => {
        this.counterpartyHeaderWidth = (params.columnApi.getColumn("check").getActualWidth() +
          params.columnApi.getColumn("CounterpartyName").getActualWidth() +
          params.columnApi.getColumn("GenRating").getActualWidth() +
          params.columnApi.getColumn("PortRating").getActualWidth());
        this.pinnedColumnsWidth.emit(this.counterpartyHeaderWidth);
      },

      onRowClicked(params) {
        // params.node.setExpanded(!params.node.expanded);
      },

      onColumnVisible: function (params) {
        if (params.columnApi.getAllDisplayedColumns().length <= 11) {
          params.api.sizeColumnsToFit();
        }
        // params.api.sizeColumnsToFit();
      },
      autoGroupColumnDef: {
        headerName: 'Product', headerTooltip: 'Product', field: 'ProductName', minWidth: 200,
        comparator: function(a,b) {
            const statusName = ['OfferCreated','AwaitingApproval','Approved','Rejected','Contracted']; //Sort Ag-grid data based on this status order
            return statusName.indexOf(a) - statusName.indexOf(b);
        },
        sort: 'asc',        
        cellClass: (params) => { return params.node.level != 0 && this.rfqSent && this.rowSelected && params.node.rowIndex != 3 ? 'editable-cell grey-opacity-cell' : 'ag-grouped-cell' },
        cellRendererSelector: (params) => {
          this.sendNodeData.emit(params.node);
          if (params.node.level == 0) {
            return {
              component: 'agGroupCellRenderer',
              params: { label: 'port-rating', cellClass: 'rating-chip-renderer' } 
            };
          } else if (params.node.rowIndex != 3) {
            return {
              component: 'productSelectRenderer'
            };
          }
          else{
            return {
              component: 'noQuoteRenderer',
              params: { show: this.rfqSent }
            }
          }
        },
        cellRendererParams: {
          suppressCount: true
        },


        colSpan: (params) => {

          if (params.node.rowIndex == 3|| params.node.level==0)
            return 12;
          else
            return 1;
        }

      },


      frameworkComponents: {
        checkboxHeaderRenderer: MatCheckboxHeaderComponent,
        checkboxRenderer: AGGridCheckboxRenderer,
        ratingChipRenderer: AGGridRatingChipRenderer,
        groupRowRenderer: GroupRowInnerRenderer,
        inputSelectRenderer: AGGridInputSelectRenderer,
        datepickerRenderer: AGGridDatepickerRenderer,
        productSelectRenderer: AGGridCellMenuRenderer,
        noQuoteRenderer: fullWidthCellRenderer
      },

      // getRowClass: params => {
      //   if (this.rfqSent && params.rowIndex == 3) {
      //     return 'display-no-quote';
      //   }
      // }

    }


    this.localService.sendRFQUpdate.subscribe(data => {
      // alert(this.rfqSent);
      //console.log(data);
      this.rfqSent = data;
      //this.rfqComplete= true;
      this.localService.isRowSelected.subscribe(data => {
        this.rowSelected = data;
      });
      //alert(this.rowSelected);
      if (data && this.rowSelected && !this.isCalculated) {
        let result = this.rowData_aggrid_forecast.map(data => ({
          id: data.id, Status: data.Status, check: data.check, CounterpartyName: data.CounterpartyName,
          GenRating: data.GenRating, PortRating: data.PortRating, ProductName: data.ProductName, SpecGroupName: data.SpecGroupName, MinQuantity: data.MinQuantity,
          MaxQuantity: data.MaxQuantity, OfferPrice: data.OfferPrice, ValidityDate: data.ValidityDate, M1: '', M2: '', M3: '', M4: '', M5: '', M6: '', Q1: '', Q2: '', Q3: '', Q4: '',
          fdTotalContractAmt: data.fdTotalContractAmt, fdFomulaDesc: data.fdFomulaDesc, fdSchedule: data.fdSchedule, fdPremium: data.fdPremium, fdAddCosts: data.fdAddCosts, fdRemarks: data.fdRemarks
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
      this.gridOptions_forecast.columnApi.setColumnsVisible(['ProductName', 'SpecGroupName', 'MinQuantity', 'MaxQuantity', 'OfferPrice', 'ValidityDate', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6'], true);
      this.gridOptions_forecast.columnApi.setColumnsVisible(['Q1', 'Q2', 'Q3', 'Q4', 'fdTotalContractAmt', 'fdFomulaDesc', 'fdSchedule', 'fdPremium', 'fdAddCosts', 'fdRemarks'], false);
    }
    else if (this.selectedChip == '1' && this.selectedPeriodicity == 'Q') {
      this.gridOptions_forecast.columnApi.setColumnsVisible(['ProductName', 'SpecGroupName', 'MinQuantity', 'MaxQuantity', 'OfferPrice', 'ValidityDate', 'Q1', 'Q2', 'Q3', 'Q4'], true);
      this.gridOptions_forecast.columnApi.setColumnsVisible(['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'm5check', 'm6check', 'fdTotalContractAmt', 'fdFomulaDesc', 'fdSchedule', 'fdPremium', 'fdAddCosts', 'fdRemarks'], false);
    } else {
      this.gridOptions_forecast.columnApi.setColumnsVisible(['ProductName', 'SpecGroupName', 'MinQuantity', 'MaxQuantity', 'OfferPrice', 'ValidityDate', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'Q1', 'Q2', 'Q3', 'Q4'], false);
      this.gridOptions_forecast.columnApi.setColumnsVisible(['fdTotalContractAmt', 'fdFomulaDesc', 'fdSchedule', 'fdPremium', 'fdAddCosts', 'fdRemarks'], true);
    }
  }

  /* getGridData() {

    
  } */
  selectAllRows(flag) {
  }
  toolTipValueGetter(params) {
    if (params.value != "-")
      return params.value;
  }
  getStatusName(id) {
    let name;
    let className;

    switch (id) {
      case '0': { name = 'Offers'; className = "offers"; break; }
      case '1': { name = 'Awaiting Approval'; className = "await"; break; }
      case '2': { name = 'Approved'; className = "approved"; break; }
      case '3': { name = 'Rejected'; className = "rejected"; break; }
      case '4': { name = 'Contracted'; className = "contracted"; break; }
    }
    return {
      "name": name,
      "className": className
    };
  }

  private rowClassRules = {
    // 'customRowClass': function (params) {
    //   var OfferPrice = params.data.OfferPrice1;
    //   return OfferPrice == 100;
    // },
    // 'display-no-quote': function (params) {
    //   var OfferPrice = params.data.isQuote;
    //   return OfferPrice == 'No quote';
    // },
  };

  private columnDef_aggrid_forecast = [
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
          checkboxSelection: (params) => { return params.node.level != 0 ? true : false },
          resizable: false,
          suppressNavigable: true, lockPosition: true, pinned: 'left',
          headerClass: 'header-checkbox-center checkbox-center ag-checkbox-v2 header-selectAll',
          cellClass: 'ag-checkbox-v2',
          suppressSizeToFit:true
        },
        {
          headerName: 'Name', headerTooltip: 'Name', field: 'CounterpartyName', width: 100,suppressSizeToFit:true,
          cellClass: 'suppress-movable-col remove-option hoverCell', pinned: 'left',
          headerClass: 'm-l-7', suppressNavigable: true, lockPosition: true,
          cellRendererFramework: AGGridCellClickRendererComponent,
          cellRendererParams: { label: 'hover-cell-lookup', type: 'hover-cell-lookup', cellClass: '', data: (params) => { return params.data } }
        },
        {
          headerName: 'Gen. Rating', headerTooltip: 'General Rating', headerClass: ['aggrid-text-align-c'],suppressSizeToFit:true,
          suppressNavigable: true, lockPosition: true, pinned: 'left',
          field: 'GenRating', minWidth: 60, maxWidth: 110, cellClass: 'aggridtextalign-center no-padding rating-chip-renderer',
          // cellRendererParams: { label: 'gen-rating', cellClass: 'rating-chip-renderer' }
          cellRendererSelector: (params) => {
            if (params.node.level != 0) {
              return {
                component: 'ratingChipRenderer',
                params: {
                  label: 'gen-rating', cellClass: 'rating-chip-renderer',
                  value: { grating: params.data?.GenRating, gprice: '', prating: params.data?.PortRating, pprice: '' }
                }
              };
            } else {
              return undefined;
            }
          },
        },
        {
          headerName: 'Port Rating', headerTooltip: 'Port Rating', headerClass: ['aggrid-text-align-c border-right'],
          suppressNavigable: true, lockPosition: true, pinned: 'left',suppressSizeToFit:true,
          field: 'PortRating', minWidth:60, maxWidth: 110, cellClass: 'aggridtextalign-center no-padding rating-chip rating-chip-renderer',
          // cellRenderer: 'ratingChipRenderer'
          cellRendererSelector: (params) => {
            if (params.node.level != 0) {
              return {
                component: 'ratingChipRenderer',
                params: {
                  label: 'port-rating', cellClass: 'rating-chip-renderer',
                  value: { grating: params.data?.GenRating, gprice: '', prating: params.data?.PortRating, pprice: '' }
                }
              };
            } else {
              return undefined;
            }
          },
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
          field: 'Status', resizable: false, rowGroup: true, cellRenderer: 'agGroupCellRenderer', hide: true,
          cellRendererParams: {
            innerRenderer: GroupRowInnerRenderer,
            innerRendererParams:(params)=>{return{toggle:params.node.expanded}},
            suppressCount: true,
            checkbox: false,
            suppressDoubleClickExpand: true,
            suppressEnterExpand: true,
          }
        },
        // {
        //   headerName: 'Product', headerTooltip: 'Product', field: 'product',
        // },
        {
          headerName: 'Spec',
          headerTooltip: 'Spec', field: 'SpecGroupName', editable: true, cellClass: (params) => { return params.node.level != 0 && this.rfqSent && this.rowSelected ? 'editable-cell grey-opacity-cell' : '' }
        },
        {
          headerName: 'Qty Min', headerTooltip: 'Qty Min', field: 'MinQuantity', minWidth: 120,
          cellClass: (params) => { return params.node.level != 0 && this.rfqSent && this.rowSelected ? 'editable-cell input-select-renderer grey-opacity-cell' : '' },
          // cellRenderer: 'inputSelectRenderer',
          // cellRendererParams: (params) => { return { value: params.data?.MinQuantity, unit: params.data?.MinQuantityUnit } }

          cellRendererSelector: (params) => {
            if (params.node.level != 0 && this.rfqSent && this.rowSelected) {
              return {
                component: 'inputSelectRenderer',
                params: { value: params.data.MinQuantity, unit: params.data.MinQuantityUnit?params.data.MinQuantityUnit:'BBL' }
              };
            } else {
              return undefined;
            }
          },
        },

        {
          headerName: 'Qty Max', headerTooltip: 'Qty Max', field: 'MaxQuantity', minWidth: 120,
          cellClass: (params) => { return params.node.level != 0 && this.rfqSent && this.rowSelected ? 'editable-cell input-select-renderer grey-opacity-cell' : '' },
          //cellClass: ['editable-cell input-select-renderer'],
          // cellRenderer: 'inputSelectRenderer',
          // cellRendererParams: (params) => { return { value: params.data?.MaxQuantity, unit: params.data?.MaxQuantityUnit } }

          cellRendererSelector: (params) => {
            if (params.node.level != 0 && this.rfqSent && this.rowSelected) {
              return {
                component: 'inputSelectRenderer',
                params: { value: params.data.MaxQuantity, unit: params.data.MaxQuantityUnit?params.data.MaxQuantityUnit:'BBL' }
              };
            } else {
              return undefined;
            }
          },
        },
        {
          headerName: 'Offer Price', headerTooltip: 'Offer Price', field: 'OfferPrice', editable: true, type: "numericColumn",
          cellClass: (params) => { return params.node.level != 0 && this.rfqSent && this.rowSelected ? 'editable-cell grey-opacity-cell' : '' },
          cellRendererFramework: AGGridCellClickRendererComponent,
          cellRendererParams:(params)=>{ return { label: 'offerprice-hover-cell', type: 'offerprice-hover-cell', cellClass: '' ,context:this.context}}
        },
        {
          headerName: 'Validity', headerTooltip: 'Validity', field: 'ValidityDate', cellClass: (params) => { return params.node.level != 0 && this.rfqSent && this.rowSelected ? 'editable-cell grey-opacity-cell' : '' },
          cellRendererSelector: (params) => {
            if (params.node.level != 0) {
              return {
                component: 'datepickerRenderer'
              };
            } else {
              return undefined;
            }
          },
        },
        // {
        //   headerName: '', field: 'm1check', cellClass: 'ag-checkbox-v2', suppressMenu: true,width: 10,
        //   cellRenderer: params => {
        //     if(this.rfqSent && this.rowSelected && params.node.level != 0){
        //       return `<label class="container">
        //       <input type="checkbox" class="checkbox dark" ${params.value ? 'checked' : ''} />
        //       <span class="checkmark"></span>
        //     </label>`
        //     }else{
        //       return undefined;
        //     }
        //   }
        // },
        {
          headerName: 'M1', headerTooltip: 'M1', field: 'M1', cellClass: 'grey-opacity-cell',
          cellRendererFramework: AGGridCheckboxRenderer,
          cellRendererParams: (params) => {
            return this.gridCellRenderer(params);
          }
        },
        {
          headerName: 'Q1', headerTooltip: 'Q1', field: 'Q1',
          cellRendererFramework: AGGridCheckboxRenderer,
          cellRendererParams: (params) => {
            return this.gridCellRenderer(params);
          }
        },
        {
          headerName: 'M2', headerTooltip: 'M2', field: 'M2', cellClass: 'grey-opacity-cell',
          cellRendererFramework: AGGridCheckboxRenderer,
          cellRendererParams: (params) => {
            return this.gridCellRenderer(params);
          }
        },
        {
          headerName: 'Q2', headerTooltip: 'Q2', field: 'Q2',
          cellRendererFramework: AGGridCheckboxRenderer,
          cellRendererParams: (params) => {
            return this.gridCellRenderer(params);
          }
        },

        {
          headerName: 'M3', headerTooltip: 'M3', field: 'M3', cellClass: 'grey-opacity-cell',
          cellRendererFramework: AGGridCheckboxRenderer,
          cellRendererParams: (params) => {
            return this.gridCellRenderer(params);
          }
        },
        {
          headerName: 'Q3', headerTooltip: 'Q3', field: 'Q3',
          cellRendererFramework: AGGridCheckboxRenderer,
          cellRendererParams: (params) => {
            return this.gridCellRenderer(params);
          }
        },

        {
          headerName: 'M4', headerTooltip: 'M4', field: 'M4', cellClass: 'grey-opacity-cell',
          cellRendererFramework: AGGridCheckboxRenderer,
          cellRendererParams: (params) => {
            return this.gridCellRenderer(params);
          }
        },
        {
          headerName: 'Q4', headerTooltip: 'Q4', field: 'Q4',
          cellRendererFramework: AGGridCheckboxRenderer,
          cellRendererParams: (params) => {
            return this.gridCellRenderer(params);
          }
        },

        {
          headerName: 'M5', headerTooltip: 'M5', field: 'M5', cellClass: 'grey-opacity-cell',
          cellRendererFramework: AGGridCheckboxRenderer,
          cellRendererParams: (params) => {
            return this.gridCellRenderer(params);
          }
        },

        {
          headerName: 'M6', headerTooltip: 'M6', field: 'M6', cellClass: 'grey-opacity-cell',
          cellRendererFramework: AGGridCheckboxRenderer,
          cellRendererParams: (params) => {
            return this.gridCellRenderer(params);
          }
        },
        {
          headerName: 'Total Contract Amt.', headerTooltip: 'Total Contract Amt.', field: 'fdTotalContractAmt'
        },
        {
          headerName: 'Formula Description', headerTooltip: 'Formula Description', field: 'fdFomulaDesc'
        },
        {
          headerName: 'Schedule', headerTooltip: 'Schedule', field: 'fdSchedule'
        },
        {
          headerName: 'Premium', headerTooltip: 'Premium', field: 'fdPremium'
        },
        {
          headerName: 'Add.Costs', headerTooltip: 'Add.Costs', field: 'fdAddCosts'
        },
        {
          headerName: 'Remarks', headerTooltip: 'Remarks', field: 'fdRemarks', cellClass: (params) => { return params.node.level != 0 && this.rfqSent && this.rowSelected ? 'editable-cell' : '' }
        },

      ]
    }

  ];

  gridCellRenderer(params) {
    {
      var classArray: string[] = [];
      let newClass = "";
      let clickEvent = false;
      let status = params.data ? params.data.Status : '';
      if (status == 'OfferCreated') {
        newClass = "normal-checkbox";
        clickEvent = true;
      }
      else if (status == "AwaitingApproval") {
        newClass = "orange-checkbox";
        clickEvent = true;
      }
      else if (status == "Rejected") {
        newClass = "red-checkbox";
        clickEvent = true;
      }
      else if (status == "Approved" || status == "Contracted") {
        newClass = params.value ==113 || params.value == 106 ? "tick-mark" : "";
        clickEvent = false;
      }
      classArray.push(newClass);
      return { cellClass: classArray.length > 0 ? classArray : null, isClickable: clickEvent, cellValueClass: params.value ==113 || params.value == 106 ? "best-price" : "", status: status }
    }
  }
  onRowSelected(e) {
    this.localService.sendRFQUpdate.subscribe((r) => {
      if (r == true) {
        this.gridOptions_forecast.api.forEachNode((rowNode, index) => {
          if (rowNode.level != 0 && e.rowIndex === rowNode.rowIndex) {
            rowNode.data.rfqStatus = true;
            rowNode.data.check = false;
          }
        });
        //this.localService.updateSendRFQStatus(false);
      }

    })
    //this.rowSelected = true;
    //this.isCalculated = true;

    this.localService.updateRowSelected(true);
    if (this.rfqSent) {

      this.localService.setContractNoQuote(this.gridOptions_forecast.api.getSelectedRows().length>0);

    }
  }

  toggleProgressBar(row){
    this.showProgressBar = !this.showProgressBar;
    row.Status="OfferCreated";
    row.M1="";
    row.M2="";
    row.M3="";
    row.M4="";
    row.M5="";
    row.M6="";
    row.Q1="";
    row.Q2="";
    row.Q3="";
    row.Q4="";

    setTimeout(()=>{    
      this.gridOptions_forecast.api.applyTransaction({update:[row]});
      this.showProgressBar = !this.showProgressBar;
    },1500)
  }

}
