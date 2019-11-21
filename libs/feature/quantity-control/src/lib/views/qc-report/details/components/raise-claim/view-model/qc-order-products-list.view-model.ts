import { Injectable } from '@angular/core';
import { QcOrderProductsListGridViewModel } from './qc-order-products-list.grid-view-model';

@Injectable({
  providedIn: 'root'
})
export class QcOrderProductsListViewModel {
  constructor(public gridViewModel: QcOrderProductsListGridViewModel) {
  }
}
