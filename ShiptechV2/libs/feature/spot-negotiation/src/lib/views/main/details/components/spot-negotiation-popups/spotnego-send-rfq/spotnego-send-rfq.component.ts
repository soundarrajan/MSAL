import { filter } from 'rxjs/operators';
import { cloneDeep } from 'lodash';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SpotNegotiationStoreModel } from 'libs/feature/spot-negotiation/src/lib/store/spot-negotiation.store';

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
    this.store.subscribe(({ spotNegotiation }) => {
      if (spotNegotiation.requests.length > 0) {
        this.requests = [...spotNegotiation.requests];
      }
    });
    this.requests = this.requests.map((item)=> ({...item, selected: false, sellerSelection: false}));
  }

  public toggleCheckbox(checkbox: any, item: any): void {
    debugger;
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
    const locationRows = this.store.selectSnapshot<any>((state: any) => state.spotNegotiation.locationsRows);
    const currentRequestData = this.store.selectSnapshot<any>((state: any) => state.spotNegotiation.locations);
    let currentLocProdCount = currentRequestData[0].requestProducts.length;
    this.requests.map(request=> {
        request.selected = locationRows.filter(row=> row.requestId === request.id && row.isSelected).length > 0    
        for (let index = 0; index < currentLocProdCount; index++) {
          let indx = index + 1;
          let val = 'checkProd' + indx;
          let checked=locationRows.filter(row=> row.requestId === request.id &&  row[val]=== true ).length > 0
          if(checked){
            request.sellerSelection =  locationRows.filter(row=> row.requestId === request.id &&  row[val]=== true ).length > 0
          }
        }
        if(request.selected && !request.sellerSelection){ 
          request.sellerSelection=request.selected;
        }
    });
  }
}
