import { Component, OnInit, Input, ChangeDetectorRef,Output, EventEmitter } from '@angular/core';
import { LegacyLookupsDatabase } from '@shiptech/core/legacy-cache/legacy-lookups-database.service';

@Component({
  selector: 'shiptech-additional-cost-modal',
  templateUrl: './additional-cost-modal.component.html',
  styleUrls: ['./additional-cost-modal.component.scss']
})

export class AdditionalCostModalComponent implements OnInit {
  additionalCost : any;
  @Output() changedAdditonalcost = new EventEmitter();
  @Input('formValues') set _formValues(val){
    this.additionalCost = val
  }
  costNames:any;
  uomNames:any;
  public searchText:string;
  selectedRow;
  public costType:any = [{id:1, name: "Flat"},{id:2, name: "Unit"}];
  constructor(private legacyLookupsDatabase: LegacyLookupsDatabase,private changeDetectorRef: ChangeDetectorRef) { 
    
  }

  ngOnInit(): void {
    this.legacyLookupsDatabase.getAdditionalCost().then(list=>{
      this.costNames = list;
      this.changeDetectorRef.detectChanges();
    })
    this.legacyLookupsDatabase.getUomTable().then(list=>{
      this.uomNames = list;
      this.changeDetectorRef.detectChanges();
    })
  }
  addNewAdditionalCostLine(){
    console.log("add additional cost")
    // this.additionalCost.push({id:0,isDeleted:false});
  }
  removeAdditionalCostLine(index){
    this.additionalCost[index].isDeleted = true;
    this.changedAdditonalCostEmit();
  }
  costNameChange(){
    this.changedAdditonalCostEmit();
  }
  radioSelected(element){
    this.selectedRow=element;
    console.log(this.selectedRow.product);
  }

  getFilterPredicate() {
    
  }

  applyFilter() {
  }
  changedAdditonalCostEmit(){
    this.changedAdditonalcost.emit(this.additionalCost);
  }
}
