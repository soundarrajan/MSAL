/* eslint-disable @typescript-eslint/tslint/config */
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
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { indexOf } from 'lodash';
import { ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import _ from 'lodash';

@Component({
  selector: 'shiptech-invoice-view',
  templateUrl: './invoice-splitview.component.html',
  styleUrls: ['./invoice-splitview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class InvoiceSplitviewComponent implements OnInit, OnDestroy {
  _entityId;
  isConfirm = false;
  isLoading = true;
  displayDetailFormvalues: boolean = false;
  saveDisabled = true;
  tabData: any;
  canApprove: boolean = false;
  canReject: boolean = false;
  noPdfAvailable: boolean = false;
  detailFormvalues: any;
  PdfViewerModule: any;
  navBar: any;
  currentInvoice: any;
  previousInvoice: any;
  nextInvoice: any;
  noMoreInvoices: boolean = false;

  invoiceIds = this.activatedRoute.snapshot.params.invoiceIds.split(',');
  // pdfSrc = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  pdfSrc: string;
  rotation = 0;
  zoom = 1;
  zoomScale = 'page-width';
  zoomOptions = [25, 50, 75, 100, 125, 150, 200, 300, 400];
  zoomOption = 100;
  zoomOptionIndex = 3;
  switchTheme: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceDetailsService,
    private changeDetectorRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.setCurrentInvoice();
  }

  getInvoiceItem(invoiceId) {
    if (!invoiceId || invoiceId == 0) {
      return;
    }
    this.canApprove = false;
    this.canReject = false;
    this.detailFormvalues = false;
    this.changeDetectorRef.detectChanges();

    this.invoiceService
      .getInvoicDetails(invoiceId)
      .subscribe((response: any) => {
        this.detailFormvalues = <IInvoiceDetailsItemDto>response;
        if (this.detailFormvalues.screenActions) {
          this.detailFormvalues.screenActions.forEach(action => {
            if (action.name == 'ApproveInvoice') {
              this.canApprove = true;
            } else if (action.name == 'RejectInvoice') {
              this.canReject = true;
            }
          });
        }
        this.changeDetectorRef.detectChanges();
      });

    this.noPdfAvailable = false;

    this.invoiceService
      .getPhysicalInvoice(invoiceId)
      .subscribe((response: any) => {
        if (response.byteLength == 0) {
          this.noPdfAvailable = true;
          this.toastr.warning('No Document to display');
        } else {
          this.pdfSrc = response;
        }
        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy(): void {}

  setCurrentInvoice(invoiceId = false) {
    if (invoiceId) {
      this.currentInvoice = invoiceId;
      var indexOfCurrentInvoice = this.invoiceIds.indexOf(invoiceId);
    } else {
      this.currentInvoice = this.invoiceIds[0];
      indexOfCurrentInvoice = 0;
    }
    this.nextInvoice = indexOfCurrentInvoice + 1;
    this.previousInvoice = indexOfCurrentInvoice - 1;
    if (indexOfCurrentInvoice == 0) {
      this.previousInvoice = false;
    }
    if (indexOfCurrentInvoice == this.invoiceIds.length - 1) {
      this.nextInvoice = false;
    }

    this.resetPdfViewerOptions();
    this.getInvoiceItem(this.currentInvoice);
  }

  resetPdfViewerOptions() {
    this.rotation = 0;
    this.zoom = 1;
    this.zoomOption = 100;
    this.zoomOptionIndex = 3;
  }

  approveInvoiceItem() {
    if (this.detailFormvalues.counterpartyDetails.counterpartyBankAccount) {
      if (
        this.detailFormvalues.counterpartyDetails.counterpartyBankAccount.id ==
          undefined ||
        this.detailFormvalues.counterpartyDetails.counterpartyBankAccount.id ==
          0
      ) {
        this.detailFormvalues.counterpartyDetails.counterpartyBankAccount = null;
      }
    }

    this.setAdditionalCostLine();
    this.invoiceService
      .approveInvoiceItem(this.detailFormvalues)
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastr.error(response);
        } else {
          this.toastr.success('Invoiced Approved!');
          const nextInvoiceId = this.invoiceIds[this.nextInvoice];
          const prevInvoiceId = this.invoiceIds[this.nextInvoice];
          if (this.nextInvoice !== false) {
            this.invoiceIds.splice(
              this.invoiceIds.indexOf(this.currentInvoice),
              1
            );
            this.setCurrentInvoice(nextInvoiceId);
          } else if (this.previousInvoice !== false) {
            this.invoiceIds.splice(
              this.invoiceIds.indexOf(this.currentInvoice),
              1
            );
            this.setCurrentInvoice(prevInvoiceId);
          } else {
            this.noMoreInvoices = true;
            this.changeDetectorRef.detectChanges();
          }
        }
      });
  }

  setAdditionalCostLine() {
    const validCostDetails = [];
    if (this.detailFormvalues.costDetails.length > 0) {
      this.detailFormvalues.costDetails.forEach((v, k) => {
        if (typeof v.product != 'undefined' && v.product != null) {
          if (v.product.id == -1) {
            v.product = null;
            v.deliveryProductId = null;
          } else {
            if (v.product.productId) {
              v.product.id = v.product.productId;
            }
            if (v.product.deliveryProductId) {
              v.deliveryProductId = v.product.deliveryProductId;
            }
            if (!v.product.productId) {
              v.product = null;
            }
            v.isAllProductsCost = false;
          }
        }
        if (
          (Boolean(v.id) && !(v.id == 0 && v.isDeleted)) ||
          (!v.Id && !v.isDeleted)
        ) {
          // v.isDeleted = false;
          validCostDetails.push(v);
        }
      });
    }
    // console.log(validCostDetails);
    this.detailFormvalues.costDetails = _.cloneDeep(validCostDetails);

    this.changeDetectorRef.detectChanges();
  }
  rejectInvoiceItem() {
    this.invoiceService
      .rejectInvoiceItem(this.currentInvoice)
      .subscribe((response: any) => {
        if (typeof response == 'string') {
          this.toastr.error(response);
        } else {
          this.toastr.success('Invoiced Rejected!');
          const nextInvoiceId = this.invoiceIds[this.nextInvoice];
          const prevInvoiceId = this.invoiceIds[this.nextInvoice];
          if (this.nextInvoice !== false) {
            this.invoiceIds.splice(
              this.invoiceIds.indexOf(this.currentInvoice),
              1
            );
            this.setCurrentInvoice(nextInvoiceId);
          } else if (this.previousInvoice !== false) {
            this.invoiceIds.splice(
              this.invoiceIds.indexOf(this.currentInvoice),
              1
            );
            this.setCurrentInvoice(prevInvoiceId);
          } else {
            this.noMoreInvoices = true;
            this.changeDetectorRef.detectChanges();
          }
        }
      });
  }

  rotateClockWiseDoc() {
    this.rotation += 90;
  }

  rotateAntiClockWiseDoc() {
    this.rotation -= 90;
  }

  zoomIn() {
    if (this.zoomOptionIndex < 8) {
      this.zoomOptionIndex += 1;
      this.zoomOption = this.zoomOptions[this.zoomOptionIndex];
      this.zoom = (this.zoomOption / 25) * 0.25;
    }
  }

  zoomOut() {
    if (this.zoomOptionIndex > 0) {
      this.zoomOptionIndex -= 1;
      this.zoomOption = this.zoomOptions[this.zoomOptionIndex];
      this.zoom = (this.zoomOption / 25) * 0.25;
    }
  }

  selectZoomLevel(value) {
    const findIndex = _.findIndex(this.zoomOptions, function(obj) {
      return obj === value;
    });
    if (findIndex !== -1) {
      this.zoomOptionIndex = findIndex;
      this.zoomOption = this.zoomOptions[this.zoomOptionIndex];
      this.zoom = (this.zoomOption / 25) * 0.25;
    }
  }
}
