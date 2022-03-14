import { Component, ElementRef, ViewChild } from '@angular/core';
import { IHeaderAngularComp } from '@ag-grid-community/angular';
import {
  IAfterGuiAttachedParams,
  IHeaderParams
} from '@ag-grid-community/core';
import { Store } from '@ngxs/store';
import { SpotNegotiationStoreModel } from '../../store/spot-negotiation.store';
import _ from 'lodash';
import {
  EditLocations,
  SetLocationsRows,
  UpdateSpecificRequests
} from '../../store/actions/ag-grid-row.action';
import { SetCurrentRequestSmallInfo } from '../../store/actions/request-group-actions';
@Component({
  selector: 'app-custom-header',
  template: `
    <div class="header-checkbox-center checkbox-center ag-checkbox-v2">
      <mat-checkbox
        class="mat-checkbox light-checkbox small preferred mat-accent header-selectAll1 mat-checkbox-checked"
        [(ngModel)]="selectAll"
        (change)="onSelectAllProductCheckboxChange($event)"
      ></mat-checkbox>
    </div>
  `
})
export class CustomHeader implements IHeaderAngularComp {
  public params: any;
  private selectAll: boolean = false;
  product: { id: number; name: string };
  status: string = '';
  requestLocationId: any;
  requestProductId: any;

  constructor(private store: Store) {}

  agInit(params: IHeaderParams): void {
    this.params = params;
    console.log(this.params);
    this.product = {
      id: this.params.column.colDef.cellRendererParams.productId,
      name: this.params.column.colDef.cellRendererParams.productName
    };
    this.status = this.params.column.colDef.cellRendererParams.status;
    this.requestLocationId = this.params.column.colDef.cellRendererParams.requestLocationId;
    this.requestProductId = this.params.column.colDef.cellRendererParams.requestProductId;
    this.selectAll = this.params.column.colDef.cellRendererParams.productData.isSelected;
  }
  refresh(params: IHeaderParams): boolean {
    return false;
  }

  updateSpecificRequest(requestLocationId, requestProductId, selectAll) {
    let currentRequestSmallInfo = _.cloneDeep(
      this.store.selectSnapshot((state: SpotNegotiationStoreModel) => {
        return state['spotNegotiation'].currentRequestSmallInfo;
      })
    );
    let findRequestLocationIndex = _.findIndex(
      currentRequestSmallInfo.requestLocations,
      function(object: any) {
        return object.id == requestLocationId;
      }
    );
    if (findRequestLocationIndex != -1) {
      let requestLocation =
        currentRequestSmallInfo.requestLocations[findRequestLocationIndex];
      let findProductIndex = _.findIndex(
        requestLocation?.requestProducts,
        function(object: any) {
          return object.id == requestProductId;
        }
      );
      if (findProductIndex != -1) {
        let requestProduct = requestLocation.requestProducts[findProductIndex];
        requestProduct.isSelected = selectAll;
        this.store.dispatch(
          new UpdateSpecificRequests([currentRequestSmallInfo])
        );
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
        requestProduct.isSelected = this.selectAll;
        locationsRows.forEach(locationRow => {
          if (locationRow.requestLocationId == this.requestLocationId) {
            if (!locationRow[colId] && this.selectAll) {
              locationRow[colId] = true;
            } else if (locationRow[colId] && !this.selectAll) {
              locationRow[colId] = false;
            }
          }
        });
        this.store.dispatch(new EditLocations(requestLocation));
        this.updateSpecificRequest(
          this.requestLocationId,
          this.requestProductId,
          this.selectAll
        );
        this.store.dispatch(new SetLocationsRows(locationsRows));
      }
    }
  }
}
