import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import * as Highcharts from "highcharts";
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Store } from '@ngxs/store';
import { DecimalPipe } from '@angular/common';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';
NoDataToDisplay(Highcharts)

@Component({
  selector: 'app-spotnego-offerpricehistory',
  templateUrl: './spotnego-offerpricehistory.component.html',
  styleUrls: ['./spotnego-offerpricehistory.component.css']
})
export class SpotnegoOfferpricehistoryComponent implements OnInit {

    // highcharts = Highcharts;
    // chartOptions = {
    //    chart: {
    //       height: 600,
    //       type: "spline"
    //    },
    //    title: {
    //       text: ""
    //    },
    //    xAxis:{
    //       lineWidth: 1,
    //       lineColor: '#364150',
    //       //categories:["Offer 1","Offer 2","Offer 3","Offer 4","Offer 5"]
    //    },
    //    yAxis: {
    //       tickPixelInterval: 1,
    //       title:{
    //          text:""
    //       },
    //       gridLineWidth: 0,
    //       lineWidth: 1,
    //       lineColor: '#364150',
    //       plotLines: [{
    //         color: '#ED6161',
    //         width: 1,
    //         //value: 515.5,
    //         label: {
    //           text: 'Target Price',
    //           align: 'right',
    //           x: -10,
    //           style: {
    //             color: '#333333',
    //             fontSize: '9px'
    //           }
    //         }
    //       }],
    //       //min: 514.0,
    //       //max: 521.0,
    //       plotBands: [{ // mark the weekend
    //         color: 'rgba(237,97,97,0.2)',
    //         //from: 513.0,
    //         //to: 515.5
    //       }],
    //       //tickInterval: 1
    //    },
    //    series: [
    //     {
    //         name: 'Bominflot BV',
    //         marker: {
    //           symbol: 'circle'
    //         },
    //         data: [520.2,519.0,518.6]
    //     },
    //     {
    //       name: '',
    //       marker: {
    //         symbol: 'circle'
    //       },
    //       data: []
    //   }
    // ],
    // legend: {
    //   symbolWidth: 1,
    //   symbolPadding: 7,
    //   itemDistance: 20
    // },
    // responsive: {
    //   rules: [{
    //       condition: {
    //           maxWidth: 500,
    //           maxHeight: 300
    //       }
    //   }]
    // },
    // credits: {
    //   enabled: false
    // }
    // };

  disableScrollDown = false
  public showaddbtn=true;
  public priceFormat ='';
  isShown: boolean = true; // hidden by default
  isBtnActive: boolean = false;
  isButtonVisible=true;
  iscontentEditable=false;
  requestProductId: number;
  requestLocationId: number;
  locationName: string;
  productName: string ;
  locationData: any;
  tenantService:any;
  targerPrice: any;
  highcharts = Highcharts;

  public chartOptions: any = {
    chart: {
            height: 600,
            type: "spline"
         },
         title: {
            text: ""
         },
         xAxis:{
            lineWidth: 1,
            lineColor: '#364150',
         },
         yAxis: {
            tickPixelInterval: 1,
            title:{
               text:""
            },
            gridLineWidth: 0,
            lineWidth: 1,
            lineColor: '#364150',
            plotLines: [{
              color: '#ED6161',
              width: 1,
              //value: 515.5,
              label: {
                text: 'Target Price',
                align: 'right',
                x: -10,
                style: {
                  color: '#333333',
                  fontSize: '10px'
                }
              }
            }],
            plotBands: [
              {
              color: 'rgba(237,97,97,0.2)',
              from: 0,
              to: 0
            }
          ],
            //tickInterval: 1
         },
         series: [],
      legend: {
        symbolWidth: 1,
        symbolPadding: 7,
        itemDistance: 20
      },
      responsive: {
        rules: [{
            condition: {
                maxWidth: 500,
                maxHeight: 300
            }
        }]
      },
      credits: {
        enabled: false
      }

  }


  constructor(public dialogRef: MatDialogRef<SpotnegoOfferpricehistoryComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any,
     @Inject(DecimalPipe)
     private _decimalPipe,
     private spotNegotiationService : SpotNegotiationService,
     private spinner: NgxSpinnerService,
     public store: Store,
     ) {
        this.requestProductId = data.RequestProductId;
        this.requestLocationId = data.RequestLocationId;
        this.locationName = data.LocationName;
        this.productName = data.ProductName;
        this.targerPrice = data.TargerPrice;
   }

   ngOnInit() {
     let payload = {
      requestLocationId : this.requestLocationId,
       requestProductId : this.requestProductId
     };
    this.spinner.show();
    const response =  this.spotNegotiationService.getOfferPrice(payload);
    response.subscribe((res:any)=>{
      this.spinner.hide();
         this.locationData = res.marketPriceHistory;
         let dataSeries = [];
         this.locationData.map(x=>{
            dataSeries.push({
              name: x.sellerCounterpartyName,
              marker: {
                 symbol: 'circle'
                },
              data: x.oldPrices
            })
         })
         if(dataSeries.length === 0){
           this.highcharts.setOptions({ lang: {noData: "No past offers found"}});
           this.highcharts.chart('container', this.chartOptions);
           return;
         }
         let minmaxArray = [];
          dataSeries.map(el=> el.data.map(data=> minmaxArray.push(data)));
          minmaxArray.push(this.targerPrice);
          let min = Math.min(...minmaxArray);
          let max = Math.max(...minmaxArray);
         let maxLength = Math.max(...dataSeries.map(el => el.data.length));
         let categories = [];
         for(var i = 1 ; i<=maxLength; i++){
           categories.push('Offer'+i)
         }
         console.log(categories);
         this.chartOptions.yAxis.min = min - 1;
         this.chartOptions.yAxis.max = max + 1;
         this.chartOptions.xAxis.categories = categories;
         this.chartOptions.yAxis.plotLines[0].value = this.targerPrice;
         this.chartOptions.yAxis.plotBands[0].to = this.targerPrice;
         this.chartOptions.series = dataSeries;
         this.highcharts.chart('container', this.chartOptions);
    });
    this.store.subscribe(({ spotNegotiation }) => {
      this.tenantService = spotNegotiation.tenantConfigurations;
    })
}

  closeDialog() {
      this.dialogRef.close();

    }
    priceFormatValue(value) {
      if (typeof value == 'undefined' || value == null) {
        return null;
      }
      let plainNumber = value.toString().replace(/[^\d|\-+|\.+]/g, '');
      const number = parseFloat(plainNumber);
      if (isNaN(number)) {
        return null;
      }
      let productPricePrecision = this.tenantService.pricePrecision;

      this.priceFormat =
        '1.' + productPricePrecision + '-' + productPricePrecision;
      if (plainNumber) {
        if (productPricePrecision) {
          plainNumber = this.roundDown(plainNumber, productPricePrecision + 1);
        } else {
          plainNumber = Math.trunc(plainNumber);
        }

        return this._decimalPipe.transform(plainNumber, this.priceFormat);
      }
    }
    roundDown(value, pricePrecision) {
      let precisionFactor = 1;
      let response = 0;
      const intvalue = parseFloat(value);
      if (pricePrecision === 1) {
        precisionFactor = 10;
      }
      if (pricePrecision === 2) {
        precisionFactor = 100;
      }
      if (pricePrecision === 3) {
        precisionFactor = 1000;
      }
      if (pricePrecision === 4) {
        precisionFactor = 10000;
      }
      response = Math.floor(intvalue * precisionFactor) / precisionFactor;
      return response.toString();
    }

  tabledatas2=[ ];
  newtabledata:any={}
  addNew(){
        this.tabledatas2.push(this.newtabledata)
        this.newtabledata = {};
        // this.scrollToBottom();
  }
  delete(i){
    this.tabledatas2.splice(i,1);
  }
  toggleShow() {

    this.isShown = ! this.isShown;

    }


}
