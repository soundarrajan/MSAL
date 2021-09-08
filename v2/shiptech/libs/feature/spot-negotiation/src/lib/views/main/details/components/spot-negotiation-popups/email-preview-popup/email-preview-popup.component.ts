import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-email-preview-popup',
  templateUrl: './email-preview-popup.component.html',
  styleUrls: ['./email-preview-popup.component.css']
})
export class EmailPreviewPopupComponent implements OnInit {

  selected = 'Amend RFQ';
  toEmail = '';
  ccEmail = '';
  filesList = ['Purchase Documents','Purchase Documents'];
  to = ['Saranya.v@inatech.com','Saranya.v@inatech.com','Saranya.v@inatech.com'];
  cc = ['Saranya.v@inatech.com','Saranya.v@inatech.com'];

  constructor(public dialogRef: MatDialogRef<EmailPreviewPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  addTo(item){
    this.to.push(item);
    this.toEmail = '';
  }

  addCc(item){
    this.cc.push(item);
    this.ccEmail = '';
  }

  fileBrowseHandler(files){
    for (const item of files) {
      this.filesList.push(item.name);
    }
  }

}
