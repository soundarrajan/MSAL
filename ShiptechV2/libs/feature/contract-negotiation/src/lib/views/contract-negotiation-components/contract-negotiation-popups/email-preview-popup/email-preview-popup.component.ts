import { Component, ElementRef, Inject, OnInit,  ChangeDetectorRef,ChangeDetectionStrategy } from '@angular/core';
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
import { NgxSpinnerService } from 'ngx-spinner';
import { ContractNegoEmaillogComponent } from '../../contract-nego-emaillog/contract-nego-emaillog.component';
export interface User {
  id: string;
  name: string;
}
@Component({
  selector: 'app-email-preview-popup',
  templateUrl: './email-preview-popup.component.html',
  styleUrls: ['./email-preview-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ContractNegoEmaillogComponent],
})
export class EmailPreviewPopupComponent implements OnInit {

  @ViewChild(MatAutocompleteTrigger) auto: MatAutocompleteTrigger;
  @ViewChild('hiddenTextTo') addNewAdd: ElementRef;
  @ViewChild('hiddenTextCC') addNewAddCC: ElementRef;


  selected = 'send_rfq';
  toEmail = new FormControl();
  ccEmail = new FormControl();
  public configuration = {
    height: '250px',
    disableNativeSpellChecker: false,
    // fullPage: true,
    allowContent: true,
    extraAllowedContent:
      'div;h1;h2;h3;h4;h5;h6;p;textarea;text;script;template;span;ol;ul;li;table;td;style;*[id];*(*);*{*};<!--(*); -->(*)',
    defaultLanguage: 'en',
    language: 'en',
    toolbar: 'MyToolbar',
    removePlugins: 'elementspath',
    ignoreEmptyParagraph: true,
    removeButtons: 'Anchor',
    readOnly: false
  };
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
  editable: boolean = false;
  public selectedEmailPreview: any;
  currentUserId: number;
  from: any;
  toList: any =  [];
  ccList: any =[];
  filesList = [];
  to: any =  [];
  cc: any =  [];
  constructor(   
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private store: Store,
    private contractNegoService: ContractNegotiationService,
    public dialogRef: MatDialogRef<EmailPreviewPopupComponent>,
    private changeDetector: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private contractNegoEmail: ContractNegoEmaillogComponent
    ) {
      this.selectedEmailPreview = data;
      this.currentUserId = this.store.selectSnapshot(UserProfileState.user).id;
      this.configuration.readOnly = data.readOnly;
    }

  ngOnInit(): void {
    if(this.selectedEmailPreview.popupSource == 'emailLog'){
      this.getPreviewTemplate();
      this.editable = false;
    } else if(this.selectedEmailPreview.popupSource == 'previewRFQ'){
      this.previewSendRFQTemplate();
      this.editable = true;
    }
    this.filteredOptionsTo = this.toEmail.valueChanges.pipe(
      startWith(''),
      map(name => (name ? this._filterTo(name) : this.toList.slice()))
    );
    this.filteredOptionsCc = this.ccEmail.valueChanges.pipe(
      startWith(''),
      map(name => (name ? this._filterCc(name) : this.ccList.slice()))
    );
  }

  emailLogResendMail(){
    const contractRequestId = this.selectedEmailPreview.contractRequestId; 
    var loginUserId = this.currentUserId;
    var emailLogsId =[this.selectedEmailPreview.id];
    let reqpayload =  {"loginUserId":loginUserId,"emailLogsIds":emailLogsId,"requestId":contractRequestId};          
    this.contractNegoService.emailLogsResendMail(
      reqpayload
    ).subscribe(data => {        
      
    });
    this.changeDetector.detectChanges();
    this.toaster.success('Mail sent successfully.');    
     this.contractNegoEmail.getLatestEmailLogs(contractRequestId);

  }

  getPreviewTemplate() {
    const contractRequestEmailId = this.selectedEmailPreview.id;
    const payload = contractRequestEmailId;
    this.spinner.show();
    const emailLogsPreview = this.contractNegoService.getEmailLogsPreview(
      payload
    );
    emailLogsPreview.subscribe((res: any) => {
      this.spinner.hide();
      if (res?.message == 'Unauthorized') { 
        return;
      }
      if (res.payload) {
        let toIds = res.payload.to ? res.payload.to.split(',') : res.payload.to;
        let ccIds = res.payload.cc ? res.payload.cc.split(',') : res.payload.cc;
        toIds.forEach((item: any) => {
          this.to.push({ IdEmailAddress: item, name: item });
        });
        ccIds.forEach((item: any) => {
          this.cc.push({ IdEmailAddress: item, name: item });
        });    
        this.subject = res.payload.subject;
        this.content = res.payload.body;
        this.changeDetector.markForCheck();
      }
    });
  }

  previewSendRFQTemplate() {
    const payload = {
      "contractRequestProductOfferIds": this.selectedEmailPreview.contractRequestProductOfferIds,
      "counterpartyId": this.selectedEmailPreview.counterPartyId,
      "contractRequestId": this.selectedEmailPreview.contractRequestId,
      "templateName": "ContractNegotiationSendRFQ",
      "userId": this.currentUserId
    };
    this.spinner.show();
    this.contractNegoService.getPreviewRFQEmail(payload).subscribe((res: any) => { 
      this.spinner.hide();
      if (res?.message == 'Unauthorized' || res?.errors) {         
        return;
      }
      if(res.errorMessage){
        this.toaster.error(res.errorMessage);
        return;
      }
      if (res.previewResponse) {
        this.toList = JSON.parse(JSON.stringify(res.previewResponse.toList));
        this.ccList = JSON.parse(JSON.stringify(res.previewResponse.ccList));
        this.to = (res.previewResponse?.to) ? res.previewResponse.to : [];
        this.cc = (res.previewResponse?.cc) ? res.previewResponse.cc : [];
        this.subject = res.previewResponse.subject;
        this.content = res.previewResponse.content;
        this.changeDetector.markForCheck();
      }
    });
  }

  private _filterTo(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.toList.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  private _filterCc(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.ccList.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  addTo(selected,e) {
    let array1 = this.toList.filter(item => item.name == selected);
    this.to.push(array1[0]);
    this.toEmail.setValue("");
    this.widthTo = 80;
    this.widthTo = 80;
    // this.addNewToAdd.nativeElement.value = "";
  }

  addCc(selected) {
    let array1 = this.ccList.filter(item => item.name == selected);
    this.cc.push(array1[0]);
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
      if (item.idEmailAddress != selected.idEmailAddress && item.name != selected.name)
        array.push(item);
    })
    this.to = array;
  }

  removeCC(selected) {
    let array = [];
    this.cc.forEach((item) => {
      if (item.idEmailAddress != selected.idEmailAddress && item.name != selected.name)
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

  clearData() {
    this.to = [];
    this.cc = [];
    this.subject = '';
    this.content = '';
    this.from = [];
    this.filesList = [];
  }

  changeFieldWidthTo(){
    setTimeout(() => this.widthTo = Math.max(this.minWidth, this.addNewAdd.nativeElement.offsetWidth+16));
  }
  changeFieldWidthCC(){
    setTimeout(() => this.widthCC = Math.max(this.minWidth, this.addNewAddCC.nativeElement.offsetWidth+16));
  }
}
