import { removeSummaryDuplicates } from '@angular/compiler';
import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { ViewChild } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

export interface User {
  id: string;
  name: string;
}

@Component({
  selector: 'app-email-preview-popup',
  templateUrl: './email-preview-popup.component.html',
  styleUrls: ['./email-preview-popup.component.scss']
})
export class EmailPreviewPopupComponent implements OnInit {

  @ViewChild(MatAutocompleteTrigger) auto: MatAutocompleteTrigger;
  @ViewChild('hiddenTextTo') addNewAdd: ElementRef;
  @ViewChild('hiddenTextCC') addNewAddCC: ElementRef;
  selected = 'Offer Approval';
  toEmail = new FormControl();
  ccEmail = new FormControl();
  filesList = [{ id: '1', name: 'Purchase Documents1' }, { id: '2', name: 'Purchase Documents' }];
  userList: User[] = [{ id: '1', name: 'Alexander.J' }, { id: '2', name: 'Reshma.Thomas' }, { id: '3', name: 'Gokul.S' },{ id: '4', name: 'Soundar.Rajan' }, { id: '5', name: 'Padma.S' }];
  to: User[] = [{ id: '1', name: 'Alexander.J' }, { id: '2', name: 'Reshma.Thomas' }, { id: '3', name: 'Gokul.S' }];
  cc: User[] = [{ id: '1', name: 'Soundar.Rajan' }, { id: '2', name: 'Padma.S' }];
  filteredOptionsTo: Observable<User[]>;
  filteredOptionsCc: Observable<User[]>;
  myControl = new FormControl();
  options: User[] = [{ id: '4', name: 'User1@inatech.com' }, { id: '6', name: 'User2@inatech.com' }, { id: '7', name: 'User3@inatech.com' }];
  conter = 999;
  minWidth: number = 80;
  widthTo: number = this.minWidth;
  widthCC: number = this.minWidth;
  constructor(public dialogRef: MatDialogRef<EmailPreviewPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.filteredOptionsTo = this.toEmail.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.id)),
      map(name => (name ? this._filter(name) : this.userList.slice()))
    );
    this.filteredOptionsCc = this.ccEmail.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.id)),
      map(name => (name ? this._filter(name) : this.userList.slice()))
    );
  }

  private _filter(value: string): User[] {
    const filterValue = value.toLowerCase();

    return this.userList.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  addTo(selected,e) {
    let array1 = this.userList.filter(item => item.id == selected);
    if(array1.length>0){
      this.to.push(array1[0]);
    }
    else{
      if(selected!='')
        this.to.push({ id: '999', name: selected })
    }
    this.toEmail.setValue("");
    this.widthTo = 80;
    this.widthTo = 80;
    // this.addNewToAdd.nativeElement.value = "";
  }

  addCc(selected) {
    let array1 = this.userList.filter(item => item.id == selected);
    if(array1.length>0){
      this.cc.push(array1[0]);
    }
    else{
      if(selected!='')
        this.cc.push({ id: '999', name: selected })
    }
    this.ccEmail.setValue("");
    this.widthTo = 80;
    this.widthTo = 80;
    // this.addNewCcAdd.nativeElement.value = "";
  }

  fileBrowseHandler(files) {
    for (const item of files) {
      this.filesList.push(item.name);
    }
  }

  removeRecipient(selected) {
    let array = [];
    this.to.forEach((item) => {
      if (item.id != selected.id && item.name != selected.name)
        array.push(item);
    })
    this.to = array;

  }
  removeCC(selected) {
    let array = [];
    this.cc.forEach((item) => {
      if (item.id != selected.id && item.name != selected.name)
        array.push(item);
    })
    this.cc = array;

  }

  removeFile(file) {
    let array = [];
    this.filesList.forEach((item) => {
      if (item.id != file.id)
        array.push(item);
    })
    this.filesList = array;
  }

  changeFieldWidthTo(value){
    setTimeout(() => this.widthTo = Math.max(this.minWidth, this.addNewAdd.nativeElement.offsetWidth+16));
  }
  changeFieldWidthCC(value){
    setTimeout(() => this.widthCC = Math.max(this.minWidth, this.addNewAddCC.nativeElement.offsetWidth+16));

  }
}
