import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'shiptech-additional-cost-modal',
  templateUrl: './additional-cost-modal.component.html',
  styleUrls: ['./additional-cost-modal.component.scss']
})

export class AdditionalCostModalComponent implements OnInit {
  additionalCost : any;
  @Input('formValues') set _formValues(val){
    this.additionalCost = val
  }
  public searchText:string;
  selectedRow;
  public costData:any = [{selected:false, costType:'Barging'}, 
                            {selected:false, costType:'Tax'},
                            {selected:false, costType:'Miscellaneous Charges'}];
  constructor() { 
    
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
