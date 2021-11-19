import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  Inject,
  ChangeDetectorRef,
  Renderer2
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import _ from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  Optional
} from '@ag-grid-enterprise/all-modules';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'remove-counterparty-confirmation',
  templateUrl: './remove-counterparty-confirmation.html',
  styleUrls: ['./remove-counterparty-confirmation.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class RemoveCounterpartyComponent implements OnInit {
  public sellerCounterpartyId:any;
  constructor(
    public dialogRef: MatDialogRef<RemoveCounterpartyComponent>,
    private ren: Renderer2,
    private router: Router,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
     this.sellerCounterpartyId = data.sellerCounterpartyId;
  }

  ngOnInit() {}

  closeClick(): void {
    this.dialogRef.close();
  }
  confirm(value: boolean): void {
    this.dialogRef.close(value);
  }

}
