import { Component, OnInit, Inject, ViewChild, ElementRef,  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-applicablecostpopup',
  templateUrl: './applicablecostpopup.component.html',
  styleUrls: ['./applicablecostpopup.component.css']
})
export class ApplicablecostpopupComponent implements OnInit {

  requestOptions = [
    {
      request : 'Req 12321', vessel: 'Merlion', selected: true
    },
    {
      request : 'Req 12322', vessel: 'Afif', selected: true
    }
  ];
  disableScrollDown = false;
  public showaddbtn=true;
  isShown: boolean = true; // hidden by default
  isShown2: boolean = true;
  isBtnActive: boolean = false;
  isButtonVisible=true;
  iscontentEditable=false;

  ngOnInit() { 
    // this.scrollToBottom();
}
  
  constructor(public dialogRef: MatDialogRef<ApplicablecostpopupComponent>,    @Inject(MAT_DIALOG_DATA) public data: any) { }
   
  closeDialog() {
      this.dialogRef.close();
    
    } 
      
 tabledatalocation=[{}];
    tabledataslocation1=[{}];
    tabledataslocationlist=[{
      costname:'Surveyor Fee',
      costtype:'Flat',
      maxqty:'1500  MT',
      price:'5000',
      extra:'5.5',
      extraamt:'5000'
    },
    { costname:'Barge Fee',
    costtype:'Flat',
    maxqty:'1500  MT',
    price:'5000',
    extra:'5.5',
    extraamt:'5000'},
  {
    costname:'Test Fee',
    costtype:'Flat',
    maxqty:'1500  MT',
    price:'5000',
    extra:'5.5',
    extraamt:'5000'
  }]
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
  delete2(j){
    this.tabledataslocation.splice(j,1);
  }
  delete3(j){
    this.tabledataslocationlist.splice(j,1);
  }
  toggleShow() {

    this.isShown = ! this.isShown;
    this.isShown2=! this.isShown2;
    
    } 
    tabledataslocation=[ ];
    addNewlocationbasedcost(){
      this.tabledataslocation.push(this.newtabledata)
      this.newtabledata = {};
     
    }

}

