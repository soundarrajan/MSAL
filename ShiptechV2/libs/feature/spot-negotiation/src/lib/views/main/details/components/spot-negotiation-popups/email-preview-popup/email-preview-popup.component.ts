import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import { SpotNegotiationService } from '../../../../../../../../../spot-negotiation/src/lib/services/spot-negotiation.service';
import {
  SetLocationsRows,
  UpdateRequest
  // SetLocationsRowsPriceDetails
} from '../../../../../../store/actions/ag-grid-row.action';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import _ from 'lodash';
import { MatRadioChange } from '@angular/material/radio';
import { FileSaverService } from 'ngx-filesaver';
import { AppErrorHandler } from '@shiptech/core/error-handling/app-error-handler';
import { ModuleError } from '../../negotiation-documents/error-handling/module-error';

interface Items {
  value: string;
  viewValue: string;
}
interface EmailAddress {
  IdEmailAddress: string;
  Name: string;
}

@Component({
  selector: 'app-email-preview-popup',
  templateUrl: './email-preview-popup.component.html',
  styleUrls: ['./email-preview-popup.component.css']
})
export class EmailPreviewPopupComponent implements OnInit {
  public SelectedSellerWithProds: any;
  currentRequestInfo: any;
  selected: any;
  toEmail = '';
  ccEmail = '';
  filesList: any;
  from: any;
  to: any;
  cc: any;
  subject: any;
  content: any;
  readonly: boolean = false;
  previewTemplate: any = [];
  requestOptions: any;
  //rfqTemplate: any;
  items: Items[];
  public Editor = ClassicEditor;
  documentsList: any;
  entityId: any;

  expandDocumentPopUp: boolean = false;
  searchDocumentModel: any;
  document: any;
  documentListForSearch: any = [];
  selectedDocument: any;
  documentPopUp: any;
  displayedColumns: string[] = ['name', 'documentType'];
  toList: any;
  ccList: any;
  ccList2: any;
  toList2: any;
  locationRowsAcrossRequest: any;
  constructor(
    public dialogRef: MatDialogRef<EmailPreviewPopupComponent>,
    private store: Store,
    private spinner: NgxSpinnerService,
    private toaster: ToastrService,
    private changeDetector: ChangeDetectorRef,
    private spotNegotiationService: SpotNegotiationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _FileSaverService: FileSaverService,
    private appErrorHandler: AppErrorHandler
  ) {
    this.SelectedSellerWithProds = data;
    this.selected = 'MultipleRfqNewRFQEmailTemplate';
    this.readonly = this.SelectedSellerWithProds.ReadOnly;
    //if(this.SelectedSellerWithProds.requestOffers?.length > 0){
    //if(this.SelectedSellerWithProds.requestOffers == undefined && this.SelectedSellerWithProds.requestOffers?.filter(off => off.isRfqskipped === false).length > 0){
    // this.items =  [
    //   {value: 'MultipleRfqNewRFQEmailTemplate', viewValue: 'RFQ', disabled: false},
    //   {value: 'MultipleRfqAmendRFQEmailTemplate', viewValue: 'Amend RFQ', disabled: true},
    //   {value: 'MultipleRfqRevokeRFQEmailTemplate', viewValue: 'Revoke RFQ', disabled: true},
    // ];
    // this.selected = 'MultipleRfqAmendRFQEmailTemplate';
    // }
    // else{
    //   this.toaster.error('Amended RFQ cannot be sent as RFQ was skipped.');
    //   this.dialogRef.close();
    // }
    // }
    // else{
    //   this.items =  [
    //     {value: 'MultipleRfqNewRFQEmailTemplate', viewValue: 'New RFQ'},
    //   ];
    //   this.selected = 'MultipleRfqNewRFQEmailTemplate';
    // }
    this.content = '';
  }

  ngOnInit(): void {
    this.store.subscribe(({ spotNegotiation }) => {
      this.currentRequestInfo = spotNegotiation.currentRequestSmallInfo;
      this.entityId = spotNegotiation.groupOfRequestsId;
      this.requestOptions = spotNegotiation.requests;
      this.locationRowsAcrossRequest = spotNegotiation.locationsRows;
    });
    if (this.selected) {
      this.getPreviewTemplate();
      this.getDocumentsList();
    }
  }

  getPreviewTemplate() {
    if (this.selected != 'MultipleRfqNewRFQEmailTemplate') {
      if (
        this.SelectedSellerWithProds.filter(x => x.requestOffers != undefined)
          .length == 0 ||
        this.SelectedSellerWithProds.filter(x => x.requestOffers?.length > 0)
          .length == 0
      ) {
        if (this.selected == 'MultipleRfqAmendRFQEmailTemplate')
          this.toaster.error(
            'Amend RFQ cannot be sent as RFQ was not communicated.'
          );
        else if (this.selected == 'MultipleRfqRevokeRFQEmailTemplate')
          this.toaster.error(
            'Revoke RFQ cannot be sent as RFQ was not communicated.'
          );
        else if (this.selected == 'RequoteRFQEmailTemplate')
          this.toaster.error(
            'Requote RFQ cannot be sent as RFQ was not communicated.'
          );
        this.clearData();
        return;
      } else if (
        this.SelectedSellerWithProds.filter(
          x =>
            x.requestOffers?.filter(off => off.isRfqskipped === false)
              .length === 0
        ).length > 0
      ) {
        if (this.selected == 'MultipleRfqAmendRFQEmailTemplate')
          this.toaster.error('Amend RFQ cannot be sent as RFQ was skipped.');
        else if (this.selected == 'MultipleRfqRevokeRFQEmailTemplate')
          this.toaster.error('Revoke RFQ cannot be sent as RFQ was skipped.');
        else if (this.selected == 'RequoteRFQEmailTemplate')
          this.toaster.error('Requote RFQ cannot be sent as RFQ was skipped.');
        this.clearData();
        return;
      } else if (
        this.selected == 'RequoteRFQEmailTemplate' &&
        this.SelectedSellerWithProds.filter(x =>
          x.requestOffers?.some(x => !x.isRfqskipped && x.price != null)
        ).length == 0
      ) {
        this.toaster.error(
          'Atleast 1 offer price should be captured in order to requote.'
        );
        this.clearData();
        return;
      }
    }

    if (!this.readonly) {
      var reqSelectedProds = this.currentRequestInfo.requestLocations.map(
        prod =>
          prod.requestProducts
            .map((e, i) =>
              this.SelectedSellerWithProds.find(
                y =>
                  y['checkProd' + (i + 1)] &&
                  prod.id == y.requestLocationId &&
                  (!y.requestOffers ||
                    y.requestOffers?.find(
                      x =>
                        (x.requestProductId == e.id &&
                          !x.isRfqskipped &&
                          !x.isDeleted) ||
                        x.requestProductId != e.id
                    ))
              )
                ? e.id
                : undefined
            )
            .filter(x => x)
      );
      let mergedReqProds = [];
      reqSelectedProds.forEach(singleLocationPro => {
        mergedReqProds = [...mergedReqProds, ...singleLocationPro];
      });
      let rfqId = 0;
      if (this.selected != 'MultipleRfqNewRFQEmailTemplate') {
        rfqId = this.SelectedSellerWithProds.some(
          x => x.requestOffers?.length > 0
        )
          ? this.SelectedSellerWithProds.find(x => x.requestOffers?.length > 0)
              .requestOffers[0].rfqId
          : 0;
      }

      var FinalAPIdata = {
        RequestLocationSellerId: this.SelectedSellerWithProds[0].id,
        RequestId: this.SelectedSellerWithProds[0].requestId,
        CounterpartyId: this.SelectedSellerWithProds[0].sellerCounterpartyId,
        CounterpartyName: this.SelectedSellerWithProds[0]
          .sellerCounterpartyName,
        RequestProductIds: mergedReqProds,
        RfqId: rfqId,
        TemplateName: this.selected,
        QuoteByDate: new Date(this.spotNegotiationService.QuoteByDate)
      };

      this.spinner.show();
      // Get response from server
      const response = this.spotNegotiationService.PreviewRfqMail(FinalAPIdata);
      response.subscribe((res: any) => {
        this.spinner.hide();
        if(res?.message == 'Unauthorized'){
          return;
        }
        if (res['previewResponse']) {
          this.previewTemplate = res['previewResponse'];
          //this.rfqTemplate = this.previewTemplate
          this.to = this.previewTemplate.to.map(to => to.name);
          this.cc = this.previewTemplate.cc.map(cc => cc.name);
          this.subject = this.previewTemplate.subject;
          this.content = this.previewTemplate.content;
          this.from = this.previewTemplate.From;
          this.toList = this.previewTemplate.toList;
          this.ccList = this.previewTemplate.ccList;
          this.filesList = this.previewTemplate.attachmentsList;
          for (let i = 0; i < this.filesList.length; i++) {
            this.filesList[i].isIncludedInMail = true;
          }
        } else {
          this.clearData();
          this.toaster.error(res);
        }
      });
    } else {
      const payload = this.SelectedSellerWithProds.id;
      this.spinner.show();
      const emailLogsPreview = this.spotNegotiationService.getEmailLogsPreview(
        payload
      );
      emailLogsPreview.subscribe((res: any) => {
        this.spinner.hide();
        if(res?.message == 'Unauthorized'){
          return;
        }
        if (res.payload) {
          this.to = res.payload.to ? res.payload.to.split(',') : res.payload.to;
          this.cc = res.payload.cc ? res.payload.cc.split(',') : res.payload.cc;
          this.subject = res.payload.subject;
          this.content = res.payload.body;
        }
      });
    }
  }
  clearData() {
    this.to = [];
    this.cc = [];
    this.subject = '';
    this.content = '';
    this.from = [];
    this.filesList = [];
    this.previewTemplate = null;
  }

  addTo(item, selectedFromLookup) {
    this.to.push(item);    
    if (this.previewTemplate == null) {
      this.previewTemplate = [];
    }
    if (
      this.previewTemplate.to == undefined ||
      this.previewTemplate.to == null
    ) {
      this.previewTemplate.to = [];
    }

    if(selectedFromLookup){
      this.previewTemplate.to.push(this.toList2?.find(c => c.name == item));
    } else {
      this.previewTemplate.to.push({ IdEmailAddress: item });
    }
    this.toEmail = '';
    this.toList2 = this.toList;
  }

  RemoveEmailId(item, val) {
    if (val == 'toEmail') {
      if (this.to && this.to.length > 0 && item != null) {
        let index = this.to.findIndex(x => x === item);
        this.to.splice(index, 1);
        this.previewTemplate.to.splice(index, 1);
      }
    } else {
      if (this.cc && this.cc.length > 0 && item != null) {
        let index = this.cc.findIndex(x => x === item);
        this.cc.splice(index, 1);
        this.previewTemplate.cc.splice(index, 1);
      }
    }
  }

  searchCC(item){
    this.ccList2 = this.ccList;
    if(item != null){
      this.ccList2 = this.ccList.filter(e => {
        if (e.name.toLowerCase().includes(item.toLowerCase())) {
          return true;
        }
        else{
          return false;
        }
      });
    }
  }

  searchTO(item){
    this.toList2 = this.toList;
    if(item != null){
      this.toList2 = this.toList.filter(e => {
        if (e.name.toLowerCase().includes(item.toLowerCase())) {
          return true;
        }
        else{
          return false;
        }
      });
    }
  }

  addCc(item, selectedFromLookup) {
    this.cc.push(item);
    if (this.previewTemplate == null) {
      this.previewTemplate = [];
    }
    if (
      this.previewTemplate.cc == undefined ||
      this.previewTemplate.cc == null
    ) {
      this.previewTemplate.cc = [];
    }
    if(selectedFromLookup){
      this.previewTemplate.cc.push(this.ccList2?.find(c => c.name == item));
    } else {
      this.previewTemplate.cc.push({ IdEmailAddress: item });
    }
    this.ccEmail = '';
    this.ccList2 = this.ccList;
  }

  displayNull(value) {
    return null;
  }

  fileBrowseHandler(files) {
    for (const item of files) {
      this.filesList.push(item.name);
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

    var selectedSellers = [];

    this.SelectedSellerWithProds.forEach((singleSeller, index) => {
      var selectedSeller = {
        RequestLocationSellerId: singleSeller.id,
        RequestLocationId: singleSeller.requestLocationId,
        LocationID: singleSeller.locationId,
        SellerId: singleSeller.sellerCounterpartyId,
        RfqId:
          singleSeller.requestOffers?.length > 0
            ? singleSeller.requestOffers[0].rfqId
            : 0,
        RequestId: singleSeller.requestId,
        PhysicalSupplierCounterpartyId:
          singleSeller.physicalSupplierCounterpartyId,
        RequestProductIds: this.currentRequestInfo.requestLocations
          .filter(loc => loc.id === singleSeller.requestLocationId)
          .map(prod => prod.requestProducts.map(i => i.id))[0]
      };
      selectedSellers.push(selectedSeller);
    });

    this.previewTemplate.subject = this.subject;
    this.previewTemplate.content = this.content;
    this.previewTemplate.From = this.from;
    this.previewTemplate.AttachmentsList = this.filesList;
    let rfqIds = selectedSellers.map(x => x.RfqId);
    let requestProductIds = selectedSellers.map(x => x.RequestProductIds);

    var saveAndSendRfqAPIPayload = {
      SelectedSellers: selectedSellers,
      RequestGroupId: this.currentRequestInfo.requestGroupId,
      IsSendMail: isSendEmail,
      PreviewResponse: this.previewTemplate,
      QuoteByDate: new Date(this.spotNegotiationService.QuoteByDate)
    };

    this.spinner.show();
    // Get response from server
    const response = this.spotNegotiationService.SaveAndSendRFQ(
      saveAndSendRfqAPIPayload
    );
    response.subscribe((res: any) => {
      this.spinner.hide();
      if(res?.message == 'Unauthorized'){
        return;
      }
      if (res instanceof Object && res['validationMessage'].length > 0) {
        // this.toaster.success('RFQ(s) skipped successfully.')
        // if(res['message'].length>5)
        this.toaster.warning(res['validationMessage']);
      } else if (
        res instanceof Object &&
        isSendEmail &&
        res['validationMessage'].length == 0
      ) {
        this.toaster.success('Mail sent successfully.');
        this.dialogRef.close();
      } else if (
        res instanceof Object &&
        !isSendEmail &&
        res['validationMessage'].length == 0
      ) {
        this.toaster.success('Template saved successfully.');
        this.previewTemplate = res['previewResponse'];
      } else if (res instanceof Object) {
        this.toaster.warning(res.Message);
      } else {
        this.toaster.error(res);
        return;
      }

      if (res.isGroupDeleted) {
        const baseOrigin = new URL(window.location.href).origin;
        window.open(
          `${baseOrigin}/#/edit-request/${this.currentRequestInfo.id}`,
          '_self'
        );
        //window.open(`${baseOrigin}/#/edit-request/${request.id}`, '_blank');
      }
      var futureLocationsRows;
      const stelocationsRows = this.store.selectSnapshot<any>((state: any) => {
        return state.spotNegotiation.locationsRows;
      });

      if (res['sellerOffers']) {
        let locationsRows;
        const requestGroupID = this.store.selectSnapshot<string>(
          (state: any) => {
            return state.spotNegotiation.groupOfRequestsId;
          }
        );

        if (res['requestLocationSellers']) {
          locationsRows = res['requestLocationSellers'];
        } else {
          const storeLocationsRows = this.store.selectSnapshot<string>(
            (state: any) => {
              return state.spotNegotiation.locationsRows;
            }
          );
          locationsRows = JSON.parse(JSON.stringify(storeLocationsRows));
        }

        // this.store.dispatch(
        //   new SetLocationsRowsPriceDetails(res['sellerOffers'])
        // );

        futureLocationsRows = this.getLocationRowsWithPriceDetails(
          locationsRows,
          res['sellerOffers']
        );
        this.store.dispatch(new SetLocationsRows(futureLocationsRows));

        this.changeDetector.detectChanges();
      }

      if (this.previewTemplate.comment.emailTemplate.id == 10) {
        this.requestOptions = this.requestOptions.map(e => {
          let requestLocations = e.requestLocations.map(reqLoc => {
            let requestProducts =
              this.previewTemplate.comment.emailTemplate.id == 10
                ? reqLoc.requestProducts.map(reqPro =>
                    requestProductIds.some(x => x.includes(reqPro.id)) &&
                    (reqPro.status.toLowerCase() == 'validated' ||
                      reqPro.status.toLowerCase() == 'reopen')
                      ? { ...reqPro, status: 'Inquired' }
                      : reqPro
                  )
                : reqLoc.requestProducts.map(reqPro =>
                    requestProductIds.some(x => x.includes(reqPro.id))
                      ? { ...reqPro, status: 'ReOpen' }
                      : reqPro
                  );

            return { ...reqLoc, requestProducts };
          });
          return { ...e, requestLocations };
        });
        this.store.dispatch(new UpdateRequest(this.requestOptions));
      } else if (this.previewTemplate.comment.emailTemplate.id == 12) {
        requestProductIds = stelocationsRows
          .filter(
            r =>
              r.requestOffers &&
              r.requestOffers.find(
                ro => rfqIds.includes(ro.rfqId) && !ro.isRfqskipped
              )
          )
          .map(x =>
            x.requestOffers
              .filter(r => !r.isRfqskipped)
              .map(r => r.requestProductId)
          );
        this.requestOptions = this.requestOptions.map(e => {
          let requestLocations = e.requestLocations.map(reqLoc => {
            let requestProducts = null;
            if (
              futureLocationsRows.filter(
                lr => lr.requestLocationId == reqLoc.id && lr.requestOffers
              ).length == 0 ||
              futureLocationsRows.filter(
                lr =>
                  lr.requestLocationId == reqLoc.id &&
                  lr.requestOffers?.find(x => !x.isRfqskipped)
              ).length == 0
            ) {
              requestProducts = reqLoc.requestProducts.map(reqPro =>
                requestProductIds.some(x => x.includes(reqPro.id))
                  ? { ...reqPro, status: 'ReOpen' }
                  : reqPro
              );
            }

            return requestProducts ? { ...reqLoc, requestProducts } : reqLoc;
          });
          return requestLocations ? { ...e, requestLocations } : e;
        });
        this.store.dispatch(new UpdateRequest(this.requestOptions));
      }
    });
    //}
  }
  getLocationRowsWithPriceDetails(rowsArray, priceDetailsArray) {
    let currentRequestData: any;
    let counterpartyList: any;
    let requestlist: any;
    this.store.subscribe(({ spotNegotiation, ...props }) => {
      requestlist = spotNegotiation.requests;
      currentRequestData = spotNegotiation.locations;
      counterpartyList = spotNegotiation.counterparties;
    });

    rowsArray.forEach((row, index) => {
      let currentLocProd = currentRequestData.filter(
        row1 => row1.locationId == row.locationId
      );
      let reqLocations = requestlist.filter(req=>req.requestLocations.some(reqloc=>reqloc.id==row.requestLocationId));
      let reqProducts = reqLocations[0].requestLocations.filter(
        row1 => row1.id == row.requestLocationId
      );
      let currentLocProdCount =
        reqProducts.length > 0 ? reqProducts[0].requestProducts.length : 0;
      for (let index = 0; index < currentLocProdCount; index++) {
        let indx = index + 1;
        let val = 'checkProd' + indx;
        row[val] = false;
        row.isSelected = false;
      }
      // Optimize: Check first in the same index from priceDetailsArray; if it's not the same row, we will do the map bind
      if (
        index < priceDetailsArray.length &&
        row.id === priceDetailsArray[index]?.requestLocationSellerId
      ) {
        row.requestOffers = priceDetailsArray[index].requestOffers;
        //row.isSelected = priceDetailsArray[index].isSelected;
        row.physicalSupplierCounterpartyId =
          priceDetailsArray[index].physicalSupplierCounterpartyId;
        if (priceDetailsArray[index].physicalSupplierCounterpartyId) {
          row.physicalSupplierCounterpartyName = counterpartyList.find(
            x => x.id == priceDetailsArray[index].physicalSupplierCounterpartyId
          )?.displayName;
        }
        row.totalOffer = priceDetailsArray[index].totalOffer;
        row.totalCost = priceDetailsArray[index].totalCost;
        this.UpdateProductsSelection(currentLocProd, row);
        row.requestOffers = row.requestOffers?.sort((a,b)=>
        a.requestProductTypeId  === b.requestProductTypeId ?
        (a.requestProductId > b.requestProductId ? 1 : -1) :
       (a.requestProductTypeId > b.requestProductTypeId ? 1 : -1)
       );
        return row;
      }

      // Else if not in the same index
      const detailsForCurrentRow = priceDetailsArray.filter(
        e => e.requestLocationSellerId === row.id
      );

      // We found something
      if (detailsForCurrentRow.length > 0) {
        row.requestOffers = detailsForCurrentRow[0].requestOffers;
        //row.isSelected = detailsForCurrentRow[0].isSelected;
        row.physicalSupplierCounterpartyId =
          detailsForCurrentRow[0].physicalSupplierCounterpartyId;
        if (detailsForCurrentRow[0].physicalSupplierCounterpartyId) {
          row.physicalSupplierCounterpartyName = counterpartyList.find(
            x => x.id == detailsForCurrentRow[0].physicalSupplierCounterpartyId
          )?.displayName;
        }
        row.totalOffer = detailsForCurrentRow[0].totalOffer;
        row.totalCost = detailsForCurrentRow[0].totalCost;
        this.UpdateProductsSelection(currentLocProd, row);
        row.requestOffers = row.requestOffers?.sort((a,b)=>
        a.requestProductTypeId  === b.requestProductTypeId ?
        (a.requestProductId > b.requestProductId ? 1 : -1) :
       (a.requestProductTypeId > b.requestProductTypeId ? 1 : -1)
       );
      }
      return row;
    });

    return rowsArray;
  }

  UpdateProductsSelection(currentLocProd, row) {
    if (currentLocProd.length != 0) {
      let currentLocProdCount = currentLocProd[0].requestProducts.length;
      row.requestOffers.forEach(element1 => {
        let FilterProdut = currentLocProd[0].requestProducts.filter(
          col => col.id == element1.requestProductId
        );
        element1.requestProductTypeId = FilterProdut[0]?.productTypeId;
      });
      for (let index = 0; index < currentLocProdCount; index++) {
        let indx = index + 1;
        let val = 'checkProd' + indx;
        const status = currentLocProd[0].requestProducts[index].status;
        row[val] =
          status === 'Stemmed' || status === 'Confirmed'
            ? false
            : row.isSelected;
        //row[val] = row.isSelected;
      }
    }
  }

  revertChanges() {
    if (this.previewTemplate == null) {
      this.toaster.error('Template does not exists.');
      return;
    }

    if (this.previewTemplate.comment.id === 0) {
      this.toaster.error('No saved template.');
      return;
    } else {
      let requestPayload = {
        Id: this.previewTemplate.comment.id,
        EmailTemplateId: this.previewTemplate.comment.emailTemplate.id,
        // BusinessId: this.previewTemplate.comment.businessId,
        // SecondBusinessId: this.previewTemplate.comment.secondBusinessId,
        // ThirdBusinessId: this.previewTemplate.comment.thirdBusinessId,
        AttachmentsList: this.previewTemplate.attachmentsList
      };

      this.spinner.show();
      const response = this.spotNegotiationService.RevertSavedComments(
        requestPayload
      );
      response.subscribe((res: any) => {
        this.spinner.hide();
        if(res?.message == 'Unauthorized'){
          return;
        }
        if (res) {
          this.getPreviewTemplate();
          this.toaster.success('Changes reverted successfully.');
        }
      });
    }
  }

  validateEmail(inputData:string, type: string){
    const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const validateemail =  regularExpression.test(String(inputData).toLowerCase());
    if(validateemail && type == 'ccMail'){
        this.addCc(inputData, false);
    }
    if(validateemail && type == 'toMail'){
      this.addTo(inputData, false);
    }
    if(!validateemail && type == 'ccMail'){
      this.ccEmail ='';
    }
    if(!validateemail && type == 'toMail' ){
      this.toEmail ='';
    }
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
          Value: 2
        }
      ],
      SearchText: null,
      Pagination: {
        Skip: 0,
        Take: 9999
      }
    };
    this.spinner.show();
    this.spotNegotiationService
      .getDocuments(payload)
      .subscribe((response: any) => {
        if(response?.message == 'Unauthorized'){
          return;
        }
        if (typeof response === 'string') {
          this.spinner.hide();
          this.toaster.error(response);
        } else {
          for (let i = 0; i < response.length; i++) {
            response[i].isIncludedInMail = true;
          }
          this.documentsList = _.cloneDeep(response);
          this.documentListForSearch = _.cloneDeep(response);
        }
      });
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
      let isInList = _.find(this.filesList, v => {
        return v.id == selectedDocument.id;
      });
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
    this.spotNegotiationService.downloadDocument(request).subscribe(
      response => {
        this.spinner.hide();
        this._FileSaverService.save(response, name);
      },
      () => {
        this.spinner.hide();
        this.appErrorHandler.handleError(ModuleError.DocumentDownloadError);
      }
    );
  }

  resetDocumentData() {
    this.searchDocumentModel = null;
    this.documentPopUp = null;
    this.documentListForSearch = _.cloneDeep(this.documentsList);
    this.expandDocumentPopUp = false;
  }
}
