import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import { SpotNegotiationService } from '../../../../../../../../../spot-negotiation/src/lib/services/spot-negotiation.service';
import {
  SetLocationsRows,
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
    });
    if (this.selected) {
      this.getPreviewTemplate();
      this.getDocumentsList();
    }
  }

  getPreviewTemplate() {
    if (this.selected != 'MultipleRfqNewRFQEmailTemplate') {
      if (
        this.SelectedSellerWithProds.requestOffers == undefined ||
        this.SelectedSellerWithProds.requestOffers?.length === 0
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
        this.SelectedSellerWithProds.requestOffers?.filter(
          off => off.isRfqskipped === false
        ).length === 0
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
        !this.SelectedSellerWithProds.requestOffers?.some(x => x.price != null)
      ) {
        this.toaster.error(
          'Atleast 1 offer price should be captured in order to requote.'
        );
        this.clearData();
        return;
      }
    }
    // let requestProducts: any;
    // if(this.SelectedSellerWithProds.requestOffers?.length > 0){
    //   requestProducts = this.SelectedSellerWithProds.requestOffers?.filter(row => row.isRfqskipped === false)
    //   .map(prod =>
    //     prod.requestProductId
    //   );
    // }
    // else{
    //   requestProducts = this.currentRequestInfo.requestLocations.filter(loc => loc.id === this.SelectedSellerWithProds.requestLocationId
    //     ).map(prod =>
    //       prod.requestProducts.map(i =>i.id)
    //     )[0];
    // }
    if (!this.readonly) {
      var FinalAPIdata = {
        RequestLocationSellerId: this.SelectedSellerWithProds.id,
        RequestId: this.SelectedSellerWithProds.requestId,
        CounterpartyId: this.SelectedSellerWithProds.sellerCounterpartyId,
        CounterpartyName: this.SelectedSellerWithProds.sellerCounterpartyName,
        RequestProductIds: this.currentRequestInfo.requestLocations
          .filter(
            loc => loc.id === this.SelectedSellerWithProds.requestLocationId
          )
          .map(prod =>
            prod.requestProducts
              .map((e, i) =>
                this.SelectedSellerWithProds['checkProd' + (i + 1)] &&
                (!this.SelectedSellerWithProds.requestOffers ||
                  this.SelectedSellerWithProds.requestOffers?.find(
                    x =>
                      (x.requestProductId == e.id &&
                        !x.isRfqskipped &&
                        !x.isDeleted) ||
                      x.requestProductId != e.id
                  ))
                  ? e.id
                  : undefined
              )
              .filter(x => x)
          )[0],
        RfqId:
          this.SelectedSellerWithProds.requestOffers?.length > 0
            ? this.SelectedSellerWithProds.requestOffers[0].rfqId
            : 0,
        TemplateName: this.selected,
        QuoteByDate: new Date(this.spotNegotiationService.QuoteByDate)
      };

      this.spinner.show();
      // Get response from server
      const response = this.spotNegotiationService.PreviewRfqMail(FinalAPIdata);
      response.subscribe((res: any) => {
        this.spinner.hide();
        if (res['previewResponse']) {
          this.previewTemplate = res['previewResponse'];
          //this.rfqTemplate = this.previewTemplate
          this.to = this.previewTemplate.to.map(to => to.idEmailAddress);
          this.cc = this.previewTemplate.cc.map(cc => cc.idEmailAddress);
          this.subject = this.previewTemplate.subject;
          this.content = this.previewTemplate.content;
          this.from = this.previewTemplate.From;
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
  addTo(item) {
    this.to.push(item);
    if (this.previewTemplate == null) {
      this.previewTemplate = [];
    }
    if (
      this.previewTemplate.to == undefined ||
      this.previewTemplate.to == null
    ) {
      this.previewTemplate.to = [];
      this.previewTemplate.to.push({ IdEmailAddress: item });
    } else {
      this.previewTemplate.to.push({ IdEmailAddress: item });
    }
    this.toEmail = '';
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

  addCc(item) {
    this.cc.push(item);
    if (this.previewTemplate == null) {
      this.previewTemplate = [];
    }
    if (
      this.previewTemplate.cc == undefined ||
      this.previewTemplate.cc == null
    ) {
      this.previewTemplate.cc = [];
      this.previewTemplate.cc.push({ IdEmailAddress: item });
    } else {
      this.previewTemplate.cc.push({ IdEmailAddress: item });
    }
    this.ccEmail = '';
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

    var selectedSellers = [
      {
        RequestLocationSellerId: this.SelectedSellerWithProds.id,
        RequestLocationID: this.SelectedSellerWithProds.requestLocationId,
        LocationID: this.SelectedSellerWithProds.locationId,
        SellerId: this.SelectedSellerWithProds.sellerCounterpartyId,
        RfqId:
          this.SelectedSellerWithProds.requestOffers?.length > 0
            ? this.SelectedSellerWithProds.requestOffers[0].rfqId
            : 0,
        RequestId: this.SelectedSellerWithProds.requestId,
        PhysicalSupplierCounterpartyId: this.SelectedSellerWithProds
          .physicalSupplierCounterpartyId,
        RequestProductIds: this.currentRequestInfo.requestLocations
          .filter(
            loc => loc.id === this.SelectedSellerWithProds.requestLocationId
          )
          .map(prod => prod.requestProducts.map(i => i.id))[0]
      }
    ];

    this.previewTemplate.subject = this.subject;
    this.previewTemplate.content = this.content;
    this.previewTemplate.From = this.from;
    this.previewTemplate.AttachmentsList = this.filesList;

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

        const futureLocationsRows = this.getLocationRowsWithPriceDetails(
          locationsRows,
          res['sellerOffers']
        );
        this.store.dispatch(new SetLocationsRows(futureLocationsRows));

        this.changeDetector.detectChanges();
      }
    });
    //}
  }
  getLocationRowsWithPriceDetails(rowsArray, priceDetailsArray) {
    let currentRequestData: any;
    let counterpartyList: any;
    let requestlist:any;
    this.store.subscribe(({ spotNegotiation, ...props }) => {
      requestlist= spotNegotiation.requests;
      currentRequestData = spotNegotiation.locations;
      counterpartyList = spotNegotiation.counterparties;
    });

    rowsArray.forEach((row, index) => {
      let currentLocProd = currentRequestData.filter(
        row1 => row1.locationId == row.locationId
      );
      let reqLocations = requestlist.filter(row1 => row1.id == row.requestId );
      let reqProducts= reqLocations[0].requestLocations.filter(row1 => row1.id == row.requestLocationId );
      let currentLocProdCount = reqProducts.length>0?reqProducts[0].requestProducts.length:0;
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
        row.requestOffers = priceDetailsArray[
          index
        ].requestOffers?.sort((a, b) =>
          a.requestProductId > b.requestProductId ? 1 : -1
        );
        //row.isSelected = priceDetailsArray[index].isSelected;
        row.physicalSupplierCounterpartyId = priceDetailsArray[index].physicalSupplierCounterpartyId;
        if (priceDetailsArray[index].physicalSupplierCounterpartyId) {
          row.physicalSupplierCounterpartyName = counterpartyList.find(
            x => x.id == priceDetailsArray[index].physicalSupplierCounterpartyId
          )?.displayName;
        }
        row.totalOffer = priceDetailsArray[index].totalOffer;
        row.totalCost = priceDetailsArray[index].totalCost;
        this.UpdateProductsSelection(currentLocProd, row);

        return row;
      }

      // Else if not in the same index
      const detailsForCurrentRow = priceDetailsArray.filter(
        e => e.requestLocationSellerId === row.id
      );

      // We found something
      if (detailsForCurrentRow.length > 0) {
        row.requestOffers = detailsForCurrentRow[0].requestOffers?.sort(
          (a, b) => (a.requestProductId > b.requestProductId ? 1 : -1)
        );
        //row.isSelected = detailsForCurrentRow[0].isSelected;
        row.physicalSupplierCounterpartyId =
          detailsForCurrentRow[0].physicalSupplierCounterpartyId;
        if (detailsForCurrentRow[0].physicalSupplierCounterpartyId) {
          row.physicalSupplierCounterpartyName = counterpartyList.find(
            x => x.id == detailsForCurrentRow[0].physicalSupplierCounterpartyId
          ).displayName;
        }
        row.totalOffer = detailsForCurrentRow[0].totalOffer;
        row.totalCost = detailsForCurrentRow[0].totalCost;
        this.UpdateProductsSelection(currentLocProd, row);
      }
      return row;
    });

    return rowsArray;
  }

  UpdateProductsSelection(currentLocProd, row) {
    if (currentLocProd.length != 0) {
      let currentLocProdCount = currentLocProd[0].requestProducts.length;
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
        if (res) {
          this.getPreviewTemplate();
          this.toaster.success('Changes reverted successfully.');
        }
      });
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
        if (typeof response === 'string') {
          this.spinner.hide();
          this.toaster.error(response);
        } else {
          console.log(response);
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
    console.log(filterDocumentType);
    this.documentListForSearch = [...filterDocumentType];
  }

  addFilesList($event: MatRadioChange) {
    if ($event.value) {
      console.log($event.value);
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
        console.log(this.filesList);
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
