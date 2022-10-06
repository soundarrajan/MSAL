import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss']
})
export class NewRequestComponent implements OnInit {

  public productDetails = [
    {
      id: 0,
      prod: "RMK 850",
      specGrp: "ISO 8217-2010",
      minQty: "1000 MT",
      maxQty: "1000 MT",
      selected: true,
      portDetails: [
        {
          name: "CTA",
          eta: "14/04/2020 10:00",
          reqQty: "1000 MT",
          selected: false
        },
        {
          name: "YEADE",
          eta: "14/05/2020 10:00",
          reqQty: "20,000 MT",
          selected: false
        },
        {
          name: "OMSOH",
          eta: "14/06/2020 10:00",
          reqQty: "30,000 MT",
          selected: false
        }
      ]
    },
    {
      id: 1,
      prod: "DMA 01",
      specGrp: "ISO 8217-2010",
      minQty: "20,000 MT",
      maxQty: "30,000 MT",
      selected: false,
      portDetails: [
        {
          name: "CTA1",
          eta: "10/04/2020 10:00",
          reqQty: "1000 MT",
          selected: false
        },
        {
          name: "YEADE",
          eta: "10/05/2020 10:00",
          reqQty: "10,000 MT",
          selected: false
        }
      ]
    }
  ]
  public portDetails = this.productDetails[0].portDetails;
  public productName = this.productDetails[0].prod;
  public newProducts = [];
  public date = new FormControl(new Date(new Date().setHours(10,0,0,0)));
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'date-picker',
      sanitizer.bypassSecurityTrustResourceUrl('../assets/customicons/datepicker.svg'));
  }


  ngOnInit() {
  }
  onRowSelect(prod) {
    if (this.productDetails.filter(element => element.prod == prod).length > 0)
      this.productDetails.forEach((element) => {
        if (element.prod == prod) {
          element.selected = true;
          this.portDetails = element.portDetails;
          this.productName = element.prod;
        }
        else
          element.selected = false;
      })
    else {
      this.newProducts.forEach((element) => {
        if (element.prod == prod) {
          element.selected = true;
          this.portDetails = element.portDetails;
          this.productName = element.prod;
        }
        else
          element.selected = false;
      })
    }
  }
  remove(prod) {
    this.productDetails = this.productDetails.filter(element => element.prod != prod);
    this.newProducts = this.newProducts.filter(element => element.prod != prod);
  }
  addProduct() {
    this.newProducts.push({
      prod: "",
      specGrp: "",
      minQty: "",
      maxQty: "",
      portDetails: []
    })
  }
}
