import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ProcurementRequestsGridViewModel } from './view-model/procurement-requests-grid.view-model';

@Component({
  selector: 'shiptech-main-quality-control',
  templateUrl: './main-quality-control.component.html',
  styleUrls: ['./main-quality-control.component.scss'],
  providers: [ProcurementRequestsGridViewModel],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainQualityControlComponent implements OnInit {

  constructor(public gridViewModel: ProcurementRequestsGridViewModel) {
  }

  onPageChange(page: number): void {
    this.gridViewModel.page = page;
  }

  onPageSizeChange(pageSize: number): void {
    this.gridViewModel.pageSize = pageSize;
  }

  getPage(): number {
    return this.gridViewModel.page;
  }

  ngOnInit(): void {
  }

}
