import { Component, OnInit } from '@angular/core';
import { ProcurementRequestsGridViewModel } from './view-model/procurement-requests-grid.view-model';
import { IProcurementRequestDto } from '../../services/models/procurement-requests.dto';
import { Observable } from 'rxjs';

@Component({
  selector: 'shiptech-main-quality-control',
  templateUrl: './main-quality-control.component.html',
  styleUrls: ['./main-quality-control.component.scss'],
  providers: [ProcurementRequestsGridViewModel]
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

  ngOnInit(): void {
  }

}
