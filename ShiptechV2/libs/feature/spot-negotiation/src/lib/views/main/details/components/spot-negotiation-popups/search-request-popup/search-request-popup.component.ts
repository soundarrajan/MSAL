import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { Store } from '@ngxs/store';
import { AGGridCellRendererComponent } from '../../../../../../core/ag-grid/ag-grid-cell-renderer.component';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
import { AddRequest } from '../../../../../../store/actions/request-group-actions';
import { AddCounterpartyToLocations } from '../../../../../../store/actions/ag-grid-row.action';
import { SpotNegotiationStoreModel } from 'libs/feature/spot-negotiation/src/lib/store/spot-negotiation.store';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';

@Component({
  selector: 'app-search-request-popup',
  templateUrl: './search-request-popup.component.html',
  styleUrls: ['./search-request-popup.component.css']
})
export class SearchRequestPopupComponent implements OnInit {
  public dialog_gridOptions: GridOptions;
  public requestRowCount: number = this._spotNegotiationService.requestCount;
  public count;
  public requestListLength;
  public requestList;
  public hoverRowDetails = [
    { label: 'Day Opening Balance', value: '5000 MT' },
    { label: 'In', value: '3000 MT' },
    { label: 'Out', value: '-5000 MT' },
    { label: 'Transfer Out', value: '-2000 MT' },
    { label: 'Transfer In', value: '0 MT' },
    { label: 'Gain', value: '20 MT' },
    { label: 'Loss', value: '0 MT' },
    { label: 'Adj In', value: '0 MT' },
    { label: 'Adj Out', value: '0 MT' },
    { label: 'Day Closing Balance', value: '1020 MT' }
  ];
  selectedRequestList: any[];
  RequestGroupId: any;
  rowData: any = [];
  searchingRequest: string = null;
  public page: number;
  public pageSize: number;
  public totalItems: number;
  public gridId: any;
  public overlayLoadingTemplate =
    '<span class="ag-overlay-loading-center" style="color:white;border-radius:20px; border: 2px solid #5C5C5B; background: #5C5C5B ;">Loading Rows...</span>';
  public overlayNoRowsTemplate = '<span>No rows to show</span>';
  ngOnInit() {}
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private store: Store,
    private format: TenantFormattingService,
    private _spotNegotiationService: SpotNegotiationService,
    public dialogRef: MatDialogRef<SearchRequestPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.RequestGroupId = data.RequestGroupId;

    this.dialog_gridOptions = <GridOptions>{
      defaultColDef: {
        resizable: true
      },

      columnDefs: this.columnDefs,
      suppressRowClickSelection: true,
      headerHeight: 30,
      rowHeight: 30,
      rowSelection: 'multiple',
      //rowModelType: 'single',
      //cacheBlockSize: 50,

      // groupIncludeTotalFooter: true,
      onGridReady: params => {
        this.dialog_gridOptions.api = params.api;
        this.dialog_gridOptions.columnApi = params.columnApi;
        this.dialog_gridOptions.api.sizeColumnsToFit();
        //params.api.setDatasource(this.dataSource);

        this.store.selectSnapshot<any>((state: any) => {
          this.requestList = state.spotNegotiation.requestList;
          var currentPage = this.dialog_gridOptions.api.paginationGetCurrentPage();
          this.page = currentPage + 1;
          this.pageSize = 25;
          this.totalItems = this.requestRowCount;
          this.dialog_gridOptions.api.setRowData(this.requestList);
          this.requestListLength = this.requestList.length;
        });
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

  onPageChange(page: number) {
    var endRowData = page * this.pageSize;
    this.dialog_gridOptions.api.showLoadingOverlay();
    this.page = page;
    const response = this._spotNegotiationService.getRequestresponse(
      null,
      { Filters: [] },
      { SortList: [{ columnValue: 'eta', sortIndex: 0, sortParameter: 2 }] },
      [],
      null,
      { Skip: endRowData - this.pageSize, Take: this.pageSize }
    );
    response.subscribe((res: any) => {
      this.dialog_gridOptions.api.hideOverlay();
      this.dialog_gridOptions.api.setRowData(res.payload);
    });
  }

  onPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.dialog_gridOptions.api.showLoadingOverlay();
    var currentPage = this.dialog_gridOptions.api.paginationGetCurrentPage();
    this.page = currentPage + 1;
    const response = this._spotNegotiationService.getRequestresponse(
      null,
      { Filters: [] },
      { SortList: [{ columnValue: 'eta', sortIndex: 0, sortParameter: 2 }] },
      [],
      null,
      { Skip: 0, Take: this.pageSize }
    );
    response.subscribe((res: any) => {
      this.dialog_gridOptions.api.hideOverlay();
      if (res.payload) {
        this.requestList = res.payload;
        this.dialog_gridOptions.api.setRowData(res.payload);
      } else {
        this.dialog_gridOptions.api.showNoRowsOverlay();
      }
    });
  }

  onCounterpartyChange(value) {
    this.searchingRequest = value;
    if (this.searchingRequest.length === 0) {
      this.totalItems = this.requestRowCount;
      this.dialog_gridOptions.api.setRowData(this.requestList);
    } else {
      return;
    }
  }

  search(userInput: string) {
    this.dialog_gridOptions.api.showLoadingOverlay();
    const response = this._spotNegotiationService.getRequestresponse(
      null,
      { Filters: [] },
      { SortList: [{ columnValue: 'eta', sortIndex: 0, sortParameter: 2 }] },
      [],
      userInput.toLowerCase(),
      { Skip: 0, Take: this.pageSize }
    );
    response.subscribe((res: any) => {
      this.totalItems = res.matchedCount;
      this.dialog_gridOptions.api.hideOverlay();
      if (res.payload) {
        var currentPage = this.dialog_gridOptions.api.paginationGetCurrentPage();
        this.page = currentPage + 1;
        this.dialog_gridOptions.api.setRowData(res.payload);
      } else {
        this.dialog_gridOptions.api.showNoRowsOverlay();
      }
    });
  }

  // onPageSizeChange(pageSize: number): void {
  //   var currentPage = this.dialog_gridOptions.api.paginationGetCurrentPage();
  //  this.page = currentPage + 1;
  //   this.pageSize =  pageSize;
  //   console.log("Page Size = "+ this.pageSize);
  //   let dataSource : IDatasource ={
  //     getRows: (params: IGetRowsParams)=>{
  //      this.dialog_gridOptions.api.showLoadingOverlay();
  //      const response = this._spotNegotiationService.getRequestresponse(null, { Filters: [] }, { SortList: [{ columnValue: 'eta', sortIndex: 0, sortParameter: 2 }]}, [] , null , { Skip:0, Take: this.pageSize });
  //      //this.page = page;
  //      response.subscribe((res:any)=>{
  //       this.totalItems = this.requestRowCount;
  //        this.dialog_gridOptions.api.hideOverlay();
  //      if(res?.payload?.length >0){
  //         params.successCallback(res.payload, res.matchedCount);
  //        }
  //      else{
  //        this.dialog_gridOptions.api.showNoRowsOverlay();
  //      }
  //    });
  //     }
  //     };
  //   this.dialog_gridOptions.api.setDatasource(dataSource);
  // }

  // onPageChange(page: number){
  //   var endRowData = page * this.pageSize ;
  //   let dataSource : IDatasource ={
  //     getRows: (params: IGetRowsParams)=>{
  //      this.dialog_gridOptions.api.showLoadingOverlay();
  //      const response = this._spotNegotiationService.getRequestresponse(null, { Filters: [] }, { SortList: [{ columnValue: 'eta', sortIndex: 0, sortParameter: 2 }]}, [] , null , { Skip:endRowData, Take: this.pageSize });
  //      this.page = page;
  //      response.subscribe((res:any)=>{
  //       this.totalItems = this.requestRowCount;
  //        this.dialog_gridOptions.api.hideOverlay();
  //      if(res?.payload?.length >0){
  //         params.successCallback(res.payload, res.matchedCount);
  //        }
  //      else{
  //        this.dialog_gridOptions.api.showNoRowsOverlay();
  //      }
  //    });
  //     }
  //     };
  //   this.dialog_gridOptions.api.setDatasource(dataSource);

  // }

  // onCounterpartyChange(value){
  //   this.searchingRequest = value;
  //   if(this.searchingRequest.length ===0 ){
  //     let datasource: IDatasource = {
  //        getRows: (params: IGetRowsParams) =>{
  //            var currentPage = this.dialog_gridOptions.api.paginationGetCurrentPage();
  //           this.page = currentPage + 1;
  //           this.totalItems =this.requestRowCount;
  //            params.successCallback(this.requestList, this.requestRowCount);
  //        }
  //     };
  //     this.dialog_gridOptions.api.setDatasource(datasource);
  //  }
  // }

  // dataSource: IDatasource = {
  //   getRows: (params: IGetRowsParams) => {
  //     this.requestRowCount = this._spotNegotiationService.requestCount;
  //     if(this.count !=0 && this.requestListLength < params.endRow ){
  //       this.dialog_gridOptions.api.showLoadingOverlay();
  //       const response = this._spotNegotiationService.getRequestresponse(null, { Filters: [] }, { SortList: [{ columnValue: 'eta', sortIndex: 0, sortParameter: 2 }]}, [] , null , { Skip: params.endRow-25, Take: 25 })
  //       response.subscribe((res: any) => {
  //         this.dialog_gridOptions.api.hideOverlay();
  //           if (res?.payload?.length > 0) {

  //             params.successCallback(res.payload, this.requestRowCount);
  //             this.store.dispatch(new AppendRequestList(res.payload));
  //           }
  //       });
  //     }
  //     else{
  //       this.count =1 ;
  //       this.dialog_gridOptions.api.hideOverlay();
  //       this.store.subscribe(({ spotNegotiation }) => {
  //       this.requestList = spotNegotiation.requestList ;
  //       var currentPage = this.dialog_gridOptions.api.paginationGetCurrentPage();
  //        this.page = currentPage + 1;
  //        this.totalItems = this.requestRowCount;
  //         params.successCallback(this.requestList.slice(params.startRow, params.endRow), this.requestRowCount);
  //          this.requestListLength = this.requestList.length;
  //       });
  //     }
  //     }
  // }

  // search(userInput: string){
  //  let dataSource : IDatasource ={
  //    getRows: (params: IGetRowsParams)=>{
  //     this.dialog_gridOptions.api.showLoadingOverlay();
  //     const response = this._spotNegotiationService.getRequestresponse(null, { Filters: [] }, { SortList: [{ columnValue: 'eta', sortIndex: 0, sortParameter: 2 }]}, [] , userInput.toLowerCase() , { Skip:0, Take: 25 });
  //     response.subscribe((res:any)=>{
  //       var currentPage = this.dialog_gridOptions.api.paginationGetCurrentPage();
  //       this.page = currentPage + 1;
  //       this.totalItems = res.matchedCount;
  //       this.dialog_gridOptions.api.hideOverlay();
  //     if(res?.payload?.length >0){
  //        params.successCallback(res.payload, res.matchedCount);
  //       }
  //     else{
  //       this.dialog_gridOptions.api.showNoRowsOverlay();
  //     }
  //   });
  //    }
  //    };

  //   this.dialog_gridOptions.api.setDatasource(dataSource);
  // }

  addToRequestList() {
    this.selectedRequestList = this.dialog_gridOptions.api.getSelectedRows();
    if (this.selectedRequestList.length > 0) {
      const requests = this.store.selectSnapshot(
        (state: SpotNegotiationStoreModel) => {
          return state['spotNegotiation'].requests;
        }
      );
      let selectedreqId = [];
      this.selectedRequestList.forEach(element => {
        let filterduplicaterequest = requests.filter(
          e => e.id == element.requestId
        );
        if (filterduplicaterequest.length > 0) {
          let ErrorMessage =
            filterduplicaterequest[0].name +
            ' - ' +
            filterduplicaterequest[0].vesselName +
            ' already linked to the request.';
          this.toastr.error(ErrorMessage);
        } else {
          selectedreqId.push(element.requestId);
        }
      });
      if (this.selectedRequestList.length > 0) {
        let payload = {
          groupId: parseInt(this.RequestGroupId),
          requestIds: selectedreqId
        };
        const response = this._spotNegotiationService.addRequesttoGroup(
          payload
        );
        response.subscribe((res: any) => {
          if (res?.message == 'Unauthorized') {
            return;
          }
          if (res.error) {
            alert('Handle Error');
            return;
          } else {
            if (res['requests'] && res['requests'].length > 0) {
              this.store.dispatch(new AddRequest(res['requests']));
              res['requests'].forEach(element => {
                let SuccessMessage =
                  element.name +
                  ' - ' +
                  element.vesselName +
                  ' has been linked successfully.';
                this.toastr.success(SuccessMessage);
              });
            }
            if (
              res['requestLocationSellers'] &&
              res['requestLocationSellers'].length > 0
            ) {
              this.store.dispatch(
                new AddCounterpartyToLocations(res['requestLocationSellers'])
              );
            }
          }
        });
      }
    } else {
      this.toastr.error('Select atlease one Request');
      return;
    }
  }
  search1(userInput: string): void {
    this.store.selectSnapshot<any>((state: any) => {
      if (state.spotNegotiation.requestList) {
        this.rowData = state.spotNegotiation.requestList.filter(e => {
          if (
            e.requestName.toLowerCase().includes(userInput.toLowerCase()) ||
            e.vesselName.toLowerCase().includes(userInput.toLowerCase())
            // || e.serviceName?.toLowerCase().includes(userInput.toLowerCase())
            // || e.buyerName.toLowerCase().includes(userInput.toLowerCase()) || e.locationName.toLowerCase().includes(userInput.toLowerCase())
            // || e.productName.toLowerCase().includes(userInput.toLowerCase())
          ) {
            return true;
          } else {
            return false;
          }
        });
        if (this.rowData.length > 0) {
          this.dialog_gridOptions.api.setRowData(this.rowData);
        }
      }
    });
  }
  tankSummary() {
    //this.dialogRef.close();
    this.router.navigate([]).then(result => {
      window.open('opsinventory/tankSummary', '_blank');
    });
    //this.router.navigate(['opsinventory/tankSummary']);
  }
  public columnDefs = [
    {
      headerName: '',
      field: 'check',
      suppressMenu: true,
      width: 35,
      checkboxSelection: true,
      resizable: false,
      suppressMovable: true,
      headerClass: 'header-checkbox-center checkbox-center ag-checkbox-v2',
      cellClass: 'p-1 checkbox-center ag-checkbox-v2'
    },
    {
      headerName: 'Request ID',
      headerTooltip: 'Request ID',
      field: 'requestName',
      width: 175,
      cellClass: ['aggridtextalign-left']
    },
    {
      headerName: 'Date',
      headerTooltip: 'Date',
      field: 'requestDate',
      cellClass: ['aggridtextalign-center'],
      valueFormatter: params => this.format.dateUtc(params.value)
    },
    {
      headerName: 'Service',
      headerTooltip: 'Service',
      field: 'serviceName',
      cellClass: ['aggridtextalign-left']
    },
    {
      headerName: 'Buyer',
      headerTooltip: 'Buyer',
      field: 'buyerName',
      cellClass: ['aggridtextalign-left']
    },
    {
      headerName: 'Vessel',
      headerTooltip: 'Vessel',
      field: 'vesselName',
      cellClass: ['aggridtextalign-left']
    },
    {
      headerName: 'IMO',
      headerTooltip: 'IMO',
      field: 'imo',
      cellClass: ['aggridtextalign-left']
    },
    {
      headerName: 'ETA',
      headerTooltip: 'ETA',
      field: 'eta',
      cellClass: ['aggridtextalign-center'],
      valueFormatter: params => this.format.date(params.value)
    },
    {
      headerName: 'Location',
      headerTooltip: 'Location',
      field: 'locationName',
      cellClass: ['aggridtextalign-left']
    },
    {
      headerName: 'Request Status',
      headerTooltip: 'Request Status',
      field: 'requestStatus',
      suppressMenu: true,
      cellRendererFramework: AGGridCellRendererComponent,
      cellClass: ['aggridtextalign-center'],
      cellRendererParams: function(params) {
        var classArray: string[] = [];
        classArray.push('aggridtextalign-center');
        let newClass =
          params.value === 'Validated'
            ? 'custom-chip medium-amber'
            : 'custom-chip dark';
        classArray.push(newClass);
        return { cellClass: classArray.length > 0 ? classArray : null };
      }
    },
    {
      headerName: 'Product',
      headerTooltip: 'Product',
      field: 'productName',
      cellClass: ['aggridtextalign-left']
    },
    {
      headerName: 'Product Status',
      headerTooltip: 'Product Status',
      field: 'productStatus',
      suppressMenu: true,
      cellRendererFramework: AGGridCellRendererComponent,
      cellClass: ['aggridtextalign-center'],
      cellRendererParams: function(params) {
        var classArray: string[] = [];
        classArray.push('aggridtextalign-center');
        let newClass =
          params.value === 'Validated'
            ? 'custom-chip medium-amber'
            : 'custom-chip dark';
        classArray.push(newClass);
        return { cellClass: classArray.length > 0 ? classArray : null };
      }
    },
    {
      headerName: 'Terminal',
      headerTooltip: 'Terminal',
      field: 'terminal',
      suppressMenu: true,
      cellRendererFramework: AGGridCellRendererComponent,
      cellClass: ['aggridtextalign-center']
    }
  ];

  public numberFormatter(params) {
    if (isNaN(params.value)) return params.value;
    else return params.value.toFixed(4);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
