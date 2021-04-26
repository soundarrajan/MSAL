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
          <div class="data" [ngStyle]="{'float': info.Title === 'Deductions' ? 'right' : 'left'}">{{info.Data}}</div>
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
                content: url(/assets/customicons/circle.svg);
                padding-right: 5px;
              }
              .dashed-border-chip{
                height: 40px;
                padding: 0px 6px;
                border-style: dashed;
                border-width: 1px;
                border-radius: 2px;
              }
            `]
  })
  export class MasterChip {
  @Input('info') info;

  constructor(){

  }

  ngOnInit(){

  }

  }
