import { Component, OnInit, Inject, ViewChild, ElementRef,  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-sellerratingpopup',
  templateUrl: './sellerratingpopup.component.html',
  styleUrls: ['./sellerratingpopup.component.css']
})
export class SellerratingpopupComponent implements OnInit {
  ngOnInit() { 
   
  }
  constructor(public dialogRef: MatDialogRef<SellerratingpopupComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }
   
  closeDialog() {
      this.dialogRef.close();
    
    } 
      

  }


