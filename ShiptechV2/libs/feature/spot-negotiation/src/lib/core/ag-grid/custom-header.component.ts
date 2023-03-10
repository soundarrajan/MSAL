import { Component } from '@angular/core';
import { IHeaderAngularComp } from '@ag-grid-community/angular';
import { IHeaderParams } from '@ag-grid-community/core';
import { Store } from '@ngxs/store';
import { SpotNegotiationStoreModel } from '../../store/spot-negotiation.store';
import _ from 'lodash';
import { SetLocationsRows } from '../../store/actions/ag-grid-row.action';
import { SpotNegotiationService } from '../../services/spot-negotiation.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-custom-header',
  template: `
    <div
      class="header-checkbox-center checkbox-center ag-checkbox-v2 select-all-product"
    >
      <mat-checkbox
        class="mat-checkbox mat-accent light-checkbox small"
        [(ngModel)]="selectAll"
        [disabled]="status == 'Stemmed' || status == 'Confirmed'"
        (change)="onSelectAllProductCheckboxChange($event)"
      ></mat-checkbox>
    </div>
  `
})
export class CustomHeader implements IHeaderAngularComp {
  public params: any;
  selectAll: boolean = false;
  product: { id: number; name: string };
  status: string = '';
  requestLocationId: any;
  requestProductId: any;

  constructor(
    private store: Store,
    private spotNegotiationService: SpotNegotiationService,
    private toastr: ToastrService
  ) {}

  agInit(params: IHeaderParams): void {
    this.params = params;
    this.product = {
      id: this.params.column.colDef.cellRendererParams.productId,
      name: this.params.column.colDef.cellRendererParams.productName
    };
    this.status = this.params.column.colDef.cellRendererParams.status;
    this.requestLocationId = this.params.column.colDef.cellRendererParams.requestLocationId;
    this.requestProductId = this.params.column.colDef.cellRendererParams.requestProductId;
    this.detectIfColumnIsSelected();
  }
  refresh(params: IHeaderParams): boolean {
    return false;
  }

  detectIfColumnIsSelected() {
    let locationsRows = [];
    locationsRows = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locationsRows;
    });

    if (locationsRows.length) {
      let requestLocationId = this.requestLocationId;
      let currentLocationsRows = _.cloneDeep(
        _.filter(locationsRows, function(row) {
          return row.requestLocationId == requestLocationId;
        })
      );

      let colId = this.params.column.colId;
      let hasUncheckedCheckbox = false;
      for (let i = 0; i < currentLocationsRows.length; i++) {
        if (!currentLocationsRows[i][colId]) {
          hasUncheckedCheckbox = true;
        }
      }
      if (hasUncheckedCheckbox) {
        this.selectAll = false;
      } else {
        this.selectAll = true;
      }
    }
  }

  onSelectAllProductCheckboxChange(checkbox: any) {
    this.selectAll = checkbox.checked ? true : false;
    let colId = this.params.column.colId;
    let requestLocationId = this.requestLocationId;
    let requestProductId = this.requestProductId;
    let locationsRows = _.cloneDeep(
      this.store.selectSnapshot((state: SpotNegotiationStoreModel) => {
        return state['spotNegotiation'].locationsRows;
      })
    );
    let locations = _.cloneDeep(
      this.store.selectSnapshot((state: SpotNegotiationStoreModel) => {
        return state['spotNegotiation'].locations;
      })
    );
    let findRequestLocationIndex = _.findIndex(locations, function(
      object: any
    ) {
      return object.id == requestLocationId;
    });
    if (findRequestLocationIndex != -1) {
      let requestLocation = locations[findRequestLocationIndex];
      let findProductIndex = _.findIndex(
        requestLocation?.requestProducts,
        function(object: any) {
          return object.id == requestProductId;
        }
      );
      if (findProductIndex != -1) {
        let requestProduct = requestLocation.requestProducts[findProductIndex];
        let requestProductLength = requestLocation.requestProducts.length;
        requestProduct.isSelected = this.selectAll;

        locationsRows.forEach(locationRow => {
          if (locationRow.requestLocationId == this.requestLocationId) {
            if (!locationRow[colId] && this.selectAll) {
              locationRow[colId] = true;
            } else if (locationRow[colId] && !this.selectAll) {
              locationRow[colId] = false;
            }
            let hasUncheckedCheckbox = false;
            for (let i = 0; i < requestProductLength; i++) {
              let colIdIndex = 'checkProd' + (i + 1);
              if (!locationRow[colIdIndex]) {
                hasUncheckedCheckbox = true;
              }
            }
            if (!hasUncheckedCheckbox) {
              locationRow.isSelected = true;
            } else {
              locationRow.isSelected = false;
            }
          }
        });
        this.store.dispatch(new SetLocationsRows(locationsRows));
      }
    }
  }

  selectCounterparty(locationRow) {
    let locRows = this.store.selectSnapshot<any>((state: any) => {
      return state.spotNegotiation.locationsRows;
    });
      if(!locRows.find(x=>x.requestOffers)){
      let payload = {
        reqLocSellers: [
          {
            requestLocationSellerId: locationRow.id,
            isSelected: locationRow.isSelected
          }
        ]
      };
      const response = this.spotNegotiationService.UpdateSelectSeller(payload);
      response.subscribe((res: any) => {
        if (res?.message == 'Unauthorized') {
          return;
        }
        if (res['isUpdated']) {
        } else {
          this.toastr.error('An error has occurred!');
        }
      });
    }
  }
}
