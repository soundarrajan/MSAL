import { Component, OnInit } from '@angular/core';
import { QualityControlGridViewModel } from './view-model/quality-control-grid.view-model';
import { ProcurementService } from '../../services/procurement.service';
import { IProcurementRequestDto } from '../../services/models/procurement-requests.dto';
import { Observable } from 'rxjs';

@Component({
  selector: 'shiptech-main-quality-control',
  templateUrl: './main-quality-control.component.html',
  styleUrls: ['./main-quality-control.component.scss'],
  providers: [QualityControlGridViewModel]
})
export class MainQualityControlComponent implements OnInit {

  public rowData$: Observable<IProcurementRequestDto[]>;

  constructor(public gridViewModel: QualityControlGridViewModel, private procurementService: ProcurementService) {
    // this.rowData$ = this.procurementService.getAllProcurementRequests();
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
