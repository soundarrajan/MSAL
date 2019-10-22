import { Component } from '@angular/core';
import { QuantityControlMockApiService } from '../services/api/quantity-control.api.service.mock';

@Component({
  selector: 'shiptech-main-quantity-control',
  templateUrl: './main-quantity-control.component.html',
  styleUrls: ['./main-quantity-control.component.scss']
})
export class MainQuantityControlComponent {

  constructor(mockApi: QuantityControlMockApiService) {

  }
}
