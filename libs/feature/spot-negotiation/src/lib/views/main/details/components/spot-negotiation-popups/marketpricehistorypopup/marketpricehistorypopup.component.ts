import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as Highcharts from 'highcharts';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
import { TenantFormattingService } from '@shiptech/core/services/formatting/tenant-formatting.service';
import moment from 'moment';

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
  Highcharts: typeof Highcharts = Highcharts;

  chartOptions: Highcharts.Options = {
    chart: {
      height: 500,
      width: 800
    },
    title: {
      text: ''
    },
    xAxis: {
      lineWidth: 1,
      lineColor: '#364150',
      title: {
        text: ''
      },
      categories: [
        '20/5',
        '21/05',
        '24/05',
        '25/05',
        '26/05',
        '27/05',
        '02/06',
        '03/06',
        '05/06',
        '07/06',
        '08/06'
      ]
    },
    yAxis: {
      gridLineWidth: 0,
      lineWidth: 1,
      lineColor: '#364150',
      title: {
        text: ''
      },
      tickPixelInterval: 2
    },
    series: [
      {
        showInLegend: false,
        type: 'line',
        data: [
          476.0,
          473.0,
          482.0,
          485.0,
          485.0,
          487.0,
          492.0,
          496.0,
          502.0,
          506.0,
          518.0
        ]
      }
    ],
    credits: {
      enabled: false
    }
  };

  ngOnInit(): void {}
  constructor(
    public format: TenantFormattingService,
    private _spotNegotiationService: SpotNegotiationService,
    public dialogRef: MatDialogRef<MarketpricehistorypopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    let payload = {
      LocationId: this.data.LocationId,
      ProductId: this.data.ProductId,
      RequestId: this.data.RequestId
    };
    const response = this._spotNegotiationService.getMarketPriceHistory(
      payload
    );
    response.subscribe((res: any) => {
      if (res?.message == 'Unauthorized') {
        return;
      }
      // this.priceHistoryData =  {date : res.marketPriceHistory.map(item => item.date), price : res.marketPriceHistory.map(item => item.price)};
      res.marketPriceHistory.forEach(item => {
        this.tabledata.push({
          price: item.price,
          date: this.formatDate(item.date)
        });
      });
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
