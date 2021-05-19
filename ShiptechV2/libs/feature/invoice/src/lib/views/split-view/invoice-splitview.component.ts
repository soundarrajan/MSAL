import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KnownInvoiceRoutes } from '../../known-invoice.routes';
import { IInvoiceDetailsItemDto, IInvoiceDetailsItemRequest, IInvoiceDetailsItemResponse } from '../../services/api/dto/invoice-details-item.dto';
import { InvoiceDetailsService } from '../../services/invoice-details.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { indexOf } from 'lodash';

@Component({
    selector: 'shiptech-invoice-view',
    templateUrl: './invoice-splitview.component.html',
    styleUrls: ['./invoice-splitview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceSplitviewComponent implements OnInit, OnDestroy {

    _entityId;
    // invoiceSubmitState: EsubmitMode;
    isConfirm = false;
    isLoading = true;
    detailFormvalues: any;
    displayDetailFormvalues: boolean = false;
    saveDisabled = true;
    tabData: any;
    PdfViewerModule: any;
    navBar: any;
    currentInvoice: any;
    previousInvoice: any;
    nextInvoice: any;
    invoiceIds = this.activatedRoute.snapshot.params.invoiceIds.split(",");
   
    constructor(private route: ActivatedRoute, private invoiceService: InvoiceDetailsService, private changeDetectorRef: ChangeDetectorRef, private PdfViewerModule: PdfViewerModule, private activatedRoute: ActivatedRoute) {
        // this._entityId = route.snapshot.params[KnownInvoiceRoutes.InvoiceIdParam];
    }

    pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";

    ngOnInit(): void {
        console.log(this.invoiceIds);
        this.setCurrentInvoice();
    }

    
    ngOnDestroy(): void {
    }
    
    setCurrentInvoice(invoiceId : any) {
        if(invoiceId) {
            this.currentInvoice = invoiceId;
            var indexOfCurrentInvoice = this.invoiceIds.indexOf(invoiceId);
        } else {
            this.currentInvoice = this.invoiceIds[0];
            indexOfCurrentInvoice = 0;
        }
        this.nextInvoice = indexOfCurrentInvoice+1;
        this.previousInvoice = indexOfCurrentInvoice-1;
        if (indexOfCurrentInvoice == 0 ) {
            this.previousInvoice = false;
        } 
        if (indexOfCurrentInvoice == this.invoiceIds.length - 1) {
            this.nextInvoice = false;
        }
    }     

    
}

