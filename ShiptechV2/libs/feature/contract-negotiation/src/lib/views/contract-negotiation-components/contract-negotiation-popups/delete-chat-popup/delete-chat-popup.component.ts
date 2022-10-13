import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-chat-popup',
  templateUrl: './delete-chat-popup.component.html',
  styleUrls: ['./delete-chat-popup.component.scss']
})
export class DeleteChatPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteChatPopupComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }
  clickNo(){
    this.dialogRef.close();
  }
  clickYes(){
    this.dialogRef.close({data:true});
  }
}
