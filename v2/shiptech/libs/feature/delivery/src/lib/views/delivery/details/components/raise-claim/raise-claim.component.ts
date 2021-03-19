import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { QcOrderProductsListGridViewModel } from './view-model/qc-order-products-list.grid-view-model';
import { IQcOrderProductsListItemDto } from '../../../../../services/api/dto/qc-order-products-list-item.dto';
import { QcReportService } from '../../../../../services/qc-report.service';
import { ToastrService } from 'ngx-toastr';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'shiptech-raise-claim',
  templateUrl: './raise-claim.component.html',
  styleUrls: ['./raise-claim.component.css'],
  providers: [QcOrderProductsListGridViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RaiseClaimComponent implements OnInit {
  constructor(
    public dialogRef: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public gridViewModel: QcOrderProductsListGridViewModel,
    private reportDetails: QcReportService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  raiseClaim(): void {
    const gridApi = this.gridViewModel.gridOptions.api;
    const selectedNodes = gridApi.getSelectedNodes() || [];

    const orderProducts = selectedNodes.map(
      n => <IQcOrderProductsListItemDto>n.data
    );

    if (orderProducts.length !== 1) {
      this.toastr.warning('Please select one order to raise claim for.');
      return;
    }

    this.reportDetails
      .raiseClaim$(orderProducts[0].id, orderProducts[0].order.id)
      .subscribe(() => {
        gridApi.deselectAll();
        this.dialogRef.close();
      });
  }
}
