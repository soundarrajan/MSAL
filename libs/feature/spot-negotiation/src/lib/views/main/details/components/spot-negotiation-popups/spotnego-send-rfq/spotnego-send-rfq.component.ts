import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-spotnego-send-rfq',
  templateUrl: './spotnego-send-rfq.component.html',
  styleUrls: ['./spotnego-send-rfq.component.css']
})
export class SpotnegoSendRfqComponent implements OnInit {

  requestOptions = [
    {
      request : 'Req 12321', vessel: 'Merlion', selected: true
    },
    {
      request : 'Req 12322', vessel: 'Afif', selected: true
    },
    {
      request : 'Req 12323', vessel: 'Al Mashrab', selected: false
    }
  ];
  constructor(public dialogRef: MatDialogRef<SpotnegoSendRfqComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
