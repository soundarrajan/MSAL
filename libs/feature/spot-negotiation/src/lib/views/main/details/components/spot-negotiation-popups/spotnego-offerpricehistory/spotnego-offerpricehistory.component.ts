import { Component, OnInit, Inject, ViewChild, ElementRef,  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import * as Highcharts from "highcharts";

@Component({
  selector: 'app-spotnego-offerpricehistory',
  templateUrl: './spotnego-offerpricehistory.component.html',
  styleUrls: ['./spotnego-offerpricehistory.component.css']
})
export class SpotnegoOfferpricehistoryComponent implements OnInit {
 
    highcharts = Highcharts;
    chartOptions = {   
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
          categories:["Offer 1","Offer 2","Offer 3","Offer 4","Offer 5"]
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
            value: 515.5,
            label: {
              text: 'Target Price',
              align: 'right',
              x: -10,
              style: {
                color: '#333333',
                fontSize: '9px'
              }
            }
          }],
          min: 514.0,
          max: 521.0,
          plotBands: [{ // mark the weekend
            color: 'rgba(237,97,97,0.2)',
            from: 513.0,
            to: 515.5
          }],
          //tickInterval: 1
       },
       series: [
        {
            name: 'Bominflot BV',
            marker: {
              symbol: 'circle'
            },
            data: [520.2,519.0,518.6,'','']
        },
        {
            name: 'BP Nederland BV',
            marker: {
              symbol: 'circle'
            },
            data: [518.5,517.0,516.8,516.0,'']
        },
        {
            name: 'Chemoil Europe BV',
            marker: {
              symbol: 'circle'
            },
            data: [519.7,518.0,519.0,'','']
        },
        {
            name: 'Supplier 4',
            marker: {
              symbol: 'circle'
            },
            data: [519.9,518.0,517.5,517.0,'']
        },
        {
            name: 'Supplier 5',
            marker: {
              symbol: 'circle'
            },
            data: [520.5,518.0,515.2,'','']
        },
        {
            name: 'Supplier 6',
            marker: {
              symbol: 'circle'
            },
            data: [519.1,518.7,517.0,516.8,'']
        }
       
    ],
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
    };

  disableScrollDown = false
  public showaddbtn=true;
  isShown: boolean = true; // hidden by default
  isBtnActive: boolean = false;
  isButtonVisible=true;
  iscontentEditable=false;

  ngOnInit() { 
    // this.scrollToBottom();
}
  
  constructor(public dialogRef: MatDialogRef<SpotnegoOfferpricehistoryComponent>,    @Inject(MAT_DIALOG_DATA) public data: any) { }
   
  closeDialog() {
      this.dialogRef.close();
    
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
