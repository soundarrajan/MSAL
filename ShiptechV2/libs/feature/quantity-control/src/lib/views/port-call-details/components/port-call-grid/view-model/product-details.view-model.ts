import { Injectable } from '@angular/core';
import { ProductDetailsGridViewModel } from './product-details-grid.view-model';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailsViewModel {
  constructor(public gridViewModel: ProductDetailsGridViewModel) {
  }
}
