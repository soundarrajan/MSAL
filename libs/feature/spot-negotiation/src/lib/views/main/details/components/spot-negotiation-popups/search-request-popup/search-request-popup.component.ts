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

@Component({
  selector: 'app-search-request-popup',
  templateUrl: './search-request-popup.component.html',
  styleUrls: ['./search-request-popup.component.css']
})
export class SearchRequestPopupComponent implements OnInit {
  public dialog_gridOptions: GridOptions;
  public rowCount: Number;
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
  rowData:any = [];
  ngOnInit() {}
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private store: Store,
    private _spotNegotiationService: SpotNegotiationService,
    public dialogRef: MatDialogRef<SearchRequestPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.RequestGroupId = data.RequestGroupId;
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
      rowSelection: 'multiple',
      // groupIncludeTotalFooter: true,
      onGridReady: params => {
        this.dialog_gridOptions.api = params.api;
        this.dialog_gridOptions.columnApi = params.columnApi;
        this.dialog_gridOptions.api.sizeColumnsToFit();
        this.store.subscribe(({ spotNegotiation }) => {
          if (spotNegotiation.RequestList && this.dialog_gridOptions.api) {
            this.rowData = spotNegotiation.RequestList;
            this.dialog_gridOptions.api.setRowData(this.rowData);
            this.rowCount = this.dialog_gridOptions.api.getDisplayedRowCount();
          }
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

  
  addToRequestList() {
    this.selectedRequestList = this.dialog_gridOptions.api.getSelectedRows();
    if(this.selectedRequestList.length > 0){
      const requests = this.store.selectSnapshot((state: SpotNegotiationStoreModel) => {
        return state['spotNegotiation'].requests;
       });
      let selectedreqId = [];
      this.selectedRequestList.forEach(element => {
        let filterduplicaterequest = requests.filter(
          e => e.id == element.requestId
        );
        if(filterduplicaterequest.length > 0){
          let ErrorMessage =  filterduplicaterequest[0].name + ' - ' + filterduplicaterequest[0].vesselName + ' already linked to the request.';
          this.toastr.error(ErrorMessage);

        }else{
          selectedreqId.push(element.requestId);
        }
      });
      if(this.selectedRequestList.length > 0){
        let payload = {
        groupId: parseInt(this.RequestGroupId),
        requestIds: selectedreqId
      };
      const response = this._spotNegotiationService.addRequesttoGroup(payload);
      response.subscribe((res: any) => {
        if (res.error) {
          alert('Handle Error');
          return;
        } else {
            if (res['requestLocationSellers'] && res['requestLocationSellers'].length > 0) 
            {
                this.store.dispatch(new AddCounterpartyToLocations(res['requestLocationSellers']));
            }
            if (res['requests'] && res['requests'].length > 0) 
            {
                this.store.dispatch(new AddRequest(res['requests']));
                res['requests'].forEach(element => {
                  let SuccessMessage =  element.name + ' - ' + element.vesselName + ' has been linked successfully.';
                  this.toastr.success(SuccessMessage);
                  });
            }
        }
      });
      }
    }
    else{
      this.toastr.error("Select atlease one Request");
      return;
    }
  }
  search(userInput: string): void {
    this.store.subscribe(({ spotNegotiation }) => {
      if (spotNegotiation.RequestList) {
        this.rowData = spotNegotiation.RequestList
          .filter(e => {
            if (e.requestName.toLowerCase().includes(userInput.toLowerCase()) || e.vesselName.toLowerCase().includes(userInput.toLowerCase()) 
            // || e.serviceName?.toLowerCase().includes(userInput.toLowerCase())
            // || e.buyerName.toLowerCase().includes(userInput.toLowerCase()) || e.locationName.toLowerCase().includes(userInput.toLowerCase())
            // || e.productName.toLowerCase().includes(userInput.toLowerCase()) 
            ) {
              return true;
            }
            else{
              return false;
            }
          });
          if(this.rowData.length > 0){
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
      cellClass: ['aggridtextalign-center']
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
      cellClass: ['aggridtextalign-center']
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
      cellClass: ['aggridtextalign-center'],
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
