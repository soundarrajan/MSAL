import { Component, Input, OnInit } from '@angular/core';
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
  @Input() placeholder:string = 'Pick one';
  @Input() name:string = 'Select';
  @Input() masterType:EstAutoSearchType;
  options: any[];

  constructor(public dialog: MatDialog, private mastersListApiService: MastersListApiService){

  }

  ngOnInit() {
    this.getOptionData();
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
              title:'Selet Company',
              selectionType:EstAutoSearchType.company
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.popupOpen = false;
            this.selected = <any>result.data;
            this.myControl.setValue(result?.data?.name);
        });
  }

  selectedEvent(evt){
    console.log(evt);
    // this.selected = 
  }

  getOptionData(){
    if(this.masterType == EstAutoSearchType.company){
      var requestParam = {"Payload":{"Filters":[{"ColumnName":"CounterpartyTypes","Value":2}]}}; 
      var URL = 'api/masters/counterparties/listByTypesAutocomplete';
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
