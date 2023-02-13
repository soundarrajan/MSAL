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
import { MatRadioChange } from '@angular/material/radio';
import { FileSaverService } from 'ngx-filesaver';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import moment from 'moment';
import { ContractNegotiationStoreModel } from '../../../../store/contract-negotiation.store';
import { TenantSettingsService } from '@shiptech/core/services/tenant-settings/tenant-settings.service';
import { LocalService } from '../../../../services/local-service.service';
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
  toList2: any =  [];
  ccList2: any =[];
  filesList = [];
  to: any =  [];
  cc: any =  [];
  previewTemplate: any = [];
  documentsList: any;
  documentListForSearch: any;
  entityId: any;
  searchDocumentModel: any;
  documentPopUp: any;
  expandDocumentPopUp: boolean;
  displayedColumns: string[] = ['name', 'documentType'];
  generalTenantSettings: any;
  templateName: string = 'ContractNegotiationSendRFQ';
  sellerRowIdsForSendRFQ = [];
  sellerRowIdsForAmendRFQ = [];
  sellerRowIdsForRequoteRFQ = [];
  sellerHasNoOfferPrice = [];
  contractRequestProductOfferIds = [];
  isPreviewRFQTemplate: boolean = false;

  constructor(   
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private store: Store,
    private contractNegoService: ContractNegotiationService,
    public dialogRef: MatDialogRef<EmailPreviewPopupComponent>,
    private changeDetector: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private contractNegoEmail: ContractNegoEmaillogComponent,
    private _FileSaverService: FileSaverService,
    private appErrorHandler: AppErrorHandler,
    private tenantSettingsService: TenantSettingsService,
    private localService: LocalService
  ) {
    this.selectedEmailPreview = data;
    this.entityId = data.contractRequestId;
    this.currentUserId = this.store.selectSnapshot(UserProfileState.user).id;
    this.configuration.readOnly = data.readOnly;
    this.generalTenantSettings = this.tenantSettingsService.getGeneralTenantSettings();
  }

  ngOnInit(): void {
    if(this.selectedEmailPreview.popupSource == 'emailLog'){
      this.getPreviewTemplate();
      this.editable = false;
    } else if(this.selectedEmailPreview.popupSource == 'previewRFQTemplate'){
      this.isPreviewRFQTemplate = true;
      this.sellerRowIdsForSendRFQ = this.selectedEmailPreview.contractRequestProductOfferIds;
      this.contractRequestProductOfferIds = this.sellerRowIdsForSendRFQ;
      this.selectedEmailPreview.sellerData.forEach( data => {
        if(data.Status == 'Inquired'|| data.Status == 'Quoted'){
          this.sellerRowIdsForAmendRFQ.push(data.id);
          if(data.OfferPrice){
            this.sellerRowIdsForRequoteRFQ.push(data.id);
          }
          else if(!data.OfferPrice || data.OfferPrice == null){
            this.sellerHasNoOfferPrice.push(data.id);
          }   
        } 
      });
      this.previewRFQTemplate();
      this.editable = true;
    }
    this.getDocumentsList();
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
    if(emailLogsId.length == 0){
      this.toaster.error("Select items from the list");
      return ;
    }
    let reqpayload =  {"loginUserId":loginUserId,"emailLogsIds":emailLogsId,"requestId":contractRequestId};          
    this.contractNegoService.emailLogsResendMail(
      reqpayload
    ).subscribe((response:any)  => { 
      if(response?.message == 'Unauthorized'){
        return;
      }
      if(emailLogsId.length > 0){   
      this.toaster.success('Mail has been resend successfully');    
      }
    });
    this.changeDetector.detectChanges();
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

  previewRFQTemplate() {
    const payload = {
      "contractRequestProductOfferIds": this.contractRequestProductOfferIds,
      "counterpartyId": this.selectedEmailPreview.counterPartyId,
      "contractRequestId": this.selectedEmailPreview.contractRequestId,
      "templateName": this.templateName,
      "userId": this.currentUserId
    };
    this.spinner.show();
    this.contractNegoService.getPreviewRFQEmail(payload).subscribe((res: any) => { 
      if (res?.message == 'Unauthorized' || res?.errors) {   
        this.spinner.hide();      
        return;
      }
      let errorMsg = '';
      errorMsg = res.errors ? JSON.stringify(res.errors) : '';
      errorMsg = res.errorMessage ? res.errorMessage : '';
      if(errorMsg != ''){
        this.spinner.hide();
        this.toaster.error(errorMsg);
        return;
      }
      if (res.previewResponse) {
        this.previewTemplate = JSON.parse(JSON.stringify(res.previewResponse));
        this.toList = JSON.parse(JSON.stringify(this.previewTemplate.toList));
        this.ccList = JSON.parse(JSON.stringify(this.previewTemplate.ccList));
        this.to = (this.previewTemplate?.to) ? this.previewTemplate.to : [];
        this.cc = (this.previewTemplate?.cc) ? this.previewTemplate.cc : [];
        this.from = this.previewTemplate.from;
        this.subject = this.previewTemplate.subject;
        this.content = this.previewTemplate.content;
        this.filesList = (this.previewTemplate.attachmentsList)?this.previewTemplate.attachmentsList:[];
        if(this.filesList && this.filesList.length > 0){
          for (let i = 0; i < this.filesList.length; i++) {
            this.filesList[i].isIncludedInMail = true;
          }
        }
        this.editable = true;
        this.changeDetector.markForCheck();
        this.spinner.hide();
      } else {
        this.spinner.hide();
        this.clearData();
        this.toaster.error(res);
      }
    });
  }

  public selectTemplate(val) {
    this.templateName = val;
    if(val == 'ContractNegotiationAmendRFQ' && this.sellerRowIdsForAmendRFQ.length == 0){
      this.toaster.error('Amend RFQ cannot be sent as RFQ was not communicated for ' + this.selectedEmailPreview.counterPartyName);
      this.clearData();
      return;
    }
    if(val == 'ContractNegotiationRequote' && this.sellerRowIdsForAmendRFQ.length == 0){
      this.toaster.error('Requote RFQ cannot be sent as RFQ was not communicated for ' + this.selectedEmailPreview.counterPartyName);
      this.clearData();
      return;
    }
    if(val == 'ContractNegotiationRequote' && this.sellerHasNoOfferPrice.length > 0 && this.sellerRowIdsForRequoteRFQ.length == 0){
      this.toaster.error('Offer price should be captured to requote for ' + this.selectedEmailPreview.counterPartyName);
      this.clearData();
      return;
    }
    this.contractRequestProductOfferIds = (val == 'ContractNegotiationAmendRFQ') ? this.sellerRowIdsForAmendRFQ : this.sellerRowIdsForRequoteRFQ;
    
    if (val == 'ContractNegotiationSendRFQ') {
      this.contractRequestProductOfferIds = this.sellerRowIdsForSendRFQ;
    }
    
    this.previewRFQTemplate();
  }

  private _filterTo(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.toList.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  private _filterCc(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.ccList.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  addTo(selected, selectedFromLookup) {
    if(selected === '') return;
    if (this.previewTemplate == null) {
      this.previewTemplate = [];
    }
    if (
      this.previewTemplate.to == undefined ||
      this.previewTemplate.to == null
    ) {
      this.previewTemplate.to = [];
    }
    if (selectedFromLookup) {
      this.previewTemplate.to.push(this.toList?.find(c => c.name == selected));
    } else {
      if(this.validateEmail(selected, 'toMail')){
        this.previewTemplate.to.push({ IdEmailAddress: selected, name: selected })
      } else {
        this.toaster.warning('Please add valid to email address!');
        return;
      }
    }
    this.to = this.previewTemplate.to;
    this.toEmail.setValue("");
    this.toList2 = this.toList;
    this.widthTo = 80;
    this.widthTo = 80;
    // this.addNewToAdd.nativeElement.value = "";
  }

  addCc(selected, selectedFromLookup) {
    if(selected === '') return;
    if (this.previewTemplate == null) {
      this.previewTemplate = [];
    }
    if (
      this.previewTemplate.cc == undefined ||
      this.previewTemplate.cc == null
    ) {
      this.previewTemplate.cc = [];
    }
    if (selectedFromLookup) {
      this.previewTemplate.cc.push(this.ccList?.find(c => c.name == selected));
    } else {
      if(this.validateEmail(selected, 'ccMail')){
        this.previewTemplate.cc.push({ IdEmailAddress: selected, name: selected })
      } else {
        this.toaster.warning('Please add valid cc email address!');
        return;
      }
    }
    this.cc = this.previewTemplate.cc;
    this.ccEmail.setValue("");
    this.ccList2 = this.ccList;
    this.widthTo = 80;
    this.widthTo = 80;
  }

  removeRecipient(selected) {
    if (this.to && this.to.length > 0 && selected != null) {
      let index = this.to.findIndex(x => x === selected);
      this.to.splice(index, 1);
      this.previewTemplate.to = this.to;
    }
  }

  removeCC(selected) {
    if (this.cc && this.cc.length > 0 && selected != null) {
      let index = this.cc.findIndex(x => x === selected);
      this.cc.splice(index, 1);
      this.previewTemplate.cc = this.cc;
    }
  }

  searchDocumentList(value: string): void {
    let filterDocumentType = this.documentsList.filter(documentType =>
      documentType.name.toLowerCase().includes(value.trim().toLowerCase())
    );
    this.documentListForSearch = [...filterDocumentType];
  }

  addFilesList($event: MatRadioChange) {
    if ($event.value) {
      let selectedDocument = $event.value;
      let isInList: any = this.filesList.find( v => v.id == selectedDocument.id );
      if (isInList && isInList.isIncludedInMail) {
        this.toaster.error('Attachment already added');
      } else {
        selectedDocument.isIncludedInMail = true;
        if (!this.filesList) {
          this.filesList = [];
        }
        let i = 0;
        while (i >= 0 && i < this.filesList.length)
          if (this.filesList[i].id == selectedDocument.id) {
            this.filesList.splice(i, 1);
            i--;
          } else {
            i++;
          }
        this.filesList.push(selectedDocument);
      }
    }
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
    this.editable = false;
  }

  getDocumentsList() {
    const payload = {
      Order: null,
      PageFilters: {
        Filters: []
      },
      SortList: {
        SortList: []
      },
      Filters: [
        {
          ColumnName: 'ReferenceNo',
          Value: this.entityId.toString()
        },
        {
          ColumnName: 'TransactionTypeId',
          Value: 48
        }
      ],
      SearchText: null,
      Pagination: {
        Skip: 0,
        Take: 9999
      }
    };
    this.contractNegoService
      .getDocuments(payload)
      .subscribe((response: any) => {
        if (response?.message == 'Unauthorized') {
          return;
        }
        if (typeof response === 'string') {
          this.toaster.error(response);
        } else {
          for (let i = 0; i < response.length; i++) {
            response[i].isIncludedInMail = true;
          }
          this.documentsList = JSON.parse(JSON.stringify(response));
          this.documentListForSearch = JSON.parse(JSON.stringify(response));
          this.changeDetector.markForCheck();
        }
      });
  }

  removeAttachment(file) {
    file.isIncludedInMail = false;
  }

  downloadDocument(file): void {
    let id = file.id;
    let name = file.name;
    const request = {
      Payload: { Id: id }
    };
    this.spinner.show();
    this.contractNegoService.downloadDocument(request).subscribe(
      response => {
        this.spinner.hide();
        this._FileSaverService.save(response, name);
      },
      () => {
        this.spinner.hide();
        this.appErrorHandler.handleError('Could not download the document. Please try again later.');
      }
    );
  }

  resetDocumentData() {
    this.searchDocumentModel = null;
    this.documentPopUp = null;
    this.documentListForSearch = JSON.parse(JSON.stringify(this.documentsList));
    this.changeDetector.markForCheck();
    this.expandDocumentPopUp = false;
  }

  changeFieldWidthTo(){
    setTimeout(() => this.widthTo = Math.max(this.minWidth, this.addNewAdd.nativeElement.offsetWidth+16));
  }
  changeFieldWidthCC(){
    setTimeout(() => this.widthCC = Math.max(this.minWidth, this.addNewAddCC.nativeElement.offsetWidth+16));
  }

  validateEmail(inputData: string, type: string) {
    const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const validateemail = regularExpression.test(
      String(inputData).toLowerCase()
    );
    if (validateemail && type == 'ccMail') {
      return true;
      //this.addCc(inputData, false);
    }
    if (validateemail && type == 'toMail') {
      //this.addTo(inputData, false);
      return true;
    }
    if (!validateemail && type == 'ccMail') {
      this.ccEmail.setValue("");
      return false;
    }
    if (!validateemail && type == 'toMail') {
      this.toEmail.setValue("");
      return false;
    }
  }

  discardSavedPreview() {
    if (this.previewTemplate == null) {
      this.toaster.error('Template does not exists.');
      return;
    }
    if (this.previewTemplate.comment.id === 0) {
      this.toaster.error('No saved template.');
      return;
    } else {
      /*let contractRequestProductOfferIds: any;
      this.selectedEmailPreview.sellerData.forEach(data => { 
        contractRequestProductOfferIds = data.contractRequestProductOfferIds;
      });*/
      let requestPayload = {
        "emailTemplateId": this.previewTemplate.comment.emailTemplate.id,
        "id": this.previewTemplate.comment.id,
        "attachmentsList": this.previewTemplate.attachmentsList??[]
      };
      this.spinner.show();
      this.contractNegoService.discardSavedPreviewRFQ(
        requestPayload
      ).subscribe((response: any) => {
        this.spinner.hide();
        if (response?.message == 'Unauthorized') {
          return;
        }
        if (response) {
          this.previewRFQTemplate();
          this.toaster.success('Changes reverted successfully.');
        }
      });
    }
  }

  saveAndSendRFQ(isSendEmail) {
    if (this.previewTemplate == null) {
      this.toaster.error('The Email Template is empty.');
      return;
    }
    if (this.subject === null || this.subject.match(/^ *$/) !== null) {
      this.toaster.error('Please add a subject to save / send the email.');
      return;
    }
    if (this.previewTemplate?.to?.length == 0) {
      this.toaster.error('Please enter atleast 1 email id.');
      return;
    }

    this.previewTemplate.subject = this.subject;
    this.previewTemplate.content = this.content;
    this.previewTemplate.from = this.from;
    this.previewTemplate.attachmentsList = this.filesList;

    let contractRequestData: any = {};
    let crProdData= this.selectedEmailPreview.prodData;
    let selectedsellerOfferRowIds: any = [];
    this.store.selectSnapshot((state: ContractNegotiationStoreModel) => {
      contractRequestData = state['contractNegotiation'].ContractRequest[0];
    });
    
    let selectedSellersData = [];
    if(this.selectedEmailPreview.sellerData && this.selectedEmailPreview.sellerData.length > 0){
      this.selectedEmailPreview.sellerData.forEach( data => {
        selectedsellerOfferRowIds.push(data.id);
        selectedSellersData.push({
          contractRequestProductId: data.contractRequestProductId,
          contractRequestProductOfferIds: data.contractRequestProductOfferIds,
          counterpartyId: data.CounterpartyId,
          counterpartyName: data.CounterpartyName,
          createdById: data.createdById,
          lastModifiedById: this.currentUserId,
          createdOn: data.createdOn,
          lastModifiedOn: moment.utc(),
          id: data.id,
          productId: crProdData[data.contractRequestProductId].productId,
          specGroupId: crProdData[data.contractRequestProductId].specGroupId,
          minQuantity: crProdData[data.contractRequestProductId].minQuantity,
          maxQuantity: crProdData[data.contractRequestProductId].maxQuantity,
          quantityUomId: crProdData[data.contractRequestProductId].maxQuantityUomId,
          validityDate: contractRequestData.minValidity,
          currencyId: this.generalTenantSettings.tenantFormats.currency.id,
          pricingTypeId: crProdData[data.contractRequestProductId].pricingTypeId
        });
      });
    }
    let saveAndSendRfqAPIPayload = {
      selectedSellers: selectedSellersData,
      contractRequestId: this.entityId,
      isSendMail: isSendEmail,
      previewResponse: this.previewTemplate,
      userId: this.currentUserId
    }
    this.spinner.show();
    // Get response from server
    this.contractNegoService.saveAndSendRFQ(
      saveAndSendRfqAPIPayload
    ).subscribe( response => {
      if (response?.message == 'Unauthorized') {
        this.toaster.error(response?.message);
        this.spinner.hide();
        return;
      }
      if (response instanceof Object && response['validationMessage'].length > 0) {
        this.toaster.warning(response['validationMessage']);
      } else if (
        response instanceof Object &&
        isSendEmail &&
        response['validationMessage'].length == 0
      ) {
        this.contractNegoService.getContractRequestDetails(contractRequestData.id)
        .subscribe(response => {
          this.localService.contractRequestData(response).then(() => {
            this.localService.callGridRefreshService(selectedsellerOfferRowIds);
          });
          this.toaster.success('RFQ sent successfully.');
          this.dialogRef.close();
        });
      } else if (
        response instanceof Object &&
        !isSendEmail &&
        response['validationMessage'].length == 0
      ) {
        this.toaster.success('Template saved successfully.');
        this.previewTemplate = response['previewResponse'];
      } else if (response instanceof Object) {
        this.toaster.warning(response.Message);
      } else {
        this.toaster.error(response);
      }
      this.spinner.hide();
    });
  };
}
