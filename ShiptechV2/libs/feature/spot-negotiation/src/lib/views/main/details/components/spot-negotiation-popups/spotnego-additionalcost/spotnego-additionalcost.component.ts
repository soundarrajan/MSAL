import { Component, OnInit, Inject, ViewChild, ElementRef, } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SpotNegotiationService } from 'libs/feature/spot-negotiation/src/lib/services/spot-negotiation.service';
import { AdditionalCostViewModel } from './additional-costs-model';

@Component({
  selector: 'app-spotnego-additionalcost',
  templateUrl: './spotnego-additionalcost.component.html',
  styleUrls: ['./spotnego-additionalcost.component.css']
})
export class SpotnegoAdditionalcostComponent implements OnInit {

  requestOptions = [
    {
      request : 'Req 12321', vessel: 'Merlion', selected: true
    },
    {
      request : 'Req 12322', vessel: 'Afif', selected: true
    }
  ];
  disableScrollDown = false;
  public showaddbtn = true;
  isShown: boolean = true; // hidden by default
  isShown2: boolean = true;
  isBtnActive: boolean = false;
  isButtonVisible = true;
  iscontentEditable = false;
  public myFormGroup;
  public select = "$";
  offerLevelCosts: AdditionalCostViewModel[];

  constructor(public dialogRef: MatDialogRef<SpotnegoAdditionalcostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    , public spotNegotiationService: SpotNegotiationService) {

  }

  ngOnInit() {
    // this.scrollToBottom();
    this.myFormGroup = new FormGroup({
      frequency: new FormControl('')
    });

    if (this.data?.requestOffers?.length > 0) {
      const firstOffer = this.data.requestOffers[0];
      const payload = {
        offerId: firstOffer.offerId, uomId: firstOffer.priceQuantityUomId,
        isLocationBased: false
      };
      this.spotNegotiationService.getAdditionalCosts(payload).subscribe((res: any) => {
          if(res){
            this.offerLevelCosts = res;
          }
      });
    }
  }

  frequencyArr = [
    { key: '$', abbriviation: 'USD' },
    { key: '€', abbriviation: 'EURO' },
    { key: '£', abbriviation: 'GBP' }
  ];

  closeDialog() {
    this.dialogRef.close();

  }

  tabledatalocation = [{}];
  tabledataslocation1 = [{}];
  additionalcosts=[{costname: 'Surveyor Fee',
  costtype: 'Flat',
  maxqty: '1500  MT',
  price: '5000',
  extra: '5.5',
  extraamt: '5000'},
  {
    costname: 'Barge Fee',
    costtype: 'Flat',
    maxqty: '1500  MT',
    price: '5000',
    extra: '5.5',
    extraamt: '5000'
  }
]
  tabledataslocationlist = [{
    costname: 'Surveyor Fee',
    costtype: 'Flat',
    maxqty: '1500  MT',
    price: '$5000',
    extra: '5.5',
    extraamt: '$5000'
  },
  {
    costname: 'Barge Fee',
    costtype: 'Flat',
    maxqty: '1500  MT',
    price: '$5000',
    extra: '5.5',
    extraamt: '$5000'
  },
  {
    costname: 'Test Fee',
    costtype: 'Flat',
    maxqty: '1500  MT',
    price: '$5000',
    extra: '5.5',
    extraamt: '$5000'
  }]
  tabledatas2 = [];
  newtabledata: any = {}
  addNew() {
    this.tabledatas2.push(this.newtabledata)
    this.newtabledata = {};
    // this.scrollToBottom();
  }
  delete(i) {
    this.tabledatas2.splice(i, 1);
  }
  delete1(i){
    this.additionalcosts.splice(i, 1);
  }
  delete2(j) {
    this.tabledataslocation.splice(j, 1);
  }
  delete3(j) {
    this.tabledataslocationlist.splice(j, 1);
  }
  toggleShow() {

    this.isShown = !this.isShown;
    this.isShown2 = !this.isShown2;

  }
  tabledataslocation = [];
  addNewlocationbasedcost() {
    this.tabledataslocation.push(this.newtabledata)
    this.newtabledata = {};

  }

}
