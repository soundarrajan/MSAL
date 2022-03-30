import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
import { SetLocationsRows } from 'libs/feature/spot-negotiation/src/lib/store/actions/ag-grid-row.action';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-supplier-comments-popup',
  templateUrl: './supplier-comments-popup.component.html',
  styleUrls: ['./supplier-comments-popup.component.scss']
})
export class SupplierCommentsPopupComponent implements OnInit {
  public supplierCommentDetails: any;
  requestInfo: any = null;
  constructor(
    public dialogRef: MatDialogRef<SupplierCommentsPopupComponent>,
    private store: Store,
    private _spotNegotiationService: SpotNegotiationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.supplierCommentDetails = data;
    this.requestInfo = _.cloneDeep(this.supplierCommentDetails);
    this.requestInfo.sellerCounterpartyName = this.transform(
      this.requestInfo.sellerCounterpartyName
    );
    this.requestInfo.sellerComments = this.transform(
      this.requestInfo.sellerComments
    );
  }

  ngOnInit(): void {}

  transform(str: any, property?: string): any {
    var decode = function(str) {
      return str.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
      });
    };
    if (str && str[property]) {
      str[property] = decode(_.unescape(str[property]));
      return str;
    }
    return decode(_.unescape(str));
  }
  //save seller Comments
  saveSellerComment(str) {
    const locationsRows = this.store.selectSnapshot<string>((state: any) => {
      return state.spotNegotiation.locationsRows;
    });
    let payload = {
      requestGroupId: this.supplierCommentDetails.requestGroupId,
      requestLocationId: this.supplierCommentDetails.requestLocationId,
      sellerCounterpartyId: this.supplierCommentDetails.sellerCounterpartyId,
      sellerComment: this.requestInfo.sellerComments,
      requestLocationSellerId: this.supplierCommentDetails.id,
      sellerCounterpartyName: this.supplierCommentDetails
        .sellerCounterpartyName,
      sellerPortalRead: str
    };
    const response = this._spotNegotiationService.UpdateSellerComments(payload);
    response.subscribe((res: any) => {
      if (res?.message == 'Unauthorized') {
        return;
      }
      if (res.status) {
        const futureLocationsRows = this.getLocationRowsAddSellerComment(
          JSON.parse(JSON.stringify(locationsRows)),
          str
        );
        this.dialogRef.close();
        this.store.dispatch(new SetLocationsRows(futureLocationsRows));
        //this.toaster.success('Seller comment added successfully');
      }
    });
  }
  //Close sellerCommentPopup
  closeSellerComment(str) {
    this.saveSellerComment(str); //Update read the seller portal comments
    this.dialogRef.close();
  }
  //Update the store
  getLocationRowsAddSellerComment(locationrow, str) {
    locationrow.forEach((element, key) => {
      if (element.id == this.supplierCommentDetails.id) {
        element.sellerComments =
          str == 'S'
            ? this.requestInfo.sellerComments
            : this.supplierCommentDetails.sellerComments;
        element.isSellerPortalComments = false;
      }
    });
    return locationrow;
  }
}
