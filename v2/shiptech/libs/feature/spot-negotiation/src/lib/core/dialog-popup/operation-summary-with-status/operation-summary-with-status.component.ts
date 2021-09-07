import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-operation-summary-with-status',
  templateUrl: './operation-summary-with-status.component.html',
  styleUrls: ['./operation-summary-with-status.component.scss']
})
export class OperationSummaryWithStatusComponent implements OnInit {
  // @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  disableScrollDown = false;
  public showaddbtn = true;
  isShown: boolean = true; // hidden by default
  isBtnActive: boolean = false;
  isButtonVisible = true;
  iscontentEditable = false;

  ngOnInit() {
    // this.scrollToBottom();
  }

  constructor(
    public dialogRef: MatDialogRef<OperationSummaryWithStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  tabledatas = [
    { Source: '123', SourceDoument: 'B/L ', Qty: '1000000', QtyUOM: 'BBL' },
    {
      Source: '234',
      SourceDoument: 'Gross Qty - B/L ',
      Qty: '1982000',
      QtyUOM: 'GAL'
    },
    {
      Source: 'Total',
      SourceDoument: 'Gross Qty - B/L ',
      Qty: '1982000',
      QtyUOM: 'GAL'
    },
    {
      Source: 'Gross',
      SourceDoument: 'Gross Qty - B/L ',
      Qty: '1982000',
      QtyUOM: 'GAL'
    }
  ];
  tabledatas2 = [];
  newtabledata: any = {};
  addNew() {
    this.tabledatas2.push(this.newtabledata);
    this.newtabledata = {};
    // this.scrollToBottom();
  }
  delete(i) {
    this.tabledatas2.splice(i, 1);
  }
  toggleShow() {
    this.isShown = !this.isShown;
  }
  // private scrollToBottom(): void {
  //   if (this.disableScrollDown) {
  //       return
  //   }
  //   try {
  //       this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  //   } catch(err) { }
  // }
}
