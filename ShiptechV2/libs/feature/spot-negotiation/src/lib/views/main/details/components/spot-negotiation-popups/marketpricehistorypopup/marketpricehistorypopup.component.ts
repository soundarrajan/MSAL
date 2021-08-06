import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as Highcharts from 'highcharts';
@Component({
  selector: 'app-marketpricehistorypopup',
  templateUrl: './marketpricehistorypopup.component.html',
  styleUrls: ['./marketpricehistorypopup.component.css']
})
export class MarketpricehistorypopupComponent implements OnInit {

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
  constructor(public dialogRef: MatDialogRef<MarketpricehistorypopupComponent>,    @Inject(MAT_DIALOG_DATA) public data: any) { }

  closeDialog() {
      this.dialogRef.close();

    }
    tabledata=[{date:'19-5-2021',price:'560.00'},{date:'18-5-2021',price:'560.01'},{date:'17-5-2021',price:'560.11'},{date:'16-5-2021',price:'560.11'},{date:'15-5-2021',price:'550.11'},{date:'14-5-2021',price:'550.11'},{date:'13-5-2021',price:'550.11'},{date:'12-5-2021',price:'550.19'},{date:'11-5-2021',price:'550.19'},{date:'10-5-2021',price:'550.19'},{date:'9-5-2021',price:'550.19'},{date:'8-5-2021',price:'550.19'},{date:'7-5-2021',price:'550.19'},{date:'6-5-2021',price:'550.31'},{date:'5-5-2021',price:'550.31'},{date:'4-5-2021',price:'550.31'}];
}
