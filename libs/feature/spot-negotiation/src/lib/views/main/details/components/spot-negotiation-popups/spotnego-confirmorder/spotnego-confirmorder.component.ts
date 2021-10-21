import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-spotnego-confirmorder',
  templateUrl: './spotnego-confirmorder.component.html',
  styleUrls: ['./spotnego-confirmorder.component.css']
})
export class SpotnegoConfirmorderComponent implements OnInit {
  disableScrollDown = false;
  public showaddbtn = true;
  isShown: boolean = true; // hidden by default
  isBtnActive: boolean = false;
  isButtonVisible = true;
  iscontentEditable = false;
  requests: any = [];



  getRequests() {
    this.requests = this.store.selectSnapshot<string>((state: any) => {
      return state.spotNegotiation.requests
    });
  }

  ngOnInit() {
    this.getRequests();
    // this.scrollToBottom();
  }

  getSelectedLocationRowsForLocation(locationId, requestId){
    // selectedCounterpartyList
    const futureLocationRowsForLocation = [];

    const selectedLocationRows = this.store.selectSnapshot<string>((state: any) => {
      return state.spotNegotiation.selectedCounterpartyList
    });



    return [1];
  }
  constructor(
    public dialogRef: MatDialogRef<SpotnegoConfirmorderComponent>,
    private store: Store,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  tabledata = [
    {
      seller: 'Total Marine Fuel',
      port: 'Amstredam',
      contractname: 'Cambodia Contarct 2021',
      contractproduct: 'DMA 1.5%',
      formula: 'Cambodia Con',
      schedule: 'Average of 5 Days',
      contractqty: '10,000,.00',
      liftedqty: '898.00 MT',
      availableqty: '96,602.00 MT',
      price: '$500.00'
    },
    {
      seller: 'Total Marine Fuel',
      port: 'Amstredam',
      contractname: 'Amstredam Contarct 2021',
      contractproduct: 'DMA 1.5%',
      formula: 'Cambodia Con',
      schedule: 'Average of 5 Days',
      contractqty: '10,000,.00',
      liftedqty: '898.00 MT',
      availableqty: '96,602.00 MT',
      price: '$500.00'
    }
  ];
}
