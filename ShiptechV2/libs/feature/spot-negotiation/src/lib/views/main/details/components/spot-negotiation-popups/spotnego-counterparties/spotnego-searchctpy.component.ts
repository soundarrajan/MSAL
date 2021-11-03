import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { GridOptions } from 'ag-grid-community';
import { SpnegoAddCounterpartyModel } from 'libs/feature/spot-negotiation/src/lib/core/models/spnego-addcounterparty.model';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
import { AddCounterpartyToLocations } from 'libs/feature/spot-negotiation/src/lib/store/actions/ag-grid-row.action';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-spotnego-searchctpy',
  templateUrl: './spotnego-searchctpy.component.html',
  styleUrls: ['./spotnego-searchctpy.component.css']
})
export class SpotnegoSearchCtpyComponent implements OnInit {
  public dialog_gridOptions: GridOptions;
  public rowCount: Number;
  public AddCounterpartiesAcrossLocations: boolean;
  public RequestGroupId: number;
  public RequestLocationId: number;
  public LocationId: number;
  public selectedRows: any = [];
  currentRequest: any;
  constructor(
    private router: Router,
    private store: Store,
    private toastr: ToastrService,
    private _spotNegotiationService: SpotNegotiationService,
    public dialogRef: MatDialogRef<SpotnegoSearchCtpyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.AddCounterpartiesAcrossLocations =
      data.AddCounterpartiesAcrossLocations;
    this.RequestGroupId = data.RequestGroupId;

    if (!data.AddCounterpartiesAcrossLocations) {
      this.RequestLocationId = data.RequestLocationId;
      this.LocationId = data.LocationId;
    }

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
          if (spotNegotiation.counterpartyList) {
            this.rowData = spotNegotiation.counterpartyList;
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
      cellClass: ['aggridtextalign-left']
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
      let selectedCounterparties = [];
      //Looping through all the Request Locations
      this.currentRequest.requestLocations.forEach(reqLoc => {
        let perLocationCtpys = this.selectedRows.map(
          val =>
            <SpnegoAddCounterpartyModel>{
              requestGroupId: this.RequestGroupId,
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
              sellerCounterpartyId: val.id,
              sellerCounterpartyName: val.name,
              senRating: ''
            }
        );
        selectedCounterparties.push(...perLocationCtpys);
      });

      return selectedCounterparties;
    } else {
      return this.selectedRows.map(
        val =>
          <SpnegoAddCounterpartyModel>{
            requestGroupId: this.RequestGroupId,
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
            sellerCounterpartyId: val.id,
            sellerCounterpartyName: val.name,
            senRating: ''
          }
      );
    }
  }

  AddCounterparties() {
    const selectedCounterparties = this.toBeAddedCounterparties();
    if (selectedCounterparties.length == 0) return;
    if(this.data.isPhysicalSupplier){
      let reqPayload={
          "RequestLocationSellerId":this.data.requestLocationSellerId,
          "phySupplierId": selectedCounterparties[0].sellerCounterpartyId
      }

      const response = this._spotNegotiationService.updatePhySupplier(reqPayload);
    response.subscribe((res: any) => {
      if (res.status) {
        this.toastr.success(res.message);
      } else {
        this.toastr.error(res.message);
        return;
      }
    });
    }

    if(!this.data.isPhysicalSupplier){
    let payload = {
      requestGroupId: this.RequestGroupId,
      isAllLocation: true,
      counterparties: selectedCounterparties
    };
    const response = this._spotNegotiationService.addCounterparties(payload);
    response.subscribe((res: any) => {
      if (res.status) {
        this.toastr.success(res.message);
        // Add in Store
        this.store.dispatch(
          new AddCounterpartyToLocations(res.counterparties)
        );
      } else {
        this.toastr.error(res.message);
        return;
      }
    });
  }
  }
}
