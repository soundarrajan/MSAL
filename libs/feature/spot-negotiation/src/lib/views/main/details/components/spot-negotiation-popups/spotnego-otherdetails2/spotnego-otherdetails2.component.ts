import { Component, OnInit, Inject, ViewChild, ElementRef,  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-spotnego-otherdetails2',
  templateUrl: './spotnego-otherdetails2.component.html',
  styleUrls: ['./spotnego-otherdetails2.component.css']
})
export class SpotnegoOtherdetails2Component implements OnInit {

  disableScrollDown = false
  public showaddbtn=true;
  isShown: boolean = true; // hidden by default
  isBtnActive: boolean = false;
  isButtonVisible=true;
  iscontentEditable=false;
public switchTheme:boolean = false;
public selectedFormulaTab;
public initialized;
  ngOnInit() {
    // this.scrollToBottom();
}

  constructor(public dialogRef: MatDialogRef<SpotnegoOtherdetails2Component>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  closeDialog() {
      this.dialogRef.close();

    }



  tabledata=[ {seller:'Total Marine Fuel', port:'Amstredam',contractname:'Cambodia Contarct 2021',contractproduct:'DMA 1.5%', formula:'Cambodia Con', schedule:'Average of 5 Days',contractqty:'10,000,.00',liftedqty:'898.00 MT', availableqty:'96,602.00 MT',price:'$500.00'},
  {seller:'Total Marine Fuel', port:'Amstredam',contractname:'Amstredam Contarct 2021',contractproduct:'DMA 1.5%', formula:'Cambodia Con', schedule:'Average of 5 Days',contractqty:'10,000,.00',liftedqty:'898.00 MT', availableqty:'96,602.00 MT',price:'$500.00'}];



}

