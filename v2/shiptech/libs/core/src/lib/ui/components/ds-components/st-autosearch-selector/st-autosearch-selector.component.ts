import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MastersListApiService } from '@shiptech/core/delivery-api/masters-list/masters-list-api.service';
import { EstAutoSearchType } from '@shiptech/core/enums/master-search-type';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ImasterSelectionPopData, MasterSelectionDialog } from '../pop-ups/master-selection-popup.component';
export namespace MastersApiPaths {
  export const getCompanyList = () => `api/masters/companies/list`;
}

@Component({
  selector: 'shiptech-st-autosearch-selector',
  templateUrl: './st-autosearch-selector.component.html',
  styleUrls: ['./st-autosearch-selector.component.css']
})
export class StAutosearchSelectorComponent implements OnInit {
  
  myControl = new FormControl();  
  filteredOptions: Observable<string[]>;
  popupOpen: boolean;
  selected:any;
  bindValue:string;
  @Input() placeholder:string = 'Pick one';  
  @Input('bindValue') set _bindValue(val) {
    if(val){
      this.bindValue = val;    
      this.myControl.setValue(this.bindValue);
    }
  }
  @Input() name:string = 'Select';
  @Input() masterType:EstAutoSearchType;
  @Output() onChanged = new EventEmitter();
  options: any[];

  constructor(public dialog: MatDialog, private mastersListApiService: MastersListApiService){

  }

  ngOnInit() {
    this.getOptionData();
    // alert(this.bindValue);    
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );    
  }

  private _filter(value: any): string[] {
    const filterValue = value?.toLowerCase();
    console.log(value)
    return this.options?.filter(option => option?.name?.toLowerCase().indexOf(filterValue) === 0);
  }

  openSearchPopup() {
    this.popupOpen = true;
        const dialogRef = this.dialog.open(MasterSelectionDialog, {
            width: '90%',
            height: '90%',
            panelClass: 'popup-grid',
            data:<ImasterSelectionPopData>{
              dialog_header: 'Select '+this.name,
              selectionType: this.masterType
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.popupOpen = false;
            this.selected = <any>result.data;
            this.onChanged.emit(this.selected);
            this.myControl.setValue(result?.data?.name);
        });
  }

  selectedEvent(evt){
    console.log(evt);
    if(this.options){
      let selectedItem = this.options.filter(x=> { return x.name == evt.option.value});
      if(selectedItem){
        this.onChanged.emit(selectedItem[0]);
      }
    }
    // this.selected = 
  }

  getOptionData(){
    var requestParam={};var URL='';
    if(this.masterType == EstAutoSearchType.company){
      requestParam = {"Payload":{"Filters":[{"ColumnName":"CounterpartyTypes","Value":2}]}}; 
      URL = 'api/masters/counterparties/listByTypesAutocomplete';
    }else if(this.masterType == EstAutoSearchType.carrier){
      requestParam = {"Payload":{"Filters":[{"ColumnName":"CounterpartyTypes","Value":2}]}}; 
      URL = 'api/masters/counterparties/listByTypesAutocomplete';
    }else if(this.masterType == EstAutoSearchType.paymentTerms){
      requestParam = {"Order":null,"PageFilters":{"Filters":[]},"SortList":{"SortList":[]},"Filters":[],"SearchText":null,"Pagination":{"Skip":0,"Take":25}}; 
      URL = 'api/masters/paymentterm/list';
    }else if(this.masterType == EstAutoSearchType.payableTo){
      // requestParam = {"Order":null,"PageFilters":{"Filters":[]},"SortList":{"SortList":[]},"Filters":[{"ColumnName":"CounterpartyTypes","Value":"2, 11"}],"SearchText":null,"Pagination":{"Skip":0,"Take":25}}
      // URL = 'api/masters/counterparties/listByTypes';
      requestParam = {"Payload":{"Filters":[{"ColumnName":"CounterpartyTypes","Value":"2,11"}]}}; 
      URL = 'api/masters/counterparties/listByTypesAutocomplete';
    }
    

    this.mastersListApiService.getList(requestParam,URL)
    .subscribe(
      response =>{
        console.log(typeof(response.payload));
        this.options = response.payload;
      },
      ()=>{
        console.log("Error")
      }
    );    
  }

}
