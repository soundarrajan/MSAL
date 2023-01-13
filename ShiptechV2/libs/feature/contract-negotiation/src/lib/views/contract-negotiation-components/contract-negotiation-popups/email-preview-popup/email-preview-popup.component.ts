import { removeSummaryDuplicates } from '@angular/compiler';
import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { ViewChild } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ContractNegotiationService } from '../../../../services/contract-negotiation.service';
import { UserProfileState } from '@shiptech/core/store/states/user-profile/user-profile.state';
import { Store } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';

export interface User {
  id: string;
  name: string;
}
import { ActivatedRoute, Router } from "@angular/router";
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
  userList: any = [{ id: '1', name: 'Alexander.J' }, { id: '2', name: 'Reshma.Thomas' }, { id: '3', name: 'Gokul.S' }];
  to: any =   [{ id: '1', name: 'Alexander.J' }, { id: '2', name: 'Reshma.Thomas' }, { id: '3', name: 'Gokul.S' }];
  cc: any =  [{ id: '1', name: 'Alexander.J' }, { id: '2', name: 'Reshma.Thomas' }, { id: '3', name: 'Gokul.S' }];
  filteredOptionsTo: Observable<any>;
  filteredOptionsCc: Observable<any>;
  myControl = new FormControl();
  options: any = [];
  conter = 999;
  minWidth: number = 80;
  widthTo: number = this.minWidth;
  widthCC: number = this.minWidth;
  subject = "";
  content = "";
  isLoaded = false;
  public SelectedSellerWithProds: any;
  currentUserId: number;
  constructor(
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private store: Store,
    private contractNegoService: ContractNegotiationService,
    public dialogRef: MatDialogRef<EmailPreviewPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.SelectedSellerWithProds = data;
      this.currentUserId = this.store.selectSnapshot(UserProfileState.user).id;
     }

  ngOnInit(): void {
    console.log(this.dialogRef);
    this.getPreviewTemplate();
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
  emailLogResendMail(){
    console.log(this.route);
   
    const contractRequestId = this.route.snapshot.params.requestId; 
    var loginUserId = this.currentUserId;
    var emailLogsId =[this.SelectedSellerWithProds.id];
    let reqpayload =  {"loginUserId":loginUserId,"emailLogsIds":emailLogsId,"requestId":contractRequestId};
          
    this.contractNegoService.emailLogsResendMail(
      reqpayload
    ).subscribe(data => {
          this.toaster.success('Mail sent successfully.');       
          this.contractNegoService.callGridRedrawService();
    });
  }
  getPreviewTemplate() {
      const contractRequestId = this.SelectedSellerWithProds.id;  
      console.log(contractRequestId);  
      const payload = contractRequestId;    
      const emailLogsPreview = this.contractNegoService.getEmailLogsPreview(
        payload
      );
        emailLogsPreview.subscribe((res: any) => {    
        if (res?.message == 'Unauthorized') {
          return;
        }
        if (res.payload) {
          this.to = res.payload.to ? res.payload.to.split(',') : res.payload.to;
          this.cc = res.payload.cc ? res.payload.cc.split(',') : res.payload.cc;
          var cc_data = res.payload.cc.split(',');
      
          console.log(this.to);
          console.log(this.cc);
         
          this.to.forEach((item: any) => {
            this.to.push({ name: item.to });
          });
          this.cc.forEach((item: any) => {
            this.cc.push({ name:item.to });
          });
          this.subject = res.payload.subject;
          this.content = res.payload.body;
        }
      });
  
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

  changeFieldWidthTo(){
    setTimeout(() => this.widthTo = Math.max(this.minWidth, this.addNewAdd.nativeElement.offsetWidth+16));
  }
  changeFieldWidthCC(){
    setTimeout(() => this.widthCC = Math.max(this.minWidth, this.addNewAddCC.nativeElement.offsetWidth+16));

  }
}
