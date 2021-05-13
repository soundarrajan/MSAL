import { Component, OnInit, Input } from '@angular/core';
@Component({
    selector: 'm-chip',
    template: `
      <div class="mchip-container">
      <div [ngClass]="{'dashed-border-chip': info.Title === 'Deductions'}" >
          <div class="title">
            <span class="chip-circle"></span>
            <span>{{info.Title}}</span>
          </div>
          <div *ngIf="info.Title !== 'Deductions'" class="data" [ngClass]="{'tile-2': info.Title === 'Status' }"    
              [matTooltip]="info.Data"
              [matTooltipPosition]="'above'"
              matTooltipClass="custom-tooltip">{{info.Data}}</div>
          <div *ngIf="info.Title === 'Deductions'" class="data deduction-container" [ngClass]="{'tile-2': info.Title === 'Status' }"    
              [matTooltip]="'Deductions'"
              [matTooltipPosition]="'above'"
              matTooltipClass="custom-tooltip"> 
                <div>
                  <input matInput 

                    [(ngModel)]="formValues.invoiceSummary.deductions"
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
            `]
  })
  export class MasterChip {
  @Input('info') info;
  @Input('formValues') formValues;
  constructor(){

  }

  ngOnInit(){

  }

  }
