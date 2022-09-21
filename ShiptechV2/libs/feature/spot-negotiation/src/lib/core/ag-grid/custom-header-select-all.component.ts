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
  selector: 'app-custom-header-select-all',
  template: `
    <div
      class="header-checkbox-center checkbox-center ag-checkbox-v2 select-all-product"
      style="position:relative; left:42%;"
    >
      <mat-checkbox
        class="mat-checkbox mat-accent light-checkbox small"
        [(ngModel)]="selectAll"
        (change)="onSelectAllProductCheckboxChange($event)"
      ></mat-checkbox>
    </div>
  `
})
export class CustomHeaderSelectAll implements IHeaderAngularComp {
  public params: any;
  selectAll: boolean = false;
  requestLocationId: any;

  constructor(
    private store: Store,
    private spotNegotiationService: SpotNegotiationService,
    private toastr: ToastrService
  ) {}

  agInit(params: IHeaderParams): void {
    this.params = params;
    this.requestLocationId = this.params.column.colDef.cellRendererParams.requestLocationId;
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

      let hasUncheckedCheckbox = false;
      for (let i = 0; i < currentLocationsRows.length; i++) {
        if (!currentLocationsRows[i].isSelected) {
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
    let requestLocationId = this.requestLocationId;
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
      let requestProductLength = requestLocation.requestProducts.length;
      locationsRows.forEach(locationRow => {
        if (locationRow.requestLocationId == this.requestLocationId) {
          for (let i = 0; i < requestProductLength; i++) {
            let colIdIndex = 'checkProd' + (i + 1);
            locationRow[colIdIndex] = this.selectAll;
          }
          locationRow.isSelected = this.selectAll;
          this.selectCounterparty(locationRow);
        }
      });
      this.store.dispatch(new SetLocationsRows(locationsRows));
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
