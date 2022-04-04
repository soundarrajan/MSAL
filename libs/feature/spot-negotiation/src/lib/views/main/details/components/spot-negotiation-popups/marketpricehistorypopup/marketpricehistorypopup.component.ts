import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as Highcharts from 'highcharts';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import NoDataToDisplay from 'highcharts/modules/no-data-to-display';

NoDataToDisplay(Highcharts)

@Component({
  selector: 'app-marketpricehistorypopup',
  templateUrl: './marketpricehistorypopup.component.html',
  styleUrls: ['./marketpricehistorypopup.component.css']
})
export class MarketpricehistorypopupComponent implements OnInit {
  public ProductId: number;
  public LocationId: number;
  public RequestId: number;
  public tabledata = [];
  public priceHistoryData: any = {};
  highcharts = Highcharts;

 public chartOptions: any = {
    chart: {
      height: 550,
      width: 800
    },
    title: {
      text: ''
    },
    xAxis: {
      lineWidth: 1,
      lineColor: '#364150',
      title: {
        text: 'Dates'
      },
      categories: []
    },
    yAxis: {
      gridLineWidth: 0,
      lineWidth: 1,
      lineColor: '#364150',
      title: {
        text: 'Prices'
      },
      tickPixelInterval: 2
    },
    series: [
      {
        showInLegend: false,
        type: 'line',
        data: []
      }
    ],
    credits: {
      enabled: false
    }
  };


  constructor(
    public format: TenantFormattingService,
    private _spotNegotiationService: SpotNegotiationService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<MarketpricehistorypopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit() {
    let payload = {
      LocationId: this.data.LocationId,
      ProductId: this.data.ProductId,
      RequestId: this.data.RequestId
    };
    this.spinner.show();
    const response = this._spotNegotiationService.getMarketPriceHistory(
      payload
    );
    response.subscribe((res: any) => {
      this.spinner.hide();
      if (res?.message == 'Unauthorized') {
        return;
      }
      let dataSeries = [];
      let categories = [];
      res.marketPriceHistory.map(x=>{
          //pushing data to data table
            this.tabledata.push({
              price: x.price,
              date: this.formatDate(x.date)
            });
           dataSeries.push(x.price);  // pushing price data to dataseries
           categories.push(this.formatDate(x.date));  // pushing date to categories
      });
      if(dataSeries.length === 0){
        this.highcharts.setOptions({ lang: {noData: "Market price data unavailable"}});
        this.highcharts.chart('container', this.chartOptions);
        return;
       }
     console.log(this.tabledata);
     this.chartOptions.xAxis.categories = categories;
     this.chartOptions.series[0].data = dataSeries;
     this.highcharts.chart('container', this.chartOptions);
    });

  }

  closeDialog() {
    this.dialogRef.close();
  }

  formatDate(date?: any) {
    if (date) {
      let currentFormat = this.format.dateFormat;
      let hasDayOfWeek;

      if (currentFormat.startsWith('DDD ')) {
        hasDayOfWeek = true;
        currentFormat = currentFormat.split('DDD ')[1];
      }
      if (currentFormat.endsWith('HH:mm')) {
        currentFormat = currentFormat.split('HH:mm')[0];
      }

      currentFormat = currentFormat.replace(/d/g, 'D');
      currentFormat = currentFormat.replace(/y/g, 'Y');

      const elem = moment(date, 'YYYY-MM-DDTHH:mm:ss');
      let formattedDate = moment(elem).format(currentFormat);

      if (hasDayOfWeek) {
        formattedDate = `${moment(date).format('ddd')} ${formattedDate}`;
      }

      return formattedDate;
    }
  }
}
