import { Injectable } from '@angular/core';
import { ProductDetailsGridViewModel } from './product-details-grid.view-model';

@Injectable()
export class ProductDetailsViewModel {
  constructor(public gridViewModel: ProductDetailsGridViewModel) {
  }
}
