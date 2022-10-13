import { Component, OnInit, Inject, ViewChild, ElementRef, } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-additional-cost-popup',
  templateUrl: './additional-cost-popup.component.html',
  styleUrls: ['./additional-cost-popup.component.scss']
})
export class AdditionalCostPopupComponent implements OnInit {

  checkAll: boolean = false;
  checkAll2: boolean = false;
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
  isShown: boolean = true;
  isShown2: boolean = true;
  isBtnActive: boolean = false;
  isButtonVisible = true;
  iscontentEditable = false;
  public myFormGroup;
  public select = "$";
  public tableData:any;
  public locationBasedData:any;
  ngOnInit() {
    this.myFormGroup = new FormGroup({
      frequency: new FormControl('')
    });
    //console.log(this.data.counterpartyName);
    // console.log(this.data.counterpartyName);
    // if(this.data.counterpartyName =="Shell Eastern Trading (Pte) Ltd"){
    // this.tableData = this.shellEasternData;
    // this.locationBasedData ={};
    // }else if(this.data.counterpartyName =="Exxonmobil Marine Fuels"){
    //   this.tableData = this.exxonmobilData;
    //   this.locationBasedData ={};
    // }else if(this.data.counterpartyName =="BP Singapore PTE Limited"){
    //   this.tableData = this.bPSingaporeData
    //   this.locationBasedData ={};
    // }
    // else{
      this.tableData = this.additionalcoast;
    //   this.locationBasedData = this.tabledataslocationlist;
    // }
  }

  frequencyArr = [
    { key: '$', abbriviation: 'USD' },
    { key: '€', abbriviation: 'EURO' },
    { key: '£', abbriviation: 'GBP' }
  ];

  constructor(public dialogRef: MatDialogRef<AdditionalCostPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  closeDialog() {
    this.dialogRef.close();
  }

  tabledatalocation = [{}];
  tabledataslocation1 = [{}];
  additionalcoast=[
  {
    costname: 'Surveyor Fee',
    costtype: 'Flat',
    maxqty: '1500  MT',
    price: '5000',
    applicationFor:'',
    extra: '5.5',
    extraamt: '5000',
    totalamt: '',
    rate: '',
    checked: false
  },
  {
    costname: 'Barge Fee',
    costtype: 'Flat',
    maxqty: '1500  MT',
    price: '5000',
    applicationFor:'',
    extra: '5.5',
    extraamt: '5000',
    totalamt: '',
    rate: '',
    checked: false
  }
];
shellEasternData=[{
  costname: 'Barging Fees',
  costtype: 'Unit',
  maxqty: '500 MT',
  price: '$0.4',
  applicationFor:'RMG 380 3.5%',
  extra: '',
  extraamt: '',
  totalamt: '200',
  rate: '$ 0.4',
  checked: false
}];
exxonmobilData=[
  {
    costname: 'Barging Fees',
    costtype: 'Unit',
    maxqty: '300  MT',
    price: '$0.50',
    applicationFor:'DMA 0.1%',
    extra: '',
    extraamt: '',
    totalamt: '150',
    rate: '$ 0.2',
    checked: false
  }
];
bPSingaporeData=[
  {
    costname: 'Surveyor Fees',
    costtype: 'Flat',
    maxqty: '800 MT',
    price: '$400',
    applicationFor:'All',
    extra: '',
    extraamt: '',
    totalamt: '400',
    rate: '$ 0.2',
    checked: false
  },
  {
    costname: 'Extra charges',
    costtype: 'Unit',
    maxqty: '500 MT',
    price: '$0.7',
    applicationFor:'RMG 380 3.5%',
    extra: '',
    extraamt: '',
    totalamt: '350',
    rate: '$ 0.7'
  }
];
  tabledataslocationlist = [{
    costname: 'Surveyor Fee',
    costtype: 'Flat',
    maxqty: '1500  MT',
    price: '$5000',
    extra: '5.5',
    extraamt: '$5000',
    totalamt: '',
    rate: '',
    checked: false
  },
  {
    costname: 'Barge Fee',
    costtype: 'Flat',
    maxqty: '1500  MT',
    price: '$5000',
    extra: '5.5',
    extraamt: '$5000',
    totalamt: '',
    rate: '',
    checked: false
  },
  {
    costname: 'Test Fee',
    costtype: 'Flat',
    maxqty: '1500  MT',
    price: '$5000',
    extra: '5.5',
    extraamt: '$5000',
    totalamt: '',
    rate: '',
    checked: false
  }]
  tabledatas2 = [];
  newtabledata: any = {
    costname: 'Barge Fee',
    costtype: 'Flat',
    maxqty: '1500  MT',
    price: '$5000',
    extra: '5.5',
    extraamt: '$5000',
    totalamt: '',
    rate: '',
    checked: false
  }
  addNew() {
    this.tabledatas2.push(this.newtabledata)
    this.newtabledata = {
      costname: 'Barge Fee',
      costtype: 'Flat',
      maxqty: '1500  MT',
      price: '$5000',
      extra: '5.5',
      extraamt: '$5000',
      totalamt: '',
      rate: '',
      checked: false
    };
  }
  delete(i) {
    this.tabledatas2.splice(i, 1);
  }
  delete1(i){
    this.tableData.splice(i, 1);
  }
  delete2(j) {
    this.tabledataslocation.splice(j, 1);
  }
  delete3(j) {
    this.locationBasedData.splice(j, 1);
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

  setAll(checked: boolean) {
    this.checkAll = checked;
    this.tableData.forEach(t => (t.checked = checked));
    this.tabledatas2.forEach(t => (t.checked = checked));
  }

  updateAll() {
    if(this.tableData.filter(t => t.checked).length > 0 || this.tabledatas2.filter(t => t.checked).length > 0){
      this.checkAll = true;
    }else{
      this.checkAll = false;
    }
  }

  setAll2(checked: boolean) {
    this.checkAll2 = checked;
    this.locationBasedData.forEach(t => (t.checked = checked));
    this.tabledataslocation.forEach(t => (t.checked = checked));
  }

  updateAll2() {
    if(this.locationBasedData.filter(t => t.checked).length > 0 || this.tabledataslocation.filter(t => t.checked).length > 0 ){
      this.checkAll2 = true;
    }else{
      this.checkAll2 = false;
    }
  }

}