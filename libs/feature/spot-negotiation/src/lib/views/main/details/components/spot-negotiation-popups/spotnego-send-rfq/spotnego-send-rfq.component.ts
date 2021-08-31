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

  requests = [
    {
      request: 'Req 12321',
      vessel: 'Merlion',
      selected: true
    },
    {
      request: 'Req 12322',
      vessel: 'Afif',
      selected: true
    },
    {
      request: 'Req 12323',
      vessel: 'Al Mashrab',
      selected: false
    }
  ];

  constructor(
    public dialogRef: MatDialogRef<SpotnegoSendRfqComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store,
    public changeDetector: ChangeDetectorRef
  ) {
    this.store.subscribe(({ spotNegotiation }) => {
      if (spotNegotiation.requests.length > 0) {
        this.requests = spotNegotiation.requests;
      }
    });
  }

  public sendRFQ() {
    alert(1);
  }
  ngOnInit(): void {}
}
