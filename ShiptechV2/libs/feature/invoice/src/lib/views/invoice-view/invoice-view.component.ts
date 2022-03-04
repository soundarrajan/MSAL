import { Subject } from 'rxjs';
import { INewInvoiceDetailsItemRequest } from './../../services/api/dto/invoice-details-item.dto';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KnownInvoiceRoutes } from '../../known-invoice.routes';
import {
  IInvoiceDetailsItemDto,
  IInvoiceDetailsItemRequest,
  IInvoiceDetailsItemResponse
} from '../../services/api/dto/invoice-details-item.dto';
import { InvoiceDetailsService } from '../../services/invoice-details.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { CurrencyConvertorModalComponent } from './details/component/currency-convertor-modal/currency-convertor-modal.component';
import _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';

@Component({
  selector: 'shiptech-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceViewComponent implements OnInit, OnDestroy {
  @ViewChild('invoiceDetails') invoiceDetailsComponent: any;
  @ViewChild('invoiceDetailsToolbar') invoiceDetailsToolbarComponent: any;
  _entityId;
  isConfirm = false;
  detailFormvalues: any;
  displayDetailFormvalues: boolean = false;
  saveDisabled = true;
  tabData: any;
  navBar: any;
  reportUrl: string;
  selectedTab = 0;
  submitreviewBtn: boolean = true;
  submitapproveBtn: boolean = true;
  cancelBtn: boolean = true;
  acceptBtn: boolean = true;
  revertBtn: boolean = true;
  rejectBtn: boolean = true;
  email: any;
  formValues: any;
  staticLists: any;
  currencyList: any;
  private _destroy$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceDetailsService,
    private changeDetectorRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {
    this.getTabDataLinks();
  }

  ngOnInit(): void {
    this.spinner.show();
    this.route.data.subscribe(data => {
      this.navBar = data.navBar;
      this.staticLists = data.staticLists;
      this.currencyList = this.setListFromStaticLists('Currency');
      this._entityId = this.route.snapshot.params[
        KnownInvoiceRoutes.InvoiceIdParam
      ];
      this.getTabDataLinks();
      // http://localhost:9016/#/invoices/invoice/edit/0
      if (localStorage.getItem('invoiceFromDelivery')) {
        // Create new invoice from delivery list // http://localhost:9016/#/invoices/invoice/edit/0
        this.createNewInvoiceFromDelivery();
      } else if (localStorage.getItem('createInvoice')) {
        this.createNewInvoiceType();
      } else if (localStorage.getItem('createCreditNote')) {
        const data = JSON.parse(localStorage.getItem('createCreditNote'));
        this.toastr.success(`${data.noteType} note is Created!`);
        localStorage.removeItem('createCreditNote');
        this.setScreenActions(data);
        this.getDefaultValues();
      } else if (localStorage.getItem('createCreditNoteFromInvoiceClaims')) {
        this.createCreditNoteFromInvoiceClaims(
          'createCreditNoteFromInvoiceClaims'
        );
      } else if (
        localStorage.getItem('createDebunkerCreditNoteFromInvoiceClaims')
      ) {
        this.createCreditNoteFromInvoiceClaims(
          'createDebunkerCreditNoteFromInvoiceClaims'
        );
      } else if (
        localStorage.getItem('createResaleCreditNoteFromInvoiceClaims')
      ) {
        this.createCreditNoteFromInvoiceClaims(
          'createResaleCreditNoteFromInvoiceClaims'
        );
      } else if (
        localStorage.getItem('createPreclaimCreditNoteFromInvoiceClaims')
      ) {
        this.createPreClaimCreditNote();
      } else {
        // edit an existing invoice
        this.getInvoiceItem();
      }
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  getTabDataLinks() {
    this._entityId = this.route.snapshot.params[
      KnownInvoiceRoutes.InvoiceIdParam
    ];
    this.tabData = [
      { disabled: false, name: 'Details' },
      { disabled: false, name: 'Related Invoices' },
      { disabled: false, name: 'Documents', url: `#` },
      { disabled: false, name: 'Audit Log', url: `#` },
      { disabled: false, name: 'Email Log', url: `#` }
    ];

    if (parseFloat(this._entityId) && this._entityId > 0) {
      const baseOrigin = new URL(window.location.href).origin;
      this.tabData[2].url = `${baseOrigin}/#/invoices/invoice/documents/${this._entityId}`;
      this.tabData[3].url = `${baseOrigin}/#/invoices/invoice/audit-log/${this._entityId}`;
      this.tabData[4].url = `${baseOrigin}/#/invoices/invoice/email-log/${this._entityId}`;
      this.reportUrl = `${baseOrigin}/#/reports/ordertoinvoice/IID=${this._entityId}`;
    }
  }

  setListFromStaticLists(name) {
    const findList = _.find(this.staticLists, function(object) {
      return object.name == name;
    });
    if (findList != -1) {
      return findList?.items;
    }
  }

  detailsSave() {
    this.invoiceDetailsComponent.saveInvoiceDetails(result => {
      let params = {
        invoiceId: result
      };
      this.invoiceDetailsToolbarComponent.setNavIds(params);
    });
    // this.isConfirm = !this.isConfirm;
  }
  invoiceOptions(options) {
    this.invoiceDetailsComponent.invoiceOptionSelected(options);
  }

  getInvoiceItem() {
    if (!this._entityId || this._entityId == 0) return;
    this.invoiceService
      .getInvoicDetails(this._entityId)
      .subscribe((response: any) => {
        this.setScreenActions(response);
      });
  }

  createNewInvoiceFromDelivery() {
    const data = JSON.parse(localStorage.getItem('invoiceFromDelivery'));
    localStorage.removeItem('invoiceFromDelivery');

    this.invoiceService
      .getNewInvoicDetails(data)
      .subscribe((response: IInvoiceDetailsItemResponse) => {
        (<any>window).isNewFromDelivery = true;
        this.setScreenActions(response);
        this.getDefaultValues();
      });
  }

  createCreditNoteFromInvoiceClaims(storageKey: string) {
    this.invoiceService
      .createCreditNoteFromInvoiceClaims(
        JSON.parse(localStorage.getItem(storageKey))
      )
      .subscribe((result: any) => {
        if (typeof result == 'string') {
          this.toastr.error('Could not create credit/debit note!', result);
        } else {
          this.toastr.success('Credit/Debit note is Created!');
          this.setScreenActions(result);
        }
      });
    localStorage.removeItem(storageKey);
  }

  createPreClaimCreditNote() {
    this.invoiceService
      .createPreClaimCreditNote(
        JSON.parse(
          localStorage.getItem('createPreclaimCreditNoteFromInvoiceClaims')
        )
      )
      .subscribe((result: any) => {
        if (typeof result == 'string') {
          this.toastr.error(result);
        } else {
          this.toastr.success('Pre Claim Credit note is Created!');
          this.setScreenActions(result);
        }
      });

    localStorage.removeItem('createPreclaimCreditNoteFromInvoiceClaims');
  }

  createNewInvoiceType() {
    const data = JSON.parse(localStorage.getItem('createInvoice'));
    localStorage.removeItem('createInvoice');

    // 2 - Final Invoice - Get provisional invoice data, if final invoice is created from provisional
    if (data.documentType.id == 2 && data.previousDocumentType.id == 1) {
      data.invoiceSummary.provisionalInvoiceNo = data.id;
      data.invoiceSummary.provisionalInvoiceAmount =
        data.invoiceSummary.invoiceAmountGrandTotal;
    } else {
      data.invoiceSummary.provisionalInvoiceNo = '';
      data.invoiceSummary.provisionalInvoiceAmount = null;
    }
    data.id = 0;
    data.invoiceDetails = null;
    data.documentNo = null;
    data.dueDate = null;
    data.invoiceDate = `${
      moment(new Date())
        .format('YYYY-MM-DDTHH:mm:ss')
        .split('T')[0]
    }T00:00:00`;
    data.invoiceSummary.deductions = null;
    // data.paymentDate = null;
    data.accountNumber = null;
    data.paymentDetails.paidAmount = null;
    data.paymentDetails = null;
    data.invoiceDetails = null;
    data.sellerInvoiceNo = null;
    data.receivedDate = null;
    data.manualDueDate = null;
    data.sellerInvoiceDate = null;
    data.sellerDueDate = null;
    data.approvedDate = null;
    // data.invoiceRateCurrency = null;
    data.backOfficeComments = null;
    data.invoiceSummary.invoiceAmountGrandTotal = null;
    data.invoiceSummary.estimatedAmountGrandTotal = null;
    data.invoiceSummary.totalDifference = null;
    data.status = {};
    data.customStatus = null;
    data.accountancyDate = null;
    data.paymentDetails = {};
    const invoiceAmountGrandTotal = 0;
    const deductions = 0;

    data.invoiceSummary.netPayable = invoiceAmountGrandTotal - deductions;
    const deliveryProductIds = [];
    data.productDetails.forEach((v, k) => {
      v.id = 0;
      v.invoiceRate = 0;
      v.description = null;
      v.pricingDate = null;
      v.invoiceAmount = null;
      v.reconStatus = null;
      v.amountInInvoice = null;
      v.pricingDate = v.orderProductPricingDate;
      deliveryProductIds.push(v.deliveryProductId);
    });

    if (data.costDetails) {
      data.costDetails.forEach((v, k) => {
        v.id = 0;
        v.invoiceRate = null;
        v.invoiceExtras = null;
        v.description = null;
        v.invoiceAmount = null;
        // if (v.product) {
        //   if (v.product.id != -1) {
        //     if (v.product.id != v.deliveryProductId) {
        //       v.product.productId = v.product.id;
        //       v.product.id = v.deliveryProductId;
        //     }
        //   }
        // } else {
        //   v.product = {
        //     id : -1,
        //   };
        // }
      });
    }
    data.counterpartyDetails.paymentTerm =
      data.counterpartyDetails.orderPaymentTerm;
    data.deliveryDate = data.orderDeliveryDate;
    data.orderDetails.carrierCompany = data.orderDetails.orderCarrierCompany;
    data.orderDetails.paymentCompany = data.orderDetails.orderPaymentCompany;
    data.invoiceChecks = null;

    this.displayDetailFormvalues = false;
    this.spinner.show();
    const requestPayload = {
      DeliveryProductIds: deliveryProductIds,
      OrderId: data.orderDetails.order.id
    };
    this.invoiceService
      .getFinalInvoiceDueDates(requestPayload)
      .subscribe((response: any) => {
        if (response) {
          data.dueDate = response.dueDate;
          data.paymentDate = response.paymentDate;
          data.workingDueDate = response.workingDueDate;
        }
        this.setScreenActions(data);
      });
  }

  setScreenActions(formValues: any) {
    this.cancelBtn = true;
    this.submitreviewBtn = true;
    this.saveDisabled = true;
    this.rejectBtn = true;
    this.revertBtn = true;
    this.acceptBtn = true;
    this.submitapproveBtn = true;

    this.displayDetailFormvalues = true;
    this.spinner.hide();
    this.detailFormvalues = <IInvoiceDetailsItemDto>formValues;
    this.detailFormvalues?.screenActions?.forEach(action => {
      if (action.name == 'Cancel') {
        this.cancelBtn = false;
      } else if (action.name == 'SubmitForReview') {
        this.submitreviewBtn = false;
      } else if (action.name == 'ApproveInvoice') {
        this.saveDisabled = false;
      } else if (action.name == 'RejectInvoice') {
        this.rejectBtn = false;
      } else if (action.name == 'Revert') {
        this.revertBtn = false;
      } else if (action.name == 'Accept') {
        this.acceptBtn = false;
      } else if (action.name == 'SubmitForApprovalInvoice') {
        this.submitapproveBtn = false;
      }
    });
    this.changeDetectorRef.detectChanges();
  }

  getDefaultValues() {
    const requestPayload = this.invoiceDetailsComponent.formValues.orderDetails
      .order.id;
    this.invoiceService
      .getDefaultValues(requestPayload)
      .subscribe((response: any) => {
        if (response) {
          this.invoiceDetailsComponent.gotDefaultValues = true;
          this.invoiceDetailsComponent.formValues.counterpartyDetails.customer =
            response.customer;
          this.invoiceDetailsComponent.formValues.counterpartyDetails.payableTo =
            response.payableTo;
          this.changeDetectorRef.detectChanges();
          this.invoiceDetailsComponent.getBankAccountNumber();
          setTimeout(() => {
            this.invoiceDetailsComponent.formValues.counterpartyDetails.counterpartyBankAccount =
              response.bankAccount;
            this.changeDetectorRef.detectChanges();
          });
        }
      });
  }

  openCurrencyConversionPopUp() {
    if (
      this.invoiceDetailsComponent.conversionTo.id ==
      this.invoiceDetailsComponent.formValues.invoiceRateCurrency.id
    ) {
      this.invoiceDetailsComponent.conversionRoe = 1;
      this.invoiceDetailsComponent.roeDisabled = true;
    } else {
      this.invoiceDetailsComponent.roeDisabled = false;
    }

    this.computeInvoiceTotalConversion(
      this.invoiceDetailsComponent.conversionRoe,
      this.invoiceDetailsComponent.conversionTo
    );
  }

  computeInvoiceTotalConversion(conversionRoe, conversionTo) {
    if (
      this.invoiceDetailsComponent.formValues.invoiceRateCurrency.id ==
      this.invoiceDetailsComponent.conversionTo.id
    ) {
      this.invoiceDetailsComponent.roeDisabled = true;
      this.invoiceDetailsComponent.conversionRoe = 1;
    } else {
      this.invoiceDetailsComponent.roeDisabled = false;
    }
    this.changeDetectorRef.detectChanges();
    if (
      !conversionRoe ||
      !conversionTo /* || !this.formValues.invoiceSummary*/
    ) {
      return false;
    }
    if (
      typeof this.invoiceDetailsComponent.changedFromCurrency == 'undefined'
    ) {
      this.invoiceDetailsComponent.changedFromCurrency = false;
    }

    if (!this.invoiceDetailsComponent.formValues.invoiceSummary) {
      return;
    }

    const payloadData = {
      Amount: this.invoiceDetailsComponent.formValues.invoiceSummary
        .invoiceAmountGrandTotal,
      CurrencyId: this.invoiceDetailsComponent.formValues.invoiceRateCurrency
        .id,
      ROE: conversionRoe,
      ToCurrencyId: conversionTo.id,
      CompanyId: this.invoiceDetailsComponent.formValues.orderDetails
        .carrierCompany.id,
      GetROE: this.invoiceDetailsComponent.changedFromCurrency
    };

    this.invoiceService
      .computeInvoiceTotalConversion(payloadData)
      .pipe(finalize(() => {}))
      .subscribe((result: any) => {
        if (typeof result == 'string') {
          this.toastr.error(result);
        } else {
          if (
            this.invoiceDetailsComponent.changedFromCurrency &&
            !result.getROE
          ) {
            this.toastr.warning(
              'There is no conversion rate available for current selection'
            );
          } else {
            this.invoiceDetailsComponent.convertedAmount =
              result.convertedAmount;
            this.invoiceDetailsComponent.conversionRoe = result.roe;
            const dialogRef = this.dialog.open(
              CurrencyConvertorModalComponent,
              {
                width: '50%',
                data: {
                  formValues: this.detailFormvalues,
                  currencyList: this.currencyList,
                  convertedAmount: this.invoiceDetailsComponent.convertedAmount,
                  conversionTo: this.invoiceDetailsComponent.conversionTo,
                  conversionRoe: this.invoiceDetailsComponent.conversionRoe,
                  roeDisabled: this.invoiceDetailsComponent.roeDisabled
                }
              }
            );

            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.invoiceDetailsComponent.convertedAmount = this.convertDecimalSeparatorStringToNumber(
                  result.convertedAmount
                );
                this.invoiceDetailsComponent.conversionTo = result.conversionTo;
                this.invoiceDetailsComponent.conversionRoe =
                  result.conversionRoe;
                this.invoiceDetailsComponent.roeDisabled = result.roeDisabled;
              }
            });
            this.changeDetectorRef.detectChanges();
          }
        }
      });
    this.invoiceDetailsComponent.changedFromCurrency = false;
    this.changeDetectorRef.detectChanges();
  }

  convertDecimalSeparatorStringToNumber(number) {
    let numberToReturn = number;
    let decimalSeparator, thousandsSeparator;
    if (typeof number == 'string') {
      if (number.indexOf(',') != -1 && number.indexOf('.') != -1) {
        if (number.indexOf(',') > number.indexOf('.')) {
          decimalSeparator = ',';
          thousandsSeparator = '.';
        } else {
          thousandsSeparator = ',';
          decimalSeparator = '.';
        }
        numberToReturn =
          parseFloat(
            number
              .split(decimalSeparator)[0]
              .replace(new RegExp(thousandsSeparator, 'g'), '')
          ) + parseFloat(`0.${number.split(decimalSeparator)[1]}`);
      } else {
        numberToReturn = parseFloat(number);
      }
    }
    if (isNaN(numberToReturn)) {
      numberToReturn = 0;
    }
    return parseFloat(numberToReturn);
  }

  getInvoiceDetailsChanged() {
    this.spinner.show();
    this.displayDetailFormvalues = false;
    this.getInvoiceItem();
  }
}
