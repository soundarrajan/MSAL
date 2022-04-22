import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-spotnego-send-rfq',
  templateUrl: './spotnego-send-rfq.component.html',
  styleUrls: ['./spotnego-send-rfq.component.css']
})
export class SpotnegoSendRfqComponent implements OnInit {
  currentRequestSmallInfo: Observable<any> = null;
  requests = [];

  constructor(
    public dialogRef: MatDialogRef<SpotnegoSendRfqComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store,
    public changeDetector: ChangeDetectorRef
  ) {
    this.store.selectSnapshot<any>((state: any) => {
      if (state.spotNegotiation.requests.length > 0) {
        this.requests = [...state.spotNegotiation.requests];
      }
    });
    this.requests = this.requests.map(item => ({
      ...item,
      selected: false,
      sellerSelection: false
    }));
  }

  public toggleCheckbox(checkbox: any, item: any): void {
    if (checkbox.checked) {
      item.selected = true;
    } else {
      item.selected = false;
    }
  }

  public sendRFQ(): void {
    this.dialogRef.close(this.requests);
  }

  ngOnInit(): void {
    const locationRows = this.store.selectSnapshot<any>(
      (state: any) => state.spotNegotiation.locationsRows
    );
    this.requests.map(request => {
      request.selected =
        locationRows.filter(
          row => row.requestId === request.id && row.isSelected
        ).length > 0;
      locationRows.forEach((row, index) => {
        let reqLocations = this.requests.filter(
          row1 => row1.id == row.requestId
        );
        let reqProducts =
          reqLocations.length > 0
            ? reqLocations[0].requestLocations.filter(
                row1 => row1.id == row.requestLocationId
              )
            : [];
        let currentLocProdCount =
          reqProducts.length > 0 ? reqProducts[0].requestProducts.length : 0;
        for (let index = 0; index < currentLocProdCount; index++) {
          let indx = index + 1;
          let val = 'checkProd' + indx;
          let checked =
            locationRows.filter(
              row => row.requestId === request.id && row[val] === true
            ).length > 0;
          if (checked) {
            request.sellerSelection =
              locationRows.filter(
                row => row.requestId === request.id && row[val] === true
              ).length > 0;
            request.selected = request.sellerSelection;
          }
        }
      });
    });
  }
}
