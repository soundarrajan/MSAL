import { Component, OnInit, Input } from '@angular/core';
@Component({
    selector: 'm-chip',
    template: `
      <div class="mchip-container">
        <div class="title">{{info.Title}}</div>
        <div class="data">{{info.Data}}</div>
    </div>
    `,
    styles: [`.mchip-container { 
                background-color: #364150 ;
                width: 100px; height: 60px;
                border-radius: 5px;
                margin: 5px;
                padding: 5px;
                color:#fff;
              }
              .mchip-container .title{
                  font-size: 10px;
                  font-weight: 100;
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
