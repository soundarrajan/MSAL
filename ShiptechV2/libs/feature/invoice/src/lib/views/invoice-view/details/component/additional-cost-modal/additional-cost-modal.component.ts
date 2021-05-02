import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'shiptech-additional-cost-modal',
  templateUrl: './additional-cost-modal.component.html',
  styleUrls: ['./additional-cost-modal.component.scss']
})
export class AdditionalCostModalComponent implements OnInit {

  public searchText:string;
  selectedRow;
  public costData:any = [{selected:false, costType:'Barging'}, 
                            {selected:false, costType:'Tax'},
                            {selected:false, costType:'Miscellaneous Charges'}];
  constructor(public dialogRef: MatDialogRef<AdditionalCostModalComponent>) { 
    
  }

  ngOnInit(): void {

  }

  radioSelected(element){
    this.selectedRow=element;
    console.log(this.selectedRow.product);
  }

  getFilterPredicate() {
    
  }

  applyFilter() {
  }
}
