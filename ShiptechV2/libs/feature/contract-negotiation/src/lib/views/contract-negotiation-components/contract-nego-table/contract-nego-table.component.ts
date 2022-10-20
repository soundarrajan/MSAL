import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { FormControl, FormGroup } from '@angular/forms';
import { FormulaPricingPopupComponent } from '../contract-negotiation-popups/formula-pricing-popup/formula-pricing-popup.component';
import { LocalService } from '../../../services/local-service.service';
import { AdditionalCostPopupComponent } from '../contract-negotiation-popups/additional-cost-popup/additional-cost-popup.component';
import { SellerratingpopupComponent } from '@shiptech/core/ui/components/designsystem-v2/dialog-popup/sellerratingpopup/sellerratingpopup.component';
import { ModifyOfferPeriodPopupComponent } from '../contract-negotiation-popups/modify-offer-period-popup/modify-offer-period-popup.component';
import { EmailPreviewPopupComponent } from '../contract-negotiation-popups/email-preview-popup/email-preview-popup.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contract-nego-table',
  templateUrl: './contract-nego-table.component.html',
  styleUrls: ['./contract-nego-table.component.scss']
})
export class ContractNegoTableComponent implements OnInit {

  @Input() contractData;
  @Input() periodicity;
  @Input() locationId;
  @Input() chipSelected;
  @Input() rfqSent;
  @Input() noQuote;
  @Input() sendToApprove;
  @ViewChild('picker') picker;
  @ViewChild('timepicker') timepicker: ElementRef<HTMLElement>;
  
  public dark:boolean = false;
  public params: any;
  dummyId = 121;
  noQuoteRow = '';
  // periodicity = 'M';
  rowData = [];
  allComplete: boolean = false;
  coln = ["Name", "Gen. Rating", "Port Rating", "Product", "Spec.", "Qty min.",
    "Qty max.", "Off.Pr($/MT)", "Validity"];
  colnPeriod = ["M1", "M2", "M3", "M4", "M5", "M6"];
  colnMonthly = ["M1", "M2", "M3", "M4", "M5", "M6"];
  colnQuarterly = ["Q1", "Q2", "Q3", "Q4"];
  fdColn = ["Name", "Gen. Rating", "Port Rating", "Product", "Total Contract Amt.", "Formula Description", "Schedule", "Premium", "Add. Costs", "Remarks"];
  hideSelectionPopup: boolean = true;
  dataSource = [
    { product: 'DMB MAX 0.1 %S', type: 'LSFO' },
    { product: 'DMA MAX 1%', type: 'DOGO' },
    { product: 'DMA MAX 1.5 %S', type: 'LSFO' },
    { product: 'RMG 380 MAX 0.5 %S', type: 'VLSFO' }
  ];
  displayedColumns: string[] = ['product', 'type'];
  currencyArr = [
    { key: '$', abbriviation: 'USD' },
    { key: '€', abbriviation: 'EURO' },
    { key: '£', abbriviation: 'GBP' },
    { key: '¥', abbriviation: 'YEN' }
  ];
  unitArr = [
    { key: 'MT', abbriviation: 'MT' },
    { key: 'BBL', abbriviation: 'BBL' },
    { key: 'GAL', abbriviation: 'GAL' }
  ];

  // Status
  // 0-Offers
  // 1-Awaiting Approval
  // 2-Approved
  // 3-Rejected
  // 4-Contratced

  constructor(public dialog: MatDialog, private localService: LocalService, private toaster: ToastrService) {
  }
  
  ngOnInit(): void {
    // this.initialDate.setValue(new Date('12/09/2022'));
    console.log('contractData:::', this.contractData);
    this.localService.sendRFQUpdate.subscribe((r) => {
      if (r == true) {
        this.contractData.forEach((item) => {
          if (item.check) {
            item.rfqStatus = true;
            item.check = false;
          }
        });
        if (this.allComplete) {
          this.allComplete = false;
        }
        this.localService.updateSendRFQStatus(false);
      }

    })
    // this.localService.contractPeriodicityUpdate.subscribe((p) => {
    //   this.periodicity = p;
    //   if (p == 'M') {
    //     this.colnPeriod = this.colnMonthly;
    //   }
    //   else if (p == 'Q') {
    //     this.colnPeriod = this.colnQuarterly;
    //   }
    // });
    this.localService.contractStatusUpdate.subscribe((status) => {
      this.updateData(status);
    });
    this.localService.calculatePriceUpdate.subscribe((status) => {
      if (status) {
        this.contractData.forEach(data => data.priceCalculated = true);
        this.localService.updatecalculatePriceStatus(false);
      }
    });
    // this.localService.contractNoQuote.subscribe((data) => {
    //   if (data) {
    //     this.contractData.forEach((item) => {
    //       if (item.id == this.noQuoteRow) {
    //         item.noQuote = this.noQuote;
    //         item.rfqStatus = true;
    //       }
    //     })
    //   }
    // })

  }
  ngAfterViewInit() {

  }
  ngOnChanges() {
    if (this.periodicity == 'M') {
          this.colnPeriod = this.colnMonthly;
        }
        else if (this.periodicity == 'Q') {
          this.colnPeriod = this.colnQuarterly;
        }
    this.arrangeData();

  }
  arrangeData() {
    this.rowData = [];
    let statusId = 0;
    if (this.contractData) {
      while (statusId <= 4) {
        let items = this.contractData.filter((record) => record.status == statusId);
        console.log('items::', items)
        this.rowData.push({
          "status": statusId,
          "statusName": this.getStatusName(statusId.toString()),
          "data": items,
          "showDetail": true
        })
        statusId++;
      }
    }

  }

  getStatusName(id) {
    let name;
    switch (id) {
      case '0': { name = 'Offers'; break; }
      case '1': { name = 'Awaiting Approval'; break; }
      case '2': { name = 'Approved'; break; }
      case '3': { name = 'Rejected'; break; }
      case '4': { name = 'Contracted'; break; }
    }
    return name;
  }

  setAll(value) {
    this.contractData.forEach((element, index) => {
      element.check = value;
    });
  }
  rowChecked(value, rowindex) {
    this.localService.setContractNoQuote(value);
    this.noQuoteRow = rowindex;
  }
  sellerratingpopup(data : any, popupType:string) {
      let type = (popupType == 'gen-rating')?'genRating':'portRating';
      const dialogRef = this.dialog.open(SellerratingpopupComponent, {
      width: '1164px',
      height: '562px',
      panelClass: 'additional-cost-popup',
      /*data: {
        sellerId: data.sellerCounterpartyId,
        locationId : data.locationId,
        popupType : type
      }*/
      data: {
        sellerId: 385,
        locationId: 112,
        popupType: type
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  deleteRow(row) {
    this.contractData = this.contractData.filter((item) => item.id != row.id);
    this.rowData.forEach((rec) => {
      if (rec.status == row.status) {
        rec.data = rec.data.filter((item) => item.id != row.id);
        return;
      }
    })
  }
  addAnotherOffer(row) {
    let index = -1;
    let data;
    this.contractData.forEach((rec, i) => {
      if (rec.id == row.id) {
        index = i;
        data = {
          "id": this.dummyId++,
          "status": row.status,
          "name": row.name,
          "genRating": row.genRating,
          "portRating": row.portRating,
          "product": row.product,
          "spec": row.spec,
          "qtyMin": row.qtyMin,
          "qtyMax": row.qtyMax,
          "offPrice": row.offPrice,
          "validity": row.validity,
          "m1": "407.7",
          "m2": "401.2",
          "m3": "407.2",
          "m4": "407.7",
          "m5": "393.8",
          "m6": "391.8",
          "check": false,
          "check1": false,
          "m1check": false,
          "m2check": false,
          "m3check": false,
          "m4check": false,
          "m5check": false,
          "m6check": false,
          "m1bestValue": false,
          "m2bestValue": false,
          "m3bestValue": false,
          "m4bestValue": false,
          "m5bestValue": false,
          "m6bestValue": false,
          "qtyMinUnit": row.qtyMinUnit,
          "qtyMaxUnit": row.qtyMaxUnit,
          "offerPriceCur": row.offerPriceCur,
          "fdProduct": "RMK 500",
          "fdTotalContractAmt": "3000 K USD",
          "fdFomulaDesc": "MOPS 380cST (PPXDK00) - 6.5 $/MT ex-w DON",
          "fdSchedule": "DON",
          "fdPremium": "-6.5",
          "fdAddCosts": "5 USD",
          "fdRemarks": row.fdRemarks,
          "priceCalculated": false,
          "noQuote": false,
          "offerPeriod": row.offerPeriod,
          "rfqStatus": row.rfqStatus,
        };
        return;
      }
      return;
    });
    if (index != -1) {
      this.contractData.splice(index + 1, 0, data)
    }

    this.rowData.forEach((rec) => {
      if (rec.status == row.status) {
        rec.data.forEach((item, index) => {
          if (item.id == row.id) {
            rec.data.splice(index + 1, 0, data);
            return;
          }
        })
        return;
      }
    })
  }
  modifyOfferPeriod(e, params, row) {
    const dialogRef = this.dialog.open(ModifyOfferPeriodPopupComponent, {
      width: '350px',
      height: '150px',
      panelClass: ['additional-cost-popup'],
    });

    dialogRef.afterClosed().subscribe(result => {
      row.offerPeriod = result;
    });
  }

  openEmailPreview() {
    const dialogRef = this.dialog.open(EmailPreviewPopupComponent, {
      width: '80vw',
      height: '90vh',
      panelClass: 'remove-padding-popup'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  formulaPricingPopup(index, rowindex) {
    const dialogRef = this.dialog.open(FormulaPricingPopupComponent, {
      width: '1164px',
      maxHeight: '95vh',
      height: 'auto',
      panelClass: ['additional-cost-popup', 'pricing-detail-popup-panel-class', 'scroll-change'],
    });

    dialogRef.afterClosed().subscribe(result => {
      //alert(index);
      this.rowData[index].data[rowindex].offPrice = "432.5";
      //console.log(this.rowData);
    });
  }
  additionalCostPopup(index, rowindex) {
    const dialogRef = this.dialog.open(AdditionalCostPopupComponent, {
      width: '1170px',
      height: 'auto',
      //minHeight: '245px',
      maxHeight: '80vh',
      panelClass: 'additional-cost-popup',
      //data: { counterpartyName: data }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.rowData[index].data[rowindex].offPrice = Number(this.rowData[index].data[rowindex].offPrice) + 100;
    });
  }
  updateData(statusObj) {
    // Status
    // 0-Offers
    // 1-Awaiting Approval
    // 2-Approved
    // 3-Rejected
    // 4-Contratced

    this.changeContractStatus(statusObj);
  }
  changeContractStatus(statusObj) {
    if (this.contractData) {
      if (statusObj.newStatus != 4) {
        this.contractData.forEach((data) => {
          if (data.status == statusObj.oldStatus) {
            if (this.periodicity == 'M') {
              if (data.m1check || data.m2check || data.m3check || data.m4check || data.m5check || data.m6check) {
                data.status = statusObj.newStatus;
              }
            }
            else {
              if (data.q1check || data.q2check || data.q3check || data.q4check) {
                data.status = statusObj.newStatus;
              }
            }

          }
        });
      }
      else {
        this.contractData.forEach((data) => {
          if (data.check == true && data.status == statusObj.oldStatus) {
            data.status = statusObj.newStatus;
            data.check = false;
          }
        });
      }
      this.arrangeData();

    }
  }
  isM1checked($event) {
    this.localService.setContractPreviewEmail($event.checked);
  }
  addToAnotherNego() {
    this.toaster.show('<div class="image-placeholder"><span class="image"></span></div><div class="message">Negotiation duplicated successfully and available in request list</div>',
      '', {
      enableHtml: true,
      toastClass: "toast-alert toast-green custom-toast", // toast-green, toast-amber, toast-red, toast-grey
      timeOut: 2000
    });
  }
  updateProduct(row, value) {
    this.rowData.forEach((data) => {
      if (data.status == row.status) {
        data.data.forEach(rec => {
          if (rec.id == row.id) {
            rec.product = value;
            return;
          }
        })
        return;
      }
    })

  }
}

