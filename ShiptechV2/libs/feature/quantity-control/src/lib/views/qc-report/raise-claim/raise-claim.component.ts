import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef, MessageService } from 'primeng/api';
import { QcOrderProductsListGridViewModel } from './view-model/qc-order-products-list.grid-view-model';
import { QcOrderProductsListViewModel } from './view-model/qc-order-products-list.view-model';
import { IQcOrderProductsListItemDto } from '../../../services/api/dto/qc-order-products-list-item.dto';
import * as _ from 'lodash';

@Component({
  selector: 'shiptech-raise-claim',
  templateUrl: './raise-claim.component.html',
  styleUrls: ['./raise-claim.component.css'],
  providers: [QcOrderProductsListGridViewModel, QcOrderProductsListViewModel, MessageService]
})
export class RaiseClaimComponent implements OnInit {

  constructor(public ref: DynamicDialogRef,
              public config: DynamicDialogConfig,
              public viewModel: QcOrderProductsListViewModel,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
  }

  raiseClaim(): void {
    const gridApi = this.viewModel.gridViewModel.gridOptions.api;
    const selectedNodes = gridApi.getSelectedNodes();
    this.messageService.clear();

    if (!selectedNodes.length) {
      this.messageService.add({
        severity: 'error',
        detail: 'Please select a order product'
      });
      return;
    }

    const selectedItem: IQcOrderProductsListItemDto = _.first(selectedNodes).data;

    this.messageService.add({
      severity: 'success',
      detail: `Raise claim for orderId: ${selectedItem.orderId} and productId: ${selectedItem.productId}`
    });

    gridApi.deselectAll();
  }

}
