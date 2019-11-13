import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { QcOrderProductsListGridViewModel } from './view-model/qc-order-products-list.grid-view-model';
import { QcOrderProductsListViewModel } from './view-model/qc-order-products-list.view-model';

@Component({
  selector: 'shiptech-raise-claim',
  templateUrl: './raise-claim.component.html',
  styleUrls: ['./raise-claim.component.css'],
  providers: [QcOrderProductsListGridViewModel, QcOrderProductsListViewModel]
})
export class RaiseClaimComponent implements OnInit {

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, public viewModel: QcOrderProductsListViewModel) {
  }

  ngOnInit(): void {
  }

}
