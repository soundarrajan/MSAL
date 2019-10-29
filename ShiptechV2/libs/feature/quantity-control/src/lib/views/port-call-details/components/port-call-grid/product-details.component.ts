import { Component, OnInit } from '@angular/core';
import { ProductDetailsViewModel } from './view-model/product-details.view-model';
import { Store } from '@ngxs/store';
import { ProductDetailsGridViewModel } from './view-model/product-details-grid.view-model';

@Component({
  selector: 'shiptech-port-call-grid',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  providers: [ProductDetailsViewModel, ProductDetailsGridViewModel]
})
export class ProductDetailsComponent implements OnInit {
  // TODO: get port callId dynamically
  // Note: At this point the port call details should be already loaded into the state, use the selector.
  // Note: Rename "Grid" to Product Details
  // portCall$: Observable<IPortCallProductDto> = this.store.select(state => state.)

  constructor(public viewModel: ProductDetailsViewModel, private store: Store) {
  }

  ngOnInit(): void {
  }

}
