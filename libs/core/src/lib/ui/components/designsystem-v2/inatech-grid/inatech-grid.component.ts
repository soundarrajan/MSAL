import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LocalService } from 'src/app/services/local-service.service';
import { EmailPreviewPopupComponent } from 'src/app/shiptech-spot-negotiation/spot-negotiation-popups/email-preview-popup/email-preview-popup.component';
import { SupplierCommentsPopupComponent } from 'src/app/shiptech-spot-negotiation/spot-negotiation-popups/supplier-comments-popup/supplier-comments-popup.component';
import { SpotnegoOfferpricehistoryComponent } from 'src/app/shiptech-spot-negotiation/spot-negotiation-popups/spotnego-offerpricehistory/spotnego-offerpricehistory.component';
import { MarketpricehistorypopupComponent } from 'src/app/shiptech-spot-negotiation/spot-negotiation-popups/marketpricehistorypopup/marketpricehistorypopup.component';
import {AvailabletermcontractspopupComponent} from 'src/app/shiptech-spot-negotiation/spot-negotiation-popups/availabletermcontractspopup/availabletermcontractspopup.component';

@Component({
  selector: 'inatech-grid',
  templateUrl: './inatech-grid.component.html',
  styleUrls: ['./inatech-grid.component.scss']
})
export class InatechGridComponent implements OnInit {
  @ViewChild('igrid') igrid:ElementRef;
  pg1_col_span = 5;
  pg2_col_span = 4;
  pg3_col_span = 4;
  public myFormGroup;
  public select = "$";

  constructor(private localService:LocalService, public dialog: MatDialog) { }
  ngOnInit(): void {
    this.localService.getSpotDataJSON('12321','001').subscribe((res: any) => {
      // this.rows  = res;
      // this.gridOptions_counterparty.api.setRowData(this.rowData_aggrid)
    })
    this.myFormGroup = new FormGroup({
      frequency: new FormControl('')
    });

    // var allData.forkJoin
  }

  frequencyArr = [
    { key: '$', abbriviation: 'USD' },
    { key: '€', abbriviation: 'EURO' },
    { key: '£', abbriviation: 'GBP' }
  ];

  rows = [
    ["Total Marine Fuel", "4.2","$9.4"," Add P. supplier","-","","-","-","-","-","-","-","-","-","-","-","-"],
    ["Mitsui & co petroleum", "4.2","$9.2"," Add P. supplier","-","","-","-","-","-","-","-","-","-","-","-","-"],
    ["Phillip 66", "4.2","$9.2"," Add P. supplier ","-","","-","-","-","-","-","-","-","-","-","-","-"],
    ["Total Marine Fuel", "4.3","$9.0"," Add P. supplier","-","","-","-","-","-","-","-","-","-","-","-","-"],
    ["Total Marine Fuel", "2.3","$8.3"," Add P. supplier","-","","-","-","-","-","-","-","-","-","-","-","-"],
    ["Total Marine Fuel", "2.3","$8.3"," Add P. supplier","-","","-","-","-","-","-","-","-","-","-","-","-"],
    ["Total Marine Fuel", "2.3","$8.3"," Add P. supplier","-","","-","-","-","-","-","-","-","-","-","-","-"],
    ["Total Marine Fuel", "2.3","$8.3"," Add P. supplier","-","","-","-","-","-","-","-","-","-","-","-","-"],
    ["Total Marine Fuel", "2.3","$8.3"," Add P. supplier","-","","-","-","-","-","-","-","-","-","-","-","-"],
    ["Total Marine Fuel", "2.3","$8.3"," Add P. supplier","-","","-","-","-","-","-","-","-","-","-","-","-"],
    ["Total Marine Fuel", "2.3","$8.3"," Add P. supplier","-","","-","-","-","-","-","-","-","-","-","-","-"],
    ["Total Marine Fuel", "2.3","$8.3"," Add P. supplier","-","","-","-","-","-","-","-","-","-","-","-","-"],
    ["Total Marine Fuel", "2.3","$8.3"," Add P. supplier","-","","-","-","-","-","-","-","-","-","-","-","-"],
    ["Total Marine Fuel", "2.3","$8.3"," Add P. supplier","-","","-","-","-","-","-","-","-","-","-","-","-"],
    ["Total Marine Fuel", "2.3","$8.3"," Add P. supplier","-","","-","-","-","-","-","-","-","-","-","-","-"],
    ["Total Marine Fuel", "2.3","$8.3"," Add P. supplier","-","","-","-","-","-","-","-","-","-","-","-","-"],
    ["Total Marine Fuel", "2.3","$8.3"," Add P. supplier","-","","-","-","-","-","-","-","-","-","-","-","-"]
  ];

  // coln =[ "Name", "Gen. Rating", "Port Rating","Phy. Supplier","","Total Offer($)",
  // "Offer price","T.Pr.($)","Amt ($)","Tar. diff",
  // "MJ/KJ","TCO ($)","E. diff",
  // "Offer price","T.Pr.($)","Amt ($)","Tar. diff",
  // "MJ/KJ","TCO ($)","E. diff"]

  coln =[ "Name", "Gen. Rating", "Port Rating","Phy. Supplier","Total Offer($)","",
  "Offer price","T.Pr.($)","Amt ($)","Tar. diff",
  "Offer price","T.Pr.($)","Amt ($)","Tar. diff",
  "Offer price","T.Pr.($)","Amt ($)","Tar. diff"]


  isExpand=false;
  addcolmn(){
    if(!this.isExpand){
      this.coln.splice(9,0, 'MJ/KJ');
      this.coln.splice(10,0, 'TCO ($)');
      this.coln.splice(11,0, 'E. diff');
      this.pg1_col_span=7;     

      this.coln.splice(16,0, 'MJ/KJ');
      this.coln.splice(17,0, 'TCO ($)');
      this.coln.splice(18,0, 'E. diff');
      this.pg2_col_span=7;

      this.coln.splice(21,0, 'MJ/KJ');
      this.coln.splice(22,0, 'TCO ($)');
      this.coln.splice(23,0, 'E. diff');
      this.pg3_col_span=9;

      this.rows.forEach(element => {
        element.splice( 9, 0, "-","-","-","-","-","-","-","-","-");
      }); 
      this.isExpand =true;
    }
    else{
      this.coln.splice(21, 1);
      this.coln.splice(21, 1);
      this.coln.splice(21, 1);
      this.pg3_col_span=4;

      this.coln.splice(16, 1);
      this.coln.splice(16, 1);
      this.coln.splice(16, 1);
      this.pg2_col_span=4;

      this.coln.splice(9, 1);
      this.coln.splice(9, 1);
      this.coln.splice(9, 1);
      this.pg1_col_span=4;

      this.rows.forEach(element => {
        element.splice(17);
      }); 
      
      this.isExpand =false;
    }    
  }

  openEmailPreview(){
    const dialogRef = this.dialog.open(EmailPreviewPopupComponent, {
      width: '80vw',
      height: '90vh',
      panelClass: 'additional-cost-popup'
    });
  
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  suppliercommentspopup(){
    const dialogRef = this.dialog.open(SupplierCommentsPopupComponent, {
      width: '672px',
      minHeight: '540px',
      panelClass: ['additional-cost-popup', 'supplier-contact-popup']
    });
  
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  rowData = [
    {
        "name": "Total Marine Fuel",
        "counterpartytype": "seller",
        "operator": "",
        "mail": "mail-active",
        "genRating": "4.2",
        "genPrice": "$9.4",
        "portRating": "4.2",
        "portPrice": "$9.8",
        "phySupplier": "Add P. supplier",
        "totalOffer": "500.00",
        "offPrice1": "100.00",
        "offPrice2": "-",
        "offPrice3": "-",
        "tPr": "-",
        "amt": "-",
        "diff": "-",
        "check": false,
        "check1": false,
        "check2": "",
        "check3": "",
        "mj": "41",
        "mj1": "41",
        "tco": "4,48,152.00",
        "ediff": "1.19",
        "tco1": "4,48,152.00",
        "ediff1": "1.19",
        "infoIcon": "Yes",
        "commentIcon": "Yes"
    },
    {
        "name": "Mitsui & co petroleum",
        "counterpartytype": "broker",
        "mail": "mail-inactive",
        "genRating": "4.2",
        "genPrice": "$9.4",
        "portRating": "4.2",
        "portPrice": "$9.8",
        "phySupplier": "Add P. supplier",
        "totalOffer": "-",
        "offPrice1": "550.00",
        "offPrice2": "-",
        "offPrice3": "-",
        "tPr": "-",
        "amt": "-",
        "diff": "-",
        "check": "",
        "check1": "",
        "check2": "",
        "check3": "",
        "mj": "41",
        "mj1": "41",
        "tco": "4,48,152.00",
        "ediff": "1.19",
        "tco1": "4,48,152.00",
        "ediff1": "1.19",
        "infoIcon": "Yes",
        "commentIcon": ""
    },
    {
        "name": "Phillip 66",
        "counterpartytype": "physicalsupplier",
        "mail": "mail-none",
        "genRating": "4.2",
        "genPrice": "$9.4",
        "portRating": "4.2",
        "portPrice": "$9.8",
        "phySupplier": "Add P. supplier",
        "totalOffer": "-",
        "offPrice1": "0",
        "offPrice2": "0",
        "offPrice3": "0",
        "tPr": "",
        "amt": "",
        "diff": "",
        "check": "",
        "check1": "",
        "check2": "",
        "check3": "",
        "mj": "",
        "mj1": "",
        "tco": "",
        "ediff": "",
        "tco1": "",
        "ediff1": "",
        "infoIcon": "Yes",
        "commentIcon": "No",
        "isQuote": "No quote"
    },
    {
        "name": "Total Marine Fuel",
        "counterpartytype": "seller",
        "mail": "mail-active",
        "genRating": "4.2",
        "genPrice": "$9.4",
        "portRating": "4.2",
        "portPrice": "$9.8",
        "phySupplier": "Add P. supplier",
        "totalOffer": "-",
        "offPrice1": "-",
        "offPrice2": "-",
        "offPrice3": "-",
        "tPr": "518.50",
        "amt": "-",
        "diff": "-",
        "check": "",
        "check1": "",
        "check2": "",
        "check3": "",
        "mj": "41",
        "mj1": "41",
        "tco": "4,48,152.00",
        "ediff": "1.19",
        "tco1": "4,48,152.00",
        "ediff1": "1.19",
        "infoIcon": "No",
        "commentIcon": "Yes"
    },
    {
        "name": "Total Marine Fuel",
        "counterpartytype": "broker",
        "mail": "mail-inactive",
        "genRating": "4.2",
        "genPrice": "$9.4",
        "portRating": "4.2",
        "portPrice": "$9.8",
        "phySupplier": "Add P. supplier",
        "totalOffer": "-",
        "offPrice1": "-",
        "offPrice2": "-",
        "offPrice3": "-",
        "tPr": "-",
        "amt": "-",
        "diff": "-",
        "check": "",
        "check1": "",
        "check2": "",
        "check3": "",
        "preferred": true,
        "mj": "41",
        "mj1": "41",
        "tco": "4,48,152.00",
        "ediff": "1.19",
        "tco1": "4,48,152.00",
        "ediff1": "1.19",
        "infoIcon": "No",
        "commentIcon": "No"
    },
    {
        "name": "Total Marine Fuel",
        "counterpartytype": "physicalsupplier",
        "mail": "mail-active",
        "genRating": "4.2",
        "genPrice": "$9.4",
        "portRating": "4.2",
        "portPrice": "$9.8",
        "phySupplier": "Add P. supplier",
        "totalOffer": "-",
        "offPrice1": "-",
        "offPrice2": "-",
        "offPrice3": "-",
        "tPr": "-",
        "amt": "-",
        "diff": "-",
        "check": "",
        "check1": "",
        "check2": "preferred",
        "check3": "",
        "mj": "41",
        "mj1": "41",
        "tco": "4,48,152.00",
        "ediff": "1.19",
        "tco1": "4,48,152.00",
        "ediff1": "1.19",
        "infoIcon": "No",
        "commentIcon": "No"
    },
    {
        "name": "Total Marine Fuel",
        "counterpartytype": "seller",
        "mail": "mail-inactive",
        "genRating": "4.2",
        "genPrice": "$9.4",
        "portRating": "4.2",
        "portPrice": "$9.8",
        "phySupplier": "Add P. supplier",
        "totalOffer": "-",
        "offPrice1": "-",
        "offPrice2": "-",
        "offPrice3": "-",
        "tPr": "-",
        "amt": "-",
        "diff": "-",
        "check": "",
        "check1": "",
        "check2": "",
        "check3": "preferred",
        "mj": "41",
        "mj1": "41",
        "tco": "4,48,152.00",
        "ediff": "1.19",
        "tco1": "4,48,152.00",
        "ediff1": "1.19",
        "infoIcon": "No",
        "commentIcon": "Yes"
    },
    {
        "name": "Total Marine Fuel",
        "counterpartytype": "physicalsupplier",
        "mail": "mail-active",
        "genRating": "4.2",
        "genPrice": "$9.4",
        "portRating": "4.2",
        "portPrice": "$9.8",
        "phySupplier": "Add P. supplier",
        "totalOffer": "-",
        "offPrice1": "-",
        "offPrice2": "-",
        "offPrice3": "-",
        "tPr": "-",
        "amt": "-",
        "diff": "-",
        "check": "",
        "check1": "",
        "check2": "",
        "check3": "",
        "mj": "41",
        "mj1": "41",
        "tco": "4,48,152.00",
        "ediff": "1.19",
        "tco1": "4,48,152.00",
        "ediff1": "1.19",
        "infoIcon": "No",
        "commentIcon": "None"
    },
    {
        "name": "Total Marine Fuel",
        "counterpartytype": "broker",
        "mail": "mail-inactive",
        "genRating": "4.2",
        "genPrice": "$9.4",
        "portRating": "4.2",
        "portPrice": "$9.8",
        "phySupplier": "Add P. supplier",
        "totalOffer": "-",
        "offPrice1": "-",
        "offPrice2": "-",
        "offPrice3": "-",
        "tPr": "-",
        "amt": "-",
        "diff": "-",
        "check": "",
        "check1": "",
        "check2": "",
        "check3": "",
        "mj": "41",
        "mj1": "41",
        "tco": "4,48,152.00",
        "ediff": "1.19",
        "tco1": "4,48,152.00",
        "ediff1": "1.19",
        "infoIcon": "No",
        "commentIcon": "Yes"
    },
    {
        "name": "Total Marine Fuel",
        "counterpartytype": "seller",
        "mail": "mail-none",
        "genRating": "4.2",
        "genPrice": "$9.4",
        "portRating": "4.2",
        "portPrice": "$9.8",
        "phySupplier": "Add P. supplier",
        "totalOffer": "-",
        "offPrice1": "-",
        "offPrice2": "-",
        "offPrice3": "-",
        "tPr": "-",
        "amt": "-",
        "diff": "-",
        "check": "",
        "check1": "",
        "check2": "",
        "check3": "",
        "mj": "41",
        "mj1": "41",
        "tco": "4,48,152.00",
        "ediff": "1.19",
        "tco1": "4,48,152.00",
        "ediff1": "1.19",
        "infoIcon": "No",
        "commentIcon": "No"
    },
    {
        "name": "Total Marine Fuel",
        "counterpartytype": "physicalsupplier",
        "mail": "mail-active",
        "genRating": "4.2",
        "genPrice": "$9.4",
        "portRating": "4.2",
        "portPrice": "$9.8",
        "phySupplier": "Add P. supplier",
        "totalOffer": "-",
        "offPrice1": "-",
        "offPrice2": "-",
        "offPrice3": "-",
        "tPr": "-",
        "amt": "-",
        "diff": "-",
        "check": "",
        "check1": "",
        "check2": "",
        "check3": "",
        "mj": "41",
        "mj1": "41",
        "tco": "4,48,152.00",
        "ediff": "1.19",
        "tco1": "4,48,152.00",
        "ediff1": "1.19",
        "infoIcon": "No",
        "commentIcon": "Yes"
    },
    {
        "name": "Total Marine Fuel",
        "counterpartytype": "broker",
        "mail": "mail-inactive",
        "genRating": "4.2",
        "genPrice": "$9.4",
        "portRating": "4.2",
        "portPrice": "$9.8",
        "phySupplier": "Add P. supplier",
        "totalOffer": "-",
        "offPrice1": "-",
        "offPrice2": "-",
        "offPrice3": "-",
        "tPr": "-",
        "amt": "-",
        "diff": "-",
        "check": "",
        "check1": "",
        "check2": "",
        "check3": "",
        "mj": "41",
        "mj1": "41",
        "tco": "4,48,152.00",
        "ediff": "1.19",
        "tco1": "4,48,152.00",
        "ediff1": "1.19",
        "infoIcon": "No",
        "commentIcon": "Yes"
    },
    {
        "name": "Total Marine Fuel",
        "counterpartytype": "seller",
        "mail": "mail-none",
        "genRating": "4.2",
        "genPrice": "$9.4",
        "portRating": "4.2",
        "portPrice": "$9.8",
        "phySupplier": "Add P. supplier",
        "totalOffer": "-",
        "offPrice1": "-",
        "offPrice2": "-",
        "offPrice3": "-",
        "tPr": "-",
        "amt": "-",
        "diff": "-",
        "check": "",
        "check1": "",
        "check2": "",
        "check3": "",
        "mj": "41",
        "mj1": "41",
        "tco": "4,48,152.00",
        "ediff": "1.19",
        "tco1": "4,48,152.00",
        "ediff1": "1.19",
        "infoIcon": "No",
        "commentIcon": "No"
    },
    {
        "name": "Total Marine Fuel",
        "counterpartytype": "physicalsupplier",
        "mail": "mail-active",
        "genRating": "4.2",
        "genPrice": "$9.4",
        "portRating": "4.2",
        "portPrice": "$9.8",
        "phySupplier": "Add P. supplier",
        "totalOffer": "-",
        "offPrice1": "-",
        "offPrice2": "-",
        "offPrice3": "-",
        "tPr": "-",
        "amt": "-",
        "diff": "-",
        "check": "",
        "check1": "",
        "check2": "",
        "check3": "",
        "mj": "41",
        "mj1": "41",
        "tco": "4,48,152.00",
        "ediff": "1.19",
        "tco1": "4,48,152.00",
        "ediff1": "1.19",
        "infoIcon": "No",
        "commentIcon": ""
    },
    {
        "name": "Total Marine Fuel",
        "counterpartytype": "broker",
        "mail": "mail-none",
        "genRating": "4.2",
        "genPrice": "$9.4",
        "portRating": "4.2",
        "portPrice": "$9.8",
        "phySupplier": "Add P. supplier",
        "totalOffer": "-",
        "offPrice1": "-",
        "offPrice2": "-",
        "offPrice3": "-",
        "tPr": "-",
        "amt": "-",
        "diff": "-",
        "check": "",
        "check1": "",
        "check2": "",
        "check3": "",
        "mj": "41",
        "mj1": "41",
        "tco": "4,48,152.00",
        "ediff": "1.19",
        "tco1": "4,48,152.00",
        "ediff1": "1.19",
        "infoIcon": "No",
        "commentIcon": "No"
    },
    {
        "name": "Total Marine Fuel",
        "counterpartytype": "physicalsupplier",
        "mail": "mail-inactive",
        "genRating": "4.2",
        "genPrice": "$9.4",
        "portRating": "4.2",
        "portPrice": "$9.8",
        "phySupplier": "Add P. supplier",
        "totalOffer": "-",
        "offPrice1": "-",
        "offPrice2": "-",
        "offPrice3": "-",
        "tPr": "-",
        "amt": "-",
        "diff": "-",
        "check": "",
        "check1": "",
        "check2": "",
        "check3": "",
        "mj": "41",
        "mj1": "41",
        "tco": "4,48,152.00",
        "ediff": "1.19",
        "tco1": "4,48,152.00",
        "ediff1": "1.19",
        "infoIcon": "No",
        "commentIcon": "Yes"
    },
    {
        "name": "Total Marine Fuel",
        "counterpartytype": "seller",
        "mail": "mail-active",
        "genRating": "4.2",
        "genPrice": "$9.4",
        "portRating": "4.2",
        "portPrice": "$9.8",
        "phySupplier": "Add P. supplier",
        "totalOffer": "-",
        "offPrice1": "-",
        "offPrice2": "-",
        "offPrice3": "-",
        "tPr": "-",
        "amt": "-",
        "diff": "-",
        "check": "",
        "check1": "",
        "check2": "",
        "check3": "",
        "mj": "41",
        "mj1": "41",
        "tco": "4,48,152.00",
        "ediff": "1.19",
        "tco1": "4,48,152.00",
        "ediff1": "1.19",
        "infoIcon": "No",
        "commentIcon": "Yes"
    }
];

setAll(value){
  this.rowData.forEach((element, index) =>{
    this.rowData[index].check1=value;
    this.rowData[index].check=value;
});
}
rowChecked(value,rowindex){
  this.rowData.forEach((element, index) =>{
    this.rowData[index].check1= !value;
    this.rowData[index].check= !value;
});
  this.rowData[rowindex].check1=value;
  this.rowData[rowindex].check=value;
  
}
offerpricehistorypopup(){
  const dialogRef = this.dialog.open(SpotnegoOfferpricehistoryComponent, {
    width: '500vw',
    height: '90vh',
    panelClass: 'additional-cost-popup'
  });

  dialogRef.afterClosed().subscribe(result => {
  });

}
pricinghistorypopup(){
  const dialogRef = this.dialog.open(MarketpricehistorypopupComponent, {
    width: '500vw',
    height: '90vh',
    panelClass: 'additional-cost-popup'
  });

  dialogRef.afterClosed().subscribe(result => {
  });

}
availabletermcontractpopup(){
  const dialogRef = this.dialog.open(AvailabletermcontractspopupComponent, {
    width: '1164px',
    height: '179px',
    panelClass: 'additional-cost-popup'
  });

  dialogRef.afterClosed().subscribe(result => {
  });
}
}


