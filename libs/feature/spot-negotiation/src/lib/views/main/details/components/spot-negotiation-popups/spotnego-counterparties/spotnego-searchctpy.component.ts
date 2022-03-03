import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { GridOptions, IDatasource, IGetRowsParams } from 'ag-grid-community';
import { SpnegoAddCounterpartyModel } from 'libs/feature/spot-negotiation/src/lib/core/models/spnego-addcounterparty.model';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import { AddCounterpartyToLocations, AppendCounterpartyList, AppendLocationsRowsOriData, AppendPhysicalSupplierCounterpartyList, SetCounterpartyList, SetLocationsRows } from 'libs/feature/spot-negotiation/src/lib/store/actions/ag-grid-row.action';
import { ToastrService } from 'ngx-toastr';
import _, { cloneDeep } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpotNegotiationStoreModel } from 'libs/feature/spot-negotiation/src/lib/store/spot-negotiation.store';

@Component({
  selector: 'app-spotnego-searchctpy',
  templateUrl: './spotnego-searchctpy.component.html',
  styleUrls: ['./spotnego-searchctpy.component.css']
})
export class SpotnegoSearchCtpyComponent implements OnInit {
  public dialog_gridOptions: GridOptions;
  public counterpartyListRowCount: number;
  public physicalSupplierRowCount: number;
  public AddCounterpartiesAcrossLocations: boolean;
  public RequestGroupId: number;
  public RequestLocationId: number;
  public LocationId: number;
  public selectedRows: any = [];
  public params: any;
  public phySupplierId = 0;
  public editedSeller = '';
  currentRequest: any;
  rowSelection: string;
  searchingCounterparty:string = null;
  searchingPhysicalSuppilier: string = null;
  controlTowerListServerKeys: any;
  selectedCounterparties: any;
  public count: number = 0;
  public count2: number = 0;
  public counterpartyList : any;
  public physicalSuppilierList : any;
  public counterpartyListLength = 0;
  public physicalSupplierListLength = 0;
  public overlayLoadingTemplate;
  public overlayNoRowsTemplate;
  requestOptions: any;
  constructor(
    public format: TenantFormattingService,
    private router: Router,
    private store: Store,
    private toastr: ToastrService,
    private _spotNegotiationService: SpotNegotiationService,
    public dialogRef: MatDialogRef<SpotnegoSearchCtpyComponent>,
    private spotNegotiationService: SpotNegotiationService,
    private spinner : NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if(data.isPhysicalSupplier != undefined && data.isPhysicalSupplier){
      this.rowSelection = 'single';
    }
    else{
      this.rowSelection = 'multiple';
    }
    this.AddCounterpartiesAcrossLocations =
      data.AddCounterpartiesAcrossLocations;
    this.RequestGroupId = data.RequestGroupId;

    if (!data.AddCounterpartiesAcrossLocations) {
      this.RequestLocationId = data.RequestLocationId;
      this.LocationId = data.LocationId;
    }

    this.overlayLoadingTemplate =
      `<span class="ag-overlay-loading-center">Loading Rows....</span>`;
    this.overlayNoRowsTemplate =
      `"<span">No rows to show</span>"`;

    this.dialog_gridOptions = <GridOptions>{
      defaultColDef: {
        filter: true,
        sortable: true,
        resizable: true
      },
      columnDefs: this.columnDefs,
      suppressRowClickSelection: true,
      headerHeight: 30,
      rowHeight: 30,
      rowSelection: this.rowSelection,
      rowModelType: 'infinite',
      cacheBlockSize: 25,
      groupIncludeTotalFooter: true,

      onGridReady: params => {
        this.dialog_gridOptions.api = params.api;
        this.dialog_gridOptions.columnApi = params.columnApi;
        this.dialog_gridOptions.api.sizeColumnsToFit();
        if (data.isPhysicalSupplier != undefined && data.isPhysicalSupplier){
             params.api.setDatasource(this.physicalSupplierListDataSource);
        }
        else{
          params.api.setDatasource(this.counterPartyListDataSource);
        }

        // this.store.subscribe(({ spotNegotiation }) => {
        //   if (spotNegotiation.counterpartyList && this.dialog_gridOptions.api) {
        //     if (data.isPhysicalSupplier != undefined && data.isPhysicalSupplier) {
        //       this.rowData = spotNegotiation.counterpartyList.filter(x => x.supplier == true);
        //     }
        //     else {
        //       this.rowData = spotNegotiation.counterpartyList;
        //     }
        //     this.dialog_gridOptions.api.setRowData(this.rowData);
        //     this.rowCount = this.dialog_gridOptions.api.getDisplayedRowCount();
        //   }
        // });
        // if(data.isPhysicalSupplier != undefined && data.isPhysicalSupplier){
        //   this.dialog_gridOptions.api.forEachNode(function (node) {
        //     node.setSelected(node.data.id === data?.physicalSupplierCounterpartyId);
        //   });
        // }
      },
      getRowStyle: function(params) {
        if (params.node.rowPinned) {
          return { 'font-weight': '500', 'font-size': '20px' };
        }
      },
      onColumnResized: function(params) {
        if (
          params.columnApi.getAllDisplayedColumns().length <= 5 &&
          params.type === 'columnResized' &&
          params.finished === true &&
          params.source === 'uiColumnDragged'
        ) {
          params.api.sizeColumnsToFit();
        }
      }
    };
  }

  onCounterpartyChange(value){
    this.searchingCounterparty = value;
    if(this.searchingCounterparty.length === 0 ){
      let datasource: IDatasource = {
        getRows: (params: IGetRowsParams) =>{
            params.successCallback(this.counterpartyList, this.counterpartyListRowCount);
        }
     };
     this.dialog_gridOptions.api.setDatasource(datasource);
    }

  }

  onPhysicalSuppilierChange(value){
    this.searchingPhysicalSuppilier = value;
    if(this.searchingPhysicalSuppilier.length ===0 ){
      let datasource: IDatasource = {
         getRows: (params: IGetRowsParams) =>{
             params.successCallback(this.physicalSuppilierList, this.physicalSupplierRowCount);
         }
      };
      this.dialog_gridOptions.api.setDatasource(datasource);
   }
  }

  // For fetching counterparties List
  counterPartyListDataSource: IDatasource = {
    getRows: (params: IGetRowsParams) => {
      this.counterpartyListRowCount = this.spotNegotiationService.counterpartyTotalCount ;
      if(this.count !=0 && this.counterpartyListLength < params.endRow  ){
        this.dialog_gridOptions.api.showLoadingOverlay();
        let response = this.spotNegotiationService.getResponse(null, { Filters: [] }, { SortList: [] }, [{ ColumnName: 'CounterpartyTypes', Value: '1,2,3,11' }], null, { Skip:params.endRow-25 , Take: 25 } );
        response.subscribe((res: any) => {
            this.dialog_gridOptions.api.hideOverlay();
            if(res?.message == 'Unauthorized'){
              return;
            }
              if (res?.payload?.length > 0) {
                this.store.dispatch(new AppendCounterpartyList(res.payload));
                params.successCallback(res.payload, this.counterpartyListRowCount);
              }
          });
      }
      else{
        this.count = 1;
        this.store.subscribe(({ spotNegotiation }) => {
          this.counterpartyList = spotNegotiation.counterpartyList ;
          params.successCallback(this.counterpartyList.slice(params.startRow, params.endRow), this.counterpartyListRowCount);
           this.counterpartyListLength = this.counterpartyList.length;
        });
      }
      }
  }

  // For fetching PhysicalSupplier List
  physicalSupplierListDataSource : IDatasource = {
    getRows: (params: IGetRowsParams) =>{
      this.physicalSupplierRowCount = this.spotNegotiationService.physicalSupplierTotalCount;
        if(this.count2 !=0 && this.physicalSupplierListLength < params.endRow){
          this.dialog_gridOptions.api.showLoadingOverlay();
          let response = this.spotNegotiationService.getResponse(null, { Filters: [] }, { SortList: [] }, [{ ColumnName: 'CounterpartyTypes', Value: '1' }], null, { Skip:params.endRow-25 , Take: 25 } );
          response.subscribe((res:any)=>{
            this.dialog_gridOptions.api.hideOverlay();
            if(res?.message == 'Unauthorized'){
              return;
            }
            if(res?.payload?.length > 0){
              this.physicalSupplierRowCount = res.matchedCount;
              this.store.dispatch(new AppendPhysicalSupplierCounterpartyList(res.payload));
                params.successCallback(res.payload, this.physicalSupplierRowCount);
            }
          });
        }
        else{
          this.count2 = 1;
          this.store.subscribe(({ spotNegotiation }) => {
          this.physicalSuppilierList = spotNegotiation.physicalSupplierCounterpartyList ;
          params.successCallback(this.physicalSuppilierList.slice(params.startRow, params.endRow), this.physicalSupplierRowCount);
           this.physicalSupplierListLength = this.physicalSuppilierList.length;
        });
        }
    }
  };

  SearchCounterparty(userInput: string): void{
    this.dialog_gridOptions.api.hideOverlay();
    let dataSource: IDatasource = {
       getRows: (params:IGetRowsParams) =>{
        this.dialog_gridOptions.api.showLoadingOverlay();
      const response = this.spotNegotiationService.getResponse(null, { Filters: [] }, { SortList: [] }, [{ ColumnName: 'CounterpartyTypes', Value: '1,2,3,11' }], userInput.toLowerCase() , { Skip:params.endRow-25 , Take: 25 } );
      response.subscribe((res: any) => {
        this.dialog_gridOptions.api.hideOverlay();
        if(res?.message != 'Unauthorized'){
          
        
          if (res?.payload?.length > 0) {
            params.successCallback(res?.payload, res.matchedCount);
          }
          else{
              this.dialog_gridOptions.api.showNoRowsOverlay();
          }
        }
      });

    }
    };
    this.dialog_gridOptions.api.setDatasource(dataSource);
  }


  SearchPhysicalSupplier(userInput: string): void{
    this.dialog_gridOptions.api.hideOverlay();
    let dataSource: IDatasource = {
       getRows: (params:IGetRowsParams) =>{
        this.dialog_gridOptions.api.showLoadingOverlay();
        const response = this.spotNegotiationService.getResponse(null, { Filters: [] }, { SortList: [] }, [{ ColumnName: 'CounterpartyTypes', Value: '1' }], userInput.toLowerCase(), { Skip:params.endRow-25 , Take: 25 } );
      response.subscribe((res: any) => {
        this.dialog_gridOptions.api.hideOverlay();
        if(res?.message != 'Unauthorized'){

        
          if (res?.payload?.length > 0) {
            params.successCallback(res?.payload, res.matchedCount);
          }
          else{
            this.dialog_gridOptions.api.showNoRowsOverlay();
          }
        }
      });

    }
    };
    this.dialog_gridOptions.api.setDatasource(dataSource);
  }

  public columnDefs = [
    {
      headerName: '',
      field: 'check',
      filter: true,
      suppressMenu: true,
      width: 35,
      checkboxSelection: true,
      resizable: false,
      suppressMovable: true,
      headerClass: 'header-checkbox-center checkbox-center ag-checkbox-v2',
      cellClass: 'p-1 checkbox-center ag-checkbox-v2'
    },
    {
      headerName: 'Counterparty',
      headerTooltip: 'Counterparty',
      field: 'name',
      width: 175,
      cellClass: ['aggridtextalign-left']
    },
    {
      headerName: 'Parent',
      headerTooltip: 'Parent',
      field: 'parent.name',
      width: 175,
      cellClass: ['aggridtextalign-left'],
      //cellRendererFramework: AGGridCellRendererV2Component,
          // cellRendererParams: {
          //   type: 'searchbox-parent',
          // }
    },
    {
      headerName: 'Created By',
      headerTooltip: 'Created By',
      field: 'createdBy.name',
      cellClass: ['aggridtextalign-left']
    },
    {
      headerName: 'Created On',
      headerTooltip: 'Created On',
      field: 'createdOn',
      cellClass: ['aggridtextalign-center']
    },
    {
      headerName: 'Last Modified By',
      headerTooltip: 'Last Modified By',
      field: 'lastModifiedBy.name',
      cellClass: ['aggridtextalign-left']
    },
    {
      headerName: 'Last Modified On',
      headerTooltip: 'Last Modified On',
      field: 'lastModifiedOn',
      cellClass: ['aggridtextalign-center']
    }
  ];

  public numberFormatter(params) {
    if (isNaN(params.value)) return params.value;
    else return params.value.toFixed(4);
  }

  public rowData: any[];

  ngOnInit() {
    this.store.subscribe(({ spotNegotiation }) => {
      this.currentRequest = spotNegotiation.currentRequestSmallInfo;
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
  toBeAddedCounterparties(): SpnegoAddCounterpartyModel[] {
    this.selectedRows = this.dialog_gridOptions.api.getSelectedRows();

    
    if (this.AddCounterpartiesAcrossLocations) {
      this.requestOptions = this.store.selectSnapshot(
        (state: SpotNegotiationStoreModel) => {
          return state['spotNegotiation'].requests;
        }
      );
      let selectedCounterparties = [];
      //Looping through all the Request Locations
      this.requestOptions.forEach( reqOption => {
        reqOption.requestLocations.forEach(reqLoc => {
          let perLocationCtpys = this.selectedRows.map(
            val =>
              <SpnegoAddCounterpartyModel>{
                requestGroupId: this.RequestGroupId,
                requestId: reqLoc.requestId,
                requestLocationId: reqLoc.id,
                locationId: reqLoc.locationId,
                id: 0,
                name: '',
                counterpartytypeId: 0,
                counterpartyTypeName: '',
                genPrice: '',
                genRating: '',
                isDeleted: false,
                isSelected: true,
                mail: '',
                portPrice: '',
                portRating: '',
                prefferedProductIds: '',
                sellerComments: '',
                isSellerPortalComments:false,
                sellerCounterpartyId: val.id,
                sellerCounterpartyName: val.name,
                senRating: ''
              }
          );
          selectedCounterparties.push(...perLocationCtpys);
        });
      })

      return selectedCounterparties;
    } else {
      return this.selectedRows.map(
        val =>
          <SpnegoAddCounterpartyModel>{
            requestGroupId: this.RequestGroupId,
            requestId: this.currentRequest.id,
            requestLocationId: this.RequestLocationId,
            locationId: this.LocationId,
            id: 0,
            name: '',
            counterpartytypeId: 0,
            counterpartyTypeName: '',
            genPrice: '',
            genRating: '',
            isDeleted: false,
            isSelected: true,
            mail: '',
            portPrice: '',
            portRating: '',
            prefferedProductIds: '',
            sellerComments: '',
            isSellerPortalComments:false,
            sellerCounterpartyId: val.id,
            sellerCounterpartyName: val.name,
            senRating: ''
          }
      );
    }
  }

  search(userInput: string): void {
    this.store.subscribe(({ spotNegotiation }) => {
      if (spotNegotiation.counterpartyList) {
        this.rowData = spotNegotiation.counterpartyList
          .filter(e => {
            if (e.name.toLowerCase().includes(userInput.toLowerCase())) {
              return true;
            }
            else{
              return false;
            }
          });
        this.dialog_gridOptions.api.setRowData(this.rowData);
        if(this.rowData.length > 0){
          let physicalSupplierCounterpartyId = this.data.physicalSupplierCounterpartyId;
          this.dialog_gridOptions.api.forEachNode(function (node) {
            node.setSelected(node.data.id === physicalSupplierCounterpartyId);
          });
        }
      }
    });

  }

  //Update physical Supplier Counterparty Name
  getLocationRowsAddPhySupplier(locationrow) {
    locationrow.forEach((element) => {
      if (element.id == this.data.requestLocationSellerId) {
        element.physicalSupplierCounterpartyId = this.selectedCounterparties[0].sellerCounterpartyId;
        element.physicalSupplierCounterpartyName = this.selectedCounterparties[0].sellerCounterpartyName;
      }
    });
    return locationrow;
  }

  AddCounterparties() {
     this.selectedCounterparties = this.toBeAddedCounterparties();
    if (this.selectedCounterparties.length === 0) return;
    if(this.data.isPhysicalSupplier){
        let reqPayload={
          "requestGroupId":this.data.RequestGroupId,
          "requestLocationId":this.data.RequestLocationId,
          "requestLocationSellerId":this.data.requestLocationSellerId,
          "phySupplierId": this.selectedCounterparties[0].sellerCounterpartyId,
          "sellerCounterpartyId":this.selectedCounterparties[0].sellerCounterpartyId ,
          "physicalSupplierCounterpartyName":this.selectedCounterparties[0].sellerCounterpartyName
      }
      const locationsRows = this.store.selectSnapshot<string>((state: any) => {
        return state.spotNegotiation.locationsRows;
      });

    const response = this._spotNegotiationService.updatePhySupplier(reqPayload);
    response.subscribe((res: any) => {
      if(res?.message == 'Unauthorized'){
        return;
      }
      if (res.status) {

       //Update the locationRows in the store whenever physical supplier changes/added
        const futureLocationsRows = this.getLocationRowsAddPhySupplier(JSON.parse(JSON.stringify(locationsRows)));
        this.store.dispatch(new SetLocationsRows(futureLocationsRows));
        this.toastr.success('Phy. Supplier added successfully');
      } else {
        this.toastr.error(res.message);
        return;
      }
    });

    this.dialogRef.close({
      sellerName: this.selectedCounterparties[0].sellerCounterpartyName
    }
    );
    }

    if(!this.data.isPhysicalSupplier){
    let payload = {
      requestGroupId: this.RequestGroupId,
      isAllLocation: this.data.AddCounterpartiesAcrossLocations,
      counterparties: this.selectedCounterparties
    };
    const response = this._spotNegotiationService.addCounterparties(payload);
    response.subscribe((res: any) => {
      if(res?.message == 'Unauthorized'){
        return;
      }
      if (res.status) {
        this.toastr.success(res.message);
        // Add in Store
        this.store.dispatch(
          new AddCounterpartyToLocations(res.counterparties)
        );
        this.store.dispatch(new AppendLocationsRowsOriData(res.counterparties));
      } else {
        this.toastr.error(res.message);
        return;
      }
    });
  }
  }
}
