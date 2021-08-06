import { Component, OnInit, Inject, ViewChild, ElementRef,  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-availabletermcontractspopup',
  templateUrl: './availabletermcontractspopup.component.html',
  styleUrls: ['./availabletermcontractspopup.component.css']
})
export class AvailabletermcontractspopupComponent implements OnInit {

 

  ngOnInit(): void {
  }
  constructor(public dialogRef: MatDialogRef<AvailabletermcontractspopupComponent>,    @Inject(MAT_DIALOG_DATA) public data: any) { }
   
  closeDialog() {
      this.dialogRef.close();
    
    } 
      

 
  tabledata=[ {seller:'Total Marine Fuel', port:'Amstredam',contractname:'Cambodia Contarct 2021',contractproduct:'DMA 1.5%', formula:'Cambodia Contracts formula description type here in this box detailed..', schedule:'Average of 5 Days',contractqty:'100,000.00 MT',liftedqty:'898.00 MT', availableqty:'96,602.00 MT',price:'$ 500.00'},
  {seller:'Total Marine Fuel', port:'Amstredam',contractname:'Amstredam Contarct 2021',contractproduct:'DMA 1.5%', formula:'Cambodia Contracts formula description type here in this box detailed..', schedule:'Average of 5 Days',contractqty:'5,000.00 MT',liftedqty:'898.00 MT', availableqty:'5,000.00 MT',price:'$ 520.00'}];

  
 
 

}
