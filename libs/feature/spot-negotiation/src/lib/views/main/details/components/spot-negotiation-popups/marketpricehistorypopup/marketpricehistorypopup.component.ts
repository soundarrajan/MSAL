import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as Highcharts from 'highcharts';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';

@Component({
  selector: 'app-marketpricehistorypopup',
  templateUrl: './marketpricehistorypopup.component.html',
  styleUrls: ['./marketpricehistorypopup.component.css']
})
export class MarketpricehistorypopupComponent implements OnInit {
  public ProductId : number;
  public LocationId : number;
  public tabledata = [];
  public priceHistoryData : any = {};
  Highcharts: typeof Highcharts = Highcharts;

  chartOptions: Highcharts.Options = {
    chart: {
      height: 600,
      width: 800,
    },
    title: {
      text: ""
    },
    xAxis:{
      lineWidth: 1,
      lineColor: '#364150',  
      title:{
        text:""
      }, 
      categories:['20/5','21/05','24/05','25/05','26/05','27/05','02/06','03/06','05/06','07/06','08/06']
    },
    yAxis: {    
      gridLineWidth: 0,  
      lineWidth: 1,
      lineColor: '#364150',    
        title:{
          text:""
        },
        tickPixelInterval: 2 
    },
    series: [
      {
        showInLegend: false,             
        type: "line",
        data: [476.00,473.00,482.00,485.00,485.00,487.00,492.00,496.00,502.00,506.00,518.00]
      }
    ],
    credits: {
      enabled: false
    }
  };

  ngOnInit(): void {
  }
  constructor(private _spotNegotiationService: SpotNegotiationService, public dialogRef: MatDialogRef<MarketpricehistorypopupComponent>,    @Inject(MAT_DIALOG_DATA) public data: any) {
     let payload = {LocationId : this.data.LocationId, ProductId : this.data.ProductId };
     const response = this._spotNegotiationService.getMarketPriceHistory(payload);
     response.subscribe((res: any) => {
       this.tabledata = res.marketPriceHistory;
     });
     
   }
   
  closeDialog() {
      this.dialogRef.close();
    
    } 
    
}
