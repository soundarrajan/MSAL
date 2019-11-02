import { Component, OnInit } from '@angular/core';
import { ProductDetailsViewModel } from './view-model/product-details.view-model';
import { ProductDetailsGridViewModel } from './view-model/product-details-grid.view-model';

@Component({
  selector: 'shiptech-port-call-grid',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  providers: [ProductDetailsViewModel, ProductDetailsGridViewModel]
})
export class ProductDetailsComponent implements OnInit {

  constructor(public viewModel: ProductDetailsViewModel) {
  }

  ngOnInit(): void {
  }

}
