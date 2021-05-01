import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MastersListApiService } from '@shiptech/core/delivery-api/masters-list/masters-list-api.service';
import { EstAutoSearchType } from '@shiptech/core/enums/master-search-type';
import { getMetaData } from 'ngxs-reset-plugin';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
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

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    console.log(value)
    return this.options?.filter(option => option?.toLowerCase().indexOf(filterValue) === 0);
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
          console.log(result)
            this.popupOpen = false;
            this.selected = <any>{id:result.id, name:result.name};
        });
  }

  selectedEvent(evt){
    console.log(evt);
  }

  getOptionData(){
    var requestParam = {"Payload":{"Filters":[{"ColumnName":"CounterpartyTypes","Value":2}]}}; 
    this.mastersListApiService.getList(requestParam,'api/masters/counterparties/listByTypesAutocomplete')
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
