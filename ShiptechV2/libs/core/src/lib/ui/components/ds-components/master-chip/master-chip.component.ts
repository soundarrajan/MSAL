import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
@Component({
    selector: 'm-chip',
    template: `
      <div class="mchip-container">
      <div [ngClass]="{'dashed-border-chip': info.Title === 'Deductions'}" >
          <div class="cip-container" *ngIf="info.Title !== 'Status'">
            <span class="chip-circle"></span>
            <span>{{info.Title}}</span>
          </div>
          <div class="cip-container" *ngIf="info.Title === 'Status'">
            <span style="margin-right: 10px;">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="4.90561" cy="4" rx="4.22642" ry="4" fill="#9E9E9E" [ngStyle]="{'fill': info.statusColorCode }"/>
              </svg>
            </span>
            <span>{{info.Title}}</span>
          </div>
          <div *ngIf="info.Title === 'Status'" class="data cip-container" [ngClass]="{'tile-2': info.Title === 'Status' }"    
              [matTooltip]="info.Data"
              [matTooltipPosition]="'above'"
              matTooltipClass="custom-tooltip"
              [ngStyle]="{'color': info.statusColorCode}">{{info.Data}}</div>
          <div *ngIf="info.Title !== 'Deductions' && info.Title != 'Status'" class="data cip-container" [ngClass]="{'tile-2': info.Title === 'Status' }"    
              [matTooltip]="info.Data"
              [matTooltipPosition]="'above'"
              matTooltipClass="custom-tooltip">{{info.Data}}</div>
          <div *ngIf="info.Title === 'Deductions'" class="data deduction-container cip-container" [ngClass]="{'tile-2': info.Title === 'Status' }"    
              [matTooltip]="'Deductions'"
              [matTooltipPosition]="'above'"
              matTooltipClass="custom-tooltip"> 
                <div>
                  <input matInput 
                    [(ngModel)]="formValues.invoiceSummary.deductions"
                    (ngModelChange)="calculateGrand(formValues)"
                    class="deduction-input"
                    autocomplete="off"
                    amountFormat>
                </div>
                <div>
                  {{formValues.invoiceRateCurrency.code}}
                </div>
              
          </div>
        </div>
    </div>
    `,
    styles: [`.mchip-container {
                background-color: #364150 ;
                width: 125px; height: 50px;
                border-radius: 5px;
                margin: 5px;
                padding: 5px;
                color:#fff;
                line-height: 20px;
              }
              .mchip-container .title{
                  font-size: 12px;
                  font-weight: 100;
              }
              .chip-circle{
                content: url(./assets/customicons/circle.svg);
                padding-right: 5px;
              }
              .dashed-border-chip{
                height: 40px;
                padding: 0px 6px;
                border-style: dashed;
                border-width: 1px;
                border-radius: 2px;
              }
              .tile-2{
                font-weight: 500;
                font-size: 14px;
                line-height: 16px;
                color: #9E9E9E;
              }
              .tile-4-5{
                font-size: 18px;
                text-align: center;
              }
              .tile-8{
                float: right;
              }
              .data {
                justify-content: flex-start;
                align-items: center;
                text-align: start;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              .custom-tooltip {
                background: linear-gradient(0deg, rgba(158, 158, 158, 0.39), rgba(158, 158, 158, 0.39)), #676C72;
                border: 1px solid #364150;
                box-sizing: border-box;
                border-radius: 4px;
                color: white;
                font-size: 14px;
              }
              .deduction-container {
                display: inline-flex;
              }

              .cip-container {
                padding-left: 5px !important;
                padding-right: 5px !important;
              }
            `]
  })
  export class MasterChip {
  @Input('info') info;
  @Input('formValues') formValues;
  @Output() amountChanged: EventEmitter<any> = new EventEmitter<any>();
  constructor(){

  }

  ngOnInit(){

  }

  calculateGrand(formValues) {
    if (!formValues.invoiceSummary) {
        formValues.invoiceSummary = {};
    }
    // formValues.invoiceSummary.provisionalInvoiceAmount = $scope.calculateprovisionalInvoiceAmount(formValues){}
    formValues.invoiceSummary.invoiceAmountGrandTotal = this.calculateInvoiceGrandTotal(formValues);
    formValues.invoiceSummary.invoiceAmountGrandTotal -= formValues.invoiceSummary.provisionalInvoiceAmount;
    formValues.invoiceSummary.estimatedAmountGrandTotal = this.calculateInvoiceEstimatedGrandTotal(formValues);
    formValues.invoiceSummary.totalDifference = this.convertDecimalSeparatorStringToNumber(formValues.invoiceSummary.invoiceAmountGrandTotal) - this.convertDecimalSeparatorStringToNumber(formValues.invoiceSummary.estimatedAmountGrandTotal);
    formValues.invoiceSummary.netPayable = this.convertDecimalSeparatorStringToNumber(formValues.invoiceSummary.invoiceAmountGrandTotal) - this.convertDecimalSeparatorStringToNumber(formValues.invoiceSummary.deductions);
    this.amountChanged.emit(true);
    console.log(formValues);
  }

  calculateInvoiceGrandTotal(formValues) {
    let grandTotal = 0;
    formValues.productDetails.forEach((v, k) => {
        if (!v.isDeleted && typeof v.invoiceAmount != 'undefined') {
            grandTotal = grandTotal + this.convertDecimalSeparatorStringToNumber(v.invoiceAmount);
        }
    });
    formValues.costDetails.forEach((v, k) => {
        if (!v.isDeleted) {
            if (typeof v.invoiceTotalAmount != 'undefined') {
                grandTotal = grandTotal + this.convertDecimalSeparatorStringToNumber(v.invoiceTotalAmount);
            }
        }
    });
    return grandTotal;
  }

  calculateInvoiceEstimatedGrandTotal(formValues) {
    let grandTotal = 0;
    formValues.productDetails.forEach((v, k) => {
      if (!v.isDeleted && typeof v.estimatedAmount != 'undefined') {
        grandTotal = grandTotal + v.estimatedAmount;
      }
    });
    
    formValues.costDetails.forEach((v, k) => {
      if (!v.isDeleted) {
        if (typeof v.estimatedAmount != 'undefined') {
            grandTotal = grandTotal + v.estimatedAmount;
        }
      }
    });
    return grandTotal;
  }

  convertDecimalSeparatorStringToNumber(number) {
    var numberToReturn = number;
    var decimalSeparator, thousandsSeparator;
    if (typeof number == 'string') {
        if (number.indexOf(',') != -1 && number.indexOf('.') != -1) {
          if (number.indexOf(',') > number.indexOf('.')) {
            decimalSeparator = ',';
            thousandsSeparator = '.';
          } else {
            thousandsSeparator = ',';
            decimalSeparator = '.';
          }
          numberToReturn = parseFloat(number.split(decimalSeparator)[0].replace(new RegExp(thousandsSeparator, 'g'), '')) + parseFloat(`0.${number.split(decimalSeparator)[1]}`);
        } else {
          numberToReturn = parseFloat(number);
        }
    }
    if (isNaN(numberToReturn)) {
      numberToReturn = 0;
    }
    return parseFloat(numberToReturn);
  }

  }
