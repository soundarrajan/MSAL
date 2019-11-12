import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';

@Component({
  selector: 'shiptech-raise-claim',
  templateUrl: './raise-claim.component.html',
  styleUrls: ['./raise-claim.component.css']
})
export class RaiseClaimComponent implements OnInit {

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {
  }

  ngOnInit(): void {
  }

}
